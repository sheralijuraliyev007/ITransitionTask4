import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const called = useRef(false); 

  useEffect(() => {
    if (called.current) return; 
    called.current = true;

    const token = searchParams.get("token");
    axios.get(`/api/auth/verifyemail?token=${token}`)
      .then(({ data }) => {
        if (data.toLowerCase() === "verified") {
          setSuccess(true);
          setMessage("Email verified successfully!");
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          setSuccess(false);
          setMessage(data);
        }
      })
      .catch(() => {
        setSuccess(false);
        setMessage("Invalid or expired verification link.");
      });
  }, []);
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="card shadow-sm p-4 text-center w-100" style={{ maxWidth: "400px" }}>
        {success === null && (
          <div className="spinner-border text-primary mx-auto mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {success === true && (
          <i className="bi bi-check-circle text-success fs-1"></i>
        )}
        {success === false && (
          <i className="bi bi-x-circle text-danger fs-1"></i>
        )}
        <p className="mt-3 mb-0">{message}</p>
      </div>
    </div>
  );
}