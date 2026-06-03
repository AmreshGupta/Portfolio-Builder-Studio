import { useEffect, useState } from "react";
import { sendSignupOtp, verifySignupOtp } from "../../utils/authApi";

export default function AuthFormPanel({
  form,
  isForgotPassword,
  isSignup,
  message,
  onChange,
  onEmailVerifiedChange,
  onForgotPassword,
  onModeChange,
  onSubmit,
}) {
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  useEffect(() => {
    setEmailVerified(false);
    setOtpSent(false);
    setOtp("");
    setOtpMessage("");
    onEmailVerifiedChange(false);
  }, [form.email, isSignup, onEmailVerifiedChange]);

  const setVerified = (verified) => {
    setEmailVerified(verified);
    onEmailVerifiedChange(verified);
  };

  const handleSendOtp = async () => {
    const email = form.email.trim().toLowerCase();

    if (!email) {
      setOtpMessage("Please enter your email first.");
      return;
    }

    setOtpLoading(true);
    setOtpMessage("");

    try {
      await sendSignupOtp(email, form.name.trim());
      setOtpSent(true);
      setOtpMessage("OTP has been sent to your email.");
    } catch (error) {
      setOtpMessage(error.message || "Unable to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const email = form.email.trim().toLowerCase();
    const code = otp.trim();

    if (!code) {
      setOtpMessage("Please enter OTP.");
      return;
    }

    setOtpLoading(true);
    setOtpMessage("");

    try {
      await verifySignupOtp(email, code);
      setVerified(true);
      setOtp("");
      setOtpSent(false);
      setOtpMessage("Email successfully verified.");
    } catch (error) {
      setOtpMessage(error.message || "Unable to verify OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const title = isForgotPassword
    ? "Reset password"
    : isSignup
      ? "Start with signup"
      : "Welcome back";
  const subtitle = isForgotPassword
    ? "Enter your email and we will send a reset link."
    : isSignup
      ? "Create your account to unlock your personal portfolio studio."
      : "Continue with your saved account.";

  return (
    <div className="auth-form-panel">
      {!isForgotPassword && (
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
      )}

      <div className="auth-form-heading">
        <h2>{title}</h2>
        <p>{subtitle}</p>
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
          <div className="email-field-wrapper">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSignup && emailVerified}
            />
            {isSignup && (
              <button
                type="button"
                className={emailVerified ? "email-verified-badge" : "email-verify-btn"}
                onClick={handleSendOtp}
                disabled={emailVerified || otpLoading || !form.email.trim()}
              >
                {emailVerified ? "Verified" : otpLoading ? "Sending..." : "Verify Email"}
              </button>
            )}
          </div>
        </label>

        {isSignup && otpSent && !emailVerified && (
          <label className="auth-field">
            <span>Email OTP</span>
            <div className="otp-field-wrapper">
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
              />
              <button
                type="button"
                className="otp-verify-btn"
                onClick={handleVerifyOtp}
                disabled={otpLoading || !otp.trim()}
              >
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </label>
        )}

        {isSignup && otpMessage && (
          <p className={emailVerified ? "auth-message success" : "auth-message"}>
            {otpMessage}
          </p>
        )}

        {!isForgotPassword && (
          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder={isSignup ? "8-20 chars, Aa, 1, special" : "Enter password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </label>
        )}

        {isSignup && (
          <label className="auth-field">
            <span>Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="Confirm password"
              autoComplete="new-password"
            />
          </label>
        )}

        {!isSignup && !isForgotPassword && (
          <div className="forgot-password-row">
            <button type="button" className="forgot-link" onClick={onForgotPassword}>
              Forgot Password?
            </button>
          </div>
        )}

        {message && (
          <p className={message.toLowerCase().includes("sent") ? "auth-message success" : "auth-message"}>
            {message}
          </p>
        )}

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isSignup && !emailVerified}
        >
          {isForgotPassword
            ? "Send Reset Link"
            : isSignup
              ? "Create Account & Continue"
              : "Login & Continue"}
        </button>

        {(isForgotPassword || !isSignup) && (
          <button
            type="button"
            className="back-login-btn"
            onClick={() => onModeChange(isForgotPassword ? "login" : "signup")}
          >
            {isForgotPassword ? "Back to Login" : "Back to Signup"}
          </button>
        )}
      </form>
    </div>
  );
}
