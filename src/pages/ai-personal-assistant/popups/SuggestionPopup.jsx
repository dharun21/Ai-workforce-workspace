import { useState } from "react";
import Modal from "../../../components/Modal";
import { FaArrowRight, FaCheck, FaRegLightbulb } from "react-icons/fa";

export default function SuggestionPopup({ suggestion, onClose, onSave }) {
  const [saved, setSaved] = useState(false);
  return (
    <Modal title={suggestion.title} description={suggestion.description} onClose={onClose}>
      <div className="flex gap-3 rounded-xl border border-violet-300/15 bg-violet-300/[0.05] p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-300/10 text-violet-200">
          <FaRegLightbulb />
        </span>
        <div>
          <strong className="text-xs">A gentle starting point</strong>
          <p className="mb-0 mt-2 text-[11px] leading-relaxed text-[#b5b0c0]">
            {suggestion.answer}
          </p>
        </div>
      </div>
      {saved && <p className="mb-0 mt-3 text-[10px] text-emerald-300">Added to your plan.</p>}
      <div className="mt-6 flex justify-end gap-2">
        <button
          className="rounded-lg border border-white/10 px-4 py-2.5 text-[10px] text-[#c5c0d0] hover:bg-white/[0.04]"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="flex items-center gap-2 rounded-lg bg-violet-300 px-4 py-2.5 text-[10px] font-bold text-[#171222] hover:bg-violet-200"
          type="button"
          onClick={() => {
            onSave?.();
            setSaved(true);
          }}
        >
          {saved ? (
            <>
              <FaCheck />
              Saved
            </>
          ) : (
            <>
              Add to my plan <FaArrowRight />
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
