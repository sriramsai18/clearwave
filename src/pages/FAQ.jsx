import React, { useState,useEffect } from "react";
import {useNavigate} from "react-router-dom";
import "./styles.css";   

const faqData = [
  {
    question: "What is ClearWave AI?",
    answer:
      "ClearWave AI is an AI-powered platform that removes background noise and converts speech into text."
  },
  {
    question: "Which file formats are supported?",
    answer:
      "You can upload MP3, WAV, and MP4 files for processing."
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. All uploaded files are processed securely and not shared with third parties."
  },
  {
    question: "Can I record audio directly?",
    answer:
      "Yes, you can record audio using your microphone without uploading a file."
  },
  {
    question: "How does noise removal work?",
    answer:
      "We use AI models like RNNoise to detect and remove unwanted background sounds."
  },
  {
    question: "Is speech-to-text accurate?",
    answer:
      "Yes, ClearWave AI uses advanced Whisper models for highly accurate transcription."
  },
  {
    question: "Can I download the processed audio?",
    answer:
      "Yes, you can download both cleaned audio and transcription files anytime."
  },
  {
    question: "Does it support multiple languages?",
    answer:
      "Yes, transcription supports multiple global languages and accents."
  },
  {
    question: "Can I organize my audio files?",
    answer:
      "Yes, you can save, categorize, and manage your processed audio files easily."
  },
  {
    question: "Can I share my audio output?",
    answer:
      "Yes, you can securely share cleaned audio and transcripts with others."
  }
];

function FAQ() {
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      {/* BLACK BACK BUTTON */}
      <button 
        className="static-back-btn"
        onClick={() => navigate(-1)}
      >
      ← Back
      </button>
      <h1 className="faq-title">Frequently Asked Questions</h1>
      <p className="faq-subtitle">
        Everything you need to know about ClearWave AI
      </p>

      <div className="faq-container">
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item">
            <div
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className="faq-icon">
                {openIndex === index ? "−" : "+"}
              </span>
            </div>

            {openIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;