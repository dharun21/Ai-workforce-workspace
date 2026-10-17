import { useState } from "react";
import Modal from "../../../components/Modal";
export default function AccessRequestPopup({ employee, onClose }) {
  const [sent, setSent] = useState(false);
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
        <div className="access-success">✓&nbsp; Request saved for this demo workspace.</div>
      ) : (
        <>
          <label className="profile-field">
            What would you like this employee to help with?
            <textarea
              className="request-textarea"
              placeholder="Share a task or workflow you have in mind…"
            />
          </label>
          <div className="modal-actions">
            <button className="subtle-button" type="button" onClick={onClose}>
              Maybe later
            </button>
            <button
              className="auth-submit modal-submit"
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
