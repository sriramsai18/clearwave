import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaHome, FaSlidersH, FaChartBar, FaBars, FaTimes, FaSignOutAlt, FaEnvelope } from "react-icons/fa";
import logo from "../assets/clearwave.png";
import "./Navbar.css";

const Navbar = ({ theme, toggleTheme }) => {
  const [showProfile, setShowProfile]       = useState(false);
  const [menuOpen, setMenuOpen]             = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileRef = useRef(null);
  const menuRef    = useRef(null);
  const location   = useLocation();
  const navigate   = useNavigate();

  // Safe parse user
  let user = null;
  try {
    const stored = localStorage.getItem("user");
    user = stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("user");
  }

  // Close dropdown/menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      // Only close mobile menu if click is outside both menu and hamburger
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.closest(".navbar-hamburger")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Lock body scroll when logout modal is open
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showLogoutModal]);

  const handleLogoutRequest = () => {
    setShowProfile(false);
    setMenuOpen(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const NAV_LINKS = [
    { to: "/",             label: "Home",        icon: <FaHome />,     anchor: false },
    { to: "/audio-studio", label: "Audio Studio", icon: <FaSlidersH />, anchor: false },
    { to: "/dashboard",    label: "Dashboard",    icon: <FaChartBar />, anchor: false },
    { to: "/#contact",     label: "Contact",      icon: <FaEnvelope />, anchor: true  },
  ];

  const isActive = (path, anchor) => {
    if (anchor) return false;
    if (path === "/") return location.pathname === "/" || location.pathname === "/home";
    return location.pathname === path;
  };

  // Handle contact click — navigate to home then scroll
  const handleContactClick = (e, anchor) => {
    if (!anchor) return;
    e.preventDefault();
    if (location.pathname === "/" || location.pathname === "/home") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  };

  return (
    <>
      <nav className={`navbar ${theme}`}>

        {/* LEFT — logo */}
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="ClearWave Logo" className="navbar-logo-img" />
            <span className="navbar-logo-text">ClearWave AI</span>
          </Link>
        </div>

        {/* CENTER — nav links (desktop) */}
        <ul className="navbar-links">
          {NAV_LINKS.map(({ to, label, icon, anchor }) => (
            <li key={to}>
              <Link
                to={anchor ? "/" : to}
                className={`navbar-nav-link ${isActive(to, anchor) ? "active" : ""}`}
                onClick={(e) => handleContactClick(e, anchor)}
              >
                <span className="navbar-nav-icon">{icon}</span>
                <span className="navbar-nav-label">{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT — theme + auth + hamburger */}
        <div className="navbar-right">

          {/* Theme toggle */}
          <button className="navbar-theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>

          {/* Auth */}
          {!user ? (
            <Link to="/login" className="navbar-login-btn">Login</Link>
          ) : (
            <div className="navbar-profile" ref={profileRef}>
              <div
                className="navbar-profile-icon"
                onClick={() => setShowProfile(!showProfile)}
                title={user.name}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              {showProfile && (
                <div className="navbar-dropdown">
                  <p className="navbar-dropdown-name">{user.name}</p>
                  <p className="navbar-dropdown-email">{user.email}</p>
                  <button className="navbar-dropdown-logout" onClick={handleLogoutRequest}>
                    <FaSignOutAlt style={{ marginRight: 7 }} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hamburger — mobile only */}
          <button
            className="navbar-hamburger"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

        </div>

        {/* MOBILE MENU — rendered inside nav so theme class is inherited */}
        {menuOpen && (
          <div className={`navbar-mobile-menu ${theme}`} ref={menuRef}>
            {NAV_LINKS.map(({ to, label, icon, anchor }) => (
              <Link
                key={to}
                to={anchor ? "/" : to}
                className={`navbar-mobile-link ${isActive(to, anchor) ? "active" : ""}`}
                onClick={(e) => { handleContactClick(e, anchor); setMenuOpen(false); }}
              >
                <span className="navbar-nav-icon">{icon}</span>
                {label}
              </Link>
            ))}

            <div className="navbar-mobile-divider" />

            {/* Theme toggle in mobile menu */}
            <button className="navbar-mobile-theme" onClick={toggleTheme}>
              {theme === "light" ? <FaMoon /> : <FaSun />}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>

            {/* Auth in mobile menu */}
            {!user ? (
              <Link to="/login" className="navbar-mobile-login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            ) : (
              <>
                <div className="navbar-mobile-user">
                  <div className="navbar-mobile-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="navbar-mobile-name">{user.name}</p>
                    <p className="navbar-mobile-email">{user.email}</p>
                  </div>
                </div>
                <button className="navbar-mobile-logout" onClick={handleLogoutRequest}>
                  <FaSignOutAlt style={{ marginRight: 8 }} /> Logout
                </button>
              </>
            )}
          </div>
        )}

      </nav>

      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {showLogoutModal && (
        <div className={`logout-overlay ${theme}`} onClick={handleLogoutCancel}>
          <div
            className={`logout-modal ${theme}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="logout-modal-icon">
              <FaSignOutAlt />
            </div>
            <h3 className="logout-modal-title">Sign out?</h3>
            <p className="logout-modal-desc">
              You'll be signed out of <span>ClearWave AI</span>. Any unsaved changes will be lost.
            </p>
            <div className="logout-modal-actions">
              <button className="logout-btn-cancel" onClick={handleLogoutCancel}>
                Cancel
              </button>
              <button className="logout-btn-confirm" onClick={handleLogoutConfirm}>
                <FaSignOutAlt style={{ marginRight: 7 }} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
