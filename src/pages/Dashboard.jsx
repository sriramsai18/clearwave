import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaMicrophone, FaTrash, FaDownload, FaSearch,
  FaMusic, FaCheck, FaCut, FaExclamationTriangle,
  FaChevronRight,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";
const PAGE_SIZE = 20;

// ── Helpers ──────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};
const formatTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
};
const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const formatSilence = (secs) => {
  const s = parseFloat(secs) || 0;
  if (s >= 60) return `${(s / 60).toFixed(1)}m`;
  return `${s.toFixed(1)}s`;
};

// ── Toast ─────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`dash-toast dash-toast--${type}`}>
      <span>{msg}</span>
      <button onClick={onClose}>✕</button>
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();

  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") user = JSON.parse(stored);
  } catch {
    localStorage.removeItem("user");
  }

  // Theme — synced with Home.jsx
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const toggleTheme = () => {
    const t = theme === "light" ? "dark" : "light";
    setTheme(t);
    localStorage.setItem("theme", t);
  };

  useEffect(() => { if (!user) navigate("/login"); }, [user, navigate]);

  const [uploads, setUploads]         = useState([]);
  const [total, setTotal]             = useState(0);
  const [skip, setSkip]               = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [selected, setSelected]       = useState(null);
  const [activeTab, setActiveTab]     = useState("transcript");
  const [search, setSearch]           = useState("");
  const [deleting, setDeleting]       = useState(null);
  const [toast, setToast]             = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
  }, []);

  const fetchPage = useCallback((currentSkip, replace = false) => {
    if (!user?._id) return;
    replace ? setLoading(true) : setLoadingMore(true);
    fetch(`${API_BASE}/my-uploads/${user._id}?limit=${PAGE_SIZE}&skip=${currentSkip}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.audios) {
          setUploads((prev) => replace ? data.audios : [...prev, ...data.audios]);
          setTotal(data.total);
          setSkip(currentSkip + data.audios.length);
          setError("");
        } else {
          setError("Failed to load uploads.");
        }
      })
      .catch(() => setError("Could not reach the server."))
      .finally(() => { setLoading(false); setLoadingMore(false); });
  }, [user?._id]);

  useEffect(() => { fetchPage(0, true); }, [fetchPage]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return uploads;
    return uploads.filter(
      (u) =>
        u.speechText?.toLowerCase().includes(q) ||
        u.translation?.toLowerCase().includes(q) ||
        u.summary?.toLowerCase().includes(q)
    );
  }, [uploads, search]);

  const dashStats = useMemo(() => ({
    total,
    enhanced:      uploads.filter((u) => u.enhancedAudioUrl).length,
    fillers:       uploads.reduce((s, u) => s + (u.stats?.fillers_removed || 0), 0),
    silencesSaved: uploads.reduce((s, u) => s + (u.stats?.silences_removed_sec || 0), 0),
  }), [uploads, total]);

  const handleLogout = () => {
    if (!window.confirm("Log out of ClearWave?")) return;
    localStorage.removeItem("user");
    navigate("/");
  };

  const selectItem = (item) => { setSelected(item); setActiveTab("transcript"); };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this recording? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const r = await fetch(`${API_BASE}/my-uploads/${id}`, { method: "DELETE" });
      if (r.ok) {
        setUploads((prev) => prev.filter((u) => u._id !== id));
        setTotal((t) => t - 1);
        if (selected?._id === id) setSelected(null);
        showToast("Recording deleted.", "success");
      } else {
        showToast("Failed to delete. Try again.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    } finally {
      setDeleting(null);
    }
  };

  const tabContent = () => {
    if (!selected) return null;
    const map = {
      transcript:  selected.speechText,
      translation: selected.translation,
      summary:     selected.summary,
    };
    const text = map[activeTab];
    if (activeTab === "translation" && selected.translation === selected.speechText) {
      return (
        <p className="dash-text" style={{ fontStyle: "italic" }}>
          Same as transcript — source and target language were identical, no translation needed.
        </p>
      );
    }
    return text
      ? <p className="dash-text">{text}</p>
      : <p className="dash-text" style={{ fontStyle: "italic" }}>
          No {activeTab} available for this recording.
        </p>;
  };

  const hasMore = skip < total;

  return (
    <div className={`dash-wrapper ${theme}`}>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* SHARED FLOATING NAVBAR */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* ══ MAIN ══ */}
      <main className="dash-main">

        {/* Header */}
        <div className="dash-header">
          <div>
            <div className="dash-title">My Recordings</div>
            <div className="dash-subtitle">{total} file{total !== 1 ? "s" : ""} processed</div>
          </div>
          <Link to="/audio-studio" className="dash-process-btn">
            <FaMicrophone /> Process New Audio
          </Link>
        </div>

        {/* Stats */}
        <div className="dash-stats-row">
          <div className="dash-stat-card">
            <span className="dash-stat-num">{dashStats.total}</span>
            <span className="dash-stat-label">Total Uploads</span>
          </div>
          <div className="dash-stat-card">
            <span className="dash-stat-num">{dashStats.enhanced}</span>
            <span className="dash-stat-label">Enhanced</span>
          </div>
          <div className="dash-stat-card">
            <span className="dash-stat-num">{dashStats.fillers}</span>
            <span className="dash-stat-label">Fillers Removed</span>
          </div>
          <div className="dash-stat-card">
            <span className="dash-stat-num">{formatSilence(dashStats.silencesSaved)}</span>
            <span className="dash-stat-label">Silence Trimmed</span>
          </div>
        </div>

        {/* Search */}
        <div className="dash-search-row">
          <div className="dash-search-wrap">
            <FaSearch className="dash-search-icon" />
            <input
              className="dash-search"
              type="text"
              placeholder="Search transcript, translation or summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="dash-empty">
            <div className="dash-spinner" />
            <p>Loading your recordings...</p>
          </div>
        )}

        {!loading && error && (
          <div className="dash-empty">
            <FaExclamationTriangle className="dash-empty-icon" />
            <p>{error}</p>
            <button className="dash-process-btn" style={{ marginTop: 8 }} onClick={() => fetchPage(0, true)}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && uploads.length === 0 && (
          <div className="dash-empty">
            <FaMicrophone className="dash-empty-icon" />
            <p>No recordings yet.</p>
            <Link to="/audio-studio" className="dash-process-btn" style={{ marginTop: 8 }}>
              Process your first audio <FaChevronRight />
            </Link>
          </div>
        )}

        {!loading && !error && uploads.length > 0 && (
          <div className="dash-content">

            {/* List */}
            <div className="dash-list">
              {filtered.length === 0 ? (
                <div className="dash-empty" style={{ minHeight: 120 }}>
                  <FaSearch className="dash-empty-icon" style={{ fontSize: 28 }} />
                  <p>No results for "{search}"</p>
                </div>
              ) : filtered.map((item) => (
                <div
                  key={item._id}
                  className={`dash-list-item ${selected?._id === item._id ? "active" : ""}`}
                  onClick={() => selectItem(item)}
                >
                  <div className="dash-item-icon"><FaMusic /></div>
                  <div className="dash-item-info">
                    <div className="dash-item-date">{formatDate(item.createdAt)} · {formatTime(item.createdAt)}</div>
                    <div className="dash-item-preview">{item.speechText || "No transcript available"}</div>
                    <div className="dash-item-tags">
                      {item.stats?.language && <span className="dash-tag lang">{item.stats.language}</span>}
                      {(item.enhancedAudioUrl || item.audioURL) && (
                        <span className="dash-tag">
                          <FaCheck style={{ fontSize: 9, marginRight: 3 }} />
                          {item.enhancedAudioUrl ? "Enhanced" : "Original"}
                        </span>
                      )}
                      {item.stats?.fillers_removed > 0 && (
                        <span className="dash-tag">
                          <FaTrash style={{ fontSize: 9, marginRight: 3 }} />
                          {item.stats.fillers_removed} fillers
                        </span>
                      )}
                      {item.stats?.silences_removed_sec > 0 && (
                        <span className="dash-tag">
                          <FaCut style={{ fontSize: 9, marginRight: 3 }} />
                          {formatSilence(item.stats.silences_removed_sec)} silence
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="dash-delete-btn"
                    title="Delete recording"
                    onClick={(e) => handleDelete(e, item._id)}
                    disabled={deleting === item._id}
                  >
                    {deleting === item._id ? <div className="dash-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <FaTrash />}
                  </button>
                </div>
              ))}

              {hasMore && !search && (
                <button
                  className="dash-load-more"
                  onClick={() => fetchPage(skip)}
                  disabled={loadingMore}
                >
                  {loadingMore
                    ? <span className="dash-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    : `Load more (${total - skip} remaining)`}
                </button>
              )}
            </div>

            {/* Detail */}
            <div className={`dash-detail ${!selected ? "dash-detail-empty" : ""}`}>
              {!selected ? (
                <><FaChevronRight className="dash-empty-icon" style={{ fontSize: 24 }} /> Select a recording to view details</>
              ) : (
                <>
                  <div className="dash-detail-header">
                    <div className="dash-detail-title">{formatDate(selected.createdAt)} · {formatTime(selected.createdAt)}</div>
                    <button className="dash-close-btn" onClick={() => setSelected(null)} title="Close">✕</button>
                  </div>

                  {(selected.enhancedAudioUrl || selected.audioURL) ? (
                    <div className="dash-audio-player">
                      <span className="dash-section-label">
                        {selected.enhancedAudioUrl ? "Enhanced Audio" : "Original Audio"}
                      </span>
                      <audio controls src={selected.enhancedAudioUrl || selected.audioURL} className="dash-audio" />
                      <a
                        href={selected.enhancedAudioUrl || selected.audioURL}
                        download="audio.wav"
                        className="dash-download-link"
                      >
                        <FaDownload style={{ marginRight: 5 }} /> Download
                      </a>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, fontStyle: "italic" }}>No audio available for this recording.</p>
                  )}

                  {selected.stats && (
                    <div className="dash-stats-strip">
                      {Object.entries(selected.stats)
                        .filter(([k]) => !["noise_method","transcription_method","translation_method"].includes(k))
                        .map(([k, v]) => {
                          const display = k === "silences_removed_sec" ? formatSilence(v) : String(v);
                          return (
                            <span key={k} className="dash-strip-item">
                              {k.replace(/_/g, " ")}: <strong>{display}</strong>
                            </span>
                          );
                        })}
                    </div>
                  )}

                  <div className="dash-tabs">
                    {["transcript", "translation", "summary"].map((tab) => (
                      <button
                        key={tab}
                        className={`dash-tab ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="dash-tab-content">{tabContent()}</div>
                </>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;