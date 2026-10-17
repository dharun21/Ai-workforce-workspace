import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaSignOutAlt, FaChartBar } from "react-icons/fa";
import { MdOutlineWork } from "react-icons/md";
import { BsBarChartLineFill } from "react-icons/bs";
import logo from "../assets/background/ZG-white.png"
import bgImage from "../assets/background/bg-1.png";

const employees = [
  {
    id: 1,
    name: "AI Finance Analyst",
    icon: <FaRobot size={20} />,
    status: "Active",
    tasks: 128,
  },
  {
    id: 2,
    name: "AI HR Executive",
    icon: <MdOutlineWork size={20} />,
    status: "Disabled",
    tasks: "-",
  },
  {
    id: 3,
    name: "AI Sales Analyst",
    icon: <BsBarChartLineFill size={20} />,
    status: "Disabled",
    tasks: "-",
  },
];

function Workspace() {

  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  
  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${darkMode ? "text-white" : "text-gray-900"
      }`}>

      {/* Smooth Gradient Background */}
      <div className="absolute inset-0 bg-[#0b0f19]" />

      <div
        className="absolute inset-0 animate-gradient"
        style={{
          backgroundSize: "200% 200%",
          animation: "gradientShift 20s ease infinite",
          background: `
      radial-gradient(60% 60% at 70% 60%, rgba(59,130,246,0.6), transparent 70%),
      radial-gradient(50% 50% at 30% 40%, rgba(30,64,175,0.5), transparent 70%)
    `
        }}
      />

      {/* Soft Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-black/40" />

      {/* MAIN LAYOUT */}
      <div className="relative z-10 flex min-h-screen">

        {/* LEFT DRAWER */}
        <div className="w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 flex flex-col justify-between p-6">

          {/* Top Section */}
          <div>
            <div className="mb-8">
              <img src={logo} alt="Logo" className="h-15 w-auto" />
            </div>

            <div className="mb-8">
              <p className="text-gray-300 text-sm">Hello,</p>
              <h2 className="text-lg font-semibold">Dharun 👋</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
                <FaRobot />
                AI Employees
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition">
                <FaChartBar />
                Analytics
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition">
                <MdOutlineWork />
                Settings
              </button>
            </div>
          </div>

          {/* Logout */}
          <div>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 transition">
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 p-10">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-10">

            {/* LEFT SIDE (Title + Subtitle) */}
            <div>
              <h1 className="text-3xl font-bold">
                AI Workforce Workspace
              </h1>
              <p className="text-gray-300 mt-2">
                Deploy and manage your AI Employees
              </p>
            </div>

            {/* RIGHT SIDE (Top Controls) */}
            <div className="flex items-center gap-4">

              {/* Search */}
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search anything"
                  className="bg-transparent outline-none text-sm text-white placeholder-gray-300"
                />
              </div>

              {/* Notification */}
              <div className="bg-white/10 p-2 rounded-lg cursor-pointer hover:bg-white/20 transition">
                🔔
              </div>

              {/* Theme Switch */}
              <label className="switch">
                <input
                  type="checkbox"
                  checked={!darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider">
                  <span className="star star_1"></span>
                  <span className="star star_2"></span>
                  <span className="star star_3"></span>
                  <svg viewBox="0 0 16 16" className="cloud" fill="white">
                    <path d="M6 16a4 4 0 1 1 0-8 5 5 0 0 1 9 2 3 3 0 0 1-3 6H6z" />
                  </svg>
                </span>
              </label>

              {/* Profile Pic */}
              <img
                src="https://i.pravatar.cc/40"
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white/30"
              />

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-white/20 shadow-lg hover:scale-105 transition"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 text-blue-300 p-3 rounded-lg">
                      {employee.icon}
                    </div>
                    <h2 className="text-lg font-semibold">
                      {employee.name}
                    </h2>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${employee.status === "Active"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-gray-400/20 text-gray-300"
                      }`}
                  >
                    {employee.status === "Active"
                      ? "🟢 Active"
                      : "⚪ Disabled"}
                  </span>
                </div>

                <div className="mt-8">
                  <p className="text-sm text-gray-300">Tasks</p>
                  <p className="text-2xl font-bold mt-1">
                    {employee.tasks}
                  </p>
                </div>

                <div className="mt-8">
                  <button
                    disabled={employee.status !== "Active"}
                    onClick={() => {
                      if (employee.name === "AI Finance Analyst") {
                        navigate("/finance");
                      }
                    }}
                    className={`w-full py-2 rounded-lg font-medium transition ${employee.status === "Active"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-500/40 cursor-not-allowed"
                      }`}
                  >
                    {employee.status === "Active"
                      ? "Open"
                      : "Coming Soon"}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

export default Workspace;