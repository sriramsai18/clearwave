import { useEffect } from "react";
import {useNavigate} from "react-router-dom";
import "./styles.css";

function UserGuide() {
  const navigate = useNavigate();
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  return (
    <div className="userguide-page">
      {/* BLACK BACK BUTTON */}
      <button 
        className="static-back-btn"
        onClick={() => navigate(-1)}
      >
      ← Back
      </button>
      {/* HERO */}
      <div className="userguide-hero">
        <h1>ClearWave AI User Guide</h1>
        <p className="userguide-subtitle">
          Complete guide to using ClearWave AI for audio enhancement, noise removal, and transcription.
        </p>
      </div>

      {/* CONTENT */}
      <div className="userguide-container">

        <p>
          ClearWave AI is an advanced audio processing platform designed to improve
          sound quality by removing background noise and converting speech into text.
          This guide provides step-by-step instructions to help users effectively use
          all features of the system.
        </p>

        <h3>1. Account Registration & Login</h3>
        <p>
          To begin using ClearWave AI, users must create an account using a valid email
          address and password. Once registered, users can log in securely to access
          their personalized dashboard and stored files.
        </p>

        <h3>2. Dashboard Overview</h3>
        <p>
          After logging in, users are redirected to the dashboard where they can upload,
          record, manage, and access their processed audio files. The dashboard acts as
          the central hub for all activities within the platform.
        </p>

        <h3>3. Upload or Record Audio</h3>
        <p>
          Users can upload audio files in formats such as MP3, WAV, or MP4. Alternatively,
          the platform allows real-time audio recording using the device microphone,
          enabling quick and easy input.
        </p>

        <h3>4. Noise Removal (AI Processing)</h3>
        <p>
          The uploaded audio is processed using advanced AI algorithms such as RNNoise.
          These models detect and eliminate unwanted background sounds including traffic,
          fan noise, echo, and crowd disturbances, resulting in a clean audio output.
        </p>

        <h3>5. Speech-to-Text Conversion</h3>
        <p>
          Once the audio is cleaned, it is passed through a speech recognition system
          powered by Whisper AI. The system converts spoken words into accurate and
          readable text within seconds. Multiple languages and accents are supported.
        </p>

        <h3>6. Preview & Audio Comparison</h3>
        <p>
          Users can listen to both the original and processed audio to compare quality.
          This feature helps users understand the effectiveness of noise removal and
          ensures satisfaction before saving results.
        </p>

        <h3>7. Save & Organize Files</h3>
        <p>
          Processed audio and transcriptions can be saved to the user's account.
          Files can be categorized into folders such as meetings, lectures, personal
          recordings, or project files for better organization and quick retrieval.
        </p>

        <h3>8. Download & Share Output</h3>
        <p>
          Users can download enhanced audio files and transcription text. The platform
          also provides secure sharing options, allowing users to share results with
          teammates, clients, or collaborators.
        </p>

        <h3>9. Profile & Account Management</h3>
        <p>
          Users can update their personal information, change passwords, and manage
          account settings through the profile section. This ensures a secure and
          personalized experience.
        </p>

        <h3>10. Data Security & Privacy</h3>
        <p>
          ClearWave AI prioritizes user data security. All uploaded files are processed
          securely, and sensitive data is protected using modern security practices.
          User data is not shared with third parties without consent.
        </p>

        <h3>11. Best Practices</h3>
        <p>
          For optimal results, it is recommended to upload clear audio with minimal
          distortion. Avoid extremely noisy environments when recording, and ensure
          proper microphone usage for better transcription accuracy.
        </p>

        <h3>12. Troubleshooting</h3>
        <p>
          If you experience issues such as poor audio quality or incorrect transcription,
          try re-uploading the file or checking your microphone settings. Ensure a stable
          internet connection for smooth processing.
        </p>

        <h3>13. Future Enhancements</h3>
        <p>
          ClearWave AI is continuously evolving. Upcoming features may include real-time
          translation, advanced editing tools, cloud synchronization, and improved AI
          accuracy for better user experience.
        </p>

      </div>
    </div>
  );
}

export default UserGuide;