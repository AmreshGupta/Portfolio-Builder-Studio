import { apiRequest } from "./apiClient";

export async function savePortfolio(portfolio) {
  const data = await apiRequest("/api/portfolio/create", {
    method: "POST",
    body: JSON.stringify(portfolio),
  });

  return data.portfolio;
}

export async function uploadPortfolioImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const data = await apiRequest("/api/portfolio/upload-image", {
    method: "POST",
    body: formData,
  });

  return data.filename;
}

export async function getPortfolio(slug) {
  const data = await apiRequest(`/api/portfolio/${slug}`);

  return data.portfolio;
}

export async function getMyPortfolios() {
  const data = await apiRequest("/api/portfolio/my");

  return data.portfolios || [];
}

export async function sendPortfolioMessage(slug, messageData) {
  return apiRequest(`/api/portfolio/${slug}/contact`, {
    method: "POST",
    body: JSON.stringify(messageData),
  });
}
