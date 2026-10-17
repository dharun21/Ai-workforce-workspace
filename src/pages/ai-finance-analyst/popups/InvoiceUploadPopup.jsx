import { useState } from "react";
import Modal from "../../../components/Modal";

export default function InvoiceUploadPopup({ onClose, onUpload, loading }) {
  const [file, setFile] = useState(null);
  return (
    <Modal
      title="Add an invoice"
      description="Choose an invoice file for your AI finance analyst to review."
      onClose={onClose}
    >
      <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-violet-300/30 bg-violet-300/[0.035] p-6 text-center transition hover:bg-violet-300/[0.07]">
        <input
          className="sr-only"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
        <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-violet-300/10 text-xl text-violet-200">
          ↑
        </span>
        <strong className="text-xs">{file ? file.name : "Drop a file here or browse"}</strong>
        <small className="mt-2 text-[10px] text-[#9995a8]">PDF, PNG or JPG · up to 20 MB</small>
      </label>
      <div className="mt-6 flex justify-end gap-2">
        <button
          className="rounded-lg border border-white/10 px-4 py-2.5 text-[10px] text-[#c5c0d0] hover:bg-white/[0.04]"
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="rounded-lg bg-violet-300 px-4 py-2.5 text-[10px] font-bold text-[#171222] disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          disabled={!file || loading}
          onClick={() => file && onUpload(file)}
        >
          {loading ? "Analyzing…" : "Analyze invoice"}
        </button>
      </div>
    </Modal>
  );
}
