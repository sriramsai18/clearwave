import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaDownload, FaShareAlt, FaCheckCircle,
  FaFileAlt, FaGlobe, FaClipboardList, FaChartBar,
  FaWhatsapp, FaTwitter, FaInstagram, FaCopy, FaMicrophone,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import "./AudioStudio.css"; // reuse same CSS

function AudioResults() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // All result data is passed via navigate(state)
  const {
    enhancedAudio = null,
    transcript    = "",
    translation   = "",
    summary       = "",
    stats         = null,
  } = location.state || {};

  const [theme, setTheme]     = useState(localStorage.getItem("theme") || "light");
  const [toast, setToast]     = useState("");
  const [shareOpen, setShareOpen] = useState(false);

  const toggleTheme = () => {
    const t = theme === "light" ? "dark" : "light";
    setTheme(t);
    localStorage.setItem("theme", t);
  };

  // BUG FIX: Replaced broken onAnimationEnd toast pattern with a simple setTimeout
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // If someone lands here directly without state, send them back
  if (!location.state) {
    return (
      <div className={`studio-page ${theme}`}>
        <div className="studio-overlay" />
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <div className="studio-layout">
          <div className="studio-card" style={{ textAlign: "center", padding: "40px 24px" }}>
            <p style={{ color: "#aaa", marginBottom: 20 }}>No results to display.</p>
            <button className="studio-btn" onClick={() => navigate("/audio-studio")}>
              <FaArrowLeft style={{ marginRight: 8 }} /> Go to Audio Studio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`studio-page ${theme}`}>
      <div className="studio-overlay" />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {toast && (
        <div className="studio-toast">
          <FaCheckCircle className="toast-icon" /> {toast}
        </div>
      )}

      <div className="results-fullscreen">

        {/* ── Top bar — Share button removed ── */}
        <div className="results-topbar">
          <div className="results-topbar-left">
            <span className="results-topbar-logo">
              <FaMicrophone className="topbar-logo-icon" /> ClearWave AI
            </span>
            <span className="results-topbar-badge">
              <FaCheckCircle style={{ marginRight: 5 }} /> Processing Complete
            </span>
          </div>

          <div className="results-actions">
            <button
              className="results-back-btn"
              onClick={() => navigate("/studio")}
            >
              <FaArrowLeft style={{ marginRight: 6 }} /> Process Again
            </button>
          </div>
        </div>

        {/* ── Audio hero ── */}
        <div className="results-hero">
          <div className="results-hero-label">Enhanced Audio</div>

          {enhancedAudio && enhancedAudio !== "error" ? (
            <>
              <audio controls src={enhancedAudio} className="results-audio-player" />

              {/* BUG FIX: Download button margin overrides removed — layout handled by flex hero-actions */}
              <div className="results-hero-actions">
                <a
                  href={enhancedAudio}
                  download={enhancedAudio.split('/').pop() || 'enhanced_audio.wav'}
                  className="studio-download-btn"
                >
                  <FaDownload style={{ marginRight: 7 }} /> Download
                </a>

                <div className="share-wrapper">
                  <button
                    className="studio-share-btn"
                    onClick={() => setShareOpen((o) => !o)}
                    title="Share audio"
                  >
                    <FaShareAlt style={{ marginRight: 7 }} /> Share
                  </button>

                  {shareOpen && (
                    <div className="share-popover">
                      <p className="share-popover-title">Share Enhanced Audio</p>

                      <a
                        className="share-option whatsapp"
                        href={`https://wa.me/?text=${encodeURIComponent(
                          "🎙️ Check out this AI-enhanced audio by ClearWave!\n" + enhancedAudio
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShareOpen(false)}
                      >
                        <FaWhatsapp className="share-option-icon" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        className="share-option twitter"
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          "🎙️ Just enhanced my audio with ClearWave AI! Listen here:"
                        )}&url=${encodeURIComponent(enhancedAudio)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShareOpen(false)}
                      >
                        <FaTwitter className="share-option-icon" />
                        <span>X (Twitter)</span>
                      </a>

                      <button
                        className="share-option instagram"
                        onClick={() => {
                          navigator.clipboard.writeText(enhancedAudio);
                          showToast("Link copied! Paste it in your Instagram story or bio.");
                          setShareOpen(false);
                        }}
                      >
                        <FaInstagram className="share-option-icon" />
                        <span>Instagram <span className="share-copy-hint">(copy link)</span></span>
                      </button>

                      <button
                        className="share-option copy-link"
                        onClick={() => {
                          navigator.clipboard.writeText(enhancedAudio);
                          showToast("Link copied to clipboard!");
                          setShareOpen(false);
                        }}
                      >
                        <FaCopy className="share-option-icon" />
                        <span>Copy Link</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="result-empty">Audio enhancement not available</p>
          )}
        </div>

        {/* ── Result cards ── */}
        <div className="results-grid">

          <div className="result-card">
            <div className="result-card-header">
              <FaFileAlt className="result-card-icon" />
              <span className="result-card-title">Transcript</span>
            </div>
            <div className="result-card-body">
              {transcript
                ? <p className="result-text">{transcript}</p>
                : <p className="result-empty">No transcript available</p>}
            </div>
          </div>

          <div className="result-card">
            <div className="result-card-header">
              <FaGlobe className="result-card-icon" />
              <span className="result-card-title">Translation</span>
            </div>
            <div className="result-card-body">
              {translation && translation !== transcript ? (
                <p className="result-text">{translation}</p>
              ) : translation && translation === transcript ? (
                <p className="result-empty" style={{ fontStyle: "italic" }}>
                  Same as transcript — source and target language were identical.
                </p>
              ) : (
                <p className="result-empty">No translation available</p>
              )}
            </div>
          </div>

          <div className="result-card">
            <div className="result-card-header">
              <FaClipboardList className="result-card-icon" />
              <span className="result-card-title">Summary</span>
            </div>
            <div className="result-card-body">
              {summary
                ? <p className="result-text">{summary}</p>
                : <p className="result-empty">No summary available</p>}
            </div>
          </div>

          {/* BUG FIX: "stats-card" had no CSS definition — changed to "result-card--stats" with proper styles */}
          <div className="result-card result-card--stats">
            <div className="result-card-header">
              <FaChartBar className="result-card-icon" />
              <span className="result-card-title">Stats</span>
            </div>
            <div className="stats-grid">
              {stats && typeof stats === 'object' ? (
                Object.entries(stats)
                  .filter(([k]) =>
                    !["noise_method", "transcription_method", "translation_method"].includes(k)
                  )
                  .map(([k, v]) => (
                    <div key={k} className="stat-item">
                      <span className="stat-key">{k}</span>
                      <span className="stat-val">{String(v)}</span>
                    </div>
                  ))
              ) : (
                <p className="result-empty">No stats available</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AudioResults;
