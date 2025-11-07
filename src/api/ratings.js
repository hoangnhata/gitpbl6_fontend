// Ratings API client

const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || "/api";

function buildUrl(path) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path}`;
}

const authHeaders = (token) => ({ Authorization: `Bearer ${token}` });

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    let detail = "";
    try {
      if (contentType.includes("application/json")) {
        const data = await response.json();
        detail = data?.message || data?.error || JSON.stringify(data);
      } else {
        detail = await response.text();
      }
    } catch (_) {}
    const err = new Error(`Request failed: ${response.status} ${detail}`);
    err.status = response.status;
    throw err;
  }
  if (contentType.includes("application/json")) return response.json();
  return null;
}

export async function createRating({ movieId, stars, comment }, token) {
  const res = await fetch(buildUrl(`/ratings`), {
    method: "POST",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ movieId, stars, comment }),
  });
  return handleResponse(res);
}

export async function updateRating(id, { stars, comment }, token) {
  const res = await fetch(buildUrl(`/ratings/${id}`), {
    method: "PUT",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stars, comment }),
  });
  return handleResponse(res);
}

export async function deleteRating(id, token) {
  const res = await fetch(buildUrl(`/ratings/${id}`), {
    method: "DELETE",
    headers: {
      ...authHeaders(token),
    },
  });
  if (res.status === 204) return true;
  return handleResponse(res);
}

export async function getMovieRatings(movieId, { page = 0, size = 10 } = {}, token) {
  const qs = new URLSearchParams({ page: String(page), size: String(size) });
  const res = await fetch(buildUrl(`/ratings/movie/${movieId}?${qs.toString()}`), {
    headers: token ? authHeaders(token) : undefined,
  });
  return handleResponse(res);
}

export async function getUserRatingForMovie(movieId, token, userIdPathPart) {
  const path = userIdPathPart
    ? `/ratings/user/${userIdPathPart}/movie/${movieId}`
    : `/ratings/user/movie/${movieId}`;
  const res = await fetch(buildUrl(path), {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}


