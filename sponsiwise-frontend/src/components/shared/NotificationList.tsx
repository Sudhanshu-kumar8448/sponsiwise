"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Notification } from "@/lib/types/notifications";
import StatusBadge from "@/components/shared/StatusBadge";
import type { BadgeVariant } from "@/components/shared/StatusBadge";

// ─── Client-side API helpers (browser fetch, not server-side authFetch) ─

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

async function markNotificationRead(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to mark notification as read");
}

async function markAllNotificationsRead(ids: string[]): Promise<void> {
    // Optimisation: use bulk endpoint instead of N+1 requests
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to mark all notifications as read");
}

// ─── Severity badge variants ───────────────────────────────────────────

const severityVariants: Record<string, BadgeVariant> = {
    info: {
        label: "Info",
        className: "bg-blue-500/10 text-blue-400",
        dot: "bg-blue-500",
    },
    success: {
        label: "Success",
        className: "bg-emerald-500/10 text-emerald-400",
        dot: "bg-emerald-500",
    },
    warning: {
        label: "Warning",
        className: "bg-amber-500/10 text-amber-400",
        dot: "bg-amber-500",
    },
    error: {
        label: "Error",
        className: "bg-red-500/10 text-red-400",
        dot: "bg-red-500",
    },
};

// ─── Single notification row ───────────────────────────────────────────

function NotificationRow({
    item,
    onMarkRead,
}: {
    item: Notification;
    onMarkRead: (id: string) => void;
}) {
    const handleClick = () => {
        if (!item.read) {
            onMarkRead(item.id);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`flex items-start gap-4 rounded-2xl border px-5 py-4 transition-all cursor-pointer hover:bg-slate-800/50 ${!item.read
                ? "bg-blue-500/5 border-l-2 border-blue-500/30 border-t border-r border-b border-slate-800"
                : "bg-slate-900 border-slate-800 border-l-2 border-l-transparent"
                }`}
        >
            {/* Read indicator */}
            <div className="mt-1.5 flex-shrink-0">
                {!item.read ? (
                    <span className="block h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                ) : (
                    <span className="block h-2.5 w-2.5 rounded-full bg-slate-700" />
                )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <p
                        className={`text-sm leading-snug ${!item.read ? "font-semibold text-white" : "text-slate-300"
                            }`}
                    >
                        {item.title}
                    </p>
                    <StatusBadge status={item.severity} variants={severityVariants} />
                </div>
                <p className="mt-1 text-sm text-slate-400">{item.message}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    <time dateTime={item.createdAt}>
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </time>
                    {item.entityType && (
                        <>
                            <span className="text-slate-700">•</span>
                            <span className="rounded-lg bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                                {item.entityType}
                            </span>
                        </>
                    )}
                    {item.link && (
                        <>
                            <span className="text-slate-700">•</span>
                            <Link
                                href={item.link}
                                className="text-blue-400 hover:text-sky-300 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                View →
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main list component ───────────────────────────────────────────────

interface NotificationListProps {
    initialNotifications: Notification[];
    total: number;
    page: number;
    pageSize: number;
}

export default function NotificationList({
    initialNotifications,
    total,
    page,
    pageSize,
}: NotificationListProps) {
    const router = useRouter();
    const [notifications, setNotifications] = useState(initialNotifications);
    const [isPending, startTransition] = useTransition();

    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

    const handleMarkRead = async (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
        try {
            await markNotificationRead(id);
        } catch {
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: false } : n)),
            );
        }
    };

    const handleMarkAllRead = async () => {
        if (unreadIds.length === 0) return;

        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

        try {
            await markAllNotificationsRead(unreadIds);
            startTransition(() => router.refresh());
        } catch {
            setNotifications(initialNotifications);
        }
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="space-y-4">
            {/* Unread count + Mark all as read */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    Showing {notifications.length} of {total}{" "}
                    {total !== 1 ? "notifications" : "notification"}
                    {unreadIds.length > 0 && (
                        <span className="ml-2 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
                            {unreadIds.length} unread
                        </span>
                    )}
                </p>
                {unreadIds.length > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        disabled={isPending}
                        className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Marking…" : "Mark all as read"}
                    </button>
                )}
            </div>

            {/* Notification rows */}
            <div className="space-y-2">
                {notifications.map((item) => (
                    <NotificationRow
                        key={item.id}
                        item={item}
                        onMarkRead={handleMarkRead}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    {page > 1 && (
                        <Link
                            href={`/dashboard/notifications?page=${page - 1}`}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                        >
                            <ChevronLeft className="h-4 w-4" /> Previous
                        </Link>
                    )}
                    <span className="text-sm text-slate-500">
                        Page {page} of {totalPages}
                    </span>
                    {page < totalPages && (
                        <Link
                            href={`/dashboard/notifications?page=${page + 1}`}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                        >
                            Next <ChevronRight className="h-4 w-4" />
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
