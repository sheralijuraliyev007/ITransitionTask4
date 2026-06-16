import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/auth/forgotpassword`, { email });
      setMessage(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 py-4">
      <div className="card shadow-sm w-100" style={{ maxWidth: "420px" }}>
        <div className="card-body p-4">
          <h4 className="card-title mb-1">Forgot Password</h4>
          <p className="text-muted small mb-4">Enter your email and we'll send you a reset link.</p>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {message && <div className="alert alert-success py-2 small">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading || !!message}>
              {loading ? "Sending..." : "Send Reset Link"}
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