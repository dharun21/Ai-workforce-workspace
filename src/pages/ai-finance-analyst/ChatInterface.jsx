import { useEffect, useRef, useState } from "react";
import { FaComments, FaPaperPlane, FaPlus, FaTrash } from "react-icons/fa";
import { apiErrorMessage } from "../../api/client";
import { chatApi } from "../../api/chat";

function cleanDisplayText(value) {
  return String(value ?? "")
    .replaceAll("â€™", "'")
    .replaceAll("Â·", "|")
    .replaceAll("â€¦", "...")
    .replaceAll("â€“", "-")
    .replaceAll("â€”", "-");
}

export default function ChatInterface({ onProfileComplete }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [visibleSuggestionMessageId, setVisibleSuggestionMessageId] = useState(null);
  const [input, setInput] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const skipLoadRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    chatApi.listConversations()
      .then((items) => {
        if (!cancelled) {
          setConversations(items);
        }
      })
      .catch((err) => { if (!cancelled) setError(apiErrorMessage(err, "Could not load conversations.")); })
      .finally(() => { if (!cancelled) setInitialLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      setVisibleSuggestionMessageId(null);
      return undefined;
    }
    if (skipLoadRef.current === activeConversationId) {
      skipLoadRef.current = null;
      return undefined;
    }
    let cancelled = false;
    chatApi.getMessages(activeConversationId)
      .then((items) => {
        if (cancelled) return;
        setMessages(items);
        const latestSuggestion = [...items].reverse().find((item) => (
          item.role === "assistant" && item.metadata?.suggestion_version === 2
        ));
        setVisibleSuggestionMessageId(latestSuggestion?.id || null);
      })
      .catch((err) => { if (!cancelled) setError(apiErrorMessage(err, "Could not load this conversation.")); });
    return () => { cancelled = true; };
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createConversation = async () => {
    setError("");
    try {
      const conversation = await chatApi.createConversation("New finance chat");
      setConversations((prev) => [conversation, ...prev]);
      setMessages([]);
      setVisibleSuggestionMessageId(null);
      setActiveConversationId(conversation.id);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not create a conversation."));
    }
  };

  const sendMessage = async (event, override = {}) => {
    event?.preventDefault();
    const message = override.message ?? input.trim();
    if (!message || sending) return;
    setVisibleSuggestionMessageId(null);
    setInput("");
    setSending(true);
    setError("");
    const userMessage = { role: "user", content: message, created_at: new Date().toISOString(), pending: true };
    setMessages((prev) => [...prev, userMessage]);
    try {
      const result = await chatApi.sendMessage({
        conversation_id: activeConversationId,
        message,
        ...(override.attachDocumentId ? { attach_document_id: override.attachDocumentId } : {}),
      });
      const nextMessages = [
        ...messages.filter((item) => !item.pending),
        { role: "user", content: message, created_at: new Date().toISOString() },
        {
          id: result.message_id,
          role: "assistant",
          content: result.reply,
          message_type: result.message_type,
          metadata: {
            ...result.metadata,
            suggested_questions: result.suggested_questions || [],
            suggestion_version: result.metadata?.suggestion_version || 2,
            follow_up_questions: result.needs_more_info ? result.follow_up_questions || [] : [],
          },
          created_at: new Date().toISOString(),
        },
      ];
      setMessages(nextMessages);
      setVisibleSuggestionMessageId(result.message_id);
      if (!activeConversationId) {
        skipLoadRef.current = result.conversation_id;
        setActiveConversationId(result.conversation_id);
        setConversations((prev) => [{ id: result.conversation_id, title: message.slice(0, 190), updated_at: new Date().toISOString() }, ...prev]);
      } else {
        setConversations((prev) => prev.map((item) => item.id === activeConversationId
          ? { ...item, title: item.title === "New conversation" ? message.slice(0, 190) : item.title, updated_at: new Date().toISOString() }
          : item));
      }
    } catch (err) {
      setMessages((prev) => prev.filter((item) => !item.pending));
      setInput(message);
      setError(apiErrorMessage(err, "Finance AI could not answer. Check the backend and try again."));
    } finally {
      setSending(false);
    }
  };

  const deleteConversation = async (id) => {
    if (!window.confirm("Delete this conversation?")) return;
    setError("");
    try {
      await chatApi.deleteConversation(id);
      const remaining = conversations.filter((item) => item.id !== id);
      setConversations(remaining);
      if (activeConversationId === id) {
        setMessages([]);
        setVisibleSuggestionMessageId(null);
        setActiveConversationId(null);
      }
    } catch (err) {
      setError(apiErrorMessage(err, "Could not delete this conversation."));
    }
  };

  const activeConversation = conversations.find((item) => item.id === activeConversationId);
  const latestModelStatus = [...messages].reverse().find(
    (item) => item.role === "assistant" && item.metadata?.local_model_status,
  )?.metadata?.local_model_status;
  const modelStatusLabel = latestModelStatus === "available"
    ? "Private local language model active"
    : latestModelStatus && !["not_used", "not_used_for_clarification", "not_used_for_deterministic_answer"].includes(latestModelStatus)
      ? "Local finance tools active | language model not connected"
      : "Private finance workspace";

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#12111a] text-white">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.07] bg-[#171620] p-3 md:flex">
        <div className="border-b border-white/[0.07] p-2">
          <h2 className="m-0 text-sm font-semibold">Finance conversations</h2>
          <button type="button" disabled={sending} onClick={createConversation} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-300 px-3 py-2 text-xs font-semibold text-[#171222] disabled:opacity-50"><FaPlus /> New chat</button>
        </div>
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto py-3">
          {conversations.map((conversation) => (
            <div key={conversation.id} className={`flex items-center gap-1 rounded-lg px-2 ${activeConversationId === conversation.id ? "bg-violet-300/10 text-violet-100" : "text-[#aaa5b8] hover:bg-white/[0.04]"}`}>
              <button type="button" disabled={sending} onClick={() => { setError(""); setActiveConversationId(conversation.id); }} className="min-w-0 flex-1 truncate py-2 text-left text-xs disabled:opacity-50">{conversation.title}</button>
              <button type="button" disabled={sending} onClick={() => deleteConversation(conversation.id)} className="grid h-7 w-7 shrink-0 place-items-center rounded text-[#777285] hover:text-rose-300 disabled:opacity-40" aria-label={`Delete ${conversation.title}`}><FaTrash size={10} /></button>
            </div>
          ))}
        </div>
      </aside>

      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <div><p className="m-0 flex items-center gap-2 text-sm font-semibold"><FaComments className="text-violet-200" /> {activeConversation?.title || "New finance chat"}</p><p className={`mb-0 mt-1 text-[10px] ${latestModelStatus === "available" ? "text-emerald-200/80" : "text-[#898496]"}`}>{modelStatusLabel} | calculations use your confirmed finance records</p></div>
          <button type="button" onClick={onProfileComplete} className="rounded-lg border border-white/10 px-3 py-2 text-[10px] text-[#c5c0d0] hover:bg-white/[0.04]">Business profile</button>
        </header>
        {initialLoading && <p className="px-5 py-3 text-xs text-[#898496]">Loading your conversations...</p>}
        {error && <p role="alert" className="mx-4 mt-3 rounded-lg border border-rose-300/20 bg-rose-300/[0.06] px-3 py-2 text-xs text-rose-200">{error}</p>}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {!messages.length && !initialLoading && <div className="mx-auto mt-8 max-w-lg text-center">
            <h2 className="text-xl font-semibold">Ask your Finance Analyst</h2>
            <p className="text-sm leading-6 text-[#aaa5b8]">Ask about confirmed income and expenses, invoices, bills, spending trends, or profit planning.</p>
            <div className="mt-5 grid gap-2 text-left">{["Summarize my confirmed income and expenses", "Which customer invoices are overdue?", "What supplier bills are due soon?", "How can I increase profit?"].map((question) => <button key={question} type="button" disabled={sending} onClick={() => sendMessage(null, { message: question })} className="rounded-xl border border-white/[0.08] px-4 py-3 text-xs text-[#d3cfdd] hover:border-violet-300/30 disabled:opacity-50">{question}</button>)}</div>
          </div>}
          {messages.map((message, index) => <div key={message.id || `${message.created_at}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className="max-w-[85%]">
            <article className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-violet-300 text-[#171222]" : "border border-white/[0.07] bg-[#1a1923] text-[#e2deeb]"}`}>
              {cleanDisplayText(message.content)}{message.pending && <span className="mt-1 block text-[10px] opacity-60">Sending...</span>}
              {message.role === "assistant" && message.metadata?.supporting_figures?.length > 0 && <div className="mt-3 border-t border-white/10 pt-2 text-[10px] text-[#aaa5b8]"><strong>Based on:</strong> {message.metadata.supporting_figures.map((item) => `${item.label}: ${item.value}`).join(" | ")}</div>}
              {message.role === "assistant" && message.metadata?.supporting_documents?.length > 0 && <div className="mt-2 text-[10px] text-[#aaa5b8]"><strong>Documents:</strong> {message.metadata.supporting_documents.map((item) => item.original_name).join(" | ")}</div>}
              {message.role === "assistant" && message.metadata?.assumptions?.map((item) => <p key={item} className="mb-0 mt-2 text-[10px] text-[#898496]">{item}</p>)}
            </article>
            {message.role === "assistant" && <div className="mt-2 space-y-2">
              {message.id === visibleSuggestionMessageId && message.metadata?.follow_up_questions?.map((question) => <div key={question.id} className="rounded-xl border border-white/[0.07] bg-[#171620] p-3"><p className="mb-2 mt-0 text-xs text-[#c5c0d0]">{question.question}</p><div className="flex flex-wrap gap-2">{question.suggested_answers?.map((answer) => <button key={answer} type="button" disabled={sending} onClick={() => sendMessage(null, { message: answer })} className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-[#c5c0d0] hover:border-violet-300/30 disabled:opacity-50">{answer}</button>)}{question.choices?.map((choice) => <button key={choice.document_id || choice.value} type="button" disabled={sending} onClick={() => sendMessage(null, choice.document_id ? { message: question.original_question, attachDocumentId: choice.document_id } : { message: choice.value })} className="rounded-full border border-violet-300/20 bg-violet-300/[0.06] px-3 py-1.5 text-[10px] text-violet-100 hover:border-violet-300/50 disabled:opacity-50">{choice.label}</button>)}</div></div>)}
              {message.id === visibleSuggestionMessageId && message.metadata?.suggestion_version === 2 && message.metadata?.suggested_questions?.length > 0 && <div className="flex flex-col items-start gap-1.5">{message.metadata.suggested_questions.map((question) => <button key={question} type="button" disabled={sending} onClick={() => sendMessage(null, { message: question })} className="rounded-full border border-white/10 bg-[#171620] px-3 py-1.5 text-left text-[10px] text-[#c5c0d0] hover:border-violet-300/30 disabled:opacity-50">{question}</button>)}</div>}
            </div>}
          </div></div>)}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="border-t border-white/[0.07] p-4">
          <div className="flex gap-2 rounded-xl border border-white/10 bg-[#1a1923] p-2"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about your finance work…" className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-[#777285]" disabled={sending} /><button type="submit" disabled={!input.trim() || sending} className="flex items-center gap-2 rounded-lg bg-violet-300 px-4 py-2 text-xs font-semibold text-[#171222] disabled:opacity-40"><FaPaperPlane /> {sending ? "Thinking" : "Send"}</button></div>
          <p className="mb-0 mt-2 text-[10px] text-[#777285]">Documents are searched automatically. No external AI API is used; when the local language model is offline, finance tools provide the answer.</p>
        </form>
      </section>
    </div>
  );
}
