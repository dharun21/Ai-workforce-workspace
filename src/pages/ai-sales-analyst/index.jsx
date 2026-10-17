import { useState } from "react";
import { FaArrowRight, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/AppLayout";
import AccessRequestPopup from "./popups/AccessRequestPopup";

const features = [
  ["01", "Pipeline visibility", "Surface the opportunities and changes that need attention."],
  ["02", "Account insights", "Connect customer signals to the context your team needs."],
  ["03", "Next best actions", "Turn sales patterns into practical follow-up suggestions."],
];

export default function SalesIndex() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <AppLayout section="AI team" current="Sales Analyst">
      <div className="mx-auto max-w-[1100px] px-8 py-8 max-[760px]:px-4">
        <button
          className="mb-6 flex items-center gap-2 text-[10px] text-[#9995a8] hover:text-violet-200"
          onClick={() => navigate("/")}
          type="button"
        >
          ← Back to My AI team
        </button>
        <section className="relative overflow-hidden rounded-2xl border border-sky-200/15 bg-gradient-to-br from-[#1c202a] via-[#1c1928] to-[#171a29] p-10 max-[760px]:p-6">
          <span className="absolute -right-10 -top-20 h-72 w-72 rounded-full bg-sky-300/[0.07] blur-3xl" />
          <div className="relative max-w-[680px]">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-sky-300/10 text-xl text-sky-200">
                <FaChartLine />
              </span>
              <span className="rounded-full bg-sky-300/10 px-3 py-1.5 text-[9px] font-semibold text-sky-200">
                Coming soon
              </span>
            </div>
            <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-sky-200">
              YOUR REVENUE INTELLIGENCE PARTNER
            </p>
            <h1 className="mb-3 font-display text-3xl font-bold tracking-tight">
              AI Sales Analyst
            </h1>
            <p className="max-w-[600px] text-sm leading-relaxed text-[#aaa4b8]">
              Bring pipeline signals, customer context, and next steps together so your team can
              focus on meaningful conversations.
            </p>
            <button
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-300 px-4 py-3 text-[10px] font-bold text-[#171222] hover:bg-violet-200"
              onClick={() => setOpen(true)}
              type="button"
            >
              Request early access <FaArrowRight />
            </button>
          </div>
        </section>
        <div className="mt-5 grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
          {features.map(([number, title, text]) => (
            <article
              className="rounded-xl border border-white/[0.07] bg-[#171620] p-5"
              key={number}
            >
              <strong className="font-display text-xl text-sky-200/70">{number}</strong>
              <h2 className="mb-2 mt-4 font-display text-sm font-semibold">{title}</h2>
              <p className="mb-0 text-[11px] leading-relaxed text-[#9995a8]">{text}</p>
            </article>
          ))}
        </div>
      </div>
      {open && (
        <AccessRequestPopup employee="the AI Sales Analyst" onClose={() => setOpen(false)} />
      )}
    </AppLayout>
  );
}
