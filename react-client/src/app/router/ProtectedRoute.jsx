import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) return <Navigate replace to="/login" />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      return <Navigate replace to="/login" />;
    }
  } catch {
    return <Navigate replace to="/login" />;
  }

  return children;
}