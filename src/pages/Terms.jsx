import { useEffect } from "react";
import {useNavigate} from "react-router-dom";
import "./styles.css";

function Terms() {
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
      {/* HERO SECTION */}
      <div className="terms-hero">
        <h1>Terms of Service</h1>
        <p className="updated">Last Updated: March 2026 &nbsp;|&nbsp; Effective Date: March 2026 &nbsp;|&nbsp; Governing Law: India</p>
      </div>

      {/* CONTENT CARD */}
      <div className="terms-container">

        <p>
          These Terms of Service ("Terms") govern your access to and use of
          ClearWave AI, an intelligent audio processing platform that enhances
          audio quality, removes background noise, and converts speech into text.
          By accessing or using our services, you agree to be bound by these Terms.
          If you do not agree, please discontinue use immediately.
        </p>

        <h3>1. Eligibility</h3>
        <p>
          You must be at least 13 years of age (or 16 in the European Union) to
          use ClearWave AI. By using our platform, you confirm that you meet this
          requirement. If you are using the platform on behalf of an organisation,
          you confirm you have the authority to bind that organisation to these Terms.
        </p>

        <h3>2. User Accounts</h3>
        <p>
          You are responsible for maintaining the confidentiality of your account
          credentials and for all activities that occur under your account. You agree to:
        </p>
        <ul>
          <li>Provide accurate and complete information during registration</li>
          <li>Keep your login credentials secure and not share them with others</li>
          <li>Notify us immediately at <strong>support@clearwaveai.in</strong> if you suspect unauthorised access</li>
        </ul>
        <p>
          ClearWave AI is not liable for any loss or damage resulting from unauthorised
          access due to your failure to safeguard your credentials.
        </p>

        <h3>3. Acceptable Use</h3>
        <p>
          You agree to use ClearWave AI only for lawful purposes. You must not:
        </p>
        <ul>
          <li>Upload, share, or process content that violates intellectual property rights or privacy laws</li>
          <li>Upload audio recordings of individuals without their knowledge or consent</li>
          <li>Use the platform to produce, distribute, or store illegal, harmful, or abusive content</li>
          <li>Attempt to reverse-engineer, scrape, or exploit the platform or its underlying AI models</li>
          <li>Use automated tools or bots to access the service without prior written permission</li>
          <li>Impersonate any individual, organisation, or entity</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts found to be in violation of
          these guidelines without prior notice.
        </p>

        <h3>4. Audio Processing &amp; AI Usage</h3>
        <p>
          ClearWave AI uses advanced technologies including noise reduction models and
          speech-to-text systems to process your audio. Please note:
        </p>
        <ul>
          <li>Results may vary depending on audio quality, background noise, and language complexity</li>
          <li>We do not guarantee 100% accuracy in transcriptions or audio enhancement outputs</li>
          <li>AI-generated outputs should be reviewed before use in critical or professional contexts</li>
          <li>You retain ownership of your uploaded audio and any output generated from it</li>
        </ul>

        <h3>5. Data Privacy &amp; Security</h3>
        <p>
          We take the protection of your data seriously. Uploaded audio files and
          transcriptions are securely processed and are not shared with third parties
          without your consent, except as required by law or for essential service
          functionality. For full details on how we handle your data, please refer
          to our <strong>Privacy Policy</strong>.
        </p>

        <h3>6. Storage &amp; File Management</h3>
        <p>
          Users may store, organise, and manage their processed files via the dashboard.
          Please note:
        </p>
        <ul>
          <li>Storage limits may apply depending on your account plan</li>
          <li>Inactive or unused data may be removed after <strong>12 months of inactivity</strong>, with prior notice sent to your registered email</li>
          <li>We recommend downloading important files regularly as a backup</li>
        </ul>

        <h3>7. Intellectual Property</h3>
        <p>
          All platform content, branding, technology, and underlying AI models are the
          intellectual property of ClearWave AI and are protected under applicable law.
          You may not copy, reproduce, or distribute any part of the platform without
          prior written permission. You retain full ownership of all audio content you
          upload to the platform.
        </p>

        <h3>8. Service Availability</h3>
        <p>
          We aim to provide reliable and uninterrupted service. However, we do not
          guarantee that the platform will be available at all times. We reserve the
          right to perform scheduled maintenance, apply updates, or temporarily suspend
          services for operational reasons. We will make reasonable efforts to notify
          users in advance of planned downtime.
        </p>

        <h3>9. Limitation of Liability</h3>
        <p>
          To the maximum extent permitted by applicable law, ClearWave AI shall not be
          liable for any indirect, incidental, consequential, or special damages arising
          from your use of the platform, including but not limited to:
        </p>
        <ul>
          <li>Loss of data, revenue, or business opportunities</li>
          <li>Inaccuracies in AI-generated transcriptions or audio outputs</li>
          <li>Unauthorised access resulting from user negligence</li>
          <li>Service interruptions or downtime</li>
        </ul>
        <p>
          Our total liability in any circumstance shall not exceed the amount paid by
          you for the service in the 3 months preceding the claim.
        </p>

        <h3>10. Account Termination</h3>
        <p>
          You may delete your account at any time via your dashboard. We reserve the
          right to suspend or permanently terminate accounts that:
        </p>
        <ul>
          <li>Violate these Terms or our Acceptable Use policy</li>
          <li>Are found to be engaged in fraudulent or illegal activity</li>
          <li>Remain inactive for an extended period</li>
        </ul>
        <p>
          Upon termination, your data will be handled in accordance with our Privacy Policy.
        </p>

        <h3>11. Changes to Terms</h3>
        <p>
          ClearWave AI reserves the right to update these Terms at any time. When we
          make significant changes, we will:
        </p>
        <ul>
          <li>Notify registered users via email at least <strong>7 days</strong> before changes take effect</li>
          <li>Display a notice on the platform</li>
          <li>Update the "Last Updated" date at the top of this document</li>
        </ul>

        <h3>12. Governing Law &amp; Disputes</h3>
        <p>
          These Terms are governed by and construed in accordance with the laws of
          India, including the Information Technology Act, 2000. Any disputes arising
          from these Terms or your use of the platform shall be subject to the
          exclusive jurisdiction of courts in India. We encourage you to contact us
          first at <strong>support@clearwaveai.in</strong> to resolve any issues informally
          before pursuing legal action.
        </p>

        <h3>13. Contact Us</h3>
        <p>
          If you have any questions about these Terms or your use of the platform,
          please reach out to us:
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

export default Terms;