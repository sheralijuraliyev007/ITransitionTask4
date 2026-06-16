import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/auth/resetpassword`, {
        token: searchParams.get("token"),
        newPassword
      });
      setMessage(data);
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Invalid or expired reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 py-4">
      <div className="card shadow-sm w-100" style={{ maxWidth: "420px" }}>
        <div className="card-body p-4">
          <h4 className="card-title mb-1">Reset Password</h4>
          <p className="text-muted small mb-4">Enter your new password below.</p>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {message && <div className="alert alert-success py-2 small">{message} Redirecting...</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading || !!message}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className="text-center small mt-3 mb-0">
            <Link to="/login">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}