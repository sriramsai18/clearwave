import { useEffect } from "react";
import {useNavigate} from "react-router-dom";
import "./styles.css";   

function PrivacyPolicy() {
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const navigate = useNavigate();
  return (
    <div className="terms-page">
      
      {/* BLACK BACK BUTTON */}
      <button 
        className="static-back-btn"
        onClick={() => navigate(-1)}
      >
      ← Back
      </button>
      {/* HERO */}
      <div className="terms-hero">
        <h1>Privacy Policy</h1>
        <p className="updated">Last Updated: March 2026 &nbsp;|&nbsp; Effective Date: March 2026 &nbsp;|&nbsp; Governing Law: India</p>
      </div>

      {/* CONTENT */}
      <div className="terms-container">

        <p>
          ClearWave AI is committed to protecting your privacy and ensuring the
          security of your personal data. This Privacy Policy explains how we
          collect, use, store, and safeguard your information when you use our
          platform — including audio enhancement, noise removal, and
          speech-to-text services.
        </p>

        <h3>1. Information We Collect</h3>
        <p>We collect the following categories of personal information:</p>
        <ul>
          <li><strong>Account information:</strong> name, email address, and login credentials when you register</li>
          <li><strong>Audio files:</strong> files you upload or record for processing and transcription</li>
          <li><strong>Usage data:</strong> how you interact with our platform, for performance and improvement purposes</li>
          <li><strong>Technical data:</strong> IP address, browser type, device info, and cookies</li>
        </ul>

        <h3>2. How We Use Your Information</h3>
        <p>Collected data is used to:</p>
        <ul>
          <li>Provide and improve our services, including audio enhancement, noise removal, and speech-to-text conversion</li>
          <li>Manage your account and authenticate access</li>
          <li>Send service-related communications and product updates</li>
          <li>Analyse usage patterns to improve platform performance</li>
          <li>Comply with applicable legal obligations</li>
        </ul>
        <p>Our lawful basis for processing your data (under GDPR, where applicable) is:</p>
        <ul>
          <li><strong>Contract:</strong> processing necessary to provide our services to you</li>
          <li><strong>Legitimate interest:</strong> improving service quality and platform security</li>
          <li><strong>Consent:</strong> for optional communications and non-essential cookies</li>
        </ul>

        <h3>3. Audio Data Processing</h3>
        <p>
          Audio files you upload are processed using AI technologies to enhance
          quality and generate transcriptions. These files are:
        </p>
        <ul>
          <li>Used solely for the purpose of delivering your requested output</li>
          <li>Not accessed by our team manually, except when required for technical support (with your consent)</li>
          <li>Processed using trusted third-party infrastructure detailed in Section 4</li>
        </ul>

        <h3>4. Third-Party Services</h3>
        <p>
          To deliver our services, we rely on the following third-party providers.
          Each has its own privacy policy and data processing terms:
        </p>
        <ul>
          <li><strong>Cloud hosting &amp; storage:</strong> Amazon Web Services (AWS) or Google Cloud Platform</li>
          <li><strong>AI/ML processing:</strong> OpenAI, Whisper, or equivalent speech-to-text services</li>
          <li><strong>Analytics:</strong> Google Analytics (for usage insights — see Cookie section)</li>
          <li><strong>Email communications:</strong> services such as SendGrid or Mailchimp</li>
        </ul>
        <p>
          We ensure all third-party providers meet appropriate data protection
          standards. We do not permit them to use your data for their own purposes.
        </p>

        <h3>5. Data Security</h3>
        <p>
          We implement industry-standard security measures to protect your data, including:
        </p>
        <ul>
          <li>Encrypted data transmission via HTTPS/TLS</li>
          <li>Secure storage with access controls and authentication</li>
          <li>Regular security reviews and best-practice infrastructure</li>
        </ul>
        <p>
          No system is 100% secure. In the unlikely event of a data breach, we
          will notify affected users and relevant authorities as required by law.
        </p>

        <h3>6. Data Sharing</h3>
        <p>
          ClearWave AI does not sell, trade, or rent your personal data or audio
          files to any third party. We may share data only in the following
          circumstances:
        </p>
        <ul>
          <li>With trusted service providers who assist in delivering our platform (see Section 4)</li>
          <li>When required by applicable law, court order, or governmental authority</li>
          <li>In the event of a business merger, acquisition, or asset transfer (you will be notified)</li>
        </ul>

        <h3>7. User Control &amp; Rights</h3>
        <p>
          You have full control over your data. Depending on your location, you
          may have the right to:
        </p>
        <ul>
          <li><strong>Access:</strong> request a copy of the personal data we hold about you</li>
          <li><strong>Correction:</strong> request that inaccurate data be corrected</li>
          <li><strong>Deletion:</strong> delete your files or account at any time via your dashboard</li>
          <li><strong>Portability:</strong> request your data in a machine-readable format</li>
          <li><strong>Objection:</strong> object to certain types of processing</li>
          <li><strong>Withdraw consent:</strong> opt out of non-essential communications at any time</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <strong>support@clearwaveai.in</strong>.
        </p>

        <h3>8. Data Retention</h3>
        <p>We retain your personal data only for as long as necessary:</p>
        <ul>
          <li><strong>Account data:</strong> retained while your account is active</li>
          <li><strong>Audio files:</strong> retained until you delete them or your account becomes inactive</li>
          <li><strong>Inactive accounts:</strong> data may be removed after 12 months of inactivity, with prior notice</li>
        </ul>

        <h3>9. Cookies &amp; Tracking</h3>
        <p>ClearWave AI uses the following types of cookies:</p>
        <ul>
          <li><strong>Essential cookies:</strong> required for login sessions and core functionality — cannot be disabled</li>
          <li><strong>Analytics cookies:</strong> Google Analytics, used to understand platform usage (can be opted out)</li>
          <li><strong>Preference cookies:</strong> store your settings to improve your experience</li>
        </ul>
        <p>
          You can manage cookie preferences via your browser settings or our
          cookie consent banner. Opting out of analytics cookies will not affect
          your access to the platform.
        </p>

        <h3>10. Children's Privacy</h3>
        <p>
          ClearWave AI is not intended for use by individuals under the age of 13
          (or 16 in the European Union). We do not knowingly collect personal data
          from minors. If you believe a minor has provided us with their
          information, please contact us at <strong>support@clearwaveai.in</strong>{" "}
          and we will promptly delete it.
        </p>

        <h3>11. International Users &amp; GDPR</h3>
        <p>
          ClearWave AI is operated from India. If you access our platform from
          the European Union or other regions with data protection laws, please
          note:
        </p>
        <ul>
          <li>Your data may be transferred to and processed in India or other countries where our service providers operate</li>
          <li>We take steps to ensure such transfers comply with applicable data protection law</li>
          <li>EU users have additional rights under GDPR, including the right to lodge a complaint with a supervisory authority</li>
        </ul>

        <h3>12. Changes to This Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. When we make
          significant changes, we will:
        </p>
        <ul>
          <li>Notify registered users via email at least 7 days before changes take effect</li>
          <li>Display a notice on our platform</li>
          <li>Update the "Last Updated" date at the top of this document</li>
        </ul>

        <h3>13. Governing Law</h3>
        <p>
          This Privacy Policy is governed by and construed in accordance with the
          laws of India, including the Information Technology Act, 2000, and
          applicable data protection rules. Any disputes shall be subject to the
          jurisdiction of courts in India.
        </p>

        <h3>14. Contact Information</h3>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy
          Policy or your personal data, please contact us:
        </p>
        <p>
          <strong>ClearWave AI — Support Team</strong><br />
          Email: <strong>support@clearwaveai.in</strong><br />
          Website: <strong>clearwaveai.in</strong>
        </p>

      </div>
    </div>
  );
}

export default PrivacyPolicy;