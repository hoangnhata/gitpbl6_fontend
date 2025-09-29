// Actors API client

const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || "/api";

function buildUrl(path) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path}`;
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
};
