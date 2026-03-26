import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Login.css"; // reuse same styling

const API_BASE = "https://clearwave-backend.onrender.com"; 

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [status, setStatus] = useState("idle"); // idle | loading | success | invalid
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ── Validate token on mount ──────────────────────────────
  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const verifyToken = async () => {
      setStatus("loading");
      try {
        const res = await fetch(`${API_BASE}/api/auth/verify-reset-token/${token}`);
        if (!res.ok) {
          setStatus("invalid");
        } else {
          setStatus("idle");
        }
      } catch {
        setStatus("invalid");
      }
    };

    verifyToken();
  }, [token]);

  const isStrongPassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pwd);

  // ── Handle Reset Submit ──────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isStrongPassword(password)) {
      setError("Password must contain uppercase, lowercase, number & special character");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Token expired or already used
        if (res.status === 400 || res.status === 401) {
          setStatus("invalid");
        } else {
          setError(data.message || "Something went wrong");
        }
        return;
      }

      setStatus("success");
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render: Token validating ─────────────────────────────
  if (status === "loading") {
    return (
      <div className="new-login-container" style={{ justifyContent: "center", alignItems: "center" }}>
        <p style={{ fontSize: "18px", opacity: 0.7 }}>Verifying reset link...</p>
      </div>
    );
  }

  // ── Render: Invalid / Expired token ─────────────────────
  if (status === "invalid") {
    return (
      <div className="new-login-container" style={{ justifyContent: "center" }}>
        <div className="new-login-left" style={{ maxWidth: "500px", margin: "auto" }}>
          <h1 className="welcome-title" style={{ color: "#dc2626" }}>❌ Link Invalid</h1>
          <p className="welcome-sub">
            This password reset link has expired or has already been used.
            Reset links are valid for <strong>15 minutes</strong> only.
          </p>
          <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <Link to="/login">
              <button className="sign-btn">Back to Login</button>
            </Link>
            <p style={{ textAlign: "center", fontSize: "14px", opacity: 0.6 }}>
              Need a new link? Use "Forgot Password" on the login page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Success ──────────────────────────────────────
  if (status === "success") {
    return (
      <div className="new-login-container" style={{ justifyContent: "center" }}>
        <div className="new-login-left" style={{ maxWidth: "500px", margin: "auto" }}>
          <h1 className="welcome-title" style={{ color: "#16a34a" }}>✅ Password Reset!</h1>
          <p className="welcome-sub">
            Your password has been updated successfully.
            Redirecting you to login in 3 seconds...
          </p>
          <Link to="/login">
            <button className="sign-btn" style={{ marginTop: "30px" }}>Go to Login</button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Render: Reset form ───────────────────────────────────
  return (
    <div className="new-login-container">
      {/* LEFT — Form */}
      <div className="new-login-left">
        <h1 className="welcome-title">Set New Password</h1>
        <p className="welcome-sub">Enter a strong new password for your account</p>

        <form className="login-form" onSubmit={handleReset}>

          {/* New Password */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} eye-icon`}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* Confirm Password */}
          <div className="password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <i
              className={`fa-solid ${showConfirm ? "fa-eye" : "fa-eye-slash"} eye-icon`}
              onClick={() => setShowConfirm(!showConfirm)}
            />
          </div>

          {/* Password strength hint */}
          <p style={{ fontSize: "12px", color: "#888", marginBottom: "16px", lineHeight: "1.5" }}>
            Must be 8+ characters with uppercase, lowercase, number & special character (@$!%*?&)
          </p>

          {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

          <button className="sign-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link to="/login" style={{ fontSize: "14px", color: "#000", opacity: 0.6 }}>
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>

      {/* RIGHT — Info panel */}
      <div className="new-login-right">
        <h2 className="right-title">Almost There!</h2>
        <p className="right-sub">
          Choose a strong password to keep your ClearWave AI account secure.
          Make sure it's something you haven't used before.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
