import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaArrowUp, FaBell, FaChartBar, FaRobot, FaSearch } from "react-icons/fa";
import { MdOutlineWork } from "react-icons/md";
import { BsBarChartLineFill } from "react-icons/bs";
import EmployeeCard from "../components/EmployeeCard";
import { useAuth } from "./authentication/AuthContext";
import { AppLayout } from "../components/AppLayout";
const employees = [
  {
    role: "AI Finance Analyst",
    icon: <FaRobot />,
    status: "Active",
    tasks: 128,
    detail: "Reviews invoices, flags risk, and keeps your books in sync.",
    color: "violet",
    metric: "+18.4%",
    path: "/ai/finance",
  },
  {
    role: "AI HR Executive",
    icon: <MdOutlineWork />,
    status: "Coming soon",
    tasks: "—",
    detail: "Streamline people operations and team requests.",
    color: "orange",
    path: "/ai/hr",
  },
  {
    role: "AI Sales Analyst",
    icon: <BsBarChartLineFill />,
    status: "Coming soon",
    tasks: "—",
    detail: "Turn pipeline signals into your next best move.",
    color: "blue",
    path: "/ai/sales",
  },
];
export default function Workspace() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filtered = useMemo(
    () =>
      employees.filter((employee) =>
        `${employee.role} ${employee.detail}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );
  return (
    <AppLayout>
      <div className="page-content">
        <div className="welcome-row">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              YOUR COMMAND CENTER
            </p>
            <h1>
              Good morning, {user?.name?.split(" ")[0] || "Dharun"}
              <span className="wave">✦</span>
            </h1>
            <p className="page-subtitle">Your AI team is ready to make today count.</p>
          </div>
          <span className="date-pill">
            <span className="date-dot" />
            Saturday, October 17, 2026
          </span>
        </div>
        <section className="hero-card">
          <div className="hero-content">
            <span className="hero-kicker">
              <span className="live-pulse" />
              YOUR WORKFORCE, AT A GLANCE
            </span>
            <h2>
              Meet your new
              <br />
              favorite coworkers.
            </h2>
            <p>
              Intelligent teammates that take busywork off your plate, so your people can do their
              best work.
            </p>
            <button className="hero-button" onClick={() => navigate("/ai/finance")} type="button">
              Explore your AI team <FaArrowRight />
            </button>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="hero-glow" />
            <div className="hero-core">
              <FaRobot />
            </div>
            <span className="float-chip chip-one">
              <i />
              thinking ahead
            </span>
            <span className="float-chip chip-two">
              <FaChartBar />
              24 tasks today
            </span>
            <span className="float-chip chip-three">✦&nbsp; always learning</span>
          </div>
        </section>
        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-head">
              <span>AI employees</span>
              <span className="stat-icon lavender">
                <FaRobot />
              </span>
            </div>
            <div className="stat-value">
              03{" "}
              <span className="stat-change">
                <FaArrowUp /> 1 new
              </span>
            </div>
            <p>Across your workspace</p>
          </article>
          <article className="stat-card">
            <div className="stat-head">
              <span>Tasks completed</span>
              <span className="stat-icon mint">✓</span>
            </div>
            <div className="stat-value">
              128{" "}
              <span className="stat-change">
                <FaArrowUp /> 12.8%
              </span>
            </div>
            <p>Compared to last month</p>
          </article>
          <article className="stat-card">
            <div className="stat-head">
              <span>Hours given back</span>
              <span className="stat-icon peach">◷</span>
            </div>
            <div className="stat-value">
              36.5 <span className="stat-unit">hrs</span>
            </div>
            <p>Time back for your team</p>
          </article>
          <article className="stat-card">
            <div className="stat-head">
              <span>Workforce status</span>
              <span className="stat-icon sky">
                <FaBell />
              </span>
            </div>
            <div className="stat-value status-value">
              <span className="live-pulse" />1 online <span className="status-total">/ 3</span>
            </div>
            <p>All systems looking good</p>
          </article>
        </section>
        <section className="employees-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">BUILT TO WORK WITH YOU</p>
              <h2>
                Your AI employees <span className="section-count">03</span>
              </h2>
            </div>
            <label className="search-box dashboard-search">
              <FaSearch />
              <input
                aria-label="Search employees"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search employees..."
              />
            </label>
          </div>
          <div className="employee-grid">
            {filtered.map((employee, index) => (
              <EmployeeCard
                key={employee.role}
                employee={employee}
                index={index}
                onOpen={() => navigate(employee.path)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="empty-search">
                No AI employees match “{search}”. Try another search.
              </div>
            )}
          </div>
        </section>
        <footer className="page-footer">
          <span>© 2026 zengenAI</span>
          <span>
            Thoughtfully built for better work <b>✦</b>
          </span>
          <span>Need a hand?</span>
        </footer>
      </div>
    </AppLayout>
  );
}
