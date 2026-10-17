import { useState } from "react";
import { FaArrowRight, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/AppLayout";
import AccessRequestPopup from "./popups/AccessRequestPopup";

const features = [
  ["01", "Employee support", "Help employees find answers and get routine requests moving."],
  ["02", "Onboarding workflows", "Give every new teammate a more consistent welcome."],
  ["03", "People insights", "Spot patterns and keep your people operations organized."],
];

export default function HrIndex() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <AppLayout section="AI team" current="HR Executive">
      <div className="mx-auto max-w-[1100px] px-8 py-8 max-[760px]:px-4">
        <button
          className="mb-6 flex items-center gap-2 text-[10px] text-[#9995a8] hover:text-violet-200"
          onClick={() => navigate("/")}
          type="button"
        >
          ← Back to My AI team
        </button>
        <section className="relative overflow-hidden rounded-2xl border border-orange-200/15 bg-gradient-to-br from-[#211b25] via-[#1c1928] to-[#171a29] p-10 max-[760px]:p-6">
          <span className="absolute -right-10 -top-20 h-72 w-72 rounded-full bg-orange-300/[0.07] blur-3xl" />
          <div className="relative max-w-[680px]">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-300/10 text-xl text-orange-200">
                <FaUserTie />
              </span>
              <span className="rounded-full bg-orange-300/10 px-3 py-1.5 text-[9px] font-semibold text-orange-200">
                In development
              </span>
            </div>
            <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-orange-200">
              YOUR PEOPLE OPERATIONS PARTNER
            </p>
            <h1 className="mb-3 font-display text-3xl font-bold tracking-tight">AI HR Executive</h1>
            <p className="max-w-[600px] text-sm leading-relaxed text-[#aaa4b8]">
              Give your people team a thoughtful assistant for everyday requests, onboarding, and
              the work that helps people thrive.
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
              <strong className="font-display text-xl text-orange-200/70">{number}</strong>
              <h2 className="mb-2 mt-4 font-display text-sm font-semibold">{title}</h2>
              <p className="mb-0 text-[11px] leading-relaxed text-[#9995a8]">{text}</p>
            </article>
          ))}
        </div>
      </div>
      {open && <AccessRequestPopup employee="the AI HR Executive" onClose={() => setOpen(false)} />}
    </AppLayout>
  );
}
