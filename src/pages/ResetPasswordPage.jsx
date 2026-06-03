import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../utils/authApi";

const initialForm = {
  password: "",
  confirmPassword: "",
};

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
        form.password,
      )
    ) {
      setMessage("Password must be 8-20 chars with uppercase, lowercase, number and special character.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Confirm password does not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, form.password);
      setMessage("Password reset successful. Redirecting to login...");
      window.setTimeout(() => navigate("/auth", { replace: true }), 900);
    } catch (error) {
      setMessage(error.message || "Password reset failed. Please request a new link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell reset-auth-shell">
        <div className="auth-form-panel reset-form-panel">
          <div className="auth-form-heading">
            <h2>Set new password</h2>
            <p>Create a fresh password for your portfolio account.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>New Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="8-20 chars, Aa, 1, special"
                autoComplete="new-password"
              />
            </label>

            <label className="auth-field">
              <span>Confirm Password</span>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                autoComplete="new-password"
              />
            </label>

            {message && (
              <p className={message.toLowerCase().includes("successful") ? "auth-message success" : "auth-message"}>
                {message}
              </p>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Saving..." : "Reset Password"}
            </button>

            <Link className="back-login-btn" to="/auth">
              Back to Login
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
}
