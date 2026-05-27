export default function AuthFormPanel({
  form,
  isSignup,
  message,
  onChange,
  onModeChange,
  onSubmit
}) {
  return (
    <div className="auth-form-panel">
      <div className="auth-tabs" aria-label="Authentication mode">
        <button
          type="button"
          className={isSignup ? "active" : ""}
          onClick={() => onModeChange("signup")}
        >
          Signup
        </button>
        <button
          type="button"
          className={!isSignup ? "active" : ""}
          onClick={() => onModeChange("login")}
        >
          Login
        </button>
      </div>

      <div className="auth-form-heading">
        <h2>{isSignup ? "Start with signup" : "Welcome back"}</h2>
        <p>
          {isSignup
            ? "Create your account to unlock your personal portfolio studio."
            : "Continue with your saved account."}
        </p>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        {isSignup && (
          <label className="auth-field">
            <span>Full Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your full name"
              autoComplete="name"
            />
          </label>
        )}

        <label className="auth-field">
          <span>Email Address</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Minimum 6 characters"
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
        </label>

        {isSignup && (
          <label className="auth-field">
            <span>Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="Password dobara likhein"
              autoComplete="new-password"
            />
          </label>
        )}

        {message && <p className="auth-message">{message}</p>}

         <button type="submit" className="auth-submit-btn">
          {isSignup ? "Create Account & Continue" : "Login & Continue"}
        </button>
        <button type="submit" className="auth-submit-btn">
          Forgot Password? 
        </button>
      </form>
    </div>
  );
}
