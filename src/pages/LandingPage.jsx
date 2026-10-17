import { Link } from "react-router-dom";
import { FaArrowRight, FaCheck, FaMobileAlt } from "react-icons/fa";
import { useAuth } from "./authentication/AuthContext";
import SpecialistIcon from "../components/SpecialistIcon";
import PricingPlans from "../components/PricingPlans";

const specialists = [
  {
    type: "finance",
    name: "Finance Analyst",
    description: "Go beyond invoices: talk through business goals, understand cash flow, and find practical ways to grow.",
    status: "Available now",
    tone: "bg-violet-300/10 text-violet-200",
  },
  {
    type: "assistant",
    name: "Personal Assistant",
    description: "Chat through your thoughts, ask for help, make plans, and keep reminders and everyday life in one place.",
    status: "Included with Purchase",
    tone: "bg-pink-300/10 text-pink-200",
  },
  {
    type: "hr",
    name: "HR Executive",
    description: "Support people operations, onboarding, and routine team requests.",
    status: "Coming soon",
    tone: "bg-sky-300/10 text-sky-200",
  },
  {
    type: "sales",
    name: "Sales Analyst",
    description: "Explore market signals and growth opportunities, then find practical ways to help your business stand out.",
    status: "Coming soon",
    tone: "bg-emerald-300/10 text-emerald-200",
  },
];

function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 pt-4 whitespace-nowrap sm:gap-3" aria-label="ZengenAI">
      <span
        className="text-[32px] leading-none tracking-[0.04em] text-white sm:text-[44px]"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        Zengen
      </span>
      <span className="rounded-md border border-violet-300/25 bg-violet-300/[0.08] px-1.5 py-1 font-display text-[9px] font-bold tracking-[0.18em] text-violet-200 sm:px-2.5 sm:py-2 sm:text-xs">
        AI
      </span>
    </span>
  );
}

function WorkspacePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[690px] [perspective:1400px]">
      <div className="absolute -inset-8 rounded-[40px] bg-violet-500/[0.14] blur-[70px]" />
      <div className="relative rotate-[1.2deg] overflow-hidden rounded-[22px] border border-white/[0.13] bg-[#111018] shadow-[0_35px_110px_rgba(0,0,0,0.55)] transition duration-500 hover:rotate-0">
        <div className="flex h-11 items-center gap-2 border-b border-white/[0.08] bg-[#191720] px-4">
          <i className="h-2.5 w-2.5 rounded-full bg-[#fb7185]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
          <span className="ml-4 flex h-6 flex-1 items-center justify-center rounded-md border border-white/[0.06] bg-black/20 text-[8px] tracking-wide text-[#777285]">
            zengenAI · workspace preview
          </span>
        </div>
        <div className="grid min-h-[340px] grid-cols-[132px_1fr] max-[580px]:grid-cols-1">
          <aside className="border-r border-white/[0.07] bg-[#14121a] p-3 max-[580px]:hidden">
            <div className="mb-7 flex items-center gap-2 px-1 py-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-300/10 text-violet-200">
                <SpecialistIcon type="team" className="h-4 w-4" />
              </span>
              <span className="font-display text-[9px] font-semibold text-white">Workspace</span>
            </div>
            <div className="grid gap-2 text-[8px] text-[#9995a8]">
              <div className="flex items-center gap-2 rounded-lg bg-violet-300/10 px-2 py-2 text-violet-200">
                <SpecialistIcon type="team" className="h-3.5 w-3.5" /> My AI team
              </div>
              <div className="flex items-center gap-2 px-2 py-2">
                <SpecialistIcon type="finance" className="h-3.5 w-3.5" /> Finance Analyst
              </div>
              <div className="flex items-center gap-2 px-2 py-2">
                <SpecialistIcon type="assistant" className="h-3.5 w-3.5" /> Personal Assistant
              </div>
            </div>
          </aside>
          <div className="min-w-0 p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="mb-1 text-[8px] font-bold tracking-[0.16em] text-violet-300">YOUR WORKSPACE</p>
                <h2 className="m-0 font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
                  A clearer day starts here.
                </h2>
              </div>
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#d7bea3] to-[#755b55] text-[8px] font-bold text-white">
                DK
              </div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {[
                ["02", "AI teammates"],
                ["01", "Finance workspace"],
                ["FREE", "Personal assistant"],
              ].map(([value, label]) => (
                <div className="rounded-xl border border-white/[0.07] bg-[#191720] p-3" key={label}>
                  <strong className="block font-display text-sm font-semibold text-white sm:text-base">{value}</strong>
                  <span className="mt-1 block text-[7px] leading-tight text-[#898497] sm:text-[8px]">{label}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[1.2fr_0.8fr] gap-2 max-[420px]:grid-cols-1">
              <div className="rounded-xl border border-white/[0.07] bg-[#191720] p-3.5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[9px] font-semibold text-white">Your AI teammates</span>
                  <span className="text-[7px] text-emerald-300">Ready to help</span>
                </div>
                <div className="grid gap-2.5">
                  {specialists.slice(0, 2).map((specialist) => (
                    <div className="flex items-center gap-2.5" key={specialist.type}>
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-300/10 text-violet-200">
                        <SpecialistIcon type={specialist.type} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-[8px] font-medium text-white">{specialist.name}</span>
                        <span className="text-[7px] text-[#898497]">{specialist.status}</span>
                      </div>
                      <FaCheck className="text-[8px] text-emerald-300" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-[#191720] p-3.5">
                <span className="text-[9px] font-semibold text-white">Today, at a glance</span>
                <div className="mt-4 flex h-12 items-end gap-1.5">
                  {[35, 52, 42, 70, 56, 88, 68, 96, 72, 100, 76, 88].map((height, index) => (
                    <span
                      className={`flex-1 rounded-t-sm ${index === 9 ? "bg-violet-300" : "bg-violet-300/25"}`}
                      key={`${height}-${index}`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <span className="mt-2 block text-[7px] text-[#898497]">A little more room for focused work</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-6 hidden items-center gap-2 rounded-xl border border-white/10 bg-[#191720]/95 px-3 py-2.5 text-[9px] text-white shadow-xl sm:flex">
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-violet-300/10 text-violet-200">
          <SpecialistIcon type="assistant" className="h-3.5 w-3.5" />
        </span>
        Personal Assistant included
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  const accessPath = user ? "/workspace" : "/login";

  return (
    <main className="landing-page min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_15%_8%,rgba(102,72,151,0.2),transparent_35%),radial-gradient(ellipse_at_88%_35%,rgba(83,65,126,0.17),transparent_38%),linear-gradient(145deg,#100e17,#0c0b12_55%,#100e17)] text-[#f5f3ff]">
      <header className="relative z-10 mx-auto flex w-full max-w-[1320px] items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/" aria-label="ZengenAI home">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-8 text-[11px] text-[#aaa4b8] md:flex" aria-label="Website navigation">
          <a className="transition hover:text-white" href="#team">AI team</a>
          <a className="transition hover:text-white" href="#pricing">Pricing</a>
          <a className="transition hover:text-white" href="#how-it-works">How it works</a>
          <a className="transition hover:text-white" href="#mobile">Mobile apps</a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            className="rounded-lg px-3 py-2.5 text-[10px] font-semibold text-[#d3cde0] transition hover:bg-white/[0.05] hover:text-white sm:px-4"
            to={accessPath}
          >
            Sign in
          </Link>
          <Link
            className="rounded-lg border border-violet-200/20 bg-violet-300 px-4 py-2.5 text-[10px] font-bold text-[#171222] shadow-lg shadow-violet-400/10 transition hover:bg-violet-200 sm:px-5"
            to={accessPath}
          >
            {user ? "Open workspace" : "Log in"}
          </Link>
        </div>
      </header>

      <section className="relative mx-auto grid min-h-[670px] w-full max-w-[1320px] items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:pb-28 lg:pt-20">
        <div className="relative z-[1] max-w-[540px]">
          <p className="mb-5 flex items-center gap-2 text-[9px] font-bold tracking-[0.2em] text-violet-300">
            <span className="h-px w-6 bg-violet-300" /> A MORE HUMAN WAY TO WORK
          </p>
          <h1 className="mb-5 font-display text-[clamp(42px,5.8vw,76px)] font-semibold leading-[1.02] tracking-[-0.065em] text-white">
            Your AI team,
            <br />
            <span className="bg-gradient-to-r from-violet-200 via-[#c4a7ff] to-[#8f7bdd] bg-clip-text text-transparent">
              here for the work
            </span>
            <br />
            and life around it.
          </h1>
          <p className="mb-8 max-w-[470px] text-sm leading-7 text-[#aaa4b8] sm:text-[15px]">
            Choose the AI specialists that fit your work, from business growth and finance to sales and people operations. Every AI purchase also includes your all-in-one Personal Assistant for conversations, plans, reminders, and everyday help.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="inline-flex items-center gap-2.5 rounded-lg bg-violet-300 px-5 py-3.5 text-[10px] font-bold text-[#171222] shadow-xl shadow-violet-400/15 transition hover:-translate-y-0.5 hover:bg-violet-200"
              to={accessPath}
            >
              {user ? "Open your workspace" : "Get started"} <FaArrowRight />
            </Link>
            <a
              className="rounded-lg border border-white/10 px-5 py-3.5 text-[10px] font-semibold text-white transition hover:border-violet-200/30 hover:bg-white/[0.04]"
              href="#team"
            >
              Meet your AI team
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] text-[#898497]">
            <span className="inline-flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Specialist AI for the work you need</span>
            <span className="inline-flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-violet-300" /> Personal Assistant free with any AI purchase</span>
          </div>
        </div>
        <div className="relative z-[1] py-8 lg:py-0">
          <WorkspacePreview />
        </div>
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-200/15 to-transparent lg:left-10 lg:right-10" />
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-6 py-20 lg:px-10 lg:py-24" id="team">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[620px]">
            <p className="mb-3 text-[9px] font-bold tracking-[0.18em] text-violet-300">MEET YOUR SPECIALISTS</p>
            <h2 className="m-0 font-display text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
              The right help for the work in front of you.
            </h2>
          </div>
          <p className="mb-1 max-w-[350px] text-xs leading-relaxed text-[#9995a8]">
            One workspace for your business and everyday needs, with more AI teammates on the way.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-3 max-[1050px]:grid-cols-2 max-[600px]:grid-cols-1">
          {specialists.map((specialist) => (
            <article
              className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#191720] to-[#121119] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-200/25 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
              key={specialist.type}
            >
              <div className="mb-8 flex items-start justify-between gap-3">
                <span className={`grid h-11 w-11 place-items-center rounded-xl border border-white/[0.08] ${specialist.tone}`}>
                  <SpecialistIcon type={specialist.type} className="h-5 w-5" />
                </span>
                <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[8px] text-[#aaa4b8]">
                  {specialist.status}
                </span>
              </div>
              <h3 className="mb-2 font-display text-base font-semibold text-white">AI {specialist.name}</h3>
              <p className="mb-0 min-h-[58px] text-[10px] leading-relaxed text-[#9995a8]">{specialist.description}</p>
            </article>
          ))}
        </div>
      </section>

      <PricingPlans />

      <section className="border-y border-white/[0.06] bg-white/[0.015]" id="how-it-works">
        <div className="mx-auto grid w-full max-w-[1320px] gap-12 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-24">
          <div>
            <p className="mb-3 text-[9px] font-bold tracking-[0.18em] text-violet-300">SIMPLE BY DESIGN</p>
            <h2 className="mb-4 font-display text-3xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-4xl">
              A little more room for your best work.
            </h2>
            <p className="max-w-[440px] text-xs leading-6 text-[#9995a8]">
              Give each kind of work a specialist, keep everything easy to find, and bring your attention back to what matters most.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Choose your teammate", "Open a specialist for the kind of help you need."],
              ["02", "Bring work into one place", "Keep finance tasks and everyday plans close at hand."],
              ["03", "Make space for people", "Let a little support take the busywork off your mind."],
            ].map(([number, title, description]) => (
              <article className="rounded-2xl border border-white/[0.07] bg-[#15131c] p-5" key={number}>
                <span className="font-display text-sm font-semibold text-violet-300">{number}</span>
                <h3 className="mb-2 mt-8 font-display text-sm font-semibold text-white">{title}</h3>
                <p className="mb-0 text-[10px] leading-relaxed text-[#9995a8]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-6 py-20 lg:px-10 lg:py-24" id="mobile">
        <div className="relative overflow-hidden rounded-[26px] border border-violet-200/15 bg-gradient-to-br from-[#211b31] via-[#1a1725] to-[#151822] p-8 sm:p-12">
          <div className="absolute -right-24 -top-36 h-[420px] w-[420px] rounded-full border border-violet-200/[0.08]" />
          <div className="absolute -right-4 -top-16 h-[300px] w-[300px] rounded-full border border-dashed border-violet-200/[0.12]" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div className="max-w-[620px]">
              <p className="mb-3 text-[9px] font-bold tracking-[0.18em] text-violet-200">ON THE ROADMAP</p>
              <h2 className="mb-4 font-display text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
                Your AI team, wherever your day takes you.
              </h2>
              <p className="mb-6 max-w-[560px] text-xs leading-6 text-[#aaa4b8]">
              Dedicated iOS and Android apps are on our roadmap, so your ZengenAI workspace can travel with you in the future.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/15 px-3 py-2 text-[9px] font-medium text-white">
                  <FaMobileAlt className="text-violet-200" /> iOS app · Planned
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/15 px-3 py-2 text-[9px] font-medium text-white">
                  <FaMobileAlt className="text-emerald-200" /> Android app · Planned
                </span>
              </div>
            </div>
            <div className="relative mx-auto flex h-[170px] w-[150px] items-center justify-center md:mr-8">
              <div className="absolute h-[160px] w-[160px] rounded-full border border-violet-200/15 animate-feature-ring-wave" />
              <div className="relative h-[132px] w-[72px] rounded-[20px] border border-violet-100/30 bg-gradient-to-b from-[#342a49] to-[#17141e] p-1.5 shadow-[0_20px_55px_rgba(0,0,0,0.4)]">
                <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[15px] border border-white/[0.06] bg-[#17141e]">
                  <span className="h-1 w-7 rounded-full bg-white/20" />
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-300/10 text-violet-200">
                    <SpecialistIcon type="team" className="h-6 w-6" />
                  </span>
                  <span className="h-1 w-5 rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] px-6 py-6 text-[9px] text-[#777285] lg:px-10">
        <Link to="/" aria-label="ZengenAI home"><Wordmark /></Link>
        <span>Thoughtfully built for better work <b className="text-violet-300">✦</b></span>
        <Link className="transition hover:text-violet-200" to={accessPath}>{user ? "Workspace" : "Sign in"}</Link>
      </footer>
    </main>
  );
}
