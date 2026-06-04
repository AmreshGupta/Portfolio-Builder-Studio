export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
export const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL || window.location.origin;

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL && path.startsWith("/api/")) {
    throw new Error("Backend API URL is not configured. Please set VITE_API_BASE_URL in deployment settings.");
  }

  let authUser = null;

  try {
    authUser = JSON.parse(localStorage.getItem("portfolio_auth_user") || "null");
  } catch {
    localStorage.removeItem("portfolio_auth_user");
  }

  const token = authUser?.token;
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  let data = null;
  let responseText = "";
  try {
    responseText = await response.text();
    data = responseText && contentType.includes("application/json")
      ? JSON.parse(responseText)
      : null;
  } catch {
    data = null;
  }

  if (response.ok && responseText && !contentType.includes("application/json")) {
    throw new Error("Backend API did not return JSON. Please check VITE_API_BASE_URL in deployment settings.");
  }

  if (!response.ok) {
    const message = data?.message || responseText || "Request failed. Please try again.";

    if (response.status === 401 && /invalid token|unauthorized|session expired/i.test(message)) {
      localStorage.removeItem("portfolio_auth_user");
    }

    throw new Error(message);
  }

  return data;
}
