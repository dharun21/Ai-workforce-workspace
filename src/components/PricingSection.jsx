import { useState } from "react";
import { FaCheck, FaMinus } from "react-icons/fa";
import SpecialistIcon from "./SpecialistIcon";

const USD_TO_INR = 95.11;
const SPECIALIST_PRICE_USD = 19;

function formatPrice(usd, currency) {
  const amount = currency === "INR" ? usd * USD_TO_INR : usd;
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "INR" ? 0 : 2,
  }).format(amount);
}

function CurrencySwitch({ currency, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-white/10 bg-[#111018] p-1" aria-label="Display currency">
      {["USD", "INR"].map((option) => (
        <button
          aria-pressed={currency === option}
          className={`rounded-lg px-3 py-2 text-[10px] font-semibold transition ${
            currency === option ? "bg-violet-300 text-[#171222]" : "text-[#aaa4b8] hover:text-white"
          }`}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default function PricingSection({ compact = false }) {
  const { user } = useAuth();
  const [currency, setCurrency] = useState("USD");
  const planCost = formatPrice(SPECIALIST_PRICE_USD, currency);
  const isWorkspace = compact;

  return (
    <section
      className={`${isWorkspace ? "px-5 py-10 sm:px-8" : "mx-auto w-full max-w-[1320px] px-6 py-20 lg:px-10 lg:py-24"}`}
      id={isWorkspace ? undefined : "pricing"}
    >
      <div className="relative overflow-hidden rounded-[28px] border border-violet-200/15 bg-[radial-gradient(ellipse_at_88%_0%,rgba(143,123,221,0.13),transparent_38%),linear-gradient(145deg,#17141f,#111018_65%,#17131e)] p-6 sm:p-9 lg:p-11">
        <div className="pointer-events-none absolute -right-28 -top-36 h-80 w-80 rounded-full border border-violet-200/[0.08]" />
        <div className="relative">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <p className="mb-3 text-[9px] font-bold tracking-[0.2em] text-violet-300">CLEAR PLANS, USEFUL AI</p>
              <h2 className="m-0 font-display text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
                Pricing built around your team.
              </h2>
              <p className="mb-0 mt-3 max-w-xl text-xs leading-6 text-[#aaa4b8]">
                Pick the specialist you need. Every specialist purchase includes the all-in-one Personal Assistant at no extra cost.
              </p>
            </div>
            <CurrencySwitch currency={currency} onChange={setCurrency} />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {plans.map((plan) => {
              const purchased = Boolean(user && plan.type === "finance");
              const available = plan.status === "Available now";

              return (
                <article
                  className={`rounded-2xl border p-5 transition duration-300 ${
                    purchased
                      ? "border-emerald-300/25 bg-emerald-300/[0.045]"
                      : "border-white/[0.08] bg-[#111018]/75 hover:-translate-y-1 hover:border-violet-200/25"
                  }`}
                  key={plan.type}
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-violet-200/10 bg-violet-300/10 text-violet-200">
                      <SpecialistIcon type={plan.type} className="h-5 w-5" />
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[8px] font-semibold ${
                      purchased ? "bg-emerald-300/10 text-emerald-200" : available ? "bg-violet-300/10 text-violet-200" : "bg-white/[0.05] text-[#aaa4b8]"
                    }`}>
                      {purchased ? "Purchased" : plan.status}
                    </span>
                  </div>
                  <h3 className="mb-2 font-display text-base font-semibold text-white">AI {plan.name}</h3>
                  <p className="mb-5 min-h-[48px] text-[10px] leading-relaxed text-[#9995a8]">{plan.description}</p>
                  <div className="mb-5 flex items-end gap-1.5">
                    <strong className="font-display text-3xl font-semibold tracking-tight text-white">{planCost}</strong>
                    <span className="pb-1 text-[10px] text-[#898497]">/ specialist / month</span>
                  </div>
                  <div className="mb-5 space-y-2 border-y border-white/[0.07] py-4 text-[9px] text-[#c6c1d1]">
                    <p className="m-0 flex items-center gap-2"><FaCheck className="text-emerald-300" /> Purpose-built workflows for this role</p>
                    <p className="m-0 flex items-center gap-2"><FaCheck className="text-emerald-300" /> Personal Assistant included free</p>
                    <p className="m-0 flex items-center gap-2"><FaCheck className="text-emerald-300" /> Shared monthly usage allowance</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.035] px-3 py-2.5 text-[9px] text-[#aaa4b8]">
                    {purchased ? "This specialist is active in your workspace." : available ? "Ready to add to your AI team." : "Pricing estimate; access is not open yet."}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-5 grid gap-4 rounded-2xl border border-violet-200/10 bg-black/15 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
            <div>
              <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-violet-200">WHAT A FULL MONTH COULD LOOK LIKE</p>
              <h3 className="mb-2 font-display text-lg font-semibold text-white">About 30 AI requests a day, shared across your plan.</h3>
              <p className="mb-4 max-w-2xl text-[10px] leading-5 text-[#9995a8]">
                Illustrative usage: {MONTHLY_PROMPTS.toLocaleString()} text requests in 30 days, averaging {AVG_INPUT_TOKENS.toLocaleString()} input tokens and {AVG_OUTPUT_TOKENS.toLocaleString()} output tokens each. Includes Personal Assistant conversations in the same shared allowance.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {[
                  ["Estimated plan price", `${planCost}/mo`],
                  ["Model API estimate", `${formatPrice(MODEL_COST_USD, currency)}/mo`],
                  ["Hosting & operations estimate", `${formatPrice(ESTIMATED_PLATFORM_COST_USD, currency)}/mo`],
                  ["Estimated total operating cost", `${formatPrice(ESTIMATED_TOTAL_COST_USD, currency)}/mo`],
                  ["Estimated contribution margin", `${CONTRIBUTION_MARGIN.toFixed(0)}%`],
                ].map(([label, value]) => (
                  <div className="rounded-xl border border-white/[0.06] bg-[#111018]/70 p-3" key={label}>
                    <span className="block text-[8px] leading-relaxed text-[#898497]">{label}</span>
                    <strong className="mt-1 block font-display text-sm text-white">{value}</strong>
                  </div>
                ))}
              </div>
              <p className="mb-0 mt-3 text-[9px] leading-relaxed text-[#898497]">
                Google lists a higher Gemini rate from Jan 1, 2027. At that rate, this same usage estimate becomes {formatPrice(TOTAL_COST_FROM_2027_USD, currency)} total cost and about {CONTRIBUTION_MARGIN_FROM_2027.toFixed(0)}% contribution margin at the same plan price.
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#111018]/70 p-4">
              <p className="mb-3 text-[9px] font-bold tracking-[0.14em] text-violet-200">MODEL API REFERENCE</p>
              <p className="mb-4 text-[9px] leading-relaxed text-[#898497]">Direct token rates per 1 million tokens, converted for display only. ZengenAI adds specialist workflows, a shared workspace, and the included assistant.</p>
              <div className="grid gap-3">
                {modelBenchmarks.map((model) => (
                  <a className="group flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3 first:border-0 first:pt-0" href={model.href} key={model.provider} rel="noreferrer" target="_blank">
                    <span>
                      <strong className="block text-[10px] font-semibold text-white transition group-hover:text-violet-200">{model.provider}</strong>
                      <small className="mt-1 block text-[8px] text-[#898497]">{model.note}</small>
                    </span>
                    <span className="shrink-0 text-right text-[8px] leading-relaxed text-[#aaa4b8]">
                      In {formatPrice(model.input, currency)}<br />Out {formatPrice(model.output, currency)}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <p className="mb-0 mt-4 text-[8px] leading-relaxed text-[#777285]">
            Planning estimates, not a final offer or guaranteed margin. Model pricing can change; rates above were checked October 18, 2026. INR display uses an indicative reference rate of {USD_TO_INR.toFixed(2)} INR per USD. Actual costs vary by model mix, context length, tool/search use, hosting, taxes, payment fees, support, and usage. Estimate excludes payment fees, taxes, customer support, and company overhead. Usage limits and final prices should be confirmed before checkout.
          </p>
        </div>
      </div>
    </section>
  );
}
