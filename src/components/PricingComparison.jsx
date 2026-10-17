import { useState } from "react";
import { FaCheck, FaMinus } from "react-icons/fa";
import { useAuth } from "../pages/authentication/AuthContext";
import SpecialistIcon from "./SpecialistIcon";

const USD_TO_INR = 95.11;
const SPECIALIST_PRICE_USD = 19;

const comparisons = [
  {
    label: "General AI conversations",
    general: "Chat, write, and ask across many topics",
    zengen: "A Personal Assistant for everyday help",
  },
  {
    label: "Finance specialist",
    general: "Handle finance questions through a general chat",
    zengen: "Finance Analyst with a dedicated workspace",
    icon: "finance",
  },
  {
    label: "Personal assistant",
    general: "General-purpose assistant",
    zengen: "Included free with any specialist purchase",
    icon: "assistant",
  },
  {
    label: "HR and sales specialists",
    general: "Ask a general assistant for help with each task",
    zengen: "Dedicated AI teammates coming soon",
    icon: "team",
  },
  {
    label: "Built around your work",
    general: "General-purpose chat and tools",
    zengen: "Role-focused tools, context, and workflows",
  },
];

function money(usd, currency) {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "INR" ? 0 : 2,
  }).format(currency === "INR" ? usd * USD_TO_INR : usd);
}

function BrandWordmark() {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap" aria-label="ZengenAI">
      <span className="text-[34px] leading-none tracking-[0.04em] text-white" style={{ fontFamily: "'Great Vibes', cursive" }}>
        Zengen
      </span>
      <span className="rounded-md border border-violet-300/25 bg-violet-300/[0.08] px-2 py-1 font-display text-[10px] font-bold tracking-[0.18em] text-violet-200">
        AI
      </span>
    </span>
  );
}

function CurrencySwitch({ currency, setCurrency }) {
  return (
    <div className="inline-flex rounded-xl border border-white/10 bg-[#111018] p-1" aria-label="Display currency">
      {["USD", "INR"].map((option) => (
        <button
          aria-pressed={currency === option}
          className={`rounded-lg px-3 py-2 text-[10px] font-semibold transition ${currency === option ? "bg-violet-300 text-[#171222]" : "text-[#aaa4b8] hover:text-white"}`}
          key={option}
          onClick={() => setCurrency(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default function PricingComparison({ compact = false }) {
  const { user } = useAuth();
  const [currency, setCurrency] = useState("USD");
  const container = compact ? "px-5 py-8 sm:px-8" : "mx-auto w-full max-w-[1320px] px-6 py-20 lg:px-10 lg:py-24";

  return (
    <section className={container} id={compact ? undefined : "pricing"}>
      <div className="relative overflow-hidden rounded-[28px] border border-violet-200/15 bg-[radial-gradient(ellipse_at_88%_0%,rgba(143,123,221,0.13),transparent_38%),linear-gradient(145deg,#17141f,#111018_65%,#17131e)] p-5 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-28 -top-36 h-80 w-80 rounded-full border border-violet-200/[0.08]" />
        <div className="relative">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-[9px] font-bold tracking-[0.2em] text-violet-300">A BETTER FIT FOR YOUR BUSINESS</p>
              <h2 className="m-0 font-display text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
                General AI or a team built for you?
              </h2>
              <p className="mb-0 mt-3 max-w-2xl text-xs leading-6 text-[#aaa4b8]">
                General AI is great for a little of everything. ZengenAI brings dedicated teammates and workflows to the work you do every day.
              </p>
            </div>
            <CurrencySwitch currency={currency} setCurrency={setCurrency} />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111018]/80">
              <div className="flex min-h-[136px] flex-col justify-between gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <p className="mb-1 text-[9px] font-bold tracking-[0.16em] text-[#898497]">GENERAL PURPOSE</p>
                  <h3 className="m-0 font-display text-xl font-semibold text-white">ChatGPT Plus</h3>
                  <p className="mb-0 mt-1 text-[9px] text-[#898497]">A general AI subscription from OpenAI</p>
                </div>
                <div className="shrink-0">
                  <strong className="font-display text-3xl font-semibold text-white">{money(20, currency)}</strong>
                  <span className="ml-1 text-[10px] text-[#898497]">/ month</span>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <ul className="m-0 grid list-none gap-4 p-0">
                  {comparisons.map((item) => (
                    <li className="flex items-start gap-3 text-[10px] leading-relaxed text-[#b5b0c0]" key={item.label}>
                      {item.icon ? <FaMinus className="mt-0.5 shrink-0 text-[#706b80]" /> : <FaCheck className="mt-0.5 shrink-0 text-emerald-300" />}
                      <span><strong className="font-semibold text-white">{item.label}</strong><span className="block mt-0.5 text-[#898497]">{item.general}</span></span>
                    </li>
                  ))}
                </ul>
                <a className="mt-6 inline-flex text-[9px] font-medium text-[#aaa4b8] underline decoration-white/20 underline-offset-4 transition hover:text-white" href="https://openai.com/chatgpt/pricing" rel="noreferrer" target="_blank">
                  View OpenAI plan details
                </a>
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl border border-violet-200/25 bg-gradient-to-br from-[#211b31] via-[#17141f] to-[#111018] shadow-[0_20px_70px_rgba(94,71,145,0.12)]">
              <div className="flex min-h-[136px] flex-col justify-between gap-4 border-b border-violet-200/10 p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <p className="mb-1 text-[9px] font-bold tracking-[0.16em] text-violet-200">PURPOSE-BUILT AI TEAM</p>
                  <BrandWordmark />
                  <p className="mb-0 mt-1 text-[9px] text-[#aaa4b8]">One specialist plan includes your Personal Assistant</p>
                </div>
                <div className="shrink-0">
                  <strong className="font-display text-3xl font-semibold text-white">{money(SPECIALIST_PRICE_USD, currency)}</strong>
                  <span className="ml-1 text-[10px] text-[#aaa4b8]">/ specialist / month</span>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <ul className="m-0 grid list-none gap-4 p-0">
                  {comparisons.map((item) => (
                    <li className="flex items-start gap-3 text-[10px] leading-relaxed text-[#d5cdea]" key={item.label}>
                      <FaCheck className="mt-0.5 shrink-0 text-emerald-300" />
                      <span className="min-w-0">
                        <strong className="font-semibold text-white">{item.label}</strong>
                        <span className="mt-0.5 flex items-center gap-1.5 text-violet-100/75">
                          {item.icon && <SpecialistIcon type={item.icon} className="h-3 w-3 shrink-0" />}
                          {item.icon === "finance" && user ? (
                            <>
                              Finance Analyst
                              <span className="ml-1 rounded-full bg-emerald-300/10 px-2 py-0.5 text-[8px] font-semibold text-emerald-200">Purchased</span>
                            </>
                          ) : item.zengen}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mb-0 mt-6 border-t border-white/[0.08] pt-4 text-[9px] leading-relaxed text-[#898497]">
                  Planned price per specialist. HR and Sales are coming soon. INR is an approximate conversion; OpenAI’s billed amount may vary by region.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
