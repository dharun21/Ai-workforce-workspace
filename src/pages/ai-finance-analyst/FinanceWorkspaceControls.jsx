import { useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaCheck,
  FaPlug,
  FaTimes,
} from "react-icons/fa";

const ANSWER_KEY = "zengen-finance-questions";
const PLUGIN_KEY = "zengen-finance-integrations";

const questions = [
  {
    prompt: "What would make your finance week easier?",
    choices: [
      "See what customers owe me",
      "Know which bills are coming due",
      "Understand where expenses are rising",
      "Reconcile bank activity",
      "Something else",
    ],
  },
  {
    prompt: "How often would you like a finance briefing?",
    choices: [
      "Every morning",
      "Once a week",
      "At month end",
      "Only when something needs attention",
      "Something else",
    ],
  },
  {
    prompt: "What should the analyst flag for your review?",
    choices: [
      "Unusually large expenses",
      "Possible duplicate bills",
      "Overdue customer payments",
      "Missing documents",
      "Something else",
    ],
  },
];

const plugins = [
  ["Telegram", "Share invoices, receipts, and daily finance records; review processed results here", "Messaging"],
  ["Google Drive", "Import invoices and statements from shared folders", "Storage"],
  ["Google Sheets", "Bring in finance trackers and transaction exports", "Spreadsheets"],
  ["Gmail", "Find bills and receipts in a connected inbox", "Email"],
  ["QuickBooks", "Sync accounting records and supplier bills", "Accounting"],
  ["Xero", "Bring invoices and account transactions together", "Accounting"],
  ["Stripe", "Review payment activity against customer invoices", "Payments"],
];

function readStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function FinanceQuestionsCard({ documents, onOpenDocuments }) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState(() => readStored(ANSWER_KEY, []));
  const [answerIndex, setAnswerIndex] = useState(() => Math.min(readStored(ANSWER_KEY, []).length, questions.length - 1));
  const [selection, setSelection] = useState("");
  const [customAnswer, setCustomAnswer] = useState("");
  const [saved, setSaved] = useState(false);

  function saveAnswer() {
    const answer = selection === "Something else" ? customAnswer.trim() : selection;
    if (!answer) return;
    const next = [
      ...answers,
      { question: questions[answerIndex].prompt, answer, at: new Date().toISOString() },
    ];
    setAnswers(next);
    localStorage.setItem(ANSWER_KEY, JSON.stringify(next));
    setSelection("");
    setCustomAnswer("");
    setAnswerIndex(Math.min(answerIndex + 1, questions.length - 1));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <article className="min-w-0 rounded-2xl border border-white/[0.07] bg-[#171620] p-5">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="m-0 text-sm font-semibold text-white">Needs attention</h2>
            <p className="mb-0 mt-1 text-[10px] text-[#777285]">
              {documents.length} finance file(s) · {Math.max(questions.length - answers.length, 0)} open questions
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full bg-white/[0.05] px-2 py-1 text-[9px] text-[#9995a8]">{documents.length + Math.max(questions.length - answers.length, 0)} items</span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open all attention details"
              title="Open all details"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-lg text-violet-200 transition hover:border-violet-300/30 hover:bg-violet-300/[0.08]"
            >
              <FaArrowUp className="-rotate-45 text-sm" />
            </button>
          </div>
        </header>
        <div className="space-y-2.5">
          {documents.slice(0, 2).map((document) => (
            <div key={document.id} className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-2.5">
              <span className="min-w-0 truncate text-[11px] text-white">{document.name}</span>
              <span className="shrink-0 text-[9px] text-amber-200">Imported</span>
            </div>
          ))}
          {!documents.length && (
            <p className="m-0 border-t border-white/[0.06] pt-2.5 text-[10px] leading-4 text-[#9995a8]">
              No finance files need review yet.
            </p>
          )}
          <div className="border-t border-white/[0.06] pt-2.5">
            <span className="mb-1 block text-[9px] font-semibold uppercase tracking-wider text-violet-200">Question for you</span>
            <p className="m-0 line-clamp-2 text-[10px] leading-4 text-[#c5c0d0]">
              {answers.length < questions.length ? questions[Math.min(answers.length, questions.length - 1)].prompt : "You’ve answered the current finance questions."}
            </p>
          </div>
        </div>
      </article>

      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/75 p-5 backdrop-blur-sm max-[600px]:p-2">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="finance-attention-title"
            className="flex h-[min(820px,calc(100vh-2.5rem))] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#14131c] shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-6 py-5 max-[600px]:px-4">
              <div>
                <p className="mb-1 text-[9px] font-bold tracking-[0.16em] text-violet-300">FINANCE WORKSPACE</p>
                <h2 id="finance-attention-title" className="m-0 text-lg font-semibold text-white">Needs attention</h2>
                <p className="mb-0 mt-1 text-xs text-[#9995a8]">Review incoming files and answer the analyst’s questions in one place.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close details" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#9995a8] hover:bg-white/[0.06] hover:text-white"><FaTimes /></button>
            </header>
            <div className="grid min-h-0 flex-1 gap-0 overflow-y-auto md:grid-cols-[1.1fr_0.9fr]">
              <section className="min-w-0 border-b border-white/[0.08] p-6 md:border-b-0 md:border-r max-[600px]:p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div><h3 className="m-0 text-sm font-semibold">Items to review</h3><p className="mb-0 mt-1 text-[10px] text-[#777285]">{documents.length} imported finance file(s)</p></div>
                  {onOpenDocuments && <button type="button" onClick={() => { onOpenDocuments(); setOpen(false); }} className="text-[10px] text-violet-200">Open documents →</button>}
                </div>
                {documents.length ? (
                  <div className="divide-y divide-white/[0.07]">
                    {documents.map((document) => (
                      <article key={document.id} className="flex items-start gap-3 py-4">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-300/10 text-[9px] font-bold text-violet-200">{document.kind}</span>
                        <div className="min-w-0 flex-1"><h4 className="m-0 break-all text-xs font-medium text-white">{document.name}</h4><p className="mb-0 mt-1 text-[10px] text-[#777285]">Added {document.added} · {document.status}</p><p className="mb-0 mt-2 text-[10px] leading-4 text-[#9995a8]">This file is listed in the workspace; document extraction will be available when finance processing is connected.</p></div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-white/10 p-5 text-xs leading-5 text-[#9995a8]">There are no imported files to review. Add invoices, bills, or transaction exports to see them here.</p>
                )}
                {answers.length > 0 && <div className="mt-6 border-t border-white/[0.07] pt-4"><h3 className="mb-3 text-xs font-semibold">Saved preferences</h3>{answers.map((item, index) => <div key={`${item.at}-${index}`} className="mb-2 rounded-lg bg-white/[0.03] p-3"><p className="m-0 text-[9px] text-[#777285]">{item.question}</p><p className="mb-0 mt-1 text-[11px] text-white">{item.answer}</p></div>)}</div>}
              </section>
              <section className="min-w-0 overflow-y-auto p-6 max-[600px]:p-4">
                {answers.length < questions.length ? (
                  <>
                    <p className="mb-2 text-[9px] font-bold tracking-[0.14em] text-violet-300">QUESTION {Math.min(answerIndex + 1, questions.length)} OF {questions.length}</p>
                    <h3 className="mb-2 mt-0 text-sm font-semibold text-white">{questions[answerIndex].prompt}</h3>
                    <p className="mb-4 text-[10px] leading-4 text-[#9995a8]">Choose an option or write your own response.</p>
                    <div className="space-y-2">
                      {questions[answerIndex].choices.map((choice) => (
                        <button type="button" key={choice} onClick={() => setSelection(choice)} className={`flex min-h-10 w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-[10px] transition ${selection === choice ? "border-violet-300/35 bg-violet-300/[0.08] text-white" : "border-white/[0.07] text-[#bdb8c9] hover:bg-white/[0.03]"}`}>
                          <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${selection === choice ? "border-violet-300 bg-violet-300 text-[#171222]" : "border-white/20"}`}>{selection === choice && <FaCheck className="text-[8px]" />}</span>{choice}
                        </button>
                      ))}
                    </div>
                    {selection === "Something else" && <textarea value={customAnswer} onChange={(event) => setCustomAnswer(event.target.value)} placeholder="Write your answer…" className="mt-3 min-h-24 w-full rounded-lg border border-white/10 bg-[#111018] p-3 text-xs text-white outline-none focus:border-violet-300/40" />}
                    <div className="mt-4 flex items-center justify-between gap-3"><span className="text-[9px] text-[#777285]">{answers.length} answer(s) saved</span><button type="button" disabled={!selection || (selection === "Something else" && !customAnswer.trim())} onClick={saveAnswer} className="rounded-lg bg-violet-300 px-4 py-2.5 text-[10px] font-bold text-[#171222] disabled:opacity-40">{saved ? "Saved" : answerIndex === questions.length - 1 ? "Save final answer" : "Save and continue"}</button></div>
                  </>
                ) : (
                  <div className="rounded-xl border border-emerald-300/15 bg-emerald-300/[0.04] p-5"><span className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-emerald-300/10 text-emerald-200"><FaCheck /></span><h3 className="m-0 text-sm font-semibold text-white">You’re all caught up</h3><p className="mb-0 mt-2 text-[10px] leading-5 text-[#9995a8]">You’ve answered the current questions. New questions can appear here as your finance workspace grows.</p></div>
                )}
              </section>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export function FinancePluginsPanel() {
  const [selected, setSelected] = useState(() => readStored(PLUGIN_KEY, []));

  function togglePlugin(name) {
    const next = selected.includes(name)
      ? selected.filter((plugin) => plugin !== name)
      : [...selected, name];
    setSelected(next);
    localStorage.setItem(PLUGIN_KEY, JSON.stringify(next));
  }

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5 sm:p-6">
      <div className="mb-5">
        <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">
          CONNECT YOUR WORKFLOW
        </p>
        <h2 className="m-0 text-base font-semibold text-white">Finance plugins</h2>
        <p className="mb-0 mt-2 max-w-2xl text-xs leading-5 text-[#9995a8]">
          Choose tools you may want to connect. These are saved as preferences only; accounts are not connected and no data is shared yet.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {plugins.map(([name, description, category]) => {
          const isSelected = selected.includes(name);
          return (
            <article
              key={name}
              className="rounded-xl border border-white/[0.08] bg-[#111018] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="mb-2 inline-block rounded bg-white/[0.05] px-2 py-1 text-[8px] uppercase tracking-wider text-[#9995a8]">
                    {category}
                  </span>
                  <h3 className="m-0 text-xs font-semibold text-white">{name}</h3>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-300/10 text-violet-200">
                  <FaPlug />
                </span>
              </div>
              <p className="mb-4 mt-2 min-h-8 text-[10px] leading-4 text-[#9995a8]">
                {description}
              </p>
              <button
                type="button"
                onClick={() => togglePlugin(name)}
                className={`w-full rounded-lg border px-3 py-2 text-[10px] ${isSelected ? "border-violet-300/30 bg-violet-300/[0.08] text-violet-200" : "border-white/10 text-[#c5c0d0] hover:bg-white/[0.04]"}`}
              >
                {isSelected ? "Added to setup" : "Add to setup"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

const layoutWidgets = [
  { id: "receivables", label: "Outstanding receivables", minHeight: 132, maxHeight: 320 },
  { id: "bills", label: "Bills due soon", minHeight: 132, maxHeight: 320 },
  { id: "review", label: "Needs your review", minHeight: 132, maxHeight: 320 },
  { id: "documents", label: "Documents added", minHeight: 132, maxHeight: 320 },
  { id: "autopilot", label: "Finance autopilot", minHeight: 180, maxHeight: 440 },
  { id: "attention", label: "Needs attention and questions", minHeight: 300, maxHeight: 650 },
  { id: "activity", label: "Recent activity", minHeight: 160, maxHeight: 500 },
];

export function DashboardLayoutEditor({ layout, onChange, onClose }) {
  const [draft, setDraft] = useState(() => layout.map((item) => ({ ...item })));
  const [dragging, setDragging] = useState(null);

  function updateItem(id, changes) {
    setDraft((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item));
  }

  function move(fromId, toId) {
    if (fromId === toId) return;
    setDraft((items) => {
      const next = [...items];
      const from = next.findIndex((item) => item.id === fromId);
      const to = next.findIndex((item) => item.id === toId);
      if (from < 0 || to < 0) return items;
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function toggleWidget(widget) {
    const exists = draft.some((item) => item.id === widget.id);
    if (exists) {
      setDraft((items) => items.filter((item) => item.id !== widget.id));
      return;
    }
    setDraft((items) => [...items, { id: widget.id, span: 4, height: widget.minHeight + 80 }]);
  }

  function save() {
    onChange(draft);
    onClose();
  }

  const orderedWidgets = [
    ...draft.map((item) => layoutWidgets.find((widget) => widget.id === item.id)),
    ...layoutWidgets.filter((widget) => !draft.some((item) => item.id === widget.id)),
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-end bg-black/50 p-4 pt-20 backdrop-blur-sm max-[600px]:p-2 max-[600px]:pt-16">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="finance-layout-title"
        className="max-h-[calc(100vh-6rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#15141d] p-5 shadow-2xl max-[600px]:max-h-[calc(100vh-5rem)] max-[600px]:p-4"
      >
        <header className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-[9px] font-bold tracking-[0.15em] text-violet-300">
              YOUR OVERVIEW
            </p>
            <h2 id="finance-layout-title" className="m-0 text-base font-semibold text-white">
              Arrange your dashboard
            </h2>
            <p className="mb-0 mt-2 text-[10px] leading-4 text-[#9995a8]">
              Drag cards to reorder, choose their width, and adjust height within each card’s limits.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#9995a8] hover:bg-white/[0.06] hover:text-white"
            aria-label="Close layout editor"
          >
            <FaTimes />
          </button>
        </header>
        <div className="space-y-2">
          {orderedWidgets.map((widgetDef) => {
            const item = draft.find((entry) => entry.id === widgetDef.id);
            if (!item) {
              return (
                <article key={widgetDef.id} className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#1b1a24] p-4">
                  <span className="text-xs text-[#777285]">{widgetDef.label} · hidden</span>
                  <button type="button" onClick={() => toggleWidget(widgetDef)} className="rounded-lg border border-white/10 px-3 py-2 text-[10px] text-[#c5c0d0] hover:bg-white/[0.04]">Show card</button>
                </article>
              );
            }
            const widget = widgetDef;
            if (!widget) return null;
            return (
              <article
                key={item.id}
                draggable
                onDragStart={() => setDragging(item.id)}
                onDragEnd={() => setDragging(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (dragging) move(dragging, item.id);
                  setDragging(null);
                }}
                className={`rounded-xl border bg-[#1b1a24] p-4 transition ${dragging === item.id ? "border-violet-300/40 opacity-50" : "border-white/[0.08]"}`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="cursor-grab text-[#777285]" aria-hidden="true">⠿</span>
                    <span className="truncate text-xs font-medium text-white">{widget.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" disabled={draft[0]?.id === item.id} onClick={() => move(item.id, draft[draft.findIndex((entry) => entry.id === item.id) - 1]?.id)} className="grid h-7 w-7 place-items-center rounded-md text-[#9995a8] hover:bg-white/[0.05] disabled:opacity-30" aria-label={`Move ${widget.label} up`}><FaArrowUp /></button>
                    <button type="button" disabled={draft[draft.length - 1]?.id === item.id} onClick={() => move(item.id, draft[draft.findIndex((entry) => entry.id === item.id) + 1]?.id)} className="grid h-7 w-7 place-items-center rounded-md text-[#9995a8] hover:bg-white/[0.05] disabled:opacity-30" aria-label={`Move ${widget.label} down`}><FaArrowDown /></button>
                    <button type="button" onClick={() => toggleWidget(widget)} className="text-[9px] text-[#9995a8] hover:text-white">Hide</button>
                  </div>
                </div>
                <label className="mb-3 flex items-center justify-between gap-4 text-[10px] text-[#bdb8c9]">
                  Width
                  <select
                    value={item.span}
                    onChange={(event) => updateItem(item.id, { span: Number(event.target.value) })}
                    className="rounded-lg border border-white/10 bg-[#111018] px-2.5 py-2 text-[10px] text-white outline-none"
                  >
                    {[1, 2, 3, 4].map((span) => (
                      <option key={span} value={span}>{span} of 4 columns</option>
                    ))}
                  </select>
                </label>
                <label className="block text-[10px] text-[#bdb8c9]">
                  Height · {widget.minHeight}–{widget.maxHeight}px
                  <input
                    type="range"
                    min={widget.minHeight}
                    max={widget.maxHeight}
                    step="10"
                    value={item.height}
                    onChange={(event) => updateItem(item.id, { height: Number(event.target.value) })}
                    className="mt-2 block w-full accent-violet-300"
                  />
                  <span className="mt-1 block text-right text-[9px] text-[#777285]">Current: {item.height}px</span>
                </label>
              </article>
            );
          })}
        </div>
        <footer className="mt-5 flex justify-end gap-2 border-t border-white/[0.07] pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2.5 text-[10px] text-[#c5c0d0] hover:bg-white/[0.04]">Cancel</button>
          <button type="button" onClick={save} className="rounded-lg bg-violet-300 px-4 py-2.5 text-[10px] font-bold text-[#171222]">Apply layout</button>
        </footer>
      </section>
    </div>
  );
}
