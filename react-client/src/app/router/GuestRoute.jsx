import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) return children;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      return children;
    }
  } catch {
    return children;
  }

  return <Navigate replace to="/dashboard" />;
}