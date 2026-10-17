export default function Modal({ title, description, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        className="relative my-auto w-full max-w-[520px] rounded-2xl border border-white/10 bg-[#171620] p-7 shadow-2xl shadow-black/40 max-[520px]:p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-lg text-[#9995a8] transition hover:bg-white/[0.06] hover:text-white"
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ×
        </button>
        <p className="mb-3 flex items-center gap-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">
          <span className="h-px w-4 bg-violet-300" /> WORKSPACE
        </p>
        <h2 className="mb-2 pr-8 font-display text-xl font-bold tracking-tight" id="modal-title">
          {title}
        </h2>
        {description && (
          <p className="mb-6 text-xs leading-relaxed text-[#9995a8]">{description}</p>
        )}
        {children}
      </section>
    </div>
  );
}
