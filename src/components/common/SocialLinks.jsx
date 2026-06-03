import { getSocialHref, getSocialLinkItems, isEmailLink } from "../../utils/socialLinks";

function SocialIcon({ label }) {
  const normalized = label.toLowerCase();
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  };

  if (normalized.includes("github")) {
    return (
      <svg {...commonProps}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.5 2-5-2-7-2" />
      </svg>
    );
  }

  if (normalized.includes("linkedin")) {
    return (
      <svg {...commonProps}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }

  if (normalized.includes("leetcode")) {
    return (
      <svg {...commonProps}>
        <path d="M16 4 8 12l8 8" />
        <path d="m12 8 4 4-4 4" />
        <path d="M8 12h12" />
        <path d="M5 5v14" />
      </svg>
    );
  }

  if (normalized.includes("email") || normalized.includes("mail")) {
    return (
      <svg {...commonProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (normalized.includes("youtube")) {
    return (
      <svg {...commonProps}>
        <path d="M2.5 17a24.8 24.8 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49 49 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.8 24.8 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49 49 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    );
  }

  if (normalized.includes("twitter") || normalized === "x") {
    return (
      <svg {...commonProps}>
        <path d="M4 4l16 16" />
        <path d="M20 4 4 20" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4.93" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.8 13.12a5 5 0 0 0 7.07 7.07L13 19.07" />
    </svg>
  );
}

export default function SocialLinks({ links }) {
  const items = getSocialLinkItems(links);

  if (!items.length) {
    return null;
  }

  return (
    <div className="social-row">
      {items.map((item, index) => (
        <a
          key={item.id || `${item.label}-${index}`}
          href={getSocialHref(item)}
          target={isEmailLink(item) ? undefined : "_blank"}
          rel={isEmailLink(item) ? undefined : "noreferrer"}
          className="social-link"
          title={item.label}
        >
          <span className="social-link-icon">
            <SocialIcon label={item.label} />
          </span>
          <span className="social-link-label">{item.label}</span>
        </a>
      ))}
    </div>
  );
}
