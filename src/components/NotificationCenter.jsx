import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaBell, FaCheck } from "react-icons/fa";
import SpecialistIcon from "./SpecialistIcon";

const initialNotifications = [
  {
    id: 1,
    title: "Invoice review completed",
    description: "Your Finance Analyst has finished processing a new invoice.",
    time: "8 min ago",
    icon: <SpecialistIcon type="finance" className="h-3.5 w-3.5" />,
    href: "/ai/finance",
    unread: true,
  },
  {
    id: 2,
    title: "AI workforce is ready",
    description: "Your employee workspace is ready for the day.",
    time: "Today",
    icon: <SpecialistIcon type="team" className="h-3.5 w-3.5" />,
    href: "/",
    unread: true,
  },
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const navigate = useNavigate();
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  function openNotification(notification) {
    setNotifications((current) =>
      current.map((item) => (item.id === notification.id ? { ...item, unread: false } : item)),
    );
    setIsOpen(false);
    navigate(notification.href);
  }

  function markAllRead() {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
  }

  return (
    <div className="relative">
      <button
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.025] text-[#d6d0e2] transition hover:bg-white/[0.07]"
        type="button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={isOpen}
        aria-controls="notification-panel"
        onClick={() => setIsOpen((open) => !open)}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-violet-400 px-1 text-[9px] font-bold text-[#171222]">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <section
          className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(390px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-white/10 bg-[#171620] shadow-2xl shadow-black/50"
          id="notification-panel"
          aria-label="Notifications"
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-4">
            <div>
              <h2 className="mb-1 font-display text-base font-semibold">Notifications</h2>
              <p className="mb-0 text-[11px] text-[#9995a8]">
                {unreadCount ? `${unreadCount} new updates` : "You’re all caught up"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-200 hover:text-white"
                type="button"
                onClick={markAllRead}
              >
                <FaCheck /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[360px] overflow-y-auto p-2">
            {notifications.length ? (
              notifications.map((notification) => (
                <button
                  className={`group relative flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.05] ${notification.unread ? "bg-violet-300/[0.045]" : ""}`}
                  type="button"
                  key={notification.id}
                  onClick={() => openNotification(notification)}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-300/10 text-violet-200">
                    {notification.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-xs font-semibold text-white">
                      {notification.title}
                    </strong>
                    <span className="mt-1 block text-[10px] leading-relaxed text-[#9995a8]">
                      {notification.description}
                    </span>
                    <small className="mt-2 block text-[9px] text-[#706b80]">
                      {notification.time}
                    </small>
                  </span>
                  {notification.unread && (
                    <i className="mt-1.5 h-2 w-2 rounded-full bg-violet-300" />
                  )}
                  <FaArrowRight className="mt-1 text-[10px] text-[#706b80] opacity-0 transition group-hover:opacity-100" />
                </button>
              ))
            ) : (
              <p className="px-4 py-8 text-center text-xs text-[#9995a8]">No notifications yet.</p>
            )}
          </div>
          <button
            className="flex w-full items-center justify-center gap-2 border-t border-white/[0.07] px-4 py-3 text-[10px] font-semibold text-violet-200 hover:bg-white/[0.03]"
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate("/ai/finance");
            }}
          >
            Open finance workspace <FaArrowRight />
          </button>
        </section>
      )}
    </div>
  );
}
