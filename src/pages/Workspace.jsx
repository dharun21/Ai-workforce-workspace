import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarCheck,
  FaRegClock,
  FaRegLightbulb,
  FaRobot,
  FaSearch,
} from "react-icons/fa";
import { MdOutlineWork } from "react-icons/md";
import { BsBarChartLineFill } from "react-icons/bs";
import EmployeeCard from "../components/EmployeeCard";
import { useAuth } from "./authentication/AuthContext";
import { AppLayout } from "../components/AppLayout";

const employees = [
  {
    role: "AI Finance Analyst",
    icon: <FaRobot />,
    status: "Purchased",
    access: "Your plan",
    tasks: "Ready",
    detail: "Reviews invoices, flags risk, and keeps your books in sync.",
    color: "violet",
    path: "/ai/finance",
  },
  {
    role: "AI Personal Assistant",
    icon: <FaRegLightbulb />,
    status: "Included free",
    access: "Included with Finance Analyst",
    tasks: "Ready",
    detail: "Plan your day, remember the little things, and make room for what matters.",
    color: "violet",
    path: "/ai/personal-assistant",
  },
  {
    role: "AI HR Executive",
    icon: <MdOutlineWork />,
    status: "In progress",
    access: "Available soon",
    tasks: "In progress",
    detail: "Streamline people operations and team requests.",
    color: "orange",
    path: "/ai/hr",
  },
  {
    role: "AI Sales Analyst",
    icon: <BsBarChartLineFill />,
    status: "Coming soon",
    access: "Available soon",
    tasks: "Coming soon",
    detail: "Turn pipeline signals into your next best move.",
    color: "blue",
    path: "/ai/sales",
  },
];

const highlights = [
  {
    eyebrow: "INCLUDED WITH YOUR PLAN",
    title: "A little help with everything else.",
    description:
      "Your Personal Assistant is included at no extra cost. Keep your day, reminders, and life admin in one calm place.",
    action: "Meet your assistant",
    path: "/ai/personal-assistant",
    icon: <FaRegLightbulb />,
    note: "FREE FOR YOU",
  },
  {
    eyebrow: "YOUR AI FINANCE ANALYST",
    title: "More clarity in every invoice.",
    description:
      "Review your finance workspace, follow invoice activity, and keep the important numbers moving.",
    action: "Open Finance Analyst",
    path: "/ai/finance",
    icon: <FaChartBar />,
    note: "IN YOUR WORKSPACE",
  },
  {
    eyebrow: "MEET THE ZENGENAI TEAM",
    title: "AI teammates, built around your work.",
    description:
      "Explore the specialists in your workspace and see what is coming next for your team.",
    action: "Explore the AI lineup",
    path: "#ai-catalog",
    icon: <FaRobot />,
    note: "2 READY FOR YOU",
  },
];

const utilityButton =
  "grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] text-violet-100 transition hover:bg-white/10";

export default function Workspace() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [activeHighlight, setActiveHighlight] = useState(0);
  const navigate = useNavigate();
  const filtered = useMemo(
    () =>
      employees.filter((employee) =>
        `${employee.role} ${employee.detail} ${employee.status}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search],
  );
  const ownedEmployees = employees.filter(
    (employee) => employee.status === "Purchased" || employee.status === "Included free",
  );
  const highlight = highlights[activeHighlight];

  useEffect(() => {
    const interval = window.setInterval(
      () => setActiveHighlight((current) => (current + 1) % highlights.length),
      6500,
    );
    return () => window.clearInterval(interval);
  }, []);

  function openHighlight() {
    if (highlight.path.startsWith("#")) {
      document.getElementById("ai-catalog")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate(highlight.path);
  }

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1380px] px-8 py-8 max-[1050px]:px-6 max-[760px]:px-4 max-[420px]:px-3">
        <header className="mb-6 flex items-end justify-between gap-4 max-[760px]:items-start">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">
              <span className="h-px w-4 bg-violet-300" /> YOUR ZENGENAI WORKSPACE
            </p>
            <h1 className="m-0 font-display text-[clamp(25px,2.5vw,34px)] font-bold tracking-[-0.045em]">
              Welcome back, {user?.name?.split(" ")[0] || "Dharun"}
              <span className="ml-2 text-xl text-violet-200">✦</span>
            </h1>
            <p className="mb-0 mt-2 text-xs text-[#9995a8]">
              Your AI teammates are ready. Here’s what’s included in your workspace.
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[10px] text-[#9995a8] max-[420px]:hidden">
            <i className="h-2 w-2 rounded-full bg-violet-300" /> Finance Analyst plan
          </span>
        </header>

        <section
          className="relative isolate flex h-[330px] min-h-[330px] items-center overflow-hidden rounded-2xl border border-violet-300/20 bg-gradient-to-br from-[#211b31] via-[#1c1928] to-[#171a29] px-10 pb-12 pt-8 shadow-xl max-[760px]:h-[310px] max-[760px]:min-h-[310px] max-[760px]:px-6 max-[420px]:h-[305px] max-[420px]:min-h-[305px] max-[420px]:px-5"
          aria-label="Workspace highlights"
        >
          <div className="relative z-10 max-w-[510px]">
            <span className="flex items-center gap-2 text-[9px] font-bold tracking-[0.15em] text-violet-200">
              <span className="text-[15px] text-violet-300">✦</span>
              {highlight.eyebrow}
            </span>
            <h2 className="mb-2 mt-3.5 h-[2.28em] max-w-[440px] overflow-hidden font-display text-[clamp(25px,2.5vw,34px)] font-bold leading-[1.14] tracking-[-0.045em] max-[760px]:max-w-[320px] max-[760px]:text-[25px]">
              {highlight.title}
            </h2>
            <p className="mb-0 h-[3.4em] max-w-[450px] overflow-hidden text-xs leading-[1.7] text-[#aaa4b8] max-[760px]:max-w-[310px] max-[760px]:text-[11px]">
              {highlight.description}
            </p>
            <button
              className="mt-5 inline-flex items-center gap-2.5 rounded-lg bg-violet-300 px-4 py-3 text-[10px] font-bold text-[#171222] shadow-lg shadow-violet-400/15 transition hover:bg-violet-200"
              onClick={openHighlight}
              type="button"
            >
              {highlight.action}
              <FaArrowRight />
            </button>
          </div>
          <div
            className="absolute right-[10%] top-1/2 h-[225px] w-[285px] -translate-y-1/2 max-[760px]:-right-[105px] max-[760px]:opacity-35"
            aria-hidden="true"
          >
            <div className="absolute left-1/2 top-1/2 h-[112px] w-[112px] -translate-x-1/2 -translate-y-1/2 animate-feature-ring-wave rounded-full border border-violet-200/20 motion-reduce:animate-none" />
            <div className="absolute left-1/2 top-1/2 h-[174px] w-[174px] -translate-x-1/2 -translate-y-1/2 animate-feature-ring-wave rounded-full border border-violet-200/20 [animation-delay:800ms] motion-reduce:animate-none" />
            <div className="absolute left-1/2 top-1/2 h-[236px] w-[236px] -translate-x-1/2 -translate-y-1/2 animate-feature-ring-wave rounded-full border border-dashed border-violet-200/20 opacity-60 [animation-delay:1600ms] motion-reduce:animate-none" />
            <div className="absolute left-1/2 top-1/2 z-[1] grid h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[22px] border border-violet-200/50 bg-gradient-to-br from-[#614a8d] to-[#322b49] text-[25px] text-violet-100 shadow-[0_0_45px_rgba(174,140,255,0.26)]">
              {highlight.icon}
            </div>
            <span className="absolute left-0 top-7 z-[2] flex items-center gap-2 whitespace-nowrap rounded-lg border border-white/10 bg-[#191723]/90 px-3 py-2 text-[9px] text-violet-100 shadow-lg">
              <i className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              {highlight.note}
            </span>
            <span className="absolute -bottom-1 -right-5 z-[2] flex items-center gap-2 whitespace-nowrap rounded-lg border border-white/10 bg-[#191723]/90 px-3 py-2 text-[9px] text-violet-100 shadow-lg max-[760px]:hidden">
              <FaRegClock />
              Thoughtfully here when you need it
            </span>
          </div>
          <div
            className="absolute bottom-4 right-[34px] z-[3] flex items-center gap-3 max-[760px]:bottom-[13px] max-[760px]:right-5"
            aria-label="Choose workspace highlight"
          >
            <button
              className={utilityButton}
              type="button"
              aria-label="Previous highlight"
              onClick={() =>
                setActiveHighlight((activeHighlight + highlights.length - 1) % highlights.length)
              }
            >
              <FaChevronLeft />
            </button>
            <div className="flex items-center gap-1.5">
              {highlights.map((item, index) => (
                <button
                  key={item.eyebrow}
                  aria-label={`Show highlight ${index + 1}: ${item.eyebrow}`}
                  aria-current={activeHighlight === index ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all ${activeHighlight === index ? "w-5 bg-violet-300" : "w-1.5 bg-violet-100/40"}`}
                  onClick={() => setActiveHighlight(index)}
                  type="button"
                />
              ))}
            </div>
            <button
              className={utilityButton}
              type="button"
              aria-label="Next highlight"
              onClick={() => setActiveHighlight((activeHighlight + 1) % highlights.length)}
            >
              <FaChevronRight />
            </button>
          </div>
        </section>

        <section
          className="my-4 mb-9 flex items-center justify-between gap-6 rounded-xl border border-white/[0.07] bg-[#171620] px-6 py-5 max-[760px]:flex-col max-[760px]:items-start"
          aria-label="Your AI access overview"
        >
          <div className="flex items-center gap-3.5">
            <span className="grid h-[43px] w-[43px] shrink-0 place-items-center rounded-xl border border-violet-300/20 bg-violet-300/10 text-[17px] text-violet-200">
              <FaRobot />
            </span>
            <div>
              <p className="mb-1.5 text-[9px] font-bold tracking-[0.15em] text-violet-300">
                YOUR AI WORKSPACE
              </p>
              <h2 className="mb-1 font-display text-base font-semibold">
                Two teammates, ready to help.
              </h2>
              <p className="mb-0 text-[10px] text-[#9995a8]">
                One specialist for your finances, plus your personal assistant included free.
              </p>
            </div>
          </div>
          <div className="grid min-w-[340px] gap-2.5 max-[760px]:w-full max-[760px]:min-w-0 max-[760px]:border-t max-[760px]:border-white/[0.07] max-[760px]:pt-3">
            <div className="grid grid-cols-[20px_1fr_auto] items-center gap-2 text-[10px]">
              <span className="grid h-[17px] w-[17px] place-items-center rounded-full bg-emerald-400/10 text-emerald-300">
                ✓
              </span>
              <span>Finance Analyst</span>
              <b className="text-[9px] font-semibold text-emerald-300">Purchased</b>
            </div>
            <div className="grid grid-cols-[20px_1fr_auto] items-center gap-2 text-[10px]">
              <span className="grid h-[17px] w-[17px] place-items-center rounded-full bg-violet-300/10 text-violet-200">
                ✦
              </span>
              <span>Personal Assistant</span>
              <b className="text-[9px] font-semibold text-violet-200">Included free</b>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">
                READY WHEN YOU ARE
              </p>
              <h2 className="m-0 font-display text-lg font-semibold tracking-tight">
                Your AI team{" "}
                <span className="ml-1 rounded border border-white/10 px-1.5 py-0.5 align-middle text-[8px] font-medium text-[#9995a8]">
                  02
                </span>
              </h2>
            </div>
            <span className="text-[10px] text-[#706b80] max-[760px]:hidden">
              Included in your workspace
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
            {ownedEmployees.map((employee, index) => (
              <EmployeeCard
                key={employee.role}
                employee={employee}
                index={index}
                onOpen={() => navigate(employee.path)}
              />
            ))}
          </div>
        </section>

        <section className="border-t border-white/[0.07] pt-7" id="ai-catalog">
          <div className="mb-4 flex items-end justify-between gap-4 max-[760px]:items-start max-[760px]:flex-col">
            <div>
              <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">
                GROW YOUR AI TEAM
              </p>
              <h2 className="m-0 font-display text-lg font-semibold tracking-tight">
                Explore the full AI lineup{" "}
                <span className="ml-1 rounded border border-white/10 px-1.5 py-0.5 align-middle text-[8px] font-medium text-[#9995a8]">
                  04
                </span>
              </h2>
              <p className="mb-0 mt-1.5 text-[10px] text-[#9995a8]">
                Your next specialist is never far away.
              </p>
            </div>
            <label className="flex h-10 w-[300px] items-center gap-2.5 rounded-lg border border-white/[0.08] bg-[#171620] px-3 text-xs text-[#888496] max-[760px]:w-full">
              <FaSearch />
              <input
                className="min-w-0 flex-1 bg-transparent text-[10px] text-white outline-none placeholder:text-[#706b80]"
                aria-label="Search AI specialists"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find an AI employee..."
              />
            </label>
          </div>
          <div className="grid grid-cols-4 gap-3 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
            {filtered.map((employee, index) => (
              <EmployeeCard
                key={employee.role}
                employee={employee}
                index={index}
                onOpen={() => navigate(employee.path)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-white/15 p-8 text-center text-xs text-[#9995a8]">
                No AI specialists match “{search}”. Try another search.
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-[#777285]">
            <FaRegCalendarCheck className="text-violet-300" />
            New specialists are on the way. We’ll keep this space updated as they become available.
          </div>
        </section>
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] py-4 text-[9px] text-[#706b80]">
          <span>© 2026 ZengenAI</span>
          <span>
            Thoughtfully built for better work <b className="text-violet-300">✦</b>
          </span>
          <span>Need a hand?</span>
        </footer>
      </div>
    </AppLayout>
  );
}
