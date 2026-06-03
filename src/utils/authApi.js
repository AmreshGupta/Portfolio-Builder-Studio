import { apiRequest } from "./apiClient";

export function sendSignupOtp(email, name = "") {
  return apiRequest("/api/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ email, fullName: name }),
  });
}

export function verifySignupOtp(email, otp) {
  return apiRequest("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export function signupUser(user) {
  return apiRequest("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      fullName: user.name || user.fullName,
      email: user.email,
      password: user.password,
    }),
  });
}

export function loginUser(credentials) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function requestPasswordReset(email) {
  return apiRequest("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token, password) {
  return apiRequest(`/api/auth/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}
