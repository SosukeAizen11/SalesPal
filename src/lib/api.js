// ─── REST API Client ─────────────────────────────────────────────────────────
// Replaces @supabase/supabase-js with direct REST calls to the Express backend.
// Stores JWT access + refresh tokens in localStorage.

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://salespal-backend-990900909753.us-central1.run.app";

const TOKEN_KEY = "sp_access_token";
const REFRESH_KEY = "sp_refresh_token";

// ─── Token helpers ───────────────────────────────────────────────────────────
export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}
export function setTokens(access, refresh) {
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}
export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ─── Core fetch wrapper ──────────────────────────────────────────────────────

let isRefreshing = false;
let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

async function request(method, path, body = null, options = {}) {
  const url = `${API_URL}${path}`;
  const headers = { "Content-Type": "application/json" };

  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = { method, headers };
  if (body && method !== "GET") config.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(url, config);
  } catch (error) {
    throw error;
  }

  // Auto-refresh on 401
  if (res.status === 401 && getRefreshToken() && !options._retried) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
      });
    }

    try {
      const newToken = await refreshPromise;
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, { ...config, headers });
    } catch {
      clearTokens();
      window.location.href = "/login";
      throw new Error("Session expired");
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    // Extract a string message — backend may return { error: { code, message } } or { message: "..." }
    let msg = res.statusText;
    if (typeof error.message === 'string') msg = error.message;
    else if (error.error?.message) msg = error.error.message;
    else if (typeof error.error === 'string') msg = error.error;
    else if (error.message?.message) msg = error.message.message;
    throw {
      status: res.status,
      message: msg,
    };
  }

  // Handle 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

// ─── Public API ──────────────────────────────────────────────────────────────
const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path) => request("DELETE", path),
};

export default api;
