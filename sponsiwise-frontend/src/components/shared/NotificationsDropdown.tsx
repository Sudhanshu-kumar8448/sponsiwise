import Link from "next/link";
import { fetchNotifications } from "@/lib/notifications-api";
import type { Notification } from "@/lib/types/notifications";

// ─── Severity styling ──────────────────────────────────────────────────

const severityConfig: Record<
  Notification["severity"],
  { dot: string; bg: string }
> = {
  info: { dot: "bg-blue-400", bg: "bg-blue-50" },
  success: { dot: "bg-green-500", bg: "bg-green-50" },
  warning: { dot: "bg-amber-500", bg: "bg-amber-50" },
  error: { dot: "bg-red-500", bg: "bg-red-50" },
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
      className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50 ${
        !item.read ? style.bg : ""
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
          className={`text-sm leading-snug ${
            !item.read
              ? "font-medium text-gray-900"
              : "text-gray-600"
          }`}
        >
          {item.title}
        </p>
        <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
          {item.message}
        </p>
        <p className="mt-1 text-[10px] text-gray-400">
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

// ─── Main dropdown (server-rendered) ───────────────────────────────────

/**
 * Notifications dropdown for the TopNav.
 *
 * Server Component — fetches the latest N notifications server-side.
 * Renders as a static list within the nav bar.
 *
 * Uses CSS :focus-within to toggle visibility without client JS.
 * Falls back gracefully if the API is unavailable.
 */
export default async function NotificationsDropdown() {
  let notifications: Notification[] = [];
  let unreadCount = 0;
  let error = false;

  try {
    const res = await fetchNotifications({ page: 1, pageSize: 8 });
    notifications = res.data;
    unreadCount = notifications.filter((n) => !n.read).length;
  } catch {
    // API not available — degrade gracefully, don't break the layout
    error = true;
  }

  return (
    <div className="relative">
      {/* Trigger — uses a button + focus-within for pure CSS toggle */}
      <button
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-400/10 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        {/* Bell icon (inline SVG — no dependency needed) */}
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

      {/* Dropdown panel — visible on :focus-within */}
      <div className="invisible absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white opacity-0 shadow-lg transition-all focus-within:visible focus-within:opacity-100 peer-focus:visible peer-focus:opacity-100 [div:focus-within>&]:visible [div:focus-within>&]:opacity-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-600">
              {unreadCount} new
            </span>
          )}
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto py-1">
          {error ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              Unable to load notifications.
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <span className="text-3xl">🔔</span>
              <p className="mt-2 text-sm text-gray-500">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((item) => (
                <NotificationItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-2">
            <Link
              href="/dashboard/notifications"
              className="block text-center text-xs font-medium text-blue-400 transition-colors hover:text-blue-600"
            >
              View all notifications
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
