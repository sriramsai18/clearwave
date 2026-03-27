import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import loginArt from "../assets/loginArt.png";

const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (!accepted) {
      setError("Please accept the Terms & Conditions to continue");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Server error");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setMessage("Reset link sent to your email");
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="new-login-container">
      {/* LEFT */}
      <div className="new-login-left">
        <h1 className="welcome-title">
          {showForgot ? "Reset Password" : "Welcome Back!"}
        </h1>

        <p className="welcome-sub">
          {showForgot
            ? "Enter your email to receive a reset link"
            : "Please enter your login details below"}
        </p>

        {/* LOGIN FORM */}
        {!showForgot && (
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* PASSWORD WITH EYE */}
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <i
                className={`fa-solid ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                } eye-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="forgot-wrapper">
              <span
                className="forgot-link"
                onClick={() => {
                  setShowForgot(true);
                  setError("");
                  setMessage("");
                }}
              >
                Forgot password?
              </span>
            </div>

            <div className="terms-guide-row">
              <div className="terms-row">
                <input
                  type="checkbox"
                  id="accept-terms-login"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <label htmlFor="accept-terms-login">
                  I accept the{" "}
                  <Link to="/terms">Terms & Conditions</Link>
                </label>
              </div>
              <div className="user-guide-row">
                <Link to="/user-guide">📖 User Guide</Link>
              </div>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button className="sign-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        {/* FORGOT FORM */}
        {showForgot && (
          <form className="login-form" onSubmit={handleForgot}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <button className="sign-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <div style={{ textAlign: "right", marginTop: "15px" }}>
              <span
                style={{ cursor: "pointer", opacity: 0.7 }}
                onClick={() => {
                  setShowForgot(false);
                  setError("");
                  setMessage("");
                  setAccepted(false);
                }}
              >
                Back to Login
              </span>
            </div>
          </form>
        )}

        {!showForgot && (
          <p className="bottom-signup">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        )}
      </div>

      {/* RIGHT */}
      <div className="new-login-right">
        <div className="img-box">
          <img src={loginArt} alt="audio ai graphic" />
        </div>

        <h2 className="right-title">Clean Audio. Clear Results.</h2>
        <p className="right-sub">
          ClearWave AI removes background noise and enhances speech clarity
          instantly. Upload or record audio and transform it into studio-quality
          sound within seconds.
        </p>
      </div>
    </div>
  );
};

export default Login;
