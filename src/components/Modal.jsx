export default function Modal({ title, description, onClose, children }) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close dialog">
          ×
        </button>
        <p className="eyebrow">
          <span className="eyebrow-line" />
          WORKSPACE
        </p>
        <h2 id="modal-title">{title}</h2>
        {description && <p className="modal-description">{description}</p>}
        {children}
      </section>
    </div>
  );
}
