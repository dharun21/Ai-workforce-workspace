import { useState } from "react";
import { FaCheck, FaUsers } from "react-icons/fa";
import { useAuth } from "../pages/authentication/AuthContext";
import SpecialistIcon from "./SpecialistIcon";

const USD_TO_INR = 95.11;
const SINGLE_AI_PRICE_USD = 19;

const plans = [
  {
    id: "spark",
    name: "Spark",
    tagline: "Your AI workforce begins here",
    price: 35,
    aiCount: "Any 2 AI Employees",
    usage: "Medium usage limits",
    users: 1,
    devices: 1,
    description: "Best for individuals and first-time AI workforce users.",
    features: ["Choose any 2 specialist AI employees", "Personal AI Assistant included", "1 user, 1 device", "Medium usage limits"],
  },
  {
    id: "nexus",
    name: "Nexus",
    tagline: "Your connected AI team",
    price: 65,
    aiCount: "Any 4 AI Employees",
    usage: "Medium usage limits",
    users: 2,
    devices: 2,
    description: "Best for growing businesses that need multiple specialized AI employees.",
    features: ["Choose any 4 specialist AI employees", "Personal AI Assistant included", "2 users, 2 devices", "Medium usage limits"],
  },
  {
    id: "infinity",
    name: "Infinity",
    tagline: "Your AI workforce, expanded",
    price: 250,
    aiCount: "Choose any 6 AI Employees",
    usage: "High usage limits",
    users: 3,
    devices: 3,
    description: "Best for businesses ready to build a broader AI-powered operation.",
    features: ["Choose any 6 specialist AI employees", "Personal AI Assistant included", "3 users, 3 devices", "High usage limits", "Early access to upcoming AI employees through trials"],
  },
];

function money(usd, currency) {
  const amount = currency === "INR" ? usd * USD_TO_INR : usd;
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "INR" ? 0 : 2,
  }).format(amount);
}

function Toggle({ value, onChange, options, label }) {
  return (
    <div className="inline-flex rounded-xl border border-white/10 bg-[#111018] p-1" aria-label={label}>
      {options.map((option) => (
        <button
          aria-pressed={value === option.value}
          className={`rounded-lg px-3 py-2 text-[10px] font-semibold transition ${value === option.value ? "bg-violet-300 text-[#171222]" : "text-[#aaa4b8] hover:text-white"}`}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap" aria-label="ZengenAI">
      <span className="text-[32px] leading-none tracking-[0.04em] text-white sm:text-[36px]" style={{ fontFamily: "'Great Vibes', cursive" }}>
        Zengen
      </span>
      <span className="rounded-md border border-violet-300/25 bg-violet-300/[0.08] px-2 py-1 font-display text-[10px] font-bold tracking-[0.18em] text-violet-200">
        AI
      </span>
    </span>
  );
}

function PlanCard({ plan, currency }) {
  return (
    <article className={`relative flex h-full flex-col rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 ${plan.id === "nexus" ? "border-violet-200/30 bg-gradient-to-b from-[#211b31] to-[#14121a] shadow-[0_20px_65px_rgba(106,80,160,0.12)]" : "border-white/[0.08] bg-[#111018]/85 hover:border-violet-200/20"}`}>
      {plan.id === "nexus" && <span className="absolute right-4 top-4 rounded-full border border-violet-200/15 bg-violet-300/10 px-2.5 py-1 text-[8px] font-semibold text-violet-200">POPULAR</span>}
        <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-violet-200/10 bg-violet-300/10 text-violet-200">
          <FaUsers />
        </span>
        <div>
          <p className="mb-1 text-[8px] font-bold tracking-[0.16em] text-violet-200">ZENGEN AI WORKFORCE</p>
          <h3 className="m-0 block min-h-[52px] pt-1 text-[40px] leading-[1.2] text-white" style={{ fontFamily: "'Great Vibes', cursive" }}>{plan.name}</h3>
        </div>
      </div>
      <p className="mb-4 text-[10px] font-medium text-[#d5cdea]">{plan.tagline}</p>

      <div className="mb-4 flex items-end gap-1.5">
        <strong className="font-display text-3xl font-semibold tracking-tight text-white">{money(plan.price, currency)}</strong>
        <span className="pb-1 text-[10px] text-[#898497]">/ package / month</span>
      </div>
      <p className="mb-1 text-[11px] font-semibold text-white">{plan.aiCount}</p>
      <p className="mb-4 min-h-[34px] text-[9px] leading-relaxed text-[#9995a8]">{plan.description}</p>

      <ul className="mb-5 mt-0 grid list-none gap-3 border-t border-white/[0.07] pt-4 pl-0">
        {plan.features.map((feature, index) => (
          <li className="flex items-start gap-2.5 text-[9px] leading-relaxed text-[#c6c1d1]" key={feature}>
            {index === 1 ? <SpecialistIcon type="assistant" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-200" /> : <FaCheck className="mt-0.5 shrink-0 text-emerald-300" />}
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto rounded-xl border border-white/[0.06] bg-black/15 px-3 py-2.5 text-[9px] leading-relaxed text-[#aaa4b8]">
        Plan preview. Specialist selection and checkout are coming soon.
      </div>
    </article>
  );
}

export default function PricingPlans({ compact = false }) {
  const { user } = useAuth();
  const [currency, setCurrency] = useState("USD");
  const [singleBuyerType, setSingleBuyerType] = useState("small");
  const wrapper = compact ? "px-5 py-8 sm:px-8" : "mx-auto w-full max-w-[1320px] px-6 py-20 lg:px-10 lg:py-24";

  return (
    <section className={wrapper} id={compact ? undefined : "pricing"}>
      <div className="relative overflow-hidden rounded-[28px] border border-violet-200/15 bg-[radial-gradient(ellipse_at_88%_0%,rgba(143,123,221,0.13),transparent_38%),linear-gradient(145deg,#17141f,#111018_65%,#17131e)] p-5 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-28 -top-36 h-80 w-80 rounded-full border border-violet-200/[0.08]" />
        <div className="relative">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <p className="mb-3 text-[9px] font-bold tracking-[0.2em] text-violet-300">SINGLE SPECIALIST OR FULL AI TEAM</p>
              <h2 className="m-0 font-display text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">Choose how to build your AI workforce.</h2>
              <p className="mb-0 mt-3 max-w-2xl text-xs leading-6 text-[#aaa4b8]">
                Every plan clearly shows how many specialist AI employees you get. Your Personal AI Assistant is included in every plan.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Toggle
                label="Display currency"
                value={currency}
                onChange={setCurrency}
                options={[{ value: "USD", label: "USD" }, { value: "INR", label: "INR" }]}
              />
            </div>
          </div>

          <div className="mb-10 rounded-2xl border border-white/[0.08] bg-[#111018]/60 p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[8px] font-bold tracking-[0.16em] text-violet-200">BUY A SINGLE AI EMPLOYEE</p>
                <h3 className="mb-1 font-display text-xl font-semibold text-white">One specialist. One subscription.</h3>
                <p className="mb-0 max-w-2xl text-[10px] leading-relaxed text-[#9995a8]">This purchase gives access to one selected specialist AI. The Personal Assistant is included; other specialists are separate purchases.</p>
              </div>
              <Toggle
                label="Single specialist customer type"
                value={singleBuyerType}
                onChange={setSingleBuyerType}
                options={[{ value: "small", label: "Small business" }, { value: "corporate", label: "Corporate" }]}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-[#111018]/75 p-5">
              <p className="mb-2 text-[8px] font-bold tracking-[0.16em] text-[#898497]">GENERAL AI SUBSCRIPTION</p>
              <h3 className="mb-1 font-display text-lg font-semibold text-white">ChatGPT Plus</h3>
              <p className="mb-3 text-[9px] text-[#9995a8]">One general-purpose AI subscription.</p>
              <strong className="font-display text-2xl text-white">{money(20, currency)}</strong>
              <span className="ml-1 text-[9px] text-[#898497]">/ month</span>
              </div>
              <div className="rounded-2xl border border-violet-200/20 bg-gradient-to-br from-[#211b31] to-[#14121a] p-5">
              <p className="mb-2 text-[8px] font-bold tracking-[0.16em] text-violet-200">ZENGEN AI SINGLE SPECIALIST</p>
              <Wordmark />
              <p className="mb-3 mt-2 text-[9px] leading-relaxed text-[#c6c1d1]">{singleBuyerType === "small" ? "Choose one specialist AI, with your Personal Assistant included." : "One specialist AI for your organization. Corporate pricing is tailored to your requirements."}</p>
              <strong className="font-display text-2xl text-white">{singleBuyerType === "small" ? money(SINGLE_AI_PRICE_USD, currency) : "Custom"}</strong>
              {singleBuyerType === "small" && <span className="ml-1 text-[9px] text-[#aaa4b8]">/ AI / month</span>}
              <div className="flex pt-3 flex-wrap gap-2 text-[8px] text-[#ded7f0]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/15 px-2.5 py-1.5"><FaCheck className="text-emerald-300" /> One selected specialist</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/15 px-2.5 py-1.5"><FaCheck className="text-emerald-300" /> Personal Assistant included</span>
                {user && <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-2.5 py-1.5 text-emerald-200"><SpecialistIcon type="finance" className="h-3 w-3" /> Finance Analyst purchased</span>}
              </div>
              </div>
            </div>
          </div>

          <p className="mb-4 text-[9px] leading-relaxed text-[#9995a8]">
            Finance Analyst is available now. HR Executive and Sales Analyst are coming soon; plan selections apply as each specialist launches.
          </p>

          <div className="mb-5 border-t border-white/[0.07] pt-8">
            <p className="mb-2 text-[8px] font-bold tracking-[0.16em] text-violet-200">SEPARATE MULTI-SPECIALIST PACKAGES</p>
            <h3 className="mb-2 font-display text-2xl font-semibold text-white">Choose a Zengen AI workforce plan.</h3>
            <p className="mb-0 max-w-2xl text-[10px] leading-relaxed text-[#9995a8]">These are separate subscriptions from buying one AI. Each price covers the full package and the listed number of specialist AI employees; the Personal Assistant is included separately.</p>
          </div>

          <div className="grid items-stretch gap-3 md:grid-cols-3">
            {plans.map((plan) => <PlanCard key={plan.id} plan={plan} currency={currency} />)}
          </div>
          <p className="mb-0 mt-4 text-[8px] leading-relaxed text-[#777285]">
            ZengenAI prices are a launch preview. INR amounts are approximate conversions at {USD_TO_INR} INR per USD; local billing may vary. Specialist selections, usage limits, and checkout will be confirmed before plans launch.
          </p>
        </div>
      </div>
    </section>
  );
}
