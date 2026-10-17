import { FaArrowRight } from "react-icons/fa";

const iconTone = {
  violet: "bg-violet-400/10 text-violet-200",
  orange: "bg-orange-300/10 text-orange-200",
  blue: "bg-sky-300/10 text-sky-200",
};

export default function EmployeeCard({ employee, index = 0, onOpen }) {
  const purchased = employee.status === "Purchased";
  const included = employee.status === "Included free";
  const inProgress = employee.status === "In progress";
  const available = purchased || included;
  const statusTone = purchased
    ? "bg-emerald-400/10 text-emerald-300"
    : included
      ? "bg-violet-300/10 text-violet-200"
      : inProgress
        ? "bg-orange-300/10 text-orange-200"
        : "bg-white/[0.04] text-[#9995a8]";
  const actionTone = available
    ? "border-violet-300/30 bg-violet-300/10 text-violet-200 hover:bg-violet-300/20"
    : "border-white/[0.07] bg-white/[0.025] text-[#706b80]";

  return (
    <article
      className={`min-w-0 rounded-xl border border-white/[0.07] bg-[#171620] p-[17px] transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/30 hover:shadow-xl ${included ? "border-violet-300/25 bg-gradient-to-br from-[#171620] to-violet-900/10" : ""} ${!available ? "opacity-70" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`grid h-[38px] w-[38px] place-items-center rounded-[10px] text-base ${iconTone[employee.color] || iconTone.violet}`}
        >
          {employee.icon}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-[5px] text-[9px] ${statusTone}`}
        >
          <i className="h-[5px] w-[5px] rounded-full bg-current" />
          {employee.status}
        </span>
      </div>
      <p className="mb-1.5 mt-4 text-[8px] tracking-[0.11em] text-[#706b80]">
        AI SPECIALIST&nbsp; / &nbsp;0{index + 1}
      </p>
      <h3 className="m-0 font-display text-sm font-semibold tracking-tight">{employee.role}</h3>
      <p className="my-2 min-h-8 text-[10px] leading-relaxed text-[#9995a8]">{employee.detail}</p>
      <div className="flex items-center justify-between border-y border-white/[0.07] py-2.5">
        <span>
          <strong className="font-display text-[15px] font-semibold">{employee.tasks}</strong>
          <small className="ml-1 text-[9px] text-[#9995a8]">
            {purchased ? "workspace access" : included ? "to help" : "availability"}
          </small>
        </span>
      </div>
      <p className="mb-3 mt-2 min-h-[14px] text-[9px] text-[#706b80]">{employee.access}</p>
      <button
        className={`flex h-[38px] w-full items-center justify-center gap-2 rounded-lg border text-[10px] font-semibold transition disabled:cursor-default disabled:opacity-60 ${actionTone}`}
        onClick={onOpen}
        type="button"
        disabled={!available}
      >
        {purchased
          ? "Open Finance Analyst"
          : included
            ? "Open your assistant"
            : inProgress
              ? "In development"
              : "Coming soon"}
        {available && <FaArrowRight className="text-[8px]" />}
      </button>
    </article>
  );
}
