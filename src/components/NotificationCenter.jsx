import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaBell, FaCheck, FaFileInvoice, FaRobot } from "react-icons/fa";

const initialNotifications = [
  {
    id: 1,
    title: "Invoice review completed",
    description: "Your Finance Analyst has finished processing a new invoice.",
    time: "8 min ago",
    icon: <FaFileInvoice />,
    href: "/ai/finance",
    unread: true,
  },
  {
    id: 2,
    title: "AI workforce is ready",
    description: "Your employee workspace is ready for the day.",
    time: "Today",
    icon: <FaRobot />,
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
    <div className="notification-wrap">
      <button
        className="icon-button notification-trigger"
        type="button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={isOpen}
        aria-controls="notification-panel"
        onClick={() => setIsOpen((open) => !open)}
      >
        <FaBell />
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </button>

      {isOpen && (
        <section className="notification-panel" id="notification-panel" aria-label="Notifications">
          <div className="notification-heading">
            <div>
              <h2>Notifications</h2>
              <p>{unreadCount ? `${unreadCount} new updates` : "You’re all caught up"}</p>
            </div>
            {unreadCount > 0 && (
              <button className="mark-read-button" type="button" onClick={markAllRead}>
                <FaCheck /> Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length ? (
              notifications.map((notification) => (
                <button
                  className={`notification-item ${notification.unread ? "notification-unread" : ""}`}
                  type="button"
                  key={notification.id}
                  onClick={() => openNotification(notification)}
                >
                  <span className="notification-item-icon">{notification.icon}</span>
                  <span className="notification-item-copy">
                    <strong>{notification.title}</strong>
                    <span>{notification.description}</span>
                    <small>{notification.time}</small>
                  </span>
                  {notification.unread && <i className="notification-unread-dot" />}
                  <FaArrowRight className="notification-item-arrow" />
                </button>
              ))
            ) : (
              <p className="notification-empty">No notifications yet.</p>
            )}
          </div>

          <button
            className="notification-footer"
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
