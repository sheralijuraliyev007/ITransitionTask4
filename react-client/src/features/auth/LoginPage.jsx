import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { createLoginModel } from "./models";

const API_URL = "/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(createLoginModel());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
}

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
        const { data } = await axios.post(`${API_URL}/auth/login`, {
            email: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe
        });
        if (formData.rememberMe) {
            localStorage.setItem("token", data);
        } 
        else {
            sessionStorage.setItem("token", data);
        }
        navigate("/dashboard");
    } catch (err) {
        setError(err.response?.data ?? "Something went wrong. Try again");
    } finally {
        setLoading(false);
    }
}

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 py-4">
      <div className="card shadow-sm w-100" style={{ maxWidth: "420px" }}>
        <div className="card-body p-4">
          <h4 className="card-title mb-1">Sign in</h4>
          <p className="text-muted small mb-4">User Management System</p>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control"
                placeholder="you@example.com"
                value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control"
                placeholder="Enter password"
                value={formData.password} onChange={handleChange} required />
            </div>
            <div className="mb-4 form-check">
              <input type="checkbox" name="rememberMe" className="form-check-input"
                id="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
              <label className="form-check-label small" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <hr className="my-3" />

          <p className="text-center small mb-1">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <p className="text-center small mb-0">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}