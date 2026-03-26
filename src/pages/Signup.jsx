import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import signupArt from "../assets/loginArt.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const Signup = () => {
  const navigate = useNavigate();

  const [step, setStep]                     = useState(1);
  const [name, setName]                     = useState("");
  const [email, setEmail]                   = useState("");
  const [otp, setOtp]                       = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [error, setError]                   = useState("");
  const [accepted, setAccepted]             = useState(false);
  const [isLoading, setIsLoading]           = useState(false);
  const [resendTimer, setResendTimer]       = useState(60);
  const [canResend, setCanResend]           = useState(false);
  const [resendCount, setResendCount]       = useState(0);

  const isStrongPassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pwd);

  /* ── OTP countdown timer ─────────────────────────────────── */
  useEffect(() => {
    if (step !== 2 || canResend) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(timer); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, canResend, resendCount]);

  /* ── STEP 1: Send OTP ────────────────────────────────────── */
  const handleSendOtp = async () => {
    setError("");
    if (!name.trim() || !email.trim()) { setError("Name and Email are required"); return; }
    if (!email.trim().endsWith("@gmail.com")) { setError("Only @gmail.com emails allowed"); return; }
    if (!accepted) { setError("Please accept the Terms & Conditions to continue"); return; }

    setIsLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to send OTP"); return; }
      setResendTimer(60);
      setCanResend(false);
      setStep(2);
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── STEP 2: Verify OTP ──────────────────────────────────── */
  const handleVerifyOtp = async () => {
    setError("");
    if (!otp.trim()) { setError("Please enter the OTP"); return; }

    setIsLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Invalid OTP"); return; }
      setStep(3);
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── STEP 2: Resend OTP ──────────────────────────────────── */
  const handleResendOtp = async () => {
    setError("");
    try {
      await fetch(`${API_BASE}/api/auth/send-otp`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      setCanResend(false);
      setResendTimer(60);
      setResendCount((c) => c + 1);
    } catch {
      setError("Failed to resend OTP");
    }
  };

  /* ── STEP 3: Create Account ──────────────────────────────── */
  const handleCreateAccount = async () => {
    setError("");
    if (!password || !confirmPassword) { setError("All fields are required"); return; }
    if (password !== confirmPassword)  { setError("Passwords do not match"); return; }
    if (!isStrongPassword(password))   {
      setError("Password must have uppercase, lowercase, number & special character");
      return;
    }

    setIsLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/complete-signup`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Signup failed"); return; }
      navigate("/login");
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── RENDER ──────────────────────────────────────────────── */
  return (
    <div className="signup-wrapper">

      {/* LEFT */}
      <div className="signup-left">
        <img src={signupArt} alt="audio ai" className="signup-img" />
        <h2 className="left-title">Join ClearWave AI and Enjoy Noise-Free Audio!</h2>
        <p className="left-sub">
          ClearWave AI cleans background noise, enhances voice clarity,
          and converts speech into text instantly.
        </p>
      </div>

      {/* RIGHT */}
      <div className="signup-right">
        <h1 className="signup-title">Create Account</h1>
        <p className="login-info">
          Already a member? <Link to="/login">Log In</Link>
        </p>

        {/* ── STEP 1 ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="signup-form step-1">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="terms-row">
              <input
                type="checkbox"
                id="accept-terms-signup"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <label htmlFor="accept-terms-signup">
                I accept the{" "}
                <Link to="/terms" target="_blank">Terms & Conditions</Link>
              </label>
            </div>
            <div className="user-guide-row">
              <Link to="/user-guide" target="_blank">📖 User Guide</Link>
            </div>
            {error && <p style={{ color: "red", margin: "8px 0" }}>{error}</p>}
            <button
              className="signup-btn"
              onClick={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* ── STEP 2 ─────────────────────────────────────────── */}
        {step === 2 && (
          <div className="signup-form step-2">
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "12px" }}>
              OTP sent to <strong>{email}</strong>
            </p>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
            {error && <p style={{ color: "red", margin: "8px 0" }}>{error}</p>}
            <button
              className="signup-btn"
              onClick={handleVerifyOtp}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "14px",
                  color: canResend ? "#000" : "#999",
                  cursor: canResend ? "pointer" : "not-allowed",
                }}
              >
                {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ─────────────────────────────────────────── */}
        {step === 3 && (
          <div className="signup-form step-3">
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="password-field">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {error && <p style={{ color: "red", margin: "8px 0" }}>{error}</p>}
            <button
              className="signup-btn"
              onClick={handleCreateAccount}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Signup;