// Actors API client

const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || "/api";
const AI_BASE_URL = import.meta?.env?.VITE_AI_BASE_URL || "/ai";

function buildUrl(path) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path}`;
}

function buildAiUrl(path) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${AI_BASE_URL}${path}`;
}

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson
    ? await response.json().catch(() => ({}))
    : await response.text();
  if (!response.ok) {
    const error = new Error(
      payload?.message || response.statusText || "Request failed"
    );
    error.status = response.status;
    error.details = payload;
    throw error;
  }
  return payload;
}

function jsonFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const init = { ...options, headers };
  return fetch(buildUrl(path), init).then(handleResponse);
}

export function listActors({ q = "", page = 0, size = 20 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("page", String(page));
  params.set("size", String(size));
  return jsonFetch(`/actors?${params.toString()}`, { method: "GET" });
}

export async function recognizeActorsByImage(
  file,
  { topK = 12, minScore = 0.3, maxResults = 0 } = {}
) {
  if (!file) throw new Error("image file is required");
  const form = new FormData();
  form.append("image", file);
  form.append("topK", String(topK));
  form.append("minScore", String(minScore));
  form.append("maxResults", String(maxResults));
  form.append("debug", "0");

  const url = buildAiUrl(`/actors/recognize`);
  // eslint-disable-next-line no-console
  console.log("[AI] Sending request to:", url);
  // eslint-disable-next-line no-console
  console.log(
    "[AI] AI_BASE_URL from env:",
    import.meta?.env?.VITE_AI_BASE_URL || "not set (using /ai)"
  );
  // eslint-disable-next-line no-console
  console.log(
    "[AI] Request params: topK=",
    topK,
    "minScore=",
    minScore,
    "maxResults=",
    maxResults
  );

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

  try {
    const response = await fetch(url, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // eslint-disable-next-line no-console
    console.log("[AI] Response status:", response.status, response.statusText);

    const payload = await handleResponse(response);
    // eslint-disable-next-line no-console
    console.log("[AI] recognizeActorsByImage response:", payload);
    return payload;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(
        "Request timeout: AI xử lý quá lâu. Vui lòng thử lại với ảnh khác."
      );
    }
    throw error;
  }
}

export function getActorById(actorId) {
  if (actorId == null) throw new Error("actorId is required");
  return jsonFetch(`/actors/${encodeURIComponent(actorId)}`, { method: "GET" });
}

export function listMoviesOfActor(actorId, { page = 0, size = 20 } = {}) {
  if (actorId == null) throw new Error("actorId is required");
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  return jsonFetch(
    `/actors/${encodeURIComponent(actorId)}/movies?${params.toString()}`,
    { method: "GET" }
  );
}

export default {
  listActors,
  getActorById,
  listMoviesOfActor,
  recognizeActorsByImage,
};

// Search multiple names against DB, return unique actors preserving order of names
export async function searchActorsByNames(names = []) {
  const unique = Array.from(
    new Set((names || []).map((n) => String(n || "").trim()).filter(Boolean))
  );
  if (unique.length === 0) return [];

  const normalize = (s) =>
    String(s || "")
      .normalize("NFD")
      .replace(/\p{Diacritic}+/gu, "")
      .replace(/[^\w\s]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const results = [];
  const seenIds = new Set();

  for (const rawName of unique) {
    const variants = new Set([rawName]);
    const ascii = normalize(rawName);
    if (ascii && ascii !== rawName) variants.add(ascii);
    const parts = ascii.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      variants.add(`${parts[0]} ${parts[parts.length - 1]}`);
      variants.add(parts[parts.length - 1]);
    }

    let picked = null;
    for (const q of variants) {
      try {
        const data = await listActors({ q, page: 0, size: 8 });
        const list = Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data)
          ? data
          : [];
        if (list.length === 0) continue;

        const lowerRaw = String(rawName).toLowerCase();
        const lowerAscii = ascii;
        const norm = (n) => normalize(n);
        picked =
          list.find((a) => String(a?.name || "").toLowerCase() === lowerRaw) ||
          list.find((a) => norm(a?.name) === lowerAscii) ||
          list[0];
        break;
      } catch (_) {
        // try next variant
      }
    }

    if (picked && !seenIds.has(picked.id)) {
      seenIds.add(picked.id);
      results.push(picked);
    }
  }
  return results;
}
