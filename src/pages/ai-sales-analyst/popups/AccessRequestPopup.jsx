import { useState } from "react";
import Modal from "../../../components/Modal";

export default function AccessRequestPopup({ employee, onClose }) {
  const [sent, setSent] = useState(false);
  const field =
    "mt-2 min-h-28 w-full resize-y rounded-lg border border-white/10 bg-[#111018] p-3 text-xs text-white outline-none placeholder:text-[#706b80] focus:border-violet-300/50";
  return (
    <Modal
      title={sent ? "You're on the list" : "Get early access"}
      description={
        sent
          ? `We’ll let you know when ${employee} is ready.`
          : `Leave a note for the team to let us know you’re interested in ${employee}.`
      }
      onClose={onClose}
    >
      {sent ? (
        <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4 text-xs text-emerald-200">
          ✓&nbsp; Request saved for this demo workspace.
        </div>
      ) : (
        <>
          <label className="grid gap-1.5 text-[10px] font-medium text-[#d5d0df]">
            What would you like this employee to help with?
            <textarea className={field} placeholder="Share a task or workflow you have in mind…" />
          </label>
          <div className="mt-6 flex justify-end gap-2">
            <button
              className="rounded-lg border border-white/10 px-4 py-2.5 text-[10px] text-[#c5c0d0] hover:bg-white/[0.04]"
              type="button"
              onClick={onClose}
            >
              Maybe later
            </button>
            <button
              className="rounded-lg bg-violet-300 px-4 py-2.5 text-[10px] font-bold text-[#171222] hover:bg-violet-200"
              type="button"
              onClick={() => setSent(true)}
            >
              Send request
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
