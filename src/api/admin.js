// Admin API client for movie management
// Handles CRUD operations for movies, users, and other admin functions

/**
 * Resolve API base URL from environment or default
 */
const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || "/api";

function buildUrl(path) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path}`;
}

function getAuthHeader() {
  try {
    const token = localStorage.getItem("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (_) {
    return {};
  }
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

// Helper function for JSON requests
function jsonFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...(options.headers || {}),
  };
  const init = { ...options, headers };
  return fetch(buildUrl(path), init).then(handleResponse);
}

// Helper function for multipart form data requests
function formDataFetch(path, formData, options = {}) {
  const headers = {
    ...getAuthHeader(),
    ...(options.headers || {}),
  };
  // Don't set Content-Type for FormData, let browser set it with boundary
  const init = {
    ...options,
    headers,
    body: formData,
  };
  return fetch(buildUrl(path), init).then(handleResponse);
}

// ===== USER MANAGEMENT =====

// GET /api/admin/users
export function getUsers(page = 0, size = 10, sort = "createdAt,desc") {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: String(sort),
  });
  return jsonFetch(`/admin/users?${params.toString()}`, { method: "GET" });
}

// GET /api/admin/users/{id}
export function getUserById(userId) {
  if (!userId) throw new Error("userId is required");
  return jsonFetch(`/admin/users/${encodeURIComponent(userId)}`, {
    method: "GET",
  });
}

// PUT /api/admin/users/{id}
export function updateUser(userId, userData) {
  if (!userId) throw new Error("userId is required");
  if (!userData) throw new Error("userData is required");
  return jsonFetch(`/admin/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

// DELETE /api/admin/users/{id}
export function deleteUser(userId) {
  if (!userId) throw new Error("userId is required");
  return jsonFetch(`/admin/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

// ===== MOVIE MANAGEMENT =====

// GET /api/admin/movies
export function getMovies(page = 0, size = 10, sort = "createdAt,desc") {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: String(sort),
  });
  return jsonFetch(`/admin/movies?${params.toString()}`, { method: "GET" });
}

// GET /api/admin/movies/{id}
export function getMovieById(movieId) {
  if (!movieId) throw new Error("movieId is required");
  return jsonFetch(`/admin/movies/${encodeURIComponent(movieId)}`, {
    method: "GET",
  });
}

// POST /api/movies/create-form (multipart form data)
export function createMovie(movieData) {
  if (!movieData) throw new Error("movieData is required");

  const formData = new FormData();

  // Add text fields
  if (movieData.title) formData.append("title", movieData.title);
  if (movieData.synopsis) formData.append("synopsis", movieData.synopsis);
  if (movieData.year) formData.append("year", String(movieData.year));
  if (movieData.categories) formData.append("categories", movieData.categories);
  if (movieData.actors) formData.append("actors", movieData.actors);
  if (movieData.directors) formData.append("directors", movieData.directors);
  if (movieData.country) formData.append("country", movieData.country);
  if (movieData.language) formData.append("language", movieData.language);
  if (movieData.ageRating) formData.append("ageRating", movieData.ageRating);
  if (movieData.trailerUrl) formData.append("trailerUrl", movieData.trailerUrl);
  if (movieData.videoUrl) formData.append("videoUrl", movieData.videoUrl);
  if (movieData.isAvailable !== undefined)
    formData.append("isAvailable", String(movieData.isAvailable));

  // Add file fields
  if (movieData.poster) formData.append("poster", movieData.poster);
  if (movieData.thumbnail) formData.append("thumbnail", movieData.thumbnail);
  if (movieData.video) formData.append("video", movieData.video);

  return formDataFetch("/movies/create-form", formData, { method: "POST" });
}

// PUT /api/admin/movies/{id}
export function updateMovie(movieId, movieData) {
  if (!movieId) throw new Error("movieId is required");
  if (!movieData) throw new Error("movieData is required");
  return jsonFetch(`/admin/movies/${encodeURIComponent(movieId)}`, {
    method: "PUT",
    body: JSON.stringify(movieData),
  });
}

// DELETE /api/admin/movies/{id}
export function deleteMovie(movieId) {
  if (!movieId) throw new Error("movieId is required");
  return jsonFetch(`/admin/movies/${encodeURIComponent(movieId)}`, {
    method: "DELETE",
  });
}

// ===== STATISTICS =====

// GET /api/admin/dashboard
export function getAdminStatistics() {
  return jsonFetch("/admin/dashboard", { method: "GET" });
}

// GET /api/admin/statistics/movies
export function getMovieStatistics() {
  return jsonFetch("/admin/statistics/movies", { method: "GET" });
}

// GET /api/admin/statistics/users
export function getUserStatistics() {
  return jsonFetch("/admin/statistics/users", { method: "GET" });
}

// ===== REPORTS =====

// GET /api/admin/reports
export function getReports(page = 0, size = 10, sort = "createdAt,desc") {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: String(sort),
  });
  return jsonFetch(`/admin/reports?${params.toString()}`, { method: "GET" });
}

// PUT /api/admin/reports/{id}/resolve
export function resolveReport(reportId) {
  if (!reportId) throw new Error("reportId is required");
  return jsonFetch(`/admin/reports/${encodeURIComponent(reportId)}/resolve`, {
    method: "PUT",
  });
}

// ===== ADDITIONAL ADMIN APIs =====

// GET /api/admin/dashboard (same as getAdminStatistics)
export function getDashboardAnalytics() {
  return jsonFetch("/admin/dashboard", { method: "GET" });
}

// GET /api/admin/analytics/trending
export function getTrendingContent(period = "week") {
  const params = new URLSearchParams({ period: String(period) });
  return jsonFetch(`/admin/analytics/trending?${params.toString()}`, {
    method: "GET",
  });
}

export default {
  // User management
  getUsers,
  getUserById,
  updateUser,
  deleteUser,

  // Movie management
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,

  // Statistics
  getAdminStatistics,
  getMovieStatistics,
  getUserStatistics,

  // Reports
  getReports,
  resolveReport,

  // Additional APIs
  getDashboardAnalytics,
  getTrendingContent,
};
