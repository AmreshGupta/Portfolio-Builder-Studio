const DEFAULT_SOCIAL_LABELS = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  email: "Email"
};

export function getSocialLinkItems(socialLinks) {
  if (Array.isArray(socialLinks)) {
    return socialLinks.filter((item) => item?.label && item?.url);
  }

  if (!socialLinks || typeof socialLinks !== "object") {
    return [];
  }

  return Object.entries(socialLinks)
    .filter(([, url]) => Boolean(url))
    .map(([key, url]) => ({
      id: key,
      label: DEFAULT_SOCIAL_LABELS[key] || key,
      url
    }));
}

export function isEmailLink(item) {
  const label = item.label?.toLowerCase() || "";
  const url = item.url?.trim() || "";

  return label.includes("email") || label.includes("mail") || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url);
}

export function getSocialHref(item) {
  const url = item.url.trim();

  if (isEmailLink(item) && !url.startsWith("mailto:")) {
    return `mailto:${url}`;
  }

  if (/^(https?:|mailto:|tel:)/i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

export function getExternalHref(url = "") {
  const trimmed = url.trim();

  if (!trimmed) {
    return "";
  }

  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
