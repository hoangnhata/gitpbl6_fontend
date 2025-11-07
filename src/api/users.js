// Public Users API client (no auth required)

const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || "/api";

function buildUrl(path) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path}`;
}

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const err = new Error(`Request failed: ${response.status} ${text}`);
    err.status = response.status;
    throw err;
  }
  if (contentType.includes("application/json")) return response.json();
  return null;
}

let USERS_CACHE = null;

export async function listPublicUsers() {
  const res = await fetch(buildUrl(`/users`), { method: "GET" });
  const data = await handleResponse(res);
  USERS_CACHE = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : data;
  return data;
}

export async function getPublicUser(userId) {
  if (USERS_CACHE == null) {
    try {
      await listPublicUsers();
    } catch (_) {
      return null;
    }
  }
  if (!Array.isArray(USERS_CACHE)) return null;
  const u = USERS_CACHE.find((x) => Number(x?.id) === Number(userId));
  if (!u) return null;
  return {
    id: u.id,
    name: u.fullName || u.username || u.displayName || u.email,
    avatar: u.avatarUrl || u.avatar || u.imageUrl || "",
  };
}


