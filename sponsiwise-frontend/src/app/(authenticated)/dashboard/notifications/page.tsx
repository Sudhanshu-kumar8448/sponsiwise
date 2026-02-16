import Link from "next/link";
import { fetchNotifications } from "@/lib/notifications-api";
import type { Notification } from "@/lib/types/notifications";
import { normalizeError } from "@/lib/errors";
import { ErrorState, EmptyState } from "@/components/shared";
import NotificationList from "@/components/shared/NotificationList";

const PAGE_SIZE = 20;

// ─── Page component ────────────────────────────────────────────────────

interface NotificationsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  let notifications: Notification[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const res = await fetchNotifications({ page, pageSize: PAGE_SIZE });
    notifications = res.data;
    total = res.total;
  } catch (err) {
    error = normalizeError(
      err,
      "Unable to load notifications. Please try again later.",
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-600">
            Your recent notifications and alerts.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Results */}
      {error ? (
        <ErrorState message={error} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          heading="No notifications"
          description="You don't have any notifications yet."
        />
      ) : (
        <NotificationList
          initialNotifications={notifications}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
        />
      )}
    </div>
  );
}
