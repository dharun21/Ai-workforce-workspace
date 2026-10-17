import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaFileInvoice, FaShieldAlt } from "react-icons/fa";
import { AppLayout } from "../../../components/AppLayout";
export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <AppLayout section="AI employees" current="Invoice details">
      <div className="finance-content">
        <button className="back-link" onClick={() => navigate("/ai/finance")} type="button">
          <FaArrowLeft />
          Back to invoices
        </button>
        <div className="finance-heading">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              INVOICE REVIEW
            </p>
            <h1>Invoice details</h1>
            <p>Review the fields and AI analysis for this document.</p>
          </div>
          <span className="invoice-status">✓ &nbsp; Processed</span>
        </div>
        <div className="detail-grid">
          <section className="detail-panel">
            <h2>
              Extracted fields <span className="detail-meta">Document #{id}</span>
            </h2>
            <div className="field-grid">
              {[
                ["Vendor", "Sample Vendor"],
                ["Invoice number", "INV-2026-0084"],
                ["Amount due", "$1,200.00"],
                ["Invoice date", "February 22, 2026"],
                ["Category", "Software & subscriptions"],
                ["Payment terms", "Net 30"],
              ].map(([label, value]) => (
                <div className="field-item" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </section>
          <section className="detail-panel">
            <h2>
              <FaShieldAlt style={{ color: "#81d1a8", marginRight: 8 }} />
              Risk analysis
            </h2>
            <div className="risk-score">
              <strong className="risk-number">12</strong>
              <span>
                <strong>Low risk</strong>
                <small>Risk score out of 100</small>
              </span>
            </div>
            <p className="risk-description">
              This invoice is consistent with expected vendor activity. No unusual amount or date
              patterns were detected.
            </p>
          </section>
          <section className="detail-panel">
            <h2>AI processing</h2>
            <ol className="steps-list">
              {[
                "Document text extracted",
                "Fields categorized and verified",
                "Risk evaluation completed",
                "Saved to your workspace",
              ].map((step) => (
                <li key={step}>
                  <span className="step-check">
                    <FaCheck />
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
          <section className="detail-panel">
            <h2>Analyst summary</h2>
            <p className="risk-description" style={{ margin: 0 }}>
              The invoice has been successfully processed. The vendor, amount, and invoice date were
              identified with high confidence and are ready for your review.
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
