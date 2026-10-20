import { useCallback, useEffect, useRef, useState } from "react";
import { chatApi } from "../../api/chat";
import { apiErrorMessage } from "../../api/client";
import {
  FaChevronDown,
  FaChevronRight,
  FaComments,
  FaPlug,
  FaPlus,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";

const ANSWER_KEY = "zengen-finance-questions";
const CHAT_KEY = "zengen-finance-chats";
const PLUGIN_KEY = "zengen-finance-integrations";
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

export default function FinanceCompanionTools() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("Chat");
  const [chats, setChats] = useState([]);
  const activeChatIdRef = useRef(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [plugins, setPlugins] = useState(() => readStored(PLUGIN_KEY, []));
  const [answers, setAnswers] = useState(() => readStored(ANSWER_KEY, []));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [customAnswer, setCustomAnswer] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [followUps, setFollowUps] = useState([]);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const convs = await chatApi.listConversations();
      const localChats = readStored(CHAT_KEY, []).map((chat) => ({ ...chat, legacy: true }));
      setChats([...convs, ...localChats]);
      if (convs.length > 0 && !activeChatIdRef.current) {
        activeChatIdRef.current = convs[0].id;
        setActiveChatId(convs[0].id);
        const messages = await chatApi.getMessages(convs[0].id);
        const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");
        setFollowUps(lastAssistant?.metadata?.follow_up_questions || []);
        setChats((prev) => prev.map((chat) => chat.id === convs[0].id
          ? { ...chat, messages: messages.map((message) => ({ ...message, text: message.content, at: message.created_at })) }
          : chat));
      }
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to load finance conversations."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const selectChat = async (chat) => {
    activeChatIdRef.current = chat.id;
    setActiveChatId(chat.id);
    setTab("Chat");
    setError(null);
    setFollowUps(chat.messages?.slice().reverse().find((message) => message.role === "assistant")?.metadata?.follow_up_questions || []);
    if (chat.legacy) return;
    try {
      const msgs = await chatApi.getMessages(chat.id);
      const lastAssistant = [...msgs].reverse().find((message) => message.role === "assistant");
      setFollowUps(lastAssistant?.metadata?.follow_up_questions || []);
      setChats((prev) => prev.map((c) => (c.id === chat.id
        ? { ...c, messages: msgs.map((message) => ({ ...message, text: message.content, at: message.created_at })) }
        : c)));
    } catch (err) {
      setError(apiErrorMessage(err, "Could not load messages for this conversation."));
    }
  };

  const newChat = async () => {
    setLoading(true);
    setError(null);
    try {
      const conv = await chatApi.createConversation("New finance chat");
      setChats((prev) => [conv, ...prev]);
      activeChatIdRef.current = conv.id;
      setActiveChatId(conv.id);
      setFollowUps([]);
      setDraft("");
      setTab("Chat");
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to create a new finance conversation."));
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (event, override = {}) => {
    event?.preventDefault();
    const text = override.message ?? draft.trim();
    if (!text || loading) return;
    setLoading(true);
    setError(null);
    setDraft("");
    let conversationId = activeChat?.legacy ? null : activeChatId;
    if (!conversationId) {
      try {
        const conversation = await chatApi.createConversation(text.slice(0, 42) || "New finance chat");
        conversationId = conversation.id;
        activeChatIdRef.current = conversationId;
        setActiveChatId(conversationId);
        setChats((prev) => [conversation, ...prev]);
      } catch (err) {
        setDraft(text);
        setError(apiErrorMessage(err, "Could not start a finance conversation."));
        setLoading(false);
        return;
      }
    }
    const optimisticUserMessage = { role: "user", text, at: new Date().toISOString(), pending: true };
    setChats((prev) => prev.map((chat) => chat.id === conversationId
      ? { ...chat, messages: [...(chat.messages || []), optimisticUserMessage] }
      : chat));
    try {
      const result = await chatApi.sendMessage({
        conversation_id: conversationId,
        message: text,
        ...(override.attachDocumentId ? { attach_document_id: override.attachDocumentId } : {}),
      });
      setFollowUps(result.needs_more_info ? result.follow_up_questions || [] : []);
      const timestamp = new Date().toISOString();
      setChats((prev) => prev.map((chat) => chat.id === result.conversation_id
        ? {
          ...chat,
          title: chat.title === "New finance chat" ? text.slice(0, 42) : chat.title,
          updated_at: timestamp,
          messages: [
            ...(chat.messages || []).filter((message) => !message.pending),
            { role: "user", text, at: timestamp },
            { id: result.message_id, role: "assistant", text: result.reply, at: timestamp, message_type: result.message_type, metadata: result.metadata },
          ],
        }
        : chat));
      setActiveChatId(result.conversation_id);
      activeChatIdRef.current = result.conversation_id;
    } catch (err) {
      setChats((prev) => prev.map((chat) => chat.id === conversationId
        ? { ...chat, messages: (chat.messages || []).filter((message) => !message.pending) }
        : chat));
      setDraft(text);
      setError(apiErrorMessage(err, "Finance AI could not answer. Check your connection and try again."));
    } finally {
      setLoading(false);
    }
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
          {error && tab === "Chat" && <p role="alert" className="mx-4 mt-3 rounded-lg border border-rose-300/20 bg-rose-300/[0.06] px-3 py-2 text-[10px] text-rose-200">{error}</p>}
          {tab === "Chat" && <>
            <div className="flex-1 space-y-3 overflow-y-auto p-5 max-[600px]:p-3">
              {!activeChat?.messages?.length ? <div className="mx-auto mt-8 max-w-md text-center"><span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-violet-300/10 text-violet-200"><FaComments /></span><h3 className="m-0 text-base font-semibold">What would you like to understand?</h3><p className="mb-5 mt-2 text-xs leading-5 text-[#9995a8]">Ask about cash flow, invoices, bills, spending, or finance operations. Previous conversations stay in Recent chats.</p><div className="grid gap-2 text-left">{["What should I review in my finances each week?", "How can I prepare for a cash flow review?", "Help me plan a simple expense policy"].map((prompt) => <button key={prompt} type="button" onClick={() => setDraft(prompt)} className="rounded-lg border border-white/[0.08] px-3 py-2.5 text-[10px] text-[#c5c0d0] hover:border-violet-300/30 hover:text-white">{prompt}<FaChevronRight className="float-right mt-0.5 text-[#777285]" /></button>)}</div></div> : activeChat.messages.map((message, index) => <div key={`${message.at}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-5 ${message.role === "user" ? "bg-violet-300 text-[#171222]" : "border border-white/[0.07] bg-[#1a1923] text-[#d3cfdd]"}`}><p className="m-0">{message.text}</p>{message.pending && <span className="mt-2 block text-[9px] opacity-60">Sending…</span>}</div></div>)}
            </div>
            {followUps.length > 0 && <div className="border-t border-white/[0.07] px-4 py-3"><div className="space-y-3">{followUps.map((question) => <div key={question.id}><p className="mb-2 text-[10px] font-medium text-violet-100">{question.question}</p><div className="flex flex-wrap gap-2">{question.choices?.map((choice) => <button key={choice.document_id || choice.value} type="button" disabled={loading} onClick={() => sendMessage(null, choice.document_id ? { message: question.original_question, attachDocumentId: choice.document_id } : { message: choice.value })} className="rounded-full border border-violet-300/20 bg-violet-300/[0.06] px-3 py-1.5 text-[9px] text-violet-100 hover:border-violet-300/50 disabled:opacity-50">{choice.label}</button>)}</div></div>)}</div></div>}
            <form onSubmit={sendMessage} className="border-t border-white/[0.07] p-4 max-[600px]:p-3">
              {error && <p role="alert" className="mb-2 rounded-lg border border-rose-300/20 bg-rose-300/[0.06] px-3 py-2 text-[10px] text-rose-200">{error}</p>}
              <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#1a1923] p-2">
                <textarea rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask about your finance work…" className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-xs text-white outline-none placeholder:text-[#777285]" disabled={loading} />
                <button type="submit" disabled={!draft.trim() || loading} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-300 text-[#171222] disabled:opacity-40" aria-label="Send message"><FaPaperPlane /></button>
              </div>
              <p className="mb-0 mt-2 text-[9px] text-[#777285]">Finance documents are searched automatically when your question needs them.</p>
            </form>
          </>}
          {tab === "Questions" && <div className="flex-1 overflow-y-auto p-5 max-[600px]:p-3">
            <div className="mx-auto max-w-xl"><p className="mb-2 text-[9px] font-bold tracking-[0.14em] text-violet-300">QUESTION {questionIndex + 1} OF {QUESTIONS.length}</p><h3 className="mb-2 mt-0 text-lg font-semibold">{QUESTIONS[questionIndex].prompt}</h3><p className="mb-5 text-xs text-[#9995a8]">Your selections help shape what appears in your finance workspace.</p><div className="space-y-2">{QUESTIONS[questionIndex].options.map((option) => <button type="button" key={option} onClick={() => setSelectedAnswer(option)} className={`flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 text-left text-xs ${selectedAnswer === option ? "border-violet-300/40 bg-violet-300/[0.08] text-white" : "border-white/[0.08] bg-[#171620] text-[#c5c0d0] hover:border-white/20"}`}><span className={`grid h-4 w-4 place-items-center rounded-full border ${selectedAnswer === option ? "border-violet-300 bg-violet-300" : "border-white/20"}`}>{selectedAnswer === option && <i className="h-1.5 w-1.5 rounded-full bg-[#171222]" />}</span>{option}</button>)}</div>{selectedAnswer === "Something else" && <textarea value={customAnswer} onChange={(e) => setCustomAnswer(e.target.value)} placeholder="Type your answer…" className="mt-3 min-h-24 w-full rounded-xl border border-white/10 bg-[#171620] p-3 text-xs text-white outline-none focus:border-violet-300/40" />}
              <div className="mt-5 flex items-center justify-between"><span className="text-[10px] text-[#777285]">{answers.length} preference(s) saved</span><button type="button" disabled={!selectedAnswer || (selectedAnswer === "Something else" && !customAnswer.trim())} onClick={saveAnswer} className="rounded-lg bg-violet-300 px-4 py-2.5 text-[10px] font-bold text-[#171222] disabled:opacity-40">Save answer <FaChevronRight className="ml-2 inline" /></button></div>
              {answers.length > 0 && <div className="mt-8 border-t border-white/[0.07] pt-5"><h4 className="mb-3 text-xs font-semibold">Your saved preferences</h4>{answers.slice(-4).reverse().map((item, index) => <div key={`${item.at}-${index}`} className="mb-2 rounded-lg bg-white/[0.03] p-3"><p className="m-0 text-[10px] text-[#777285]">{item.question}</p><p className="mb-0 mt-1 text-xs text-white">{item.answer}</p></div>)}</div>}
            </div>
          </div>}
          {tab === "Plugins" && <div className="flex-1 overflow-y-auto p-5 max-[600px]:p-3"><div className="mb-4 rounded-xl border border-amber-200/10 bg-amber-200/[0.035] p-3 text-[10px] leading-5 text-[#c5c0d0]">Choose the integrations you’d like to use. These are saved as setup preferences only; no accounts are connected and no data is being shared.</div><div className="grid gap-3 sm:grid-cols-2">{INTEGRATIONS.map(([name, description, category]) => { const selected = plugins.includes(name); return <article key={name} className="rounded-xl border border-white/[0.08] bg-[#171620] p-4"><div className="flex items-start justify-between gap-2"><div><span className="mb-2 inline-block rounded bg-white/[0.05] px-2 py-1 text-[8px] uppercase tracking-wider text-[#9995a8]">{category}</span><h3 className="m-0 text-xs font-semibold text-white">{name}</h3></div><span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-300/10 text-violet-200"><FaPlug /></span></div><p className="mb-4 mt-2 min-h-8 text-[10px] leading-4 text-[#9995a8]">{description}</p><button type="button" onClick={() => togglePlugin(name)} className={`w-full rounded-lg border px-3 py-2 text-[10px] ${selected ? "border-violet-300/30 bg-violet-300/[0.08] text-violet-200" : "border-white/10 text-[#c5c0d0] hover:bg-white/[0.04]"}`}>{selected ? "Added to setup" : "Add to setup"}</button></article>; })}</div></div>}
        </div>
      </section>}
    </>
  );
}
