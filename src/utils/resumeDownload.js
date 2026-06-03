import { getExternalHref } from "./socialLinks";

export function openResume(portfolio) {
  const resumeUrl = portfolio?.resumeUrl?.trim();

  if (!resumeUrl) {
    return false;
  }

  window.open(getExternalHref(resumeUrl), "_blank", "noopener,noreferrer");
  return true;
}
