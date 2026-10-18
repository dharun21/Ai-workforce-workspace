import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaCheck,
  FaChevronRight,
  FaClock,
  FaCommentDots,
  FaHeart,
  FaLightbulb,
  FaPlus,
  FaRegCalendarAlt,
  FaRegLightbulb,
  FaRegStickyNote,
  FaRegSun,
  FaSmile,
  FaTrashAlt,
} from "react-icons/fa";
import { AppLayout } from "../../components/AppLayout";
import SpecialistIcon from "../../components/SpecialistIcon";
import ReminderPopup from "./popups/ReminderPopup";
import QuickCapturePopup from "./popups/QuickCapturePopup";
import SuggestionPopup from "./popups/SuggestionPopup";
import AssistantOnboarding, { hasAssistantSetup } from "./AssistantOnboarding";
import AssistantChatPopup from "./popups/AssistantChatPopup";

const starterTasks = [
  { id: 1, label: "Choose the one thing that matters most today", complete: false },
  { id: 2, label: "Take a proper break between busy moments", complete: false },
  { id: 3, label: "Make a little progress on a personal goal", complete: false },
];

const starterReminders = [
  { id: 1, title: "Take a lunch break", when: "12:30", category: "Wellbeing", complete: false },
  {
    id: 2,
    title: "Pick up a few essentials",
    when: "4:00 PM",
    category: "Life admin",
    complete: false,
  },
];
const THOUGHTS_KEY = "zengen-personal-assistant-thoughts";

function readThoughts() {
  try {
    return JSON.parse(localStorage.getItem(THOUGHTS_KEY)) || [];
  } catch {
    return [];
  }
}

const suggestions = {
  plan: {
    title: "Make today feel manageable",
    description: "A small plan can be more useful than a perfect one.",
    answer:
      "Pick one must-do, one could-do, and one thing that can wait. Give the must-do a clear first step, then leave a little breathing room between tasks.",
    task: "Choose one must-do for today",
  },
  break: {
    title: "Find a little breathing room",
    description: "You don’t have to earn a pause by finishing everything.",
    answer:
      "Try stepping away from your screen for five minutes. Stretch, get some water, or simply let your attention rest before choosing what comes next.",
    task: "Take a five-minute reset",
  },
  steps: {
    title: "Break something down",
    description: "A task often feels lighter when the first move is small.",
    answer:
      "Write down the next visible action. Make it small enough to start in ten minutes, and let that be enough progress for now.",
    task: "Write down the next small step",
  },
  home: {
    title: "Make life admin lighter",
    description: "A tiny bit of structure can clear mental space.",
    answer:
      "Choose one errand, appointment, or message to handle. Add a time that works for you, then let the rest wait until you’re ready.",
    task: "Choose one life-admin task",
  },
  people: {
    title: "Make time for someone",
    description: "Connection can start with a small, thoughtful gesture.",
    answer:
      "Think of one person you’d like to check in with. A short message or a plan for later is a perfectly good start.",
    task: "Check in with someone I care about",
  },
  growth: {
    title: "Make room for something you enjoy",
    description: "Personal goals can be small, flexible, and just for you.",
    answer:
      "Pick something you’re curious about, then give it ten unhurried minutes. No milestone needed; showing up counts.",
    task: "Spend ten minutes on something I enjoy",
  },
};

const lifeAreas = [
  {
    id: "home",
    title: "Life admin",
    detail: "Errands, appointments, loose ends",
    icon: <FaRegCalendarAlt />,
    tone: "lavender",
  },
  {
    id: "break",
    title: "Rest & energy",
    detail: "Pauses, routines, room to reset",
    icon: <FaRegSun />,
    tone: "peach",
  },
  {
    id: "people",
    title: "People & connection",
    detail: "Reach out, make plans, stay close",
    icon: <FaHeart />,
    tone: "rose",
  },
  {
    id: "growth",
    title: "Goals & growth",
    detail: "Learning, hobbies, personal goals",
    icon: <FaLightbulb />,
    tone: "mint",
  },
];

const checkInResponses = {
  Bright: "Glad there’s some brightness today. What would help you keep a little of that feeling?",
  Okay: "An ordinary day is okay too. Choose one thing that would make today a bit easier.",
  Stretched:
    "That sounds like a lot to hold. It may help to pause and choose only the next small step.",
};

function formatClock(value) {
  if (!value || value === "Anytime") return value || "Anytime";
  if (value.includes("AM") || value.includes("PM")) return value;
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function PersonalAssistantIndex() {
  const [assistantSetup, setAssistantSetup] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("zengen-personal-assistant-setup")) || null;
    } catch {
      return null;
    }
  });
  const [assistantReady, setAssistantReady] = useState(() => hasAssistantSetup());
  const [tasks, setTasks] = useState(starterTasks);
  const [reminders, setReminders] = useState(starterReminders);
  const [checkIn, setCheckIn] = useState("");
  const [thoughts, setThoughts] = useState(readThoughts);
  const [savedTip, setSavedTip] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const completedCount = tasks.filter((task) => task.complete).length;
  const openReminders = reminders.filter((reminder) => !reminder.complete).length;
  const today = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }),
    [],
  );

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, complete: !task.complete } : task)),
    );
  }

  function toggleReminder(id) {
    setReminders((current) =>
      current.map((reminder) =>
        reminder.id === id ? { ...reminder, complete: !reminder.complete } : reminder,
      ),
    );
  }

  function addReminder(reminder) {
    setReminders((current) => [...current, reminder]);
    setIsReminderOpen(false);
  }

  function addCapturedThought(thought) {
    const next = [{ id: `${Date.now()}`, text: thought, createdAt: new Date().toISOString() }, ...thoughts];
    setThoughts(next);
    localStorage.setItem(THOUGHTS_KEY, JSON.stringify(next));
    setIsCaptureOpen(false);
  }

  function removeThought(id) {
    const next = thoughts.filter((thought) => thought.id !== id);
    setThoughts(next);
    localStorage.setItem(THOUGHTS_KEY, JSON.stringify(next));
  }

  function saveSuggestion() {
    if (!activeSuggestion) return;
    setSavedTip(activeSuggestion.answer);
    setTasks((current) => {
      if (current.some((task) => task.label === activeSuggestion.task)) return current;
      return [...current, { id: Date.now(), label: activeSuggestion.task, complete: false }];
    });
  }

  if (!assistantReady) {
    return (
      <AppLayout section="My AI team" current="Personal assistant">
        <AssistantOnboarding
          onComplete={(setup) => {
            setAssistantSetup(setup);
            setAssistantReady(true);
          }}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout section="My AI team" current="Personal assistant">
      <div className="mx-auto max-w-[1320px] px-8 py-7 max-[1050px]:px-6 max-[760px]:px-4">
        <section className="relative isolate flex min-h-[260px] items-center overflow-hidden rounded-2xl border border-violet-300/20 bg-gradient-to-br from-[#251f35] via-[#1b1927] to-[#171a29] px-9 py-8 max-[760px]:min-h-[280px] max-[760px]:px-6">
          <div className="relative z-10 max-w-[570px]">
            <p className="mb-3 flex items-center gap-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">
              <span className="h-px w-4 bg-violet-300" /> HERE FOR THE EVERYDAY
            </p>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.05] px-2.5 py-1 text-[8px] font-semibold tracking-wider text-emerald-200">
              <i className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> YOUR PERSONAL ASSISTANT
            </span>
            <h1 className="mb-3 font-display text-[clamp(30px,4vw,44px)] font-bold leading-[1.08] tracking-[-0.05em]">
              {assistantSetup?.name ? (
                <>
                  Welcome back, {assistantSetup.name}.
                  <br />
                  <em className="not-italic text-violet-300">Here’s your day.</em>
                </>
              ) : (
                <>
                  A little more room
                  <br />
                  for <em className="not-italic text-violet-300">your life.</em>
                </>
              )}
            </h1>
            <p className="max-w-[470px] text-xs leading-relaxed text-[#aaa4b8]">
              Gentle reminders, clearer next steps, and thoughtful support for the things you’re
              carrying.
            </p>
            <div className="mt-5 flex items-center gap-4 max-[500px]:items-start max-[500px]:flex-col">
              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 rounded-lg bg-violet-300 px-4 py-3 text-[10px] font-bold text-[#171222] hover:bg-violet-200" type="button" onClick={() => setIsChatOpen(true)}>
                  <FaCommentDots /> Ask me
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-[10px] font-semibold text-violet-100 hover:bg-white/[0.06]" type="button" onClick={() => setIsCaptureOpen(true)}>
                  <FaRegStickyNote /> Capture a thought
                </button>
              </div>
              <span className="flex items-center gap-2 text-[10px] text-[#aaa4b8]">
                <FaHeart className="text-rose-300" />
                Your day, your pace
              </span>
            </div>
          </div>
          <div
            className="absolute right-[10%] top-1/2 h-[235px] w-[300px] -translate-y-1/2 max-[760px]:-right-[135px] max-[760px]:opacity-30"
            aria-hidden="true"
          >
            <div className="absolute left-1/2 top-1/2 h-[135px] w-[135px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/20" />
            <div className="absolute left-1/2 top-1/2 h-[195px] w-[195px] -translate-x-1/2 -translate-y-1/2 animate-feature-ring-wave rounded-full border border-violet-200/15 motion-reduce:animate-none" />
            <div className="absolute left-1/2 top-1/2 h-[255px] w-[255px] -translate-x-1/2 -translate-y-1/2 animate-feature-ring-wave rounded-full border border-dashed border-violet-200/15 [animation-delay:900ms] motion-reduce:animate-none" />
            <div className="absolute left-1/2 top-1/2 grid h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[22px] border border-violet-200/40 bg-gradient-to-br from-[#614a8d] to-[#322b49] text-2xl text-violet-100 shadow-[0_0_50px_rgba(174,140,255,0.25)]">
              <SpecialistIcon type="assistant" className="h-5 w-5" />
            </div>
            <span className="absolute left-0 top-7 rounded-lg border border-white/10 bg-[#191723]/90 px-3 py-2 text-[9px] text-violet-100">
              <FaRegSun className="mr-1.5 inline text-amber-200" />
              room to reset
            </span>
            <span className="absolute bottom-6 right-0 rounded-lg border border-white/10 bg-[#191723]/90 px-3 py-2 text-[9px] text-violet-100">
              <FaCheck className="mr-1.5 inline text-emerald-200" />
              one step at a time
            </span>
          </div>
          <span className="absolute bottom-5 right-6 text-[9px] text-[#9995a8] max-[760px]:hidden">
            {today}
          </span>
        </section>

        <section
          className="my-4 grid grid-cols-3 gap-3 max-[760px]:grid-cols-1"
          aria-label="Your day at a glance"
        >
          <article className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#171620] p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-300/10 text-violet-200">
              <FaCalendarCheck />
            </span>
            <span className="min-w-0">
              <small className="block text-[8px] font-bold tracking-wider text-[#777285]">
                IN YOUR PLAN
              </small>
              <strong className="mt-1 block text-xs">
                {completedCount} of {tasks.length} steps
              </strong>
            </span>
            <span className="ml-auto text-[9px] text-[#777285]">for today</span>
          </article>
          <article className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#171620] p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-300/10 text-orange-200">
              <FaClock />
            </span>
            <span>
              <small className="block text-[8px] font-bold tracking-wider text-[#777285]">
                UP NEXT
              </small>
              <strong className="mt-1 block text-xs">{openReminders} reminders</strong>
            </span>
            <button
              className="ml-auto grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-[#9995a8] hover:text-white"
              type="button"
              onClick={() => setIsReminderOpen(true)}
              aria-label="Add a reminder"
            >
              <FaPlus />
            </button>
          </article>
          <article className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#171620] p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-300/10 text-emerald-200">
              <FaSmile />
            </span>
            <span className="min-w-0">
              <small className="block text-[8px] font-bold tracking-wider text-[#777285]">
                QUICK CHECK-IN
              </small>
              <strong className="mt-1 block truncate text-xs">
                {checkIn ? `Feeling ${checkIn.toLowerCase()}` : "How are you feeling?"}
              </strong>
            </span>
            <button
              className="ml-auto text-[10px] text-violet-200"
              type="button"
              onClick={() =>
                document
                  .getElementById("personal-checkin")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              aria-label="Go to check-in"
            >
              <FaArrowRight />
            </button>
          </article>
        </section>

        <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 max-[900px]:grid-cols-1">
          <section className="rounded-xl border border-white/[0.07] bg-[#171620] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="mb-1 text-[8px] font-bold tracking-[0.14em] text-violet-300">
                  A KINDER KIND OF TO-DO LIST
                </p>
                <h2 className="mb-0 font-display text-base font-semibold">What matters today</h2>
              </div>
              <button
                className="flex items-center gap-2 text-[10px] font-semibold text-violet-200 hover:text-white"
                type="button"
                onClick={() => setActiveSuggestion(suggestions.plan)}
              >
                Help me plan <FaArrowRight />
              </button>
            </div>
            <p className="mt-2 text-[10px] text-[#9995a8]">
              No perfect plan needed. Start wherever you are.
            </p>
            <div className="my-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <span
                className="block h-full rounded-full bg-violet-300 transition-all"
                style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }}
              />
            </div>
            <div className="divide-y divide-white/[0.06]">
              {tasks.map((task) => (
                <button
                  className={`flex w-full items-center gap-3 py-3 text-left text-[11px] transition ${task.complete ? "text-[#706b80] line-through" : "text-[#dedbe6] hover:text-white"}`}
                  key={task.id}
                  type="button"
                  onClick={() => toggleTask(task.id)}
                >
                  <span
                    className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md border ${task.complete ? "border-violet-300 bg-violet-300 text-[#171222]" : "border-white/20"}`}
                  >
                    {task.complete && <FaCheck className="text-[9px]" />}
                  </span>
                  {task.label}
                </button>
              ))}
            </div>
            <button
              className="mt-3 flex items-center gap-2 text-[10px] font-medium text-violet-200 hover:text-white"
              type="button"
              onClick={() => setIsReminderOpen(true)}
            >
              <FaPlus />
              Add a reminder to your day
            </button>
            {savedTip && (
              <div className="mt-4 flex gap-2 rounded-lg border border-violet-300/15 bg-violet-300/[0.05] p-3 text-[10px] leading-relaxed text-[#c8c1d5]">
                <FaLightbulb className="mt-0.5 shrink-0 text-violet-200" />
                <span>
                  <strong className="mr-1 text-violet-100">Saved for today</strong>
                  {savedTip}
                </span>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-white/[0.07] bg-[#171620] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-[8px] font-bold tracking-[0.14em] text-violet-300">
                  MAKE SPACE FOR WHAT MATTERS
                </p>
                <h2 className="mb-0 font-display text-base font-semibold">Coming up</h2>
              </div>
              <button
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-[#9995a8] hover:text-white"
                type="button"
                aria-label="Add reminder"
                onClick={() => setIsReminderOpen(true)}
              >
                <FaPlus />
              </button>
            </div>
            <div className="mt-4 grid gap-2.5">
              {reminders.length ? (
                reminders.map((reminder) => (
                  <div
                    className={`flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 ${reminder.complete ? "opacity-50" : ""}`}
                    key={reminder.id}
                  >
                    <button
                      className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md border ${reminder.complete ? "border-violet-300 bg-violet-300 text-[#171222]" : "border-white/20"}`}
                      type="button"
                      onClick={() => toggleReminder(reminder.id)}
                      aria-label={
                        reminder.complete ? "Mark reminder incomplete" : "Complete reminder"
                      }
                    >
                      {reminder.complete && <FaCheck className="text-[9px]" />}
                    </button>
                    <time className="min-w-[58px] text-[9px] font-semibold text-violet-200">
                      {formatClock(reminder.when)}
                    </time>
                    <span className="min-w-0 flex-1">
                      <strong
                        className={`block truncate text-[10px] ${reminder.complete ? "line-through" : ""}`}
                      >
                        {reminder.title}
                      </strong>
                      <small className="mt-1 block text-[9px] text-[#777285]">
                        {reminder.category}
                      </small>
                    </span>
                    <button
                      className="px-1 text-[10px] text-[#706b80] hover:text-rose-200"
                      type="button"
                      aria-label={`Remove ${reminder.title}`}
                      onClick={() =>
                        setReminders((current) => current.filter((item) => item.id !== reminder.id))
                      }
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))
              ) : (
                <div className="grid justify-items-center gap-2 py-8 text-center text-[#777285]">
                  <FaRegCalendarAlt className="text-2xl" />
                  <strong className="text-xs">Your schedule has breathing room.</strong>
                  <span className="text-[10px]">Add a reminder whenever you need one.</span>
                </div>
              )}
            </div>
            <button
              className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-violet-300/20 text-[10px] font-semibold text-violet-200 hover:bg-violet-300/[0.06]"
              type="button"
              onClick={() => setIsReminderOpen(true)}
            >
              <FaPlus />
              Add a reminder
            </button>
          </section>
        </div>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="mb-1.5 text-[8px] font-bold tracking-[0.14em] text-violet-300">
                A HAND WHEN YOU NEED ONE
              </p>
              <h2 className="mb-0 font-display text-lg font-semibold">
                What would help right now?
              </h2>
            </div>
            <span className="text-[9px] text-[#777285] max-[760px]:hidden">
              Choose a starting point
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 max-[900px]:grid-cols-1">
            {[
              [
                "Plan my day",
                "Make space for priorities and pauses.",
                <FaRegSun />,
                suggestions.plan,
                "text-amber-200 bg-amber-300/10",
              ],
              [
                "Break it into steps",
                "Find the next small, doable move.",
                <FaArrowRight />,
                suggestions.steps,
                "text-sky-200 bg-sky-300/10",
              ],
              [
                "I need a reset",
                "Take a breath and start again gently.",
                <FaHeart />,
                suggestions.break,
                "text-emerald-200 bg-emerald-300/10",
              ],
            ].map(([title, subtitle, icon, suggestion, tone]) => (
              <button
                className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#171620] p-4 text-left transition hover:-translate-y-0.5 hover:border-violet-300/25"
                key={title}
                type="button"
                onClick={() => setActiveSuggestion(suggestion)}
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}>
                  {icon}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-xs">{title}</strong>
                  <small className="mt-1 block text-[9px] text-[#9995a8]">{subtitle}</small>
                </span>
                <FaChevronRight className="text-[10px] text-[#706b80] transition group-hover:translate-x-0.5 group-hover:text-violet-200" />
              </button>
            ))}
          </div>
        </section>

        <div className="mt-4 grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
          <section
            className="rounded-xl border border-white/[0.07] bg-[#171620] p-5"
            id="personal-checkin"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-[8px] font-bold tracking-[0.14em] text-violet-300">
                  A MOMENT FOR YOU
                </p>
                <h2 className="mb-0 font-display text-base font-semibold">
                  How are you arriving today?
                </h2>
              </div>
              <FaRegSun className="text-amber-200" />
            </div>
            <p className="mb-4 mt-2 text-[10px] text-[#9995a8]">
              No need to explain. Just notice where you are.
            </p>
            <div className="flex gap-2" role="group" aria-label="Choose how you feel">
              {[
                { name: "Bright", face: "☀️" },
                { name: "Okay", face: "🌤️" },
                { name: "Stretched", face: "🌧️" },
              ].map((mood) => (
                <button
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-2 py-2.5 text-[10px] transition ${checkIn === mood.name ? "border-violet-300/40 bg-violet-300/10 text-violet-100" : "border-white/[0.07] bg-white/[0.02] text-[#aaa4b8] hover:bg-white/[0.05]"}`}
                  type="button"
                  key={mood.name}
                  onClick={() => setCheckIn(mood.name)}
                >
                  <span>{mood.face}</span>
                  {mood.name}
                </button>
              ))}
            </div>
            {checkIn && (
              <p className="mb-0 mt-3 rounded-lg bg-violet-300/[0.05] p-3 text-[10px] leading-relaxed text-[#c8c1d5]">
                {checkInResponses[checkIn]}
              </p>
            )}
          </section>
          <section className="rounded-xl border border-white/[0.07] bg-[#171620] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-[8px] font-bold tracking-[0.14em] text-violet-300">
                  A PLACE TO PUT IT DOWN
                </p>
                <h2 className="mb-0 font-display text-base font-semibold">Quick capture</h2>
              </div>
              <FaRegStickyNote className="text-violet-200" />
            </div>
            {thoughts.length ? (
              <div className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">
                {thoughts.map((thought) => (
                  <div key={thought.id} className="flex items-start gap-2 rounded-lg border border-violet-300/15 bg-violet-300/[0.04] p-3">
                    <FaRegLightbulb className="mt-0.5 shrink-0 text-violet-200" />
                    <p className="mb-0 flex-1 whitespace-pre-wrap break-words text-[10px] leading-relaxed text-[#c8c1d5]">{thought.text}</p>
                    <button className="text-[10px] text-[#777285] hover:text-rose-200" type="button" onClick={() => removeThought(thought.id)} aria-label="Delete captured thought"><FaTrashAlt /></button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-0 mt-3 text-[10px] leading-relaxed text-[#9995a8]">
                Your saved thoughts will stay listed here until you remove them.
              </p>
            )}
            <button
              className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-violet-300/20 text-[10px] font-semibold text-violet-200 hover:bg-violet-300/[0.06]"
              type="button"
              onClick={() => setIsCaptureOpen(true)}
            >
              <FaPlus />
              Capture a thought
            </button>
          </section>
        </div>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="mb-1.5 text-[8px] font-bold tracking-[0.14em] text-violet-300">
                LIFE IS MORE THAN A CHECKLIST
              </p>
              <h2 className="mb-0 font-display text-lg font-semibold">
                Make room for your whole life
              </h2>
            </div>
            <span className="text-[9px] text-[#777285] max-[760px]:hidden">
              Explore a gentle suggestion
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3 max-[1050px]:grid-cols-2 max-[500px]:grid-cols-1">
            {lifeAreas.map((area) => (
              <button
                className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#171620] p-3.5 text-left transition hover:border-violet-300/25"
                key={area.id}
                type="button"
                onClick={() => setActiveSuggestion(suggestions[area.id])}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-300/10 text-violet-200">
                  {area.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-[10px]">{area.title}</strong>
                  <small className="mt-1 block truncate text-[8px] text-[#9995a8]">
                    {area.detail}
                  </small>
                </span>
                <FaChevronRight className="text-[9px] text-[#706b80] group-hover:text-violet-200" />
              </button>
            ))}
          </div>
        </section>
        <footer className="mt-7 flex items-center justify-between gap-4 border-t border-white/[0.07] py-4 text-[9px] text-[#777285] max-[650px]:items-start max-[650px]:flex-col">
          <span>Your assistant is here to support your choices, not make them for you.</span>
          <button
            className="inline-flex items-center gap-2 text-violet-200 hover:text-white"
            type="button"
            onClick={() => navigate("/settings")}
          >
            Personalize your workspace <FaArrowRight />
          </button>
        </footer>
      </div>
      {isReminderOpen && (
        <ReminderPopup onClose={() => setIsReminderOpen(false)} onSave={addReminder} />
      )}
      {isCaptureOpen && (
        <QuickCapturePopup onClose={() => setIsCaptureOpen(false)} onSave={addCapturedThought} />
      )}
      {isChatOpen && (
        <AssistantChatPopup onClose={() => setIsChatOpen(false)} thoughts={thoughts} />
      )}
      {activeSuggestion && (
        <SuggestionPopup
          suggestion={activeSuggestion}
          onClose={() => setActiveSuggestion(null)}
          onSave={saveSuggestion}
        />
      )}
    </AppLayout>
  );
}
