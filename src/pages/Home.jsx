import React, { useState, useRef } from "react";
import "./Home.css";
import heroImg from "../assets/loginArt1.png";
import logo from "../assets/clearwave.png";
import guidePhoto from "./assets/guide.png";
// import team1 from "./assets/Navya.jpeg";
// import team2 from "./assets/Divya.jpeg";
// import team3 from "./assets/Sriram.jpeg";
// import team4 from "./assets/Sriram.jpeg";
import { FaLinkedin, FaUpload, FaDownload, FaHeadphones, FaFileAlt, FaFolder, FaGlobe, FaLink, FaEnvelope, FaPlayCircle } from "react-icons/fa";
import { FaGraduationCap, FaUniversity, FaBriefcase, FaMicrophone, FaBrain } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";


const GUIDE = {
  name:        "Asst. Prof. Kalyan Ram",
  role:        "Project Guide & Mentor",
  initials:    "KR",
  linkedin:    "https://www.linkedin.com/in/mylavarapu-kalyan-ram-3a51591b0/",
  photo:       guidePhoto,
  degree:      "M.Tech (Ph.D)",
  college:     "Aditya Engineering College",
  designation: "Assistant Professor, Dept. of CSE",
};

const TEAM = [
  { name: "Navya Sai",      role: "Frontend Dev",              initials: "NS", linkedin: "https://www.linkedin.com/in/thota-navya-sai-6801a9288/",    photo: null, degree: "B.Tech CSE", college: "Aditya Engineering College", designation: "Frontend Developer" },
  { name: "Divya Naga Sri", role: "Full Stack Dev",            initials: "DN", linkedin: "https://www.linkedin.com/in/divya-naga-sri-k-549b35287/",    photo: null, degree: "B.Tech CSE", college: "Aditya Engineering College", designation: "Full Stack Developer" },
  { name: "Sai Ganesh",     role: "AI Engineer",               initials: "SG", linkedin: "https://www.linkedin.com/in/devara-sai-ganesh/",             photo: null, degree: "B.Tech CSE", college: "Aditya Engineering College", designation: "AI & ML Engineer" },
  { name: "Sriram Sai",     role: "AI Engineer / Backend Dev", initials: "SS", linkedin: "https://www.linkedin.com/in/sriram-sai-laggisetti/",         photo: null , degree: "B.Tech CSE", college: "Aditya Engineering College", designation: "AI Engineer & Backend Developer" },
];

const GRADIENTS = [
  "linear-gradient(135deg,#378ADD,#6366f1)",
  "linear-gradient(135deg,#7F77DD,#a855f7)",
  "linear-gradient(135deg,#1D9E75,#0ea5e9)",
  "linear-gradient(135deg,#EF9F27,#f97316)",
  "linear-gradient(135deg,#D85A30,#ef4444)",
];

/* ── Avatar circle ── */
function Avatar({ person, index, size = "md" }) {
  return (
    <div
      className={`tc-avatar tc-avatar--${size}`}
      style={{ background: GRADIENTS[index % GRADIENTS.length] }}
    >
      {person.photo
        ? <img src={person.photo} alt={person.name} />
        : <span>{person.initials}</span>}
    </div>
  );
}

/* ── Single person card ── */
function PersonCard({ person, index, isGuide = false, isHovered = false, anyHovered = false }) {
  return (
    <a
      href={person.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "tc-person-card",
        isGuide    ? "tc-person-card--guide"   : "",
        isHovered  ? "tc-person-card--expanded" : "",
        anyHovered && !isHovered ? "tc-person-card--collapsed" : "",
      ].join(" ")}
    >
      <div className="tc-card-shimmer" style={{ background: GRADIENTS[index % GRADIENTS.length] }} />

      {/* Avatar — always visible */}
      <Avatar person={person} index={index} size={isGuide ? "lg" : "md"} />

      {/* Name + role — always visible */}
      <div className="tc-person-name-block">
        <p className="tc-person-name">{person.name}</p>
        <p className="tc-person-role">{person.role}</p>
      </div>

      {/* Details — slide in from right on expand */}
      <div className={`tc-details-panel ${isHovered ? "tc-details-panel--show" : ""}`}>
        <div className="tc-detail-row"><FaGraduationCap className="tc-detail-icon" /><span>{person.degree}</span></div>
        <div className="tc-detail-row"><FaUniversity    className="tc-detail-icon" /><span>{person.college}</span></div>
        <div className="tc-detail-row"><FaBriefcase     className="tc-detail-icon" /><span>{person.designation}</span></div>
        <FaLinkedin className="tc-li-icon" />
      </div>

      {isGuide && <span className="tc-guide-badge">Guide</span>}
    </a>
  );
}

/* ── Full team card ── */
function TeamCard() {
  const [hoveredId, setHoveredId] = useState(null);
  const anyHovered = hoveredId !== null;

  return (
    <div className="tc-wrapper">

      {/* Guide — full width accordion row */}
      <div
        className="tc-guide-row"
        onMouseEnter={() => setHoveredId("guide")}
        onMouseLeave={() => setHoveredId(null)}
      >
        <PersonCard
          person={GUIDE}
          index={0}
          isGuide
          isHovered={hoveredId === "guide"}
          anyHovered={anyHovered}
        />
      </div>

      {/* Divider */}
      <div className="tc-section-divider"><span>Team Members</span></div>

      {/* 4 members — accordion flex row */}
      <div className="tc-members-grid">
        {TEAM.map((tm, i) => (
          <div
            key={tm.name}
            className={[
              "tc-member-slot",
              hoveredId === i           ? "tc-member-slot--expanded"  : "",
              anyHovered && hoveredId !== i ? "tc-member-slot--collapsed" : "",
            ].join(" ")}
            onMouseEnter={() => setHoveredId(i)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <PersonCard
              person={tm}
              index={i + 1}
              isHovered={hoveredId === i}
              anyHovered={anyHovered}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
function AudioDemoCard({ label, badgeClass, badgeText, title, desc, src, accentColor }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrent(audio.currentTime);
    setProgress((audio.currentTime / audio.duration) * 100 || 0);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration || 0);
  };

  const handleEnded = () => setPlaying(false);

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  const fmt = (s) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="demo-card">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <span className={`demo-badge ${badgeClass}`}>{badgeText}</span>
      <h3 className="demo-title">{title}</h3>
      <p className="demo-desc">{desc}</p>

      {/* Zedge-style play button */}
      <button
        className="demo-play-btn"
        onClick={togglePlay}
        style={{ "--accent": accentColor }}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <rect x="5" y="4" width="4" height="16" rx="1" />
            <rect x="15" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M6 4l14 8-14 8V4z" />
          </svg>
        )}
      </button>

      {/* Progress bar */}
      <div className="demo-progress-wrap" onClick={handleSeek}>
        <div
          className="demo-progress-fill"
          style={{ width: `${progress}%`, background: accentColor }}
        />
      </div>

      {/* Time */}
      <div className="demo-time">
        <span>{fmt(current)}</span>
        <span>{duration ? fmt(duration) : "--:--"}</span>
      </div>
    </div>
  );
}

const Home = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const t = theme === "light" ? "dark" : "light";
    setTheme(t); localStorage.setItem("theme", t);
  };

  const scrollToHereTheDifference = () =>
    document.getElementById("audio-demo").scrollIntoView({ behavior: "smooth" });

  // Safe parse user for hero greeting
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
  }

  return (
    <div className={`home ${theme}`}>

      {/* SHARED NAVBAR */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* HERO */}
      <section className="hero-section" id="home">
        <div className="hero-text">
          {user ? (
            <><h1>Welcome back, {user.name}!</h1><p className="hero-desc">Ready to enhance your audio with ClearWave AI.</p></>
          ) : (
            <><h1>Your Audio.<br />Made Perfect.</h1><p className="hero-desc">ClearWave AI removes background noise and converts speech into text using AI.</p></>
          )}
          <div className="hero-buttons">
            {user ? (
              <><Link to="/audio-studio"><button className="primary-btn"><FaMicrophone className="btn-icon" /> Clean Your Audio</button></Link><button className="outline-btn" onClick={scrollToHereTheDifference}>Check this Out</button></>
            ) : (
              <><Link to="/login"><button className="primary-btn">Try Now</button></Link><button className="outline-btn" onClick={scrollToHereTheDifference}>Check this Out</button></>
            )}
          </div>
        </div>
        <div className="hero-img-box">
          <img src={heroImg} alt="Hero" className="hero-img floating" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works" id="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step-card"><div className="step-icon"><FaUpload /></div><h3>1. Upload Your File</h3><p>Choose your audio or video file to get started.</p></div>
          <div className="step-card"><div className="step-icon"><FaBrain /></div><h3>2. AI Noise Reduction</h3><p>Our AI removes unwanted background noise instantly.</p></div>
          <div className="step-card"><div className="step-icon"><FaDownload /></div><h3>3. Download Result</h3><p>Download your clean and enhanced audio file.</p></div>
        </div>
      </section>

      {/* BEFORE vs AFTER AUDIO DEMO */}
      <section className="audio-demo-section" id="audio-demo">
        <h2 className="section-title">Hear The Difference</h2>
        <p className="audio-demo-subtitle">Same recording — before and after ClearWave AI enhancement.</p>
        <div className="audio-demo-grid">

        {/* Noisy Audio Card */}
          <AudioDemoCard
            label="Before"
            badgeClass="badge-noisy"
            badgeText="🔊 With Noise"
            title="Original Recording"
            desc="Raw audio with background noise, fan hum, and echo."
            src="/demos/Noised.mp3"
            accentColor="#ef4444"
          />

        {/* VS divider */}
          <div className="audio-demo-vs">VS</div>

          {/* Clean Audio Card */}
            <AudioDemoCard
              label="After"
              badgeClass="badge-clean"
              badgeText="✨ AI Enhanced"
              title="ClearWave Output"
              desc="Crystal clear voice with all background noise removed."
              src="/demos/Denoised.mp3"
              accentColor="#38bdf8"
            />

      </div>
    </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <h2 className="section-title">Powerful AI Features</h2>
        <div className="feature-grid">
          <div className="feature-card"><span className="feature-icon"><FaHeadphones /></span><h3>Noise Removal</h3><p>Automatically detect and remove background noises like traffic, fan noise, wind, and crowd chatter.</p></div>
          <div className="feature-card"><span className="feature-icon"><FaFileAlt /></span><h3>Speech to Text</h3><p>Convert spoken audio into accurate text within seconds. Ideal for meetings, lectures, and podcasts.</p></div>
          <div className="feature-card"><span className="feature-icon"><FaPlayCircle /></span><h3>Instant Preview</h3><p>Compare original and enhanced audio instantly before saving or sharing.</p></div>
          <div className="feature-card"><span className="feature-icon"><FaFolder /></span><h3>Save & Organize</h3><p>Save, categorize, and manage cleaned audio files and transcriptions easily.</p></div>
          <div className="feature-card"><span className="feature-icon"><FaGlobe /></span><h3>Multi-Language</h3><p>Supports multiple languages and accents for international users and content creators.</p></div>
          <div className="feature-card"><span className="feature-icon"><FaLink /></span><h3>Share Output</h3><p>Securely share enhanced audio and transcripts while maintaining data privacy.</p></div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <h2 className="section-title">About ClearWave AI</h2>
        <div className="about-content">
          <p>ClearWave AI is a modern audio enhancement platform designed to improve the quality and clarity of recorded sound. Audio recordings often suffer from background noise such as traffic, fan sounds, echo, or crowd interference.</p>
          <p>Beyond noise removal, ClearWave AI provides accurate speech-to-text conversion. Spoken audio is transformed into readable text within seconds, making it useful for meetings, classes, interviews, podcasts, and content creation.</p>
          <p>The platform is built with simplicity in mind. Users can upload or record audio, preview the enhanced output instantly, organize files, and securely share results.</p>
        </div>
      </section>

      {/* WHY CLEARWAVE */}
      <section className="why-clearwave">
        <h2 className="section-title">Why ClearWave AI?</h2>
        <div className="about-content">
          <p>ClearWave AI solves one of the most common audio problems — unwanted background noise. Using advanced AI, it accurately detects human voice and removes sounds like traffic, fan noise, echo, and crowd interference.</p>
          <p>Results are fast and efficient. Audio enhancement and speech-to-text conversion complete within seconds, ideal for online meetings, virtual classes, interviews, and podcasts.</p>
          <p>ClearWave AI focuses on user safety and reliability. All uploaded files are handled securely with strong data protection.</p>
        </div>
      </section>

      {/* TEAM */}
      <section className="team-section" id="team">
        <h2 className="section-title">Meet Our Team</h2>
        
        <TeamCard />
      </section>

      {/* FOOTER */}
      <div className="footer-dark" id="contact">
        <div className="footer-dark-left">
          <div className="footer-logo-row">
            <img src={logo} alt="ClearWave Logo" className="footer-logo" />
            <h2>ClearWave AI</h2>
          </div>
          <p>Crystal clear voice technology powered by Artificial Intelligence.</p>
        </div>
        <div className="footer-dark-links">
          <div><h4>Resources</h4><Link to="/user-guide">User Guide</Link><Link to="/faq">FAQ Help</Link></div>
          <div><h4>Legal</h4><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms">Terms of Use</Link></div>
          <div><h4>Contact</h4><a href="mailto:support@clearwaveai.in" className="contact-link"><FaEnvelope className="footer-contact-icon" />support@clearwaveai.in</a></div>
        </div>
      </div>
      <div className="footer-copyright">
        <p>© 2026 ClearWave AI. All rights reserved.</p>
      </div>

    </div>
  );
};

export default Home;