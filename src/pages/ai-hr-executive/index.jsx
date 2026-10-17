import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/AppLayout";
import AccessRequestPopup from "./popups/AccessRequestPopup";
export default function HrIndex() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <AppLayout section="AI employees" current="HR executive">
      <div className="employee-coming-page">
        <button className="back-link" onClick={() => navigate("/")} type="button">
          <FaArrowLeft />
          Back to AI employees
        </button>
        <div className="coming-hero">
          <span className="employee-icon orange">
            <FaUserTie />
          </span>
          <span className="status-pill status-coming">
            <i />
            In development
          </span>
          <p className="eyebrow">
            <span className="eyebrow-line" />
            YOUR PEOPLE OPERATIONS PARTNER
          </p>
          <h1>AI HR Executive</h1>
          <p>
            Give your people team a thoughtful assistant for everyday requests, onboarding, and the
            work that helps people thrive.
          </p>
          <button className="hero-button" onClick={() => setOpen(true)} type="button">
            Request early access <FaArrowRight />
          </button>
        </div>
        <div className="coming-features">
          <article>
            <strong>01</strong>
            <h3>Employee support</h3>
            <p>Help employees find answers and get routine requests moving.</p>
          </article>
          <article>
            <strong>02</strong>
            <h3>Onboarding workflows</h3>
            <p>Give every new teammate a more consistent welcome.</p>
          </article>
          <article>
            <strong>03</strong>
            <h3>People insights</h3>
            <p>Spot patterns and keep your people operations organized.</p>
          </article>
        </div>
      </div>
      {open && <AccessRequestPopup employee="the AI HR Executive" onClose={() => setOpen(false)} />}
    </AppLayout>
  );
}
