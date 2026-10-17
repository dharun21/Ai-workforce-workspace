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
      <label className="dropzone">
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
        <span className="dropzone-icon">↑</span>
        <strong>{file ? file.name : "Drop a file here or browse"}</strong>
        <small>PDF, PNG or JPG · up to 20 MB</small>
      </label>
      <div className="modal-actions">
        <button className="subtle-button" type="button" onClick={onClose}>
          Cancel
        </button>
        <button
          className="auth-submit modal-submit"
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
