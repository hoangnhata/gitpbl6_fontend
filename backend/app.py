import io
import os
from typing import List, Dict, Any, Optional
import logging

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import httpx

import torch
from torchvision import transforms, models
import torch.nn as nn
from mtcnn import MTCNN
import cv2
import numpy as np


APP = FastAPI(title="Movie App Recognition API")
logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s %(message)s")
LOGGER = logging.getLogger("recognition")

APP.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



MODEL = None
FACE_DETECTOR = None
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
INPUT_SIZE = 112
TRANSFORM = None
LABELS: Dict[int, Dict[str, Any]] = {}
LABELS_JSON: Dict[str, Dict[str, Any]] = {}
MOVIE_API_BASE = os.getenv("MOVIE_API_BASE", "https://api.phimnhalam.website/api")


def _make_transform():
    return transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.Resize((112, 112)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
    ])


def _ensure_transform() -> None:
    global TRANSFORM
    if TRANSFORM is None:
        TRANSFORM = _make_transform()


def _project_root() -> str:
    return os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def load_labels() -> None:
    global LABELS, LABELS_JSON
    import pickle
    import json
    
    enc_paths = [
        os.path.join(_project_root(), "class_names.pkl"),
        os.path.join(os.path.dirname(__file__), "class_names.pkl"),
    ]
    
    for p in enc_paths:
        if os.path.exists(p):
            try:
                with open(p, "rb") as f:
                    label_names = pickle.load(f)
                
                if isinstance(label_names, list):
                    norm: Dict[int, Dict[str, Any]] = {}
                    for idx, raw_name in enumerate(label_names):
                        pretty = raw_name.replace("_", " ").strip()
                        if pretty.lower() == "ai pacino":
                            pretty = "Al Pacino"
                        if pretty.lower() == "gwyneth paltrow":
                            pretty = "Gwyneth Paltrow"
                        words = pretty.split()
                        if len(words) > 0:
                            pretty = " ".join(word.title() if "-" not in word else word for word in words)
                        norm[idx] = {"id": idx, "name": pretty}
                    LABELS = norm
                    LOGGER.info("Loaded labels from %s (classes=%s)", p, len(LABELS))
                    break
            except Exception as exc:
                LOGGER.warning("Failed to load class names %s: %s", p, exc)
    
    if not LABELS:
        raise FileNotFoundError("class_names.pkl not found. Please ensure it exists in project root or backend directory.")
    
    json_paths = [
        os.path.join(os.path.dirname(__file__), "labels.json"),
        os.path.join(_project_root(), "backend", "labels.json"),
    ]
    
    for p in json_paths:
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    labels_data = json.load(f)
                    for key, value in labels_data.items():
                        if isinstance(value, dict) and "name" in value:
                            actor_name = value["name"].strip().lower()
                            LABELS_JSON[actor_name] = value
                    LOGGER.info("Loaded %d actors from labels.json as fallback", len(LABELS_JSON))
                    break
            except Exception as exc:
                LOGGER.warning("Failed to load labels.json %s: %s", p, exc)


def load_model() -> None:
    global MODEL, TRANSFORM
    if MODEL is not None:
        return
    
    if not LABELS:
        load_labels()
    
    ckpt_path = os.path.join(_project_root(), "face_recognition_resnet.pth")
    if not os.path.exists(ckpt_path):
        raise FileNotFoundError(f"Checkpoint not found at {ckpt_path}")

    num_classes = len(LABELS)
    if num_classes == 0:
        raise RuntimeError("No labels loaded. Cannot determine number of classes.")

    try:
        state_dict = torch.load(ckpt_path, map_location=DEVICE)
        
        new_state_dict = {}
        for k, v in state_dict.items():
            if k.startswith('_orig_mod.'):
                new_state_dict[k[len('_orig_mod.'):]] = v
            else:
                new_state_dict[k] = v
        
        resnet_model = models.resnet18(weights=None)
        num_ftrs = resnet_model.fc.in_features
        
        model = nn.Sequential(
            resnet_model.conv1,
            resnet_model.bn1,
            resnet_model.relu,
            resnet_model.maxpool,
            resnet_model.layer1,
            resnet_model.layer2,
            resnet_model.layer3,
            resnet_model.layer4,
            resnet_model.avgpool,
            nn.Flatten(),
            nn.Dropout(0.5),
            nn.Linear(num_ftrs, num_classes)
        )
        
        model.load_state_dict(new_state_dict, strict=False)
        model.to(DEVICE)
        model.eval()
        MODEL = model
        TRANSFORM = _make_transform()
        
        LOGGER.info("Loaded ResNet18 model from %s on %s", ckpt_path, DEVICE)
        
    except Exception as exc:
        LOGGER.exception("Failed to load model: %s", exc)
        raise RuntimeError(f"Failed to load model from {ckpt_path}: {exc}") from exc


@APP.on_event("startup")
def _startup() -> None:
    load_labels()
    try:
        load_model()
    except Exception:
        pass
    _ensure_transform()


def _detect_and_crop_face(img: Image.Image) -> Optional[Image.Image]:
    global FACE_DETECTOR
    if FACE_DETECTOR is None:
        FACE_DETECTOR = MTCNN()
    
    try:
        img_array = np.array(img.convert('RGB'))
        faces = FACE_DETECTOR.detect_faces(img_array)
        
        if len(faces) == 0:
            return img
        
        face = max(faces, key=lambda x: x['confidence'])
        box = face['box']
        confidence = face['confidence']
        
        if confidence < 0.5:
            return img
        
        x, y, w, h = box
        padding_percent = 0.1
        padding_x = int(w * padding_percent)
        padding_y = int(h * padding_percent)
        
        x = max(0, x - padding_x)
        y = max(0, y - padding_y)
        w = min(img_array.shape[1] - x, w + 2 * padding_x)
        h = min(img_array.shape[0] - y, h + 2 * padding_y)
        
        cropped_array = img_array[y:y+h, x:x+w]
        face_crop = Image.fromarray(cropped_array)
        return face_crop
        
    except Exception:
        return img


def _predict_topk(img: Image.Image, topk: int) -> List[Dict[str, Any]]:
    try:
        if MODEL is None:
            raise RuntimeError("Model is not loaded")
        
        face_img = _detect_and_crop_face(img)
        _ensure_transform()
        tensor = TRANSFORM(face_img).unsqueeze(0).to(DEVICE)
        
        with torch.no_grad():
            logits = MODEL(tensor)
            if isinstance(logits, (list, tuple)):
                logits = logits[0]
            
            probs = torch.softmax(logits, dim=1)
            values, indices = torch.topk(probs, k=min(topk, probs.shape[1]), dim=1)
        
        values = values.squeeze(0).cpu().numpy().tolist()
        indices = indices.squeeze(0).cpu().numpy().tolist()

        results: List[Dict[str, Any]] = []
        LOGGER.info("PREDICTIONS (Top 3):")
        for rank, (score, idx) in enumerate(zip(values, indices), 1):
            idx_int = int(idx)
            label_meta = LABELS.get(idx_int, {"id": idx_int, "name": f"Unknown_{idx_int}"})
            predicted_name = label_meta.get("name", str(idx_int))
            percentage = float(score) * 100
            
            if rank <= 3:
                LOGGER.info("  [%d] %s: %.2f%%", rank, predicted_name, percentage)
            
            results.append({
                "id": label_meta.get("id", idx_int),
                "name": predicted_name,
                "score": float(score),
            })
        
        return results
    except Exception as exc:
        LOGGER.exception("Inference failed: %s", exc)
        return []


async def _find_actor_in_db_by_name(name: str) -> Optional[Dict[str, Any]]:
    if not name or not name.strip():
        return None
    
    search_name = name.strip()
    urls_to_try = [
        (f"{MOVIE_API_BASE}/actors", {"q": search_name, "page": 0, "size": 10}),
        (f"{MOVIE_API_BASE}/search/actor/{search_name}", {"page": 0, "size": 10}),
    ]
    
    items: List[Dict[str, Any]] = []
    
    for url, params in urls_to_try:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                data = resp.json()
                
                if isinstance(data, dict):
                    if isinstance(data.get("content"), list):
                        items = data["content"]
                    elif isinstance(data.get("data"), list):
                        items = data["data"]
                    elif isinstance(data.get("items"), list):
                        items = data["items"]
                    elif isinstance(data.get("results"), list):
                        items = data["results"]
                elif isinstance(data, list):
                    items = data
                
                if items:
                    break
        except Exception:
            continue
    
    if not items:
        search_name_lower = search_name.lower()
        if search_name_lower in LABELS_JSON:
            fallback_actor = LABELS_JSON[search_name_lower]
            actor_id = fallback_actor.get("id")
            
            if actor_id is not None:
                try:
                    api_url = f"{MOVIE_API_BASE}/actors/{actor_id}"
                    async with httpx.AsyncClient(timeout=5.0) as client:
                        resp = await client.get(api_url)
                        if resp.status_code == 200:
                            return resp.json()
                except Exception:
                    pass
            
            return fallback_actor
        return None

    search_name_lower = search_name.lower()
    
    for it in items:
        n = str(it.get("name", "")).strip().lower()
        if n == search_name_lower:
            return it
    
    for it in items:
        n = str(it.get("name", "")).strip().lower()
        if search_name_lower in n or n in search_name_lower:
            return it
    
    search_words = set(search_name_lower.split())
    for it in items:
        n = str(it.get("name", "")).strip().lower()
        item_words = set(n.split())
        if search_words.issubset(item_words) or item_words.issubset(search_words):
            return it
    
    if search_name_lower in LABELS_JSON:
        fallback_actor = LABELS_JSON[search_name_lower]
        actor_id = fallback_actor.get("id")
        
        if actor_id is not None:
            try:
                api_url = f"{MOVIE_API_BASE}/actors/{actor_id}"
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.get(api_url)
                    if resp.status_code == 200:
                        return resp.json()
            except Exception:
                pass
        
        return fallback_actor
    
    if items:
        return items[0]
    
    return None


@APP.post("/api/actors/recognize")
@APP.post("/actors/recognize")
@APP.post("/ai/actors/recognize")  # Direct endpoint for frontend
async def recognize(
    image: UploadFile = File(...),
    topK: int = Form(12),
    debug: int = Form(0),
    minScore: float = Form(0.3),  # Chỉ hiển thị diễn viên có điểm >= 30%
    maxResults: int = Form(0),    # 0 = không giới hạn, dùng topK
):
    if image.content_type is None or not image.content_type.startswith("image/"):
        LOGGER.error("❌ Invalid image content type: %s", image.content_type)
        raise HTTPException(status_code=400, detail="Invalid image content type")
    try:
        content = await image.read()
        img = Image.open(io.BytesIO(content)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Cannot read image")

    try:
        preds = _predict_topk(img, topK)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    filtered: List[Dict[str, Any]] = []
    seen_ids = set()
    
    for p in preds:
        pred_name = str(p.get("name", ""))
        pred_score = float(p.get("score", 0.0))
        
        if pred_score < float(minScore):
            continue
        
        actor = await _find_actor_in_db_by_name(pred_name)
        
        if not actor:
            continue
        
        actor_id = actor.get("id")
        if actor_id in seen_ids:
            continue
        
        seen_ids.add(actor_id)
        
        filtered.append({
            "id": actor.get("id"),
            "name": actor.get("name"),
            "imageUrl": actor.get("imageUrl") or actor.get("image") or actor.get("avatarUrl"),
            "movieCount": actor.get("movieCount"),
            "score": pred_score,
        })
    
    filtered.sort(key=lambda a: float(a.get("score", 0.0)), reverse=True)
    limit = maxResults if maxResults > 0 else topK
    if limit > 0:
        filtered = filtered[:limit]

    LOGGER.info("RESULTS:")
    if filtered:
        for i, actor in enumerate(filtered[:3], 1):
            score_pct = float(actor.get("score", 0)) * 100
            LOGGER.info("  [%d] %s - %.2f%%", i, actor.get("name"), score_pct)
        if len(filtered) > 3:
            LOGGER.info("  ... and %d more", len(filtered) - 3)
    else:
        LOGGER.info("  No actors found")

    if debug:
        return {
            "content": filtered,
            "debug": {
                "labels_count": len(LABELS),
                "device": str(DEVICE),
                "preds": preds,
            },
        }

    return {"content": filtered}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:APP", host="0.0.0.0", port=8000, reload=True)


