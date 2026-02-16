"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Notification } from "@/lib/types/notifications";
import StatusBadge from "@/components/shared/StatusBadge";
import type { BadgeVariant } from "@/components/shared/StatusBadge";

// ─── Client-side API helpers (browser fetch, not server-side authFetch) ─

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

async function markNotificationRead(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to mark notification as read");
}

async function markAllNotificationsRead(ids: string[]): Promise<number> {
    const results = await Promise.allSettled(
        ids.map((id) => markNotificationRead(id)),
    );
    return results.filter((r) => r.status === "fulfilled").length;
}

// ─── Severity badge variants ───────────────────────────────────────────

const severityVariants: Record<string, BadgeVariant> = {
    info: {
        label: "Info",
        className: "bg-blue-100 text-blue-700",
        dot: "bg-blue-500",
    },
    success: {
        label: "Success",
        className: "bg-green-100 text-green-700",
        dot: "bg-green-500",
    },
    warning: {
        label: "Warning",
        className: "bg-amber-100 text-amber-700",
        dot: "bg-amber-500",
    },
    error: {
        label: "Error",
        className: "bg-red-100 text-red-700",
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

    const content = (
        <div
            onClick={handleClick}
            className={`flex items-start gap-4 rounded-lg px-5 py-4 shadow-sm transition-all cursor-pointer hover:bg-gray-50 ${!item.read
                ? "bg-blue-50/40 border-l-2 border-blue-400"
                : "bg-white border-l-2 border-transparent"
                }`}
        >
            {/* Read indicator */}
            <div className="mt-1.5 flex-shrink-0">
                {!item.read ? (
                    <span className="block h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                ) : (
                    <span className="block h-2.5 w-2.5 rounded-full bg-gray-200" />
                )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <p
                        className={`text-sm leading-snug ${!item.read ? "font-semibold text-gray-900" : "text-gray-700"
                            }`}
                    >
                        {item.title}
                    </p>
                    <StatusBadge status={item.severity} variants={severityVariants} />
                </div>
                <p className="mt-1 text-sm text-gray-600">{item.message}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
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
                            <span className="text-gray-300">•</span>
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">
                                {item.entityType}
                            </span>
                        </>
                    )}
                    {item.link && (
                        <>
                            <span className="text-gray-300">•</span>
                            <Link
                                href={item.link}
                                className="text-blue-500 hover:text-blue-700"
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

    return content;
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
        // Optimistic update
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
        try {
            await markNotificationRead(id);
        } catch {
            // Revert on failure
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: false } : n)),
            );
        }
    };

    const handleMarkAllRead = async () => {
        if (unreadIds.length === 0) return;

        // Optimistic update
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

        try {
            await markAllNotificationsRead(unreadIds);
            startTransition(() => router.refresh());
        } catch {
            // Revert on failure
            setNotifications(initialNotifications);
        }
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="space-y-4">
            {/* Unread count + Mark all as read */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Showing {notifications.length} of {total}{" "}
                    {total !== 1 ? "notifications" : "notification"}
                    {unreadIds.length > 0 && (
                        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {unreadIds.length} unread
                        </span>
                    )}
                </p>
                {unreadIds.length > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        disabled={isPending}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            ← Previous
                        </Link>
                    )}
                    <span className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </span>
                    {page < totalPages && (
                        <Link
                            href={`/dashboard/notifications?page=${page + 1}`}
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            Next →
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
