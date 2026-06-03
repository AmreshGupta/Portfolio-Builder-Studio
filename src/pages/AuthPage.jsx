import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthBrandPanel from "../components/auth/AuthBrandPanel";
import AuthFormPanel from "../components/auth/AuthFormPanel";
import {
  getRegisteredUser,
  saveAuthUser,
  saveRegisteredUser,
} from "../utils/authStorage";
import { loginUser, requestPasswordReset, signupUser } from "../utils/authApi";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(getRegisteredUser() ? "login" : "signup");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const isSignup = mode === "signup";
  const isForgotPassword = mode === "forgot";

  const resetForm = () => {
    setForm(initialForm);
    setEmailVerified(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleEmailVerifiedChange = useCallback((verified) => {
    setEmailVerified(verified);
  }, []);

  const handleSignup = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setMessage("Please fill all required fields.");
      return;
    }

    if (!emailVerified) {
      setMessage("Please verify your email with OTP first.");
      return;
    }

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

    const newUser = {
      name: form.name.trim(),
      email: normalizeEmail(form.email),
      password: form.password,
    };

    try {
      const backendUser = await signupUser(newUser);
      const userToSave = backendUser?.user || newUser;
      saveRegisteredUser(userToSave);
      saveAuthUser(userToSave);
    } catch (error) {
      setMessage(error.message || "Signup failed. Please try again.");
      return;
    }

    navigate("/", { replace: true });
  };

  const handleLogin = async () => {
    const credentials = {
      email: normalizeEmail(form.email),
      password: form.password,
    };

    if (!credentials.email || !credentials.password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      const backendUser = await loginUser(credentials);
      saveAuthUser(backendUser?.user || credentials);
      navigate("/", { replace: true });
      return;
    } catch (error) {
      setMessage(error.message || "Login failed. Please try again.");
      return;
    }
  };

  const handleForgotPassword = async () => {
    const email = normalizeEmail(form.email);

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      await requestPasswordReset(email);
      setMessage("Password reset link sent to your email.");
      return;
    } catch {
    }

    const registeredUser = getRegisteredUser();

    if (!registeredUser || registeredUser.email !== email) {
      setMessage("No account found with this email.");
      return;
    }

    setMessage("Password reset link sent to your email.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isForgotPassword) {
      await handleForgotPassword();
      return;
    }

    if (isSignup) {
      await handleSignup();
      return;
    }

    await handleLogin();
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setMessage("");
    resetForm();
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <AuthBrandPanel />
        <AuthFormPanel
          form={form}
          isForgotPassword={isForgotPassword}
          isSignup={isSignup}
          message={message}
          onChange={handleChange}
          onEmailVerifiedChange={handleEmailVerifiedChange}
          onForgotPassword={() => {
            setMode("forgot");
            setMessage("");
            setEmailVerified(false);
            setForm((prev) => ({ ...initialForm, email: prev.email }));
          }}
          onModeChange={handleModeChange}
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}
