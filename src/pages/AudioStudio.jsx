import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUpload, FaMicrophone, FaStop, FaCircle, FaCheckCircle,
  FaRocket, FaTimes, FaArrowLeft,
  FaTrash, FaRedoAlt, FaCut, FaWind, FaCommentDots,
  FaTimesCircle, FaClock, FaBox, FaBan,
  FaSyncAlt, FaHourglassHalf,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import "./AudioStudio.css";

const API_BASE   = process.env.REACT_APP_API      || "http://localhost:5000";
const HF_SPACE   = process.env.REACT_APP_HF_SPACE || "https://clearwave48-clearwave-api.hf.space";

function AudioStudio() {
  const navigate = useNavigate();

  const [mode, setMode]             = useState("upload");
  const [file, setFile]             = useState(null);
  const [fileName, setFileName]     = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const intervalRef      = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob]     = useState(null);
  const [audioURL, setAudioURL]       = useState(null);
  const [timer, setTimer]             = useState(0);

  const [status, setStatus]                 = useState("");
  const [step, setStep]                     = useState(0);
  const [isProcessing, setIsProcessing]     = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [failedStep, setFailedStep]         = useState(null);
  const [errorMsg, setErrorMsg]             = useState("");
  const abortControllerRef                  = useRef(null);

  const [coldStart, setColdStart]   = useState(false);
  const [sseWarning, setSseWarning] = useState(false);
  const wakeUpTimerRef              = useRef(null);
  const sseTimerRef                 = useRef(null);

  const MAX_FILE_MB    = 50;
  const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;



  const [srcLang, setSrcLang]         = useState("auto");
  const [tgtLang, setTgtLang]         = useState("te");
  const [optFillers, setOptFillers]   = useState(true);
  const [optStutters, setOptStutters] = useState(true);
  const [optSilences, setOptSilences] = useState(true);
  const [optBreaths, setOptBreaths]   = useState(true);
  const [optMouth, setOptMouth]       = useState(true);

  // Theme — synced with Home & Dashboard
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const toggleTheme = () => {
    const t = theme === "light" ? "dark" : "light";
    setTheme(t);
    localStorage.setItem("theme", t);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/login");
  }, [navigate]);

  const resetResults = () => {
    setStatus(""); setStep(0); setUploadProgress(0);
    setFailedStep(null); setErrorMsg("");
    setColdStart(false); setSseWarning(false);
    setIsProcessing(false);
    if (wakeUpTimerRef.current) clearTimeout(wakeUpTimerRef.current);
    if (sseTimerRef.current)    clearInterval(sseTimerRef.current);
  };

  const handleCancel = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()  => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type.startsWith("audio/") || dropped.type.startsWith("video/"))) {
      if (dropped.size > MAX_FILE_BYTES) { setErrorMsg(`File too large. Maximum allowed size is ${MAX_FILE_MB}MB.`); setFailedStep(null); return; }
      setFile(dropped); setFileName(dropped.name); resetResults();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const picked = e.target.files[0];
      if (picked.size > MAX_FILE_BYTES) { setErrorMsg(`File too large. Maximum allowed size is ${MAX_FILE_MB}MB.`); setFailedStep(null); return; }
      setFile(picked); setFileName(picked.name); resetResults();
    }
  };

  const startRecording = async () => {
    try {
      const stream       = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob); });
      };
      mediaRecorder.start();
      setIsRecording(true); setTimer(0);
      intervalRef.current = setInterval(() => setTimer((p) => p + 1), 1000);
    } catch { alert("Microphone permission denied."); }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    clearInterval(intervalRef.current);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const STEP_NAMES = { 0: "Upload", 1: "Denoise", 2: "Transcribe", 3: "Clean", 4: "Translate", 5: "Summarize" };
  const STEPS      = ["Upload", "Denoise", "Transcribe", "Clean", "Translate", "Summarize"];
  const progressPct = Math.round((step / (STEPS.length - 1)) * 100);

  const handleProcess = async () => {
    const activeFile = mode === "upload" ? file : audioBlob;
    if (!activeFile) { alert(mode === "upload" ? "Please upload an audio file first" : "Please record audio first"); return; }

    let user = null;
    try { user = JSON.parse(localStorage.getItem("user")); } catch { /* corrupted */ }
    if (!user) return;

    // ── Reset everything cleanly BEFORE setting isProcessing ─────────
    setStatus(""); setStep(0); setUploadProgress(0);
    setFailedStep(null); setErrorMsg("");
    setColdStart(false); setSseWarning(false);
    setIsProcessing(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    // completedRef: plain ref — no re-render, tracks if done/error already fired
    let completed = false;
    let currentStep = 0;

    wakeUpTimerRef.current = setTimeout(() => setColdStart(true), 5000);

    try {
      setStatus("Uploading audio to server..."); setUploadProgress(0);
      const formData = new FormData();
      formData.append("userId", user._id); formData.append("email", user.email);
      formData.append("name", user.name);  formData.append("audio", activeFile);

      const uploadRes = await axios.post(`${API_BASE}/upload-audio`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          clearTimeout(wakeUpTimerRef.current); setColdStart(false);
          const pct = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(pct); setStatus(`Uploading... ${pct}%`);
        },
      });

      clearTimeout(wakeUpTimerRef.current); setColdStart(false);
      const { url: audioUrl, audioId } = uploadRes.data;
      console.log("[UPLOAD] Success. audioUrl:", audioUrl, "audioId:", audioId);

      // ── Wake up HF Space BEFORE hitting Render ──────────────────
      // Render free tier has a 30s timeout. If we wait for HF Space
      // inside Render, it times out. Instead, ping HF Space directly
      // from the browser until it responds, then call Render.
      setStatus("Waking up AI server..."); setStep(1); currentStep = 1;
      const maxAttempts = 25; // up to ~75 seconds
      let hfReady = false;
      for (let i = 0; i < maxAttempts; i++) {
        if (controller.signal.aborted) return;
        try {
          const hfCheck = await fetch(`${HF_SPACE}/api/health`, { signal: AbortSignal.timeout(6000) });
          if (hfCheck.ok) { hfReady = true; break; }
        } catch (_) { /* still booting */ }
        const elapsed = (i + 1) * 3;
        setStatus(`⏳ AI server starting up... (${elapsed}s)`);
        setColdStart(true);
        await new Promise((r) => setTimeout(r, 3000));
      }
      setColdStart(false);
      if (!hfReady) {
        completed = true;
        setIsProcessing(false);
        setFailedStep(1);
        setErrorMsg("HuggingFace AI server failed to start after 75 seconds. Please try again.");
        return;
      }
      // ────────────────────────────────────────────────────────────

      setStatus("Uploaded! Starting AI processing..."); setStep(1); currentStep = 1;

      let lastSseEvent = Date.now();
      sseTimerRef.current = setInterval(() => {
        if (Date.now() - lastSseEvent > 15000) setSseWarning(true);
      }, 3000);

      const doFetch = () => fetch(`${API_BASE}/process-audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ audioUrl, audioId, srcLang, tgtLang, optFillers, optStutters, optSilences, optBreaths, optMouth }),
      });

      let response = await doFetch();
      console.log("[SSE CONNECT] status:", response.status, "ok:", response.ok);
      console.log("[SSE CONNECT] headers:", [...response.headers.entries()]);
      if (!response.ok && (response.status === 502 || response.status === 503)) {
        setStatus("Server is waking up, retrying in 6 seconds...");
        await new Promise((res) => setTimeout(res, 6000));
        if (controller.signal.aborted) return;
        response = await doFetch();
      }
      if (!response.ok) {
        completed = true;
        setIsProcessing(false);
        setFailedStep(currentStep);
        setErrorMsg(`Server rejected the request (${response.status}). Please try again.`);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let lineBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        console.log("[SSE READ] done:", done, "value length:", value?.length ?? 0);
        if (value) {
          const rawChunk = decoder.decode(value, { stream: true });
          console.log("[SSE RAW CHUNK]", JSON.stringify(rawChunk.slice(0, 500)));
          lineBuffer += rawChunk;
          const lines = lineBuffer.split("\n");
          lineBuffer = lines.pop();
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const rawLine = trimmed.slice(5).trim();
            if (!rawLine) continue;
            try {
              const data = JSON.parse(rawLine);
              console.log("[SSE EVENT]", data); // 👈 logs every SSE event
              lastSseEvent = Date.now(); setSseWarning(false);
              if (data.step !== undefined) { currentStep = data.step; setStep(data.step); }
              setStatus(data.message || "");

              if (data.status === "done") {
                console.log("[SSE DONE] Received done event. Navigating to /audio-results");
                console.log("[SSE DONE] data:", JSON.stringify(data).slice(0, 300));
                completed = true;
                clearInterval(sseTimerRef.current);
                clearTimeout(wakeUpTimerRef.current);
                setSseWarning(false);
                setColdStart(false);
                setIsProcessing(false);
                // Navigate to the dedicated results page, passing all data via state
                navigate("/audio-results", {
                  state: {
                    enhancedAudio: data.enhancedAudio || "error",
                    transcript:    data.transcript    || "",
                    translation:   data.translation   || "",
                    summary:       data.summary       || "",
                    stats:         data.stats         || null,
                  },
                });
                console.log("[SSE DONE] navigate() called");
                return;
              }

              if (data.status === "error") {
                console.log("[SSE ERROR]", data.message);
                completed = true;
                clearInterval(sseTimerRef.current);
                clearTimeout(wakeUpTimerRef.current);
                setIsProcessing(false);
                setColdStart(false);
                setFailedStep(currentStep);
                setErrorMsg(data.message || `Something went wrong during the ${STEP_NAMES[currentStep] || "processing"} step.`);
                return;
              }
            } catch (e) { console.warn("[SSE parse error]", e.message, "| line:", rawLine.slice(0, 100)); }
          }
        }
        if (done) break;
      }
    } catch (err) {
      if (err.name === "AbortError" || err.code === "ERR_CANCELED") {
        completed = true;
        setIsProcessing(false);
        setFailedStep(null);
        setErrorMsg("cancelled");
        return;
      }
      const serverMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Unknown error";
      console.error("[AudioStudio] Upload/process error:", serverMsg, err);
      completed = true;
      setIsProcessing(false);
      setFailedStep(currentStep);
      setErrorMsg(`Failed at ${STEP_NAMES[currentStep] || "processing"}: ${serverMsg}`);
    } finally {
      // ONLY clean up timers and refs here — NEVER touch state.
      // All state transitions happen above in their exact branches.
      // If completed=false here it means we exited the loop without
      // a done/error event (shouldn't happen, but stop spinner as fallback).
      if (!completed) {
        console.warn("[FINALLY] completed=false — stream ended without done/error event");
        setIsProcessing(false);
      }
      clearTimeout(wakeUpTimerRef.current);
      clearInterval(sseTimerRef.current);
      abortControllerRef.current = null;
    }
  };

  // Enhancement toggle options with icons
  const TOGGLE_OPTIONS = [
    { key: "fillers",  label: "Fillers",  icon: <FaTrash />,       val: optFillers,   set: setOptFillers   },
    { key: "stutters", label: "Stutters", icon: <FaRedoAlt />,     val: optStutters,  set: setOptStutters  },
    { key: "silences", label: "Silences", icon: <FaCut />,          val: optSilences,  set: setOptSilences  },
    { key: "breaths",  label: "Breaths",  icon: <FaWind />,         val: optBreaths,   set: setOptBreaths   },
    { key: "mouth",    label: "Mouth",    icon: <FaCommentDots />,  val: optMouth,     set: setOptMouth     },
  ];

  // ── MAIN STUDIO VIEW ──────────────────────────────────────────────
  return (
    <div className={`studio-page ${theme}`}>
      <div className="studio-overlay" />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div className="studio-layout">
        <div className="studio-card">

          <div className="studio-brand-badge">ClearWave AI</div>

          <button className="studio-btn back-btn" onClick={() => navigate("/dashboard")}>
            <FaArrowLeft style={{ marginRight: 8 }} /> Back
          </button>

          <h1 className="studio-title">Audio Studio</h1>
          <p className="studio-desc">AI-powered noise removal · transcription · translation</p>

          {/* Mode Tabs */}
          <div className="studio-tabs">
            <button
              className={`studio-tab ${mode === "upload" ? "active" : ""}`}
              onClick={() => {
                setMode("upload"); resetResults(); setAudioBlob(null);
                setAudioURL((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
                setTimer(0);
              }}
            >
              <FaUpload className="tab-icon" /> Upload Audio
            </button>
            <button
              className={`studio-tab ${mode === "record" ? "active" : ""}`}
              onClick={() => { setMode("record"); resetResults(); setFile(null); setFileName(""); }}
            >
              <FaMicrophone className="tab-icon" /> Record Audio
            </button>
          </div>

          {/* Upload Mode */}
          {mode === "upload" && (
            <label
              className={`studio-dropzone ${isDragging ? "dragging" : ""} ${fileName ? "has-file" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input type="file" accept="audio/*" onChange={handleFileChange} hidden />
              <div className="dropzone-icon"><FaUpload /></div>
              {fileName ? (
                <><span className="dropzone-filename">{fileName}</span><span className="dropzone-sub">Click to change file</span></>
              ) : (
                <><span className="dropzone-main">Drop Audio Here</span><span className="dropzone-or">— or —</span><span className="dropzone-main">Click to Upload</span></>
              )}
            </label>
          )}

          {/* Record Mode */}
          {mode === "record" && (
            <div className="studio-record-area">
              {!isRecording ? (
                <button className="mic-btn" onClick={startRecording}><FaMicrophone /></button>
              ) : (
                <button className="mic-btn recording" onClick={stopRecording}><FaStop /></button>
              )}
              <p className="record-status">
                {isRecording ? (
                  <span className="record-live"><FaCircle className="rec-dot" /> Recording... {formatTime(timer)}</span>
                ) : audioURL ? (
                  <span className="record-ready"><FaCheckCircle className="rec-check" /> Recording ready</span>
                ) : "Tap mic to start recording"}
              </p>
              {audioURL && <audio controls src={audioURL} className="studio-audio-preview" />}
            </div>
          )}

          {/* Language Options */}
          <div className="studio-selects">
            <div className="studio-select-group">
              <label>Input Language</label>
              <select value={srcLang} onChange={(e) => setSrcLang(e.target.value)}>
                <option value="auto">Auto Detect</option>
                <option value="en">English</option>
                <option value="te">Telugu</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="kn">Kannada</option>
              </select>
            </div>
            <div className="studio-select-group">
              <label>Output Language</label>
              <select value={tgtLang} onChange={(e) => setTgtLang(e.target.value)}>
                <option value="te">Telugu</option>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="kn">Kannada</option>
              </select>
            </div>
          </div>

          {/* Enhancement Toggles */}
          <div className="studio-toggles">
            {TOGGLE_OPTIONS.map(({ key, label, icon, val, set }) => (
              <button key={key} className={`toggle-chip ${val ? "on" : "off"}`} onClick={() => set(!val)}>
                <span className="chip-icon">{val ? <FaCheckCircle className="chip-check" /> : icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Process / Cancel */}
          {!isProcessing ? (
            <button className="studio-btn" onClick={handleProcess}>
              <FaRocket className="btn-icon" /> Process Audio
            </button>
          ) : (
            <button className="studio-btn cancel-btn" onClick={handleCancel}>
              <FaTimes className="btn-icon" /> Cancel
            </button>
          )}

          {/* Cold Start Banner */}
          {coldStart && (
            <div className="studio-info-banner cold-start">
              <FaHourglassHalf className="info-icon spinning" />
              <div>
                <p className="info-title">Server is waking up...</p>
                <p className="info-sub">The server was idle and is starting up. This usually takes 15–30 seconds. Please wait — your request is queued.</p>
              </div>
            </div>
          )}

          {/* SSE Warning */}
          {sseWarning && (
            <div className="studio-info-banner sse-warning">
              <FaSyncAlt className="info-icon spinning" />
              <div>
                <p className="info-title">AI is still processing...</p>
                <p className="info-sub">This step is taking longer than usual. The server may be buffering results. Don't close this page — your audio is still being processed.</p>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isProcessing && uploadProgress < 100 && (
            <div className="studio-progress">
              <div className="upload-progress-header">
                <span><FaUpload style={{ marginRight: 6, fontSize: 11 }} /> Uploading to server</span>
                <span className="upload-pct">{uploadProgress}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill upload-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="progress-status">{status}</p>
            </div>
          )}

          {/* AI Progress */}
          {isProcessing && uploadProgress === 100 && (
            <div className="studio-progress">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${step === 0 ? 4 : progressPct}%` }} />
              </div>
              <div className="progress-steps">
                {STEPS.map((s, i) => (
                  <span key={s} className={`progress-step ${i < step ? "done" : i === step ? "active" : ""}`}>{s}</span>
                ))}
              </div>
              <p className="progress-status">{status || "Connecting to AI server..."}</p>
            </div>
          )}

          {/* File Too Large Error */}
          {!isProcessing && failedStep === null && errorMsg && errorMsg !== "cancelled" && errorMsg.includes("too large") && (
            <div className="studio-error-panel failed">
              <FaBox className="error-icon" />
              <div><p className="error-title">File Too Large</p><p className="error-sub">{errorMsg}</p></div>
              <button className="error-dismiss" onClick={() => setErrorMsg("")}><FaTimes /></button>
            </div>
          )}

          {/* Cancelled */}
          {!isProcessing && errorMsg === "cancelled" && (
            <div className="studio-error-panel cancelled">
              <FaBan className="error-icon" />
              <div><p className="error-title">Processing Cancelled</p><p className="error-sub">Your request was stopped. You can process the audio again anytime.</p></div>
              <button className="error-dismiss" onClick={() => setErrorMsg("")}><FaTimes /></button>
            </div>
          )}

          {/* Step Error */}
          {!isProcessing && failedStep !== null && errorMsg && errorMsg !== "cancelled" && (
            <div className="studio-error-panel failed">
              <FaTimesCircle className="error-icon" />
              <div>
                <p className="error-title">Failed at: <strong>{STEP_NAMES[failedStep]}</strong> step</p>
                <p className="error-sub">{errorMsg}</p>
                <div className="error-steps">
                  {STEPS.map((s, i) => (
                    <span key={s} className={`error-step-pill ${i < failedStep ? "passed" : i === failedStep ? "failed" : "pending"}`}>
                      {i < failedStep
                        ? <FaCheckCircle style={{ marginRight: 4 }} />
                        : i === failedStep
                        ? <FaTimesCircle style={{ marginRight: 4 }} />
                        : <FaClock style={{ marginRight: 4 }} />}
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <button className="error-dismiss" onClick={() => { setFailedStep(null); setErrorMsg(""); }}><FaTimes /></button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AudioStudio;
