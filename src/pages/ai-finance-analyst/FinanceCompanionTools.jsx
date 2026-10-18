import { useEffect, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaCheck,
  FaChevronDown,
  FaChevronRight,
  FaComments,
  FaPlug,
  FaPlus,
  FaRegWindowMaximize,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";

const CHAT_KEY = "zengen-finance-chats";
const ANSWER_KEY = "zengen-finance-questions";
const PLUGIN_KEY = "zengen-finance-integrations";
const LAYOUT_KEY = "zengen-finance-layout";
const DEFAULT_LAYOUT = [
  { id: "receivables", span: 1, height: 170 },
  { id: "bills", span: 1, height: 170 },
  { id: "review", span: 1, height: 170 },
  { id: "documents", span: 1, height: 170 },
  { id: "autopilot", span: 2, height: 250 },
  { id: "attention", span: 2, height: 380 },
  { id: "activity", span: 4, height: 220 },
];
const INTEGRATIONS = [
  ["Google Drive", "Import invoices and statements from shared folders", "Storage"],
  ["Google Sheets", "Bring in finance trackers and transaction exports", "Spreadsheets"],
  ["Gmail", "Find bills and receipts in a connected inbox", "Email"],
  ["QuickBooks", "Sync accounting records and supplier bills", "Accounting"],
  ["Xero", "Bring invoices and account transactions together", "Accounting"],
  ["Stripe", "Review payment activity against customer invoices", "Payments"],
];
const QUESTIONS = [
  {
    prompt: "What would make your finance week easier?",
    options: ["See what customers owe me", "Know which bills are coming due", "Understand where expenses are rising", "Reconcile bank activity", "Something else"],
  },
  {
    prompt: "How often would you like a finance briefing?",
    options: ["Every morning", "Once a week", "At month end", "Only when something needs attention", "Something else"],
  },
  {
    prompt: "What should the analyst flag for your review?",
    options: ["Unusually large expenses", "Possible duplicate bills", "Overdue customer payments", "Missing documents", "Something else"],
  },
];

function readStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function makeChat() {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title: "New finance chat", updated: new Date().toISOString(), messages: [] };
}

export function readFinanceLayout() {
  const saved = readStored(LAYOUT_KEY, DEFAULT_LAYOUT);
  if (saved.some((item) => ["metrics", "focus"].includes(typeof item === "string" ? item : item.id))) {
    return DEFAULT_LAYOUT;
  }
  const oldDefaults = Object.fromEntries(DEFAULT_LAYOUT.map((item) => [item.id, item]));
  return saved.map((item) => {
    const value = typeof item === "string" ? { id: item } : item;
    const defaults = oldDefaults[value.id];
    return defaults ? { ...defaults, ...value } : null;
  }).filter(Boolean);
}

export default function FinanceCompanionTools({ layout = DEFAULT_LAYOUT, onLayoutChange = () => {} }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("Chat");
  const [chats, setChats] = useState(() => readStored(CHAT_KEY, []));
  const [activeChatId, setActiveChatId] = useState(() => readStored(CHAT_KEY, [])[0]?.id || null);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [plugins, setPlugins] = useState(() => readStored(PLUGIN_KEY, []));
  const [answers, setAnswers] = useState(() => readStored(ANSWER_KEY, []));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [customAnswer, setCustomAnswer] = useState("");
  const [layoutDraft, setLayoutDraft] = useState(layout.map((item) => typeof item === "string" ? { id: item, span: 4, height: 220 } : item));
  const [notice, setNotice] = useState("");

  useEffect(() => setLayoutDraft(layout), [layout]);

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const persistChats = (next) => {
    setChats(next);
    localStorage.setItem(CHAT_KEY, JSON.stringify(next));
  };
  const selectChat = (chat) => {
    setActiveChatId(chat.id);
    setTab("Chat");
  };
  const newChat = () => {
    const chat = makeChat();
    persistChats([chat, ...chats]);
    setActiveChatId(chat.id);
    setDraft("");
    setTab("Chat");
  };
  const sendMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const chat = activeChat || makeChat();
    const message = { role: "user", text, at: new Date().toISOString() };
    const reply = {
      role: "assistant",
      text: "Your message is saved in this chat. Finance AI responses will be available when the workspace’s AI service is connected.",
      at: new Date().toISOString(),
      pending: true,
    };
    const updated = { ...chat, title: chat.messages.length ? chat.title : text.slice(0, 42), updated: new Date().toISOString(), messages: [...chat.messages, message, reply] };
    persistChats([updated, ...chats.filter((item) => item.id !== updated.id)]);
    setActiveChatId(updated.id);
    setDraft("");
  };
  const togglePlugin = (name) => {
    const next = plugins.includes(name) ? plugins.filter((item) => item !== name) : [...plugins, name];
    setPlugins(next);
    localStorage.setItem(PLUGIN_KEY, JSON.stringify(next));
  };
  const saveAnswer = () => {
    const answer = selectedAnswer === "Something else" ? customAnswer.trim() : selectedAnswer;
    if (!answer) return;
    const next = [...answers, { question: QUESTIONS[questionIndex].prompt, answer, at: new Date().toISOString() }];
    setAnswers(next);
    localStorage.setItem(ANSWER_KEY, JSON.stringify(next));
    setNotice("Preference saved for this browser.");
    setSelectedAnswer("");
    setCustomAnswer("");
    setQuestionIndex((questionIndex + 1) % QUESTIONS.length);
    window.setTimeout(() => setNotice(""), 3500);
  };
  const moveLayout = (index, direction) => {
    const next = [...layoutDraft];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setLayoutDraft(next);
  };
  const toggleLayoutItem = (id) => setLayoutDraft((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const saveLayout = () => {
    onLayoutChange(layoutDraft);
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layoutDraft));
    setNotice("Dashboard layout saved.");
    window.setTimeout(() => setNotice(""), 3500);
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full border border-violet-200/30 bg-[#211b30] px-5 py-3 text-xs font-semibold text-white shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition hover:bg-[#2b2340] max-[600px]:bottom-4 max-[600px]:right-4" aria-expanded={open}>
        {open ? <FaTimes /> : <FaComments className="text-violet-200" />}{open ? "Close finance tools" : "Ask Finance AI"}
      </button>
      {open && <section className="fixed bottom-24 right-6 z-40 flex h-[min(690px,calc(100vh-9rem))] w-[min(900px,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#12111a] shadow-[0_28px_90px_rgba(0,0,0,0.6)] max-[600px]:bottom-[4.5rem] max-[600px]:right-3 max-[600px]:h-[min(760px,calc(100vh-6rem))] max-[600px]:w-[calc(100vw-1.5rem)]" aria-label="Finance AI workspace tools">
        <aside className="flex w-52 shrink-0 flex-col border-r border-white/[0.07] bg-[#171620] p-3 max-[600px]:w-[62px] max-[600px]:items-center max-[600px]:px-1.5">
          <p className="mb-3 px-2 text-[9px] font-bold tracking-[0.14em] text-[#777285] max-[600px]:hidden">FINANCE TOOLS</p>
          {[ ["Chat", FaComments] ].map(([label, Icon]) => <button key={label} type="button" onClick={() => setTab(label)} className={`mb-1 flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-[11px] transition max-[600px]:w-10 max-[600px]:justify-center max-[600px]:px-0 ${tab === label ? "bg-violet-300/10 font-semibold text-violet-200" : "text-[#9995a8] hover:bg-white/[0.04] hover:text-white"}`} title={label}><Icon /> <span className="max-[600px]:hidden">{label}</span></button>)}
          <div className="my-3 border-t border-white/[0.07] max-[600px]:w-full" />
          <button type="button" onClick={() => setHistoryOpen(!historyOpen)} className="flex items-center gap-2 px-2 py-2 text-[9px] font-bold tracking-[0.12em] text-[#777285] max-[600px]:hidden"><FaChevronDown className={`transition ${historyOpen ? "" : "-rotate-90"}`} /> RECENT CHATS</button>
          {historyOpen && <div className="min-h-0 flex-1 overflow-y-auto max-[600px]:hidden">{chats.map((chat) => <button key={chat.id} type="button" onClick={() => selectChat(chat)} className={`mb-1 w-full truncate rounded-lg px-2.5 py-2 text-left text-[10px] ${activeChatId === chat.id ? "bg-white/[0.06] text-white" : "text-[#9995a8] hover:bg-white/[0.04]"}`}>{chat.title}</button>)}</div>}
          <button type="button" onClick={newChat} className="mt-auto flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 text-[10px] text-[#c5c0d0] hover:bg-white/[0.04]" title="New chat"><FaPlus /><span className="max-[600px]:hidden">New chat</span></button>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 max-[600px]:px-3">
            <div><h2 className="m-0 text-sm font-semibold text-white">{tab === "Chat" ? (activeChat?.title || "Finance AI") : tab === "Questions" ? "Help us work your way" : tab === "Plugins" ? "Connect your finance tools" : "Arrange your dashboard"}</h2><p className="mb-0 mt-1 text-[10px] text-[#777285]">{tab === "Chat" ? "Your finance conversations, in one place" : tab === "Questions" ? "Choose options or write your own answer" : tab === "Plugins" ? "Connections are planned here; none are active yet" : "Choose widgets and set their order"}</p></div>
            <button type="button" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg text-[#9995a8] hover:bg-white/[0.06] hover:text-white" aria-label="Close finance tools"><FaTimes /></button>
          </header>
          {notice && <p role="status" className="mx-4 mt-3 rounded-lg border border-violet-300/20 bg-violet-300/[0.06] px-3 py-2 text-[10px] text-violet-100">{notice}</p>}
          {tab === "Chat" && <>
            <div className="flex-1 space-y-3 overflow-y-auto p-5 max-[600px]:p-3">
              {!activeChat?.messages?.length ? <div className="mx-auto mt-8 max-w-md text-center"><span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-violet-300/10 text-violet-200"><FaComments /></span><h3 className="m-0 text-base font-semibold">What would you like to understand?</h3><p className="mb-5 mt-2 text-xs leading-5 text-[#9995a8]">Ask about cash flow, invoices, bills, spending, or finance operations. Previous conversations stay in Recent chats.</p><div className="grid gap-2 text-left">{["What should I review in my finances each week?", "How can I prepare for a cash flow review?", "Help me plan a simple expense policy"].map((prompt) => <button key={prompt} type="button" onClick={() => setDraft(prompt)} className="rounded-lg border border-white/[0.08] px-3 py-2.5 text-[10px] text-[#c5c0d0] hover:border-violet-300/30 hover:text-white">{prompt}<FaChevronRight className="float-right mt-0.5 text-[#777285]" /></button>)}</div></div> : activeChat.messages.map((message, index) => <div key={`${message.at}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-5 ${message.role === "user" ? "bg-violet-300 text-[#171222]" : "border border-white/[0.07] bg-[#1a1923] text-[#d3cfdd]"}`}><p className="m-0">{message.text}</p>{message.pending && <span className="mt-2 block text-[9px] opacity-60">Saved · awaiting AI connection</span>}</div></div>)}
            </div>
            <form onSubmit={sendMessage} className="border-t border-white/[0.07] p-4 max-[600px]:p-3"><div className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#1a1923] p-2"><textarea rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask about your finance work…" className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-xs text-white outline-none placeholder:text-[#777285]" /><button type="submit" disabled={!draft.trim()} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-300 text-[#171222] disabled:opacity-40" aria-label="Save message"><FaPaperPlane /></button></div><p className="mb-0 mt-2 text-[9px] text-[#777285]">Chats are saved in this browser. AI replies require a connected finance service.</p></form>
          </>}
          {tab === "Questions" && <div className="flex-1 overflow-y-auto p-5 max-[600px]:p-3">
            <div className="mx-auto max-w-xl"><p className="mb-2 text-[9px] font-bold tracking-[0.14em] text-violet-300">QUESTION {questionIndex + 1} OF {QUESTIONS.length}</p><h3 className="mb-2 mt-0 text-lg font-semibold">{QUESTIONS[questionIndex].prompt}</h3><p className="mb-5 text-xs text-[#9995a8]">Your selections help shape what appears in your finance workspace.</p><div className="space-y-2">{QUESTIONS[questionIndex].options.map((option) => <button type="button" key={option} onClick={() => setSelectedAnswer(option)} className={`flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 text-left text-xs ${selectedAnswer === option ? "border-violet-300/40 bg-violet-300/[0.08] text-white" : "border-white/[0.08] bg-[#171620] text-[#c5c0d0] hover:border-white/20"}`}><span className={`grid h-4 w-4 place-items-center rounded-full border ${selectedAnswer === option ? "border-violet-300 bg-violet-300" : "border-white/20"}`}>{selectedAnswer === option && <i className="h-1.5 w-1.5 rounded-full bg-[#171222]" />}</span>{option}</button>)}</div>{selectedAnswer === "Something else" && <textarea value={customAnswer} onChange={(e) => setCustomAnswer(e.target.value)} placeholder="Type your answer…" className="mt-3 min-h-24 w-full rounded-xl border border-white/10 bg-[#171620] p-3 text-xs text-white outline-none focus:border-violet-300/40" />}
              <div className="mt-5 flex items-center justify-between"><span className="text-[10px] text-[#777285]">{answers.length} preference(s) saved</span><button type="button" disabled={!selectedAnswer || (selectedAnswer === "Something else" && !customAnswer.trim())} onClick={saveAnswer} className="rounded-lg bg-violet-300 px-4 py-2.5 text-[10px] font-bold text-[#171222] disabled:opacity-40">Save answer <FaChevronRight className="ml-2 inline" /></button></div>
              {answers.length > 0 && <div className="mt-8 border-t border-white/[0.07] pt-5"><h4 className="mb-3 text-xs font-semibold">Your saved preferences</h4>{answers.slice(-4).reverse().map((item, index) => <div key={`${item.at}-${index}`} className="mb-2 rounded-lg bg-white/[0.03] p-3"><p className="m-0 text-[10px] text-[#777285]">{item.question}</p><p className="mb-0 mt-1 text-xs text-white">{item.answer}</p></div>)}</div>}
            </div>
          </div>}
          {tab === "Plugins" && <div className="flex-1 overflow-y-auto p-5 max-[600px]:p-3"><div className="mb-4 rounded-xl border border-amber-200/10 bg-amber-200/[0.035] p-3 text-[10px] leading-5 text-[#c5c0d0]">Choose the integrations you’d like to use. These are saved as setup preferences only; no accounts are connected and no data is being shared.</div><div className="grid gap-3 sm:grid-cols-2">{INTEGRATIONS.map(([name, description, category]) => { const selected = plugins.includes(name); return <article key={name} className="rounded-xl border border-white/[0.08] bg-[#171620] p-4"><div className="flex items-start justify-between gap-2"><div><span className="mb-2 inline-block rounded bg-white/[0.05] px-2 py-1 text-[8px] uppercase tracking-wider text-[#9995a8]">{category}</span><h3 className="m-0 text-xs font-semibold text-white">{name}</h3></div><span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-300/10 text-violet-200"><FaPlug /></span></div><p className="mb-4 mt-2 min-h-8 text-[10px] leading-4 text-[#9995a8]">{description}</p><button type="button" onClick={() => togglePlugin(name)} className={`w-full rounded-lg border px-3 py-2 text-[10px] ${selected ? "border-violet-300/30 bg-violet-300/[0.08] text-violet-200" : "border-white/10 text-[#c5c0d0] hover:bg-white/[0.04]"}`}>{selected ? "Added to setup" : "Add to setup"}</button></article>; })}</div></div>}
          {tab === "Layout" && <div className="flex-1 overflow-y-auto p-5 max-[600px]:p-3"><div className="mx-auto max-w-xl"><p className="mb-5 text-xs leading-5 text-[#9995a8]">Choose which dashboard blocks to show, then move them into the order that works for you. The overview updates when you save.</p>{LAYOUT_ITEMS.map(([id, label]) => { const index = layoutDraft.indexOf(id); const enabled = index !== -1; return <div key={id} className="mb-2 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#171620] p-3"><button type="button" onClick={() => toggleLayoutItem(id)} className={`grid h-5 w-5 shrink-0 place-items-center rounded border ${enabled ? "border-violet-300 bg-violet-300 text-[#171222]" : "border-white/20"}`} aria-label={`${enabled ? "Hide" : "Show"} ${label}`}>{enabled && <FaCheck className="text-[9px]" />}</button><span className={`min-w-0 flex-1 text-xs ${enabled ? "text-white" : "text-[#777285]"}`}>{label}</span><button type="button" disabled={!enabled || index === 0} onClick={() => moveLayout(index, -1)} className="grid h-8 w-8 place-items-center rounded-lg text-[#9995a8] hover:bg-white/[0.05] disabled:opacity-30" aria-label={`Move ${label} up`}><FaArrowUp /></button><button type="button" disabled={!enabled || index === layoutDraft.length - 1} onClick={() => moveLayout(index, 1)} className="grid h-8 w-8 place-items-center rounded-lg text-[#9995a8] hover:bg-white/[0.05] disabled:opacity-30" aria-label={`Move ${label} down`}><FaArrowDown /></button></div>; })}<button type="button" onClick={saveLayout} className="mt-4 rounded-lg bg-violet-300 px-4 py-2.5 text-[10px] font-bold text-[#171222]">Save dashboard layout</button></div></div>}
        </div>
      </section>}
    </>
  );
}
