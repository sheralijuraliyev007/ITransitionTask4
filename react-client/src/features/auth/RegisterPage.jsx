import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { createRegisterModel } from "./models";

const API_URL = "/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(createRegisterModel());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
  const { name, value } = e.target;  
  setFormData(prev => ({ ...prev, [name]: value }));
}

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        occupation: formData.occupation
      });

      setSuccess("Registered successfully! Signing you in...");
      
      const { data: token } = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
        rememberMe: false
      });
      localStorage.setItem("token", token);
      navigate("/dashboard");

    } catch (err) {
      
      setError(err.response?.data ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
}

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 py-4">
      <div className="card shadow-sm w-100" style={{ maxWidth: "420px" }}>
        <div className="card-body p-4">
          <h4 className="card-title mb-1">Create account</h4>
          <p className="text-muted small mb-4">User Management System</p>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {success && <div className="alert alert-success py-2 small">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label">First name</label>
                <input type="text" name="firstName" className="form-control"
                  value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="col-6">
                <label className="form-label">Last name</label>
                <input type="text" name="lastName" className="form-control"
                  value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Occupation <span className="text-muted">(optional)</span></label>
              <input type="text" name="occupation" className="form-control"
                value={formData.occupation} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control"
                placeholder="you@example.com"
                value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control"
                placeholder="Any password works"
                value={formData.password} onChange={handleChange} required />
            </div>
            <div className="mb-4 form-check">
              <input type="checkbox" name="rememberMe" className="form-check-input"
              id="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
              <label className="form-check-label small" htmlFor="rememberMe">Remember me</label>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading || !!success}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center small mt-3 mb-0">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}