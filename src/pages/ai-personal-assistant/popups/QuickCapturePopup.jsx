import { useState } from "react";
import Modal from "../../../components/Modal";

export default function QuickCapturePopup({ onClose, onSave }) {
  const [thought, setThought] = useState("");
  function submit(event) {
    event.preventDefault();
    if (thought.trim()) onSave(thought.trim());
  }
  return (
    <Modal
      title="Get it out of your head"
      description="Capture a task, idea, or thought. You can decide what to do with it later."
      onClose={onClose}
    >
      <form className="grid gap-4" onSubmit={submit}>
        <label className="grid gap-1.5 text-[10px] font-medium text-[#d5d0df]">
          Quick capture
          <textarea
            autoFocus
            required
            maxLength={500}
            className="min-h-32 w-full resize-y rounded-lg border border-white/10 bg-[#111018] p-3 text-xs text-white outline-none placeholder:text-[#706b80] focus:border-violet-300/50"
            value={thought}
            onChange={(event) => setThought(event.target.value)}
            placeholder="Type whatever you don’t want to forget…"
          />
        </label>
        <p className="m-0 text-[9px] text-[#777285]">This stays in this browser for now.</p>
        <div className="mt-1 flex justify-end gap-2">
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
            Save thought
          </button>
        </div>
      </form>
    </Modal>
  );
}
