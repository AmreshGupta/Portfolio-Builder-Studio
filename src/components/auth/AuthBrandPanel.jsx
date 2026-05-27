export default function AuthBrandPanel() {
  return (
    <div className="auth-brand-panel">
      <div className="auth-logo-row">
        <div className="logo-icon">P</div>
        <span className="logo-text">Portfolio Builder Studio</span>
      </div>

      <div className="auth-copy">
        <span className="auth-eyebrow">Secure workspace</span>
        <h1>Create your portfolio after signup</h1>
        <p>
         Create your account to unlock your personal portfolio studio. Your session stays securely saved, so you can continue building anytime without signing in again.
        </p>
      </div>

      <div className="auth-preview-card">
        <div className="auth-preview-bar">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="auth-preview-avatar"></div>
        <div className="auth-preview-line wide"></div>
        <div className="auth-preview-line"></div>
        <div className="auth-preview-tags">
          <span>React</span>
          <span>Design</span>
          <span>Portfolio</span>
        </div>
      </div>
    </div>
  );
}
