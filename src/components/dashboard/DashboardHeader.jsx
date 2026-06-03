export default function DashboardHeader({
  fullscreenMode,
  slug,
  onLogout,
  onPublish,
  publishing,
  onSlugChange,
  onToggleFullscreen,
}) {
  const cleanSlug = (slug || "")
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <header className="dashboard-header">
      <div className="logo-section">
        <div className="logo-icon">P</div>
        <span className="logo-text">Portfolio Builder Studio</span>
      </div>

      <div className="header-actions">
        <div className="slug-input-wrapper">
          <span className="slug-prefix">portfolio/</span>
          <input
            type="text"
            value={cleanSlug}
            onChange={(event) => onSlugChange(event.target.value)}
            className="slug-input"
            placeholder="custom-link"
          />
        </div>

        <button className="btn-secondary" onClick={onToggleFullscreen}>
          {fullscreenMode ? "Show Editor" : "Fullscreen Preview"}
        </button>

        <a
          href={cleanSlug ? `/portfolio/${cleanSlug}` : undefined}
          target="_blank"
          rel="noreferrer"
          className={`btn-secondary ${!cleanSlug ? "disabled-link" : ""}`}
        >
          View Live URL
        </a>

        <button className="btn-secondary" onClick={onLogout}>
          Logout
        </button>

        <button className="btn-primary" onClick={onPublish} disabled={publishing}>
          {publishing ? "Saving..." : "Save & Publish"}
        </button>
      </div>
    </header>
  );
}
