import { FaArrowRight, FaArrowUp } from "react-icons/fa";
export default function EmployeeCard({ employee, index = 0, onOpen }) {
  const active = employee.status === "Active";
  return (
    <article className={`employee-card ${active ? "" : "employee-muted"}`}>
      <div className="employee-card-top">
        <span className={`employee-icon ${employee.color}`}>{employee.icon}</span>
        <span className={`status-pill ${active ? "status-active" : "status-coming"}`}>
          <i />
          {employee.status}
        </span>
      </div>
      <p className="employee-index">AI EMPLOYEE&nbsp; / &nbsp;0{index + 1}</p>
      <h3>{employee.role}</h3>
      <p className="employee-detail">{employee.detail}</p>
      <div className="employee-metric">
        <span>
          <strong>{employee.tasks}</strong> <small>tasks completed</small>
        </span>
        {employee.metric && (
          <span className="metric-trend">
            <FaArrowUp /> {employee.metric}
          </span>
        )}
      </div>
      <button
        className={`employee-action ${active ? "action-primary" : "action-preview"}`}
        onClick={onOpen}
        type="button"
      >
        {active ? (
          <>
            Open employee <FaArrowRight />
          </>
        ) : (
          <>
            Preview employee <FaArrowRight />
          </>
        )}
      </button>
    </article>
  );
}
