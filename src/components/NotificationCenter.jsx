import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaBell, FaCheck } from "react-icons/fa";
import { notificationsApi } from "../api/notifications";
import SpecialistIcon from "./SpecialistIcon";

function formatNotificationTime(value) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Just now";
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return minutes + " min ago";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + " hr ago";
  return new Date(value).toLocaleDateString();
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadError, setLoadError] = useState("");
  const initialLoadStarted = useRef(false);
  const navigate = useNavigate();
  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  const loadNotifications = useCallback(async () => {
    try {
      const response = await notificationsApi.list();
      setNotifications(response);
      setLoadError("");
    } catch {
      setLoadError("Notifications could not be loaded.");
    }
  }, []);

  useEffect(() => {
    if (initialLoadStarted.current) return;
    initialLoadStarted.current = true;
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (isOpen) loadNotifications();
  }, [isOpen, loadNotifications]);

  async function openNotification(notification) {
    if (!notification.is_read) {
      try {
        await notificationsApi.markRead(notification.id);
        setNotifications((current) =>
          current.map((item) => item.id === notification.id ? { ...item, is_read: true } : item),
        );
      } catch {
        setLoadError("This notification could not be marked as read.");
      }
    }
    setIsOpen(false);
    navigate(notification.href || "/workspace");
  }

  async function markAllRead() {
    try {
      await notificationsApi.markAllRead();
      setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
      setLoadError("");
    } catch {
      setLoadError("Notifications could not be updated. Please try again.");
    }
  }

  return (
    <div className="relative">
      <button
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.025] text-[#d6d0e2] transition hover:bg-white/[0.07]"
        type="button"
        aria-label={"Notifications" + (unreadCount ? ", " + unreadCount + " unread" : "")}
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
                {unreadCount ? unreadCount + " new updates" : "You’re all caught up"}
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
          {loadError && <p role="status" className="mb-0 px-4 pt-3 text-[10px] text-rose-200">{loadError}</p>}
          <div className="max-h-[360px] overflow-y-auto p-2">
            {notifications.length ? (
              notifications.map((notification) => (
                <button
                  className={"group relative flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.05] " + (!notification.is_read ? "bg-violet-300/[0.045]" : "")}
                  type="button"
                  key={notification.id}
                  onClick={() => openNotification(notification)}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-300/10 text-violet-200">
                    <SpecialistIcon type={notification.href === "/ai/finance" ? "finance" : "team"} className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-xs font-semibold text-white">{notification.title}</strong>
                    <span className="mt-1 block text-[10px] leading-relaxed text-[#9995a8]">{notification.message}</span>
                    <small className="mt-2 block text-[9px] text-[#706b80]">{formatNotificationTime(notification.created_at)}</small>
                  </span>
                  {!notification.is_read && <i className="mt-1.5 h-2 w-2 rounded-full bg-violet-300" />}
                  <FaArrowRight className="mt-1 text-[10px] text-[#706b80] opacity-0 transition group-hover:opacity-100" />
                </button>
              ))
            ) : (
              <p className="px-4 py-8 text-center text-xs text-[#9995a8]">
                {loadError ? "Try opening notifications again in a moment." : "No notifications yet."}
              </p>
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
