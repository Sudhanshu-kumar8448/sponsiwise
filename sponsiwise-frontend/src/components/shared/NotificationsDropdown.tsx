"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import type { Notification } from "@/lib/types/notifications";

// ─── Severity styling ──────────────────────────────────────────────────

const severityConfig: Record<
  Notification["severity"],
  { dot: string; bg: string }
> = {
  info: { dot: "bg-blue-400", bg: "bg-blue-500/5" },
  success: { dot: "bg-emerald-500", bg: "bg-emerald-500/5" },
  warning: { dot: "bg-amber-500", bg: "bg-amber-500/5" },
  error: { dot: "bg-red-500", bg: "bg-red-500/5" },
};

// ─── Time formatting ───────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);

  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ─── Single notification item ──────────────────────────────────────────

function NotificationItem({ item }: { item: Notification }) {
  const style = severityConfig[item.severity] ?? severityConfig.info;

  const content = (
    <div
      className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-700/50 ${!item.read ? style.bg : ""
        }`}
    >
      {/* Unread dot */}
      <div className="mt-1.5 flex-shrink-0">
        {!item.read ? (
          <span className={`block h-2 w-2 rounded-full ${style.dot}`} />
        ) : (
          <span className="block h-2 w-2" />
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm leading-snug ${!item.read
            ? "font-medium text-white"
            : "text-slate-400"
            }`}
        >
          {item.title}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
          {item.message}
        </p>
        <p className="mt-1 text-[10px] text-slate-600">
          {timeAgo(item.createdAt)}
        </p>
      </div>
    </div>
  );

  if (item.link) {
    return (
      <Link href={item.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

// ─── Main dropdown (client-rendered) ───────────────────────────────────

/**
 * Notifications dropdown for the TopNav.
 *
 * Client Component — fetches notifications via the client-side apiClient.
 * Falls back gracefully if the API is unavailable.
 */
export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiClient.get<{ data: Notification[] }>(
        "/notifications?page=1&pageSize=8"
      );
      const data = res.data ?? [];
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-400/10 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        {/* Bell icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="animate-scale-in absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-slate-700 bg-slate-800 shadow-xl shadow-black/30">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
            <h3 className="text-sm font-semibold text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                {unreadCount} new
              </span>
            )}
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto py-1">
            {error ? (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                Unable to load notifications.
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <span className="text-3xl">🔔</span>
                <p className="mt-2 text-sm text-slate-400">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {notifications.map((item) => (
                  <NotificationItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-700 px-4 py-2">
              <Link
                href="/dashboard/notifications"
                className="block text-center text-xs font-medium text-blue-400 transition-colors hover:text-sky-300"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
