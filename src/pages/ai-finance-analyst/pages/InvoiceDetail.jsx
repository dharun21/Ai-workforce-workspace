import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaShieldAlt } from "react-icons/fa";
import { AppLayout } from "../../../components/AppLayout";

const fields = [
  ["Vendor", "Sample Vendor"],
  ["Invoice number", "INV-2026-0084"],
  ["Amount due", "$1,200.00"],
  ["Invoice date", "February 22, 2026"],
  ["Category", "Software & subscriptions"],
  ["Payment terms", "Net 30"],
];
const steps = [
  "Document text extracted",
  "Fields categorized and verified",
  "Risk evaluation completed",
  "Saved to your workspace",
];
const panel = "rounded-xl border border-white/[0.07] bg-[#171620] p-5";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <AppLayout section="My AI team" current="Invoice details">
      <div className="mx-auto max-w-[1380px] px-8 py-7 max-[760px]:px-4">
        <button
          className="mb-5 flex items-center gap-2 text-[10px] text-[#9995a8] hover:text-violet-200"
          onClick={() => navigate("/ai/finance")}
          type="button"
        >
          <FaArrowLeft />
          Back to invoices
        </button>
        <header className="mb-6 flex items-end justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">
              <span className="h-px w-4 bg-violet-300" /> INVOICE REVIEW
            </p>
            <h1 className="m-0 font-display text-3xl font-bold">Invoice details</h1>
            <p className="mb-0 mt-2 text-xs text-[#9995a8]">
              Review the fields and AI analysis for this document.
            </p>
          </div>
          <span className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-[10px] text-emerald-200">
            ✓ Processed
          </span>
        </header>
        <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
          <section className={panel}>
            <h2 className="mb-5 flex items-center justify-between font-display text-sm font-semibold">
              Extracted fields{" "}
              <span className="text-[9px] font-normal text-[#777285]">Document #{id}</span>
            </h2>
            <div className="grid grid-cols-2 gap-3 max-[500px]:grid-cols-1">
              {fields.map(([label, value]) => (
                <div
                  className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                  key={label}
                >
                  <span className="block text-[9px] text-[#777285]">{label}</span>
                  <strong className="mt-1.5 block text-xs font-medium">{value}</strong>
                </div>
              ))}
            </div>
          </section>
          <section className={panel}>
            <h2 className="mb-5 flex items-center gap-2 font-display text-sm font-semibold">
              <FaShieldAlt className="text-emerald-300" /> Risk analysis
            </h2>
            <div className="flex items-center gap-3">
              <strong className="font-display text-4xl font-bold text-emerald-200">12</strong>
              <span>
                <b className="block text-xs">Low risk</b>
                <small className="text-[9px] text-[#777285]">Risk score out of 100</small>
              </span>
            </div>
            <p className="mb-0 mt-4 text-xs leading-relaxed text-[#9995a8]">
              This invoice is consistent with expected vendor activity. No unusual amount or date
              patterns were detected.
            </p>
          </section>
          <section className={panel}>
            <h2 className="mb-4 font-display text-sm font-semibold">AI processing</h2>
            <ol className="grid gap-4">
              {steps.map((step) => (
                <li className="flex items-center gap-3 text-[11px] text-[#c4bfce]" key={step}>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-300/10 text-[9px] text-emerald-200">
                    <FaCheck />
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
          <section className={panel}>
            <h2 className="mb-3 font-display text-sm font-semibold">Analyst summary</h2>
            <p className="mb-0 text-xs leading-relaxed text-[#9995a8]">
              The invoice has been successfully processed. The vendor, amount, and invoice date were
              identified with high confidence and are ready for your review.
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
