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

export function getSocialHref(item) {
  const url = item.url.trim();

  if (item.label.toLowerCase() === "email" && !url.startsWith("mailto:")) {
    return `mailto:${url}`;
  }

  if (/^(https?:|mailto:|tel:)/i.test(url)) {
    return url;
  }

  return `https://${url}`;
}
