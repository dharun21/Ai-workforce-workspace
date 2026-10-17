import { useState } from "react";
import Modal from "../../../components/Modal";

const inputClass =
  "mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111018] px-3 text-xs text-white outline-none focus:border-violet-300/50";
const labelClass = "grid gap-1.5 text-[10px] font-medium text-[#d5d0df]";

export default function ReminderPopup({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState("");
  const [category, setCategory] = useState("Life admin");
  function submit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: Date.now(),
      title: title.trim(),
      when: when || "Anytime",
      category,
      complete: false,
    });
  }
  return (
    <Modal
      title="Add a reminder"
      description="Make a little space in your day for something that matters."
      onClose={onClose}
    >
      <form className="grid gap-4" onSubmit={submit}>
        <label className={labelClass}>
          What do you want to remember?
          <input
            autoFocus
            required
            maxLength={90}
            className={inputClass}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Call the dentist"
          />
        </label>
        <div className="grid grid-cols-2 gap-3 max-[500px]:grid-cols-1">
          <label className={labelClass}>
            Time
            <input
              className={inputClass}
              type="time"
              value={when}
              onChange={(event) => setWhen(event.target.value)}
            />
          </label>
          <label className={labelClass}>
            Area
            <select
              className={inputClass}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>Life admin</option>
              <option>Wellbeing</option>
              <option>Work</option>
              <option>People</option>
              <option>Personal goal</option>
            </select>
          </label>
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <button
            className="rounded-lg border border-white/10 px-4 py-2.5 text-[10px] text-[#c5c0d0] hover:bg-white/[0.04]"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-violet-300 px-4 py-2.5 text-[10px] font-bold text-[#171222] hover:bg-violet-200"
            type="submit"
          >
            Save reminder
          </button>
        </div>
      </form>
    </Modal>
  );
}
