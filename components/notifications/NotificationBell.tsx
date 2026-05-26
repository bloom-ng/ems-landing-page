"use client";

import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/lib/hooks/useNotifications";
import type { InAppNotification } from "@/lib/api/notifications";

interface NotificationBellProps {
  tenantSlug: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function eventIcon(eventType: string | null): string {
  if (!eventType) return "notifications";
  if (eventType.startsWith("leave")) return "event_available";
  if (eventType.startsWith("memo")) return "description";
  if (eventType.startsWith("appraisal")) return "assignment";
  if (eventType.startsWith("member")) return "person_add";
  if (eventType.startsWith("ticket")) return "confirmation_number";
  if (eventType.startsWith("message")) return "message";
  return "notifications";
}

function NotificationItem({
  notification,
  tenantSlug,
  onRead,
}: {
  notification: InAppNotification;
  tenantSlug: string;
  onRead: (id: string) => void;
}) {
  const handleClick = () => {
    if (!notification.isRead) onRead(notification.id);
    if (notification.actionUrl) {
      let url = notification.actionUrl;
      if (url.startsWith('/projects/')) {
        url = url.replace('/projects/', '/project/');
      }
      window.location.href = `/${tenantSlug}${url}`;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left flex gap-3 px-4 py-3.5 transition-colors hover:bg-muted/5 border-b border-border/50 last:border-0 group ${
        notification.isRead ? "opacity-60" : ""
      }`}
    >
      {/* icon */}
      <div
        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 ${
          notification.isRead
            ? "bg-muted/10 text-muted"
            : "bg-primary/10 text-primary"
        }`}
      >
        <span className="material-icons-outlined text-[18px]">
          {eventIcon(notification.eventType)}
        </span>
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug line-clamp-1 ${
            notification.isRead
              ? "font-medium text-foreground"
              : "font-bold text-foreground"
          }`}
        >
          {notification.title}
        </p>
        <p className="text-xs text-muted mt-0.5 line-clamp-2 leading-relaxed">
          {notification.body}
        </p>
        <p className="text-[10px] text-muted/70 font-semibold tracking-wide mt-1.5 uppercase">
          {timeAgo(notification.createdAt)}
        </p>
      </div>

      {/* unread dot */}
      {!notification.isRead && (
        <div className="shrink-0 mt-2">
          <span className="block w-2 h-2 rounded-full bg-primary" />
        </div>
      )}
    </button>
  );
}

export function NotificationBell({ tenantSlug }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { notifications, unreadCount, loading, markRead, markAllRead } =
    useNotifications(tenantSlug);

  // Close panel on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const hasUnread = unreadCount > 0;

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${hasUnread ? ` (${unreadCount} unread)` : ""}`}
        className={`p-2 rounded-lg relative transition-all group ${
          open
            ? "bg-primary/10 text-primary"
            : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <span
          className={`material-icons-outlined transition-colors ${
            open ? "text-primary" : "group-hover:text-primary"
          }`}
        >
          {open ? "notifications" : "notifications"}
        </span>

        {/* Unread badge */}
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-background animate-in zoom-in-50 duration-200">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-background border border-border rounded-2xl shadow-xl shadow-black/10 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="material-icons-outlined text-primary text-[20px]">
                notifications
              </span>
              <h3 className="text-sm font-bold text-foreground">
                Notifications
              </h3>
              {hasUnread && (
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {hasUnread && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-bold text-primary hover:underline transition-opacity"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[420px] overflow-y-auto overscroll-contain">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-xs text-muted font-semibold tracking-widest uppercase">
                  Loading...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-muted/10 flex items-center justify-center">
                  <span className="material-icons-outlined text-3xl text-muted">
                    notifications_off
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  All caught up!
                </p>
                <p className="text-xs text-muted leading-relaxed">
                  No notifications yet. Activity will appear here.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  tenantSlug={tenantSlug}
                  onRead={markRead}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-border px-4 py-2.5">
              <button
                onClick={() => {
                  setOpen(false);
                  window.location.href = `/${tenantSlug}/notifications`;
                }}
                className="w-full text-center text-xs font-bold text-primary hover:underline py-1 transition-opacity"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
