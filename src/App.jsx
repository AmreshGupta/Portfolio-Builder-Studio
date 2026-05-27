
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/routing/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/portfolio/:slug" element={<Portfolio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
