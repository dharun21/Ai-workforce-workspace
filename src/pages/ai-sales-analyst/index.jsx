import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/AppLayout";
import AccessRequestPopup from "./popups/AccessRequestPopup";
export default function SalesIndex() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <AppLayout section="AI employees" current="Sales analyst">
      <div className="employee-coming-page">
        <button className="back-link" onClick={() => navigate("/")} type="button">
          <FaArrowLeft />
          Back to AI employees
        </button>
        <div className="coming-hero">
          <span className="employee-icon blue">
            <FaChartLine />
          </span>
          <span className="status-pill status-coming">
            <i />
            In development
          </span>
          <p className="eyebrow">
            <span className="eyebrow-line" />
            YOUR REVENUE INTELLIGENCE PARTNER
          </p>
          <h1>AI Sales Analyst</h1>
          <p>
            Bring pipeline signals, customer context, and next steps together so your team can focus
            on meaningful conversations.
          </p>
          <button className="hero-button" onClick={() => setOpen(true)} type="button">
            Request early access <FaArrowRight />
          </button>
        </div>
        <div className="coming-features">
          <article>
            <strong>01</strong>
            <h3>Pipeline visibility</h3>
            <p>Surface the opportunities and changes that need attention.</p>
          </article>
          <article>
            <strong>02</strong>
            <h3>Account insights</h3>
            <p>Connect customer signals to the context your team needs.</p>
          </article>
          <article>
            <strong>03</strong>
            <h3>Next best actions</h3>
            <p>Turn sales patterns into practical follow-up suggestions.</p>
          </article>
        </div>
      </div>
      {open && (
        <AccessRequestPopup employee="the AI Sales Analyst" onClose={() => setOpen(false)} />
      )}
    </AppLayout>
  );
}
