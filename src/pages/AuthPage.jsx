import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthBrandPanel from "../components/auth/AuthBrandPanel";
import AuthFormPanel from "../components/auth/AuthFormPanel";
import {
  getRegisteredUser,
  saveAuthUser,
  saveRegisteredUser
} from "../utils/authStorage";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(getRegisteredUser() ? "login" : "signup");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  const isSignup = mode === "signup";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSignup) {
      if (!form.name.trim() || !form.email.trim() || !form.password) {
        setMessage("Please fill all required fields.");
        return;
      }

      if (form.password.length < 6) {
        setMessage("Password must be at least 6 characters.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setMessage("Confirm password does not match.");
        return;
      }

      const newUser = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      };

      saveRegisteredUser(newUser);
      saveAuthUser(newUser);
      navigate("/", { replace: true });
      return;
    }

    const registeredUser = getRegisteredUser();

    if (!registeredUser) {
      setMessage("Please create your account first.");
      setMode("signup");
      return;
    }

    if (
      registeredUser.email !== form.email.trim().toLowerCase() ||
      registeredUser.password !== form.password
    ) {
      setMessage("Email or password is incorrect.");
      return;
    }

    saveAuthUser(registeredUser);
    navigate("/", { replace: true });
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <AuthBrandPanel />
        <AuthFormPanel
          form={form}
          isSignup={isSignup}
          message={message}
          onChange={handleChange}
          onModeChange={(nextMode) => {
            setMode(nextMode);
            setMessage("");
          }}
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}
