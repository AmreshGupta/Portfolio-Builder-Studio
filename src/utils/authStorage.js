const REGISTERED_USER_KEY = "portfolio_registered_user";
const AUTH_USER_KEY = "portfolio_auth_user";

function readJson(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function getRegisteredUser() {
  return readJson(REGISTERED_USER_KEY);
}

export function saveRegisteredUser(user) {
  localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(user));
}

export function getAuthUser() {
  return readJson(AUTH_USER_KEY);
}

export function saveAuthUser(user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify({
    name: user.name,
    email: user.email
  }));
}

export function clearAuthUser() {
  localStorage.removeItem(AUTH_USER_KEY);
}
