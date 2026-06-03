import { API_BASE_URL } from "./apiClient";

export function getImageSrc(image) {
  if (!image) return "";

  if (/^(data:|blob:|https?:\/\/)/i.test(image)) {
    return image;
  }

  return `${API_BASE_URL}/uploads/portfolio/${image}`;
}
