import { useState } from "react";
import { FaArrowRight, FaCommentDots, FaPlus, FaRegStickyNote, FaTimes } from "react-icons/fa";

const CHAT_KEY = "zengen-personal-assistant-chats";

function readChats() {
  try {
    return JSON.parse(localStorage.getItem(CHAT_KEY)) || [];
  } catch {
    return [];
  }
}

function sampleReply(message) {
  const text = message.toLowerCase();
  if (text.includes("plan") || text.includes("priorit")) {
    return "Let’s make it manageable: choose one important outcome, one smaller task, and one thing that can wait. What’s the main thing you want done today?";
  }
  if (text.includes("stress") || text.includes("overwhelm") || text.includes("tired")) {
    return "That sounds like a lot to carry. You don’t have to solve everything at once. What’s one small thing that would make the next hour easier?";
  }
  if (text.includes("remind") || text.includes("remember")) {
    return "I’ve noted that in this chat. You can also save it as a reminder from your workspace so it appears in your day plan.";
  }
  return "Thanks for sharing that with me. We can break it into a next step, make a simple plan, or just talk it through. What would feel most helpful?";
}

export default function AssistantChatPopup({ onClose, thoughts = [] }) {
  const [chats, setChats] = useState(readChats);
  const [activeId, setActiveId] = useState(() => readChats()[0]?.id || null);
  const [draft, setDraft] = useState("");
  const activeChat = chats.find((chat) => chat.id === activeId) || null;

  function persist(next) {
    setChats(next);
    localStorage.setItem(CHAT_KEY, JSON.stringify(next));
  }

  function send(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const now = new Date().toISOString();
    const userMessage = { id: `${Date.now()}-user`, role: "user", text, at: now };
    const assistantMessage = { id: `${Date.now()}-assistant`, role: "assistant", text: sampleReply(text), at: now };
    const existing = activeChat || {
      id: `${Date.now()}`,
      title: text.length > 42 ? `${text.slice(0, 42)}…` : text,
      updatedAt: now,
      messages: [],
    };
    const updated = { ...existing, updatedAt: now, messages: [...existing.messages, userMessage, assistantMessage] };
    const next = [updated, ...chats.filter((chat) => chat.id !== existing.id)];
    persist(next);
    setActiveId(existing.id);
    setDraft("");
  }

  function startNewChat() {
    setActiveId(null);
    setDraft("");
  }

  function addThoughtToDraft(thought) {
    setDraft((current) => current ? `${current}\n${thought}` : thought);
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm max-[600px]:p-2" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="assistant-chat-title" className="my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#171620] p-6 shadow-2xl max-[600px]:max-h-[calc(100vh-1rem)] max-[600px]:p-3">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div><p className="mb-1 text-[9px] font-bold tracking-[0.16em] text-violet-300">YOUR PERSONAL ASSISTANT</p><h2 id="assistant-chat-title" className="m-0 font-display text-xl font-bold text-white">Ask me</h2><p className="mb-0 mt-1 text-[10px] text-[#9995a8]">Talk through a plan, share what’s on your mind, or ask for help.</p></div>
        <button type="button" onClick={onClose} aria-label="Close chat" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#9995a8] hover:bg-white/[0.06] hover:text-white"><FaTimes /></button>
      </header>
      <div className="grid h-[min(65vh,600px)] min-h-[360px] gap-4 md:grid-cols-[230px_minmax(0,1fr)] max-[600px]:min-h-[300px]">
        <aside className="hidden min-h-0 flex-col gap-4 overflow-hidden md:flex">
          <section className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-white/[0.07] bg-[#111018] p-3">
            <div className="mb-3 flex items-center justify-between gap-2"><h3 className="m-0 text-[10px] font-semibold text-white">Previous chats</h3><button type="button" onClick={startNewChat} aria-label="Start a new chat" className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 text-violet-200 hover:bg-violet-300/10"><FaPlus /></button></div>
            {chats.length ? <div className="space-y-1">{chats.map((chat) => <button key={chat.id} type="button" onClick={() => setActiveId(chat.id)} className={`w-full rounded-lg px-2.5 py-2 text-left text-[9px] leading-4 ${activeId === chat.id ? "bg-violet-300/10 text-violet-100" : "text-[#9995a8] hover:bg-white/[0.04] hover:text-white"}`}>{chat.title}</button>)}</div> : <p className="m-0 text-[9px] leading-4 text-[#777285]">Your conversations will appear here.</p>}
          </section>
          <section className="max-h-[42%] overflow-y-auto rounded-xl border border-white/[0.07] bg-[#111018] p-3">
            <h3 className="mb-2 mt-0 flex items-center gap-2 text-[10px] font-semibold text-white"><FaRegStickyNote className="text-violet-200" /> Your thoughts</h3>
            {thoughts.length ? <div className="space-y-2">{thoughts.slice(0, 8).map((thought) => <button key={thought.id} type="button" onClick={() => addThoughtToDraft(thought.text)} className="block w-full rounded-lg bg-white/[0.03] p-2 text-left text-[9px] leading-4 text-[#aaa5b7] hover:bg-white/[0.06]">{thought.text}</button>)}</div> : <p className="m-0 text-[9px] leading-4 text-[#777285]">Thoughts you capture will be listed here.</p>}
          </section>
        </aside>

        <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
          <button type="button" onClick={startNewChat} className="shrink-0 rounded-full border border-white/10 px-3 py-2 text-[9px] text-violet-200">+ New chat</button>
          {chats.map((chat) => <button key={chat.id} type="button" onClick={() => setActiveId(chat.id)} className={`max-w-40 shrink-0 truncate rounded-full border px-3 py-2 text-[9px] ${activeId === chat.id ? "border-violet-300/30 bg-violet-300/10 text-white" : "border-white/10 text-[#9995a8]"}`}>{chat.title}</button>)}
          {thoughts.map((thought) => <button key={thought.id} type="button" onClick={() => addThoughtToDraft(thought.text)} className="max-w-40 shrink-0 truncate rounded-full border border-white/10 px-3 py-2 text-[9px] text-[#9995a8]">Thought · {thought.text}</button>)}
        </div>

        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-[#111018]">
          <header className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
            <div className="flex min-w-0 items-center gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-300/10 text-violet-200"><FaCommentDots /></span><div className="min-w-0"><p className="m-0 truncate text-[10px] font-semibold text-white">{activeChat?.title || "A fresh conversation"}</p><p className="m-0 mt-0.5 text-[8px] text-[#777285]">Local chat preview · no AI service connected</p></div></div>
            <button type="button" onClick={startNewChat} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 text-[9px] text-[#c5c0d0] hover:bg-white/[0.04]"><FaPlus /> New chat</button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {!activeChat?.messages.length ? <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-violet-300/10 text-lg text-violet-200"><FaCommentDots /></span>
              <h3 className="m-0 text-xs font-semibold text-white">What’s on your mind?</h3>
              <p className="mb-4 mt-2 max-w-sm text-[9px] leading-4 text-[#9995a8]">Ask me to help shape your day, work through an idea, or turn a thought into a next step.</p>
              <div className="flex flex-wrap justify-center gap-2">{["Help me plan today", "I have too much on my mind", "Help me find a first step"].map((prompt) => <button key={prompt} type="button" onClick={() => setDraft(prompt)} className="rounded-full border border-white/10 px-3 py-2 text-[9px] text-[#c5c0d0] hover:border-violet-300/30 hover:text-white">{prompt}</button>)}</div>
            </div> : activeChat.messages.map((message) => <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><p className={`m-0 max-w-[85%] whitespace-pre-wrap rounded-xl px-3.5 py-2.5 text-[10px] leading-5 ${message.role === "user" ? "bg-violet-300 text-[#171222]" : "border border-white/[0.07] bg-[#191823] text-[#d1cddd]"}`}>{message.text}</p></div>)}
          </div>
          <form onSubmit={send} className="border-t border-white/[0.07] p-3">
            <label className="sr-only" htmlFor="assistant-chat-message">Ask your assistant</label>
            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#171620] p-2 focus-within:border-violet-300/35"><textarea id="assistant-chat-message" rows={2} maxLength={2000} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder="Ask me anything…" className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-1 text-[10px] text-white outline-none placeholder:text-[#706b80]" /><button disabled={!draft.trim()} type="submit" aria-label="Send message" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-300 text-[#171222] hover:bg-violet-200 disabled:opacity-40"><FaArrowRight /></button></div>
            <p className="mb-0 mt-2 text-center text-[8px] text-[#706b80]">Replies are sample guidance until the assistant backend is connected.</p>
          </form>
        </section>
      </div>
      </section>
    </div>
  );
}
