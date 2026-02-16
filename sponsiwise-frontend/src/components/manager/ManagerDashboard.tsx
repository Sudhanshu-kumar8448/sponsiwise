import Link from "next/link";
import {
  fetchManagerDashboardStats,
  fetchVerifiableCompanies,
  fetchVerifiableEvents,
  fetchActivityLog,
} from "@/lib/manager-api";
import type {
  ManagerDashboardStats,
  VerifiableCompany,
  VerifiableEvent,
  ActivityEntry,
} from "@/lib/types/manager";
import VerificationStatusBadge from "@/components/shared/VerificationStatusBadge";

// ─── Stats cards ───────────────────────────────────────────────────────

function StatsGrid({ stats }: { stats: ManagerDashboardStats }) {
  const cards = [
    {
      label: "Companies Pending",
      value: stats.companies_pending,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      icon: "🏢",
      href: "/dashboard/companies?verification_status=pending",
    },
    {
      label: "Companies Verified",
      value: stats.companies_verified,
      color: "text-green-600",
      bg: "bg-green-50",
      icon: "✅",
      href: "/dashboard/companies?verification_status=verified",
    },
    {
      label: "Events Pending",
      value: stats.events_pending,
      color: "text-yellow-600",
      bg: "bg-amber-50",
      icon: "📅",
      href: "/dashboard/events?verification_status=pending",
    },
    {
      label: "Events Verified",
      value: stats.events_verified,
      color: "text-green-600",
      bg: "bg-emerald-50",
      icon: "✅",
      href: "/dashboard/events?verification_status=verified",
    },
    {
      label: "Total Users",
      value: stats.total_users,
      color: "text-gray-900",
      bg: "bg-gray-50",
      icon: "👥",
      href: null,
    },
    {
      label: "Recent Registrations",
      value: stats.recent_registrations,
      color: "text-amber-600",
      bg: "bg-orange-50",
      icon: "🆕",
      href: "/dashboard/activity?type=user_registered",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const inner = (
          <div className="flex items-start gap-3">
            <span className="text-2xl">{card.icon}</span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                {card.label}
              </p>
              <p className={`mt-1.5 text-2xl font-bold ${card.color}`}>
                {card.value}
              </p>
            </div>
          </div>
        );
        return card.href ? (
          <Link
            key={card.label}
            href={card.href}
            className={`rounded-xl ${card.bg} p-5 shadow hover:shadow-md transition-all border border-gray-100`}
          >
            {inner}
          </Link>
        ) : (
          <div
            key={card.label}
            className={`rounded-xl ${card.bg} p-5 shadow border border-gray-100`}
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}

// ─── Pending companies table ───────────────────────────────────────────

function PendingCompanies({ companies }: { companies: VerifiableCompany[] }) {
  if (companies.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow">
        <span className="text-4xl">✅</span>
        <p className="mt-3 text-sm text-gray-500">
          No companies awaiting verification.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Owner
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Industry
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Registered
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {companies.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <Link
                  href={`/dashboard/companies/${c.id}`}
                  className="text-sm font-medium text-amber-700 hover:text-amber-900"
                >
                  {c.name}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {c.owner.email}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {c.industry ?? "—"}
              </td>
              <td className="px-6 py-4">
                <VerificationStatusBadge status={c.verification_status} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(c.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Pending events table ──────────────────────────────────────────────

function PendingEvents({ events }: { events: VerifiableEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow">
        <span className="text-4xl">✅</span>
        <p className="mt-3 text-sm text-gray-500">
          No events awaiting verification.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Event
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Organizer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {events.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <Link
                  href={`/dashboard/events/${e.id}`}
                  className="text-sm font-medium text-amber-700 hover:text-amber-900"
                >
                  {e.title}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {e.organizer.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {e.category || "—"}
              </td>
              <td className="px-6 py-4">
                <VerificationStatusBadge status={e.verification_status} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(e.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Recent activity feed ──────────────────────────────────────────────

const activityIcons: Record<string, string> = {
  "proposal.created": "📋",
  "proposal.submitted": "📤",
  "proposal.approved": "✅",
  "proposal.rejected": "❌",
  "company.created": "🏢",
  "company.verified": "✅",
  "company.rejected": "❌",
  "event.created": "📅",
  "event.verified": "✅",
  "event.rejected": "❌",
};

function RecentActivity({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow">
        <span className="text-4xl">📋</span>
        <p className="mt-3 text-sm text-gray-500">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white shadow divide-y divide-gray-100">
      {entries.map((entry) => {
        const icon = activityIcons[entry.action] ?? "📌";

        return (
          <div
            key={entry.id}
            className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <span className="mt-0.5 text-lg">{icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-800">
                <span className="font-medium capitalize">
                  {entry.action.replace(/\./g, " ").replace(/_/g, " ")}
                </span>
                {entry.entity_type && (
                  <>
                    {" — "}
                    <span className="font-mono text-xs text-gray-500">
                      {entry.entity_type}
                    </span>
                  </>
                )}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                {new Date(entry.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {entry.actor && (
                  <>
                    {" · "}
                    {entry.actor.role}
                  </>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Quick actions ─────────────────────────────────────────────────────

function QuickActions() {
  const actions = [
    {
      label: "View Companies",
      href: "/dashboard/companies",
      icon: "🏢",
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
    },
    {
      label: "View Events",
      href: "/dashboard/events",
      icon: "📅",
      color: "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
    },
    {
      label: "View Notifications",
      href: "/dashboard/notifications",
      icon: "🔔",
      color: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200",
    },
    {
      label: "View Activity Log",
      href: "/dashboard/activity",
      icon: "📊",
      color:
        "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={`flex items-center gap-3 rounded-xl border px-5 py-4 font-medium transition-all ${action.color}`}
        >
          <span className="text-xl">{action.icon}</span>
          <span className="text-sm">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}

// ─── Error fallback ────────────────────────────────────────────────────

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────

export default async function ManagerDashboard() {
  let stats: ManagerDashboardStats | null = null;
  let pendingCompanies: VerifiableCompany[] = [];
  let pendingEvents: VerifiableEvent[] = [];
  let recentActivity: ActivityEntry[] = [];
  let error: string | null = null;

  try {
    const [statsRes, companiesRes, eventsRes, activityRes] = await Promise.all([
      fetchManagerDashboardStats(),
      fetchVerifiableCompanies({
        page: 1,
        page_size: 5,
        verification_status: "pending",
      }),
      fetchVerifiableEvents({
        page: 1,
        page_size: 5,
        verification_status: "pending",
      }),
      fetchActivityLog({ page: 1, page_size: 10 }).catch(() => ({
        data: [] as ActivityEntry[],
        total: 0,
        page: 1,
        page_size: 10,
      })),
    ]);
    stats = statsRes;
    pendingCompanies = companiesRes.data;
    pendingEvents = eventsRes.data;
    recentActivity = activityRes.data;
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Unable to load dashboard data. Please try again later.";
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manager Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Review pending verifications, recent activity, and quick actions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/notifications"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            🔔 Notifications
          </Link>
          <Link
            href="/dashboard/activity"
            className="rounded-lg bg-blue-400 px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:bg-blue-500 hover:shadow-md hover:-translate-y-0.5"
          >
            📊 Activity Log
          </Link>
        </div>
      </div>

      {error ? (
        <ErrorCard message={error} />
      ) : (
        <>
          {/* Stats grid */}
          {stats && <StatsGrid stats={stats} />}

          {/* Quick actions */}
          <QuickActions />

          {/* Two-column layout: Pending tables + Activity feed */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Pending verification tables */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Companies Awaiting Verification
                  </h2>
                  <Link
                    href="/dashboard/companies"
                    className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-600"
                  >
                    View all →
                  </Link>
                </div>
                <PendingCompanies companies={pendingCompanies} />
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Events Awaiting Verification
                  </h2>
                  <Link
                    href="/dashboard/events"
                    className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-600"
                  >
                    View all →
                  </Link>
                </div>
                <PendingEvents events={pendingEvents} />
              </div>
            </div>

            {/* Right: Recent activity sidebar */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <Link
                  href="/dashboard/activity"
                  className="text-sm font-medium text-amber-700 hover:text-amber-900"
                >
                  View all →
                </Link>
              </div>
              <RecentActivity entries={recentActivity} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
