import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  UserPlus,
  Bell,
  Activity,
  ArrowRight,
  AlertCircle,
  FileText,
  XCircle,
} from "lucide-react";
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
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      glow: "shadow-amber-500/20",
      href: "/dashboard/companies?verification_status=pending",
    },
    {
      label: "Companies Verified",
      value: stats.companies_verified,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-green-500",
      glow: "shadow-emerald-500/20",
      href: "/dashboard/companies?verification_status=verified",
    },
    {
      label: "Events Pending",
      value: stats.events_pending,
      icon: Calendar,
      gradient: "from-sky-400 to-blue-500",
      glow: "shadow-sky-500/20",
      href: "/dashboard/events?verification_status=pending",
    },
    {
      label: "Events Verified",
      value: stats.events_verified,
      icon: CheckCircle2,
      gradient: "from-teal-400 to-emerald-500",
      glow: "shadow-teal-500/20",
      href: "/dashboard/events?verification_status=verified",
    },
    {
      label: "Total Users",
      value: stats.total_users,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      glow: "shadow-blue-500/20",
      href: null,
    },
    {
      label: "Recent Registrations",
      value: stats.recent_registrations,
      icon: UserPlus,
      gradient: "from-purple-500 to-violet-500",
      glow: "shadow-purple-500/20",
      href: "/dashboard/activity?type=user_registered",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const inner = (
          <div className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all duration-300 hover:border-slate-700 hover:-translate-y-0.5 hover:shadow-lg ${card.glow}`}>
            <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-xl transition-opacity group-hover:opacity-20`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {card.value}
                </p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg ${card.glow}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        );
        return card.href ? (
          <Link key={card.label} href={card.href}>{inner}</Link>
        ) : (
          <div key={card.label}>{inner}</div>
        );
      })}
    </div>
  );
}

// ─── Pending companies table ───────────────────────────────────────────

function PendingCompanies({ companies }: { companies: VerifiableCompany[] }) {
  if (companies.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
        <p className="mt-3 text-sm text-slate-400">
          No companies awaiting verification.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Industry</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {companies.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/companies/${c.id}`}
                    className="text-sm font-medium text-blue-400 hover:text-sky-300 transition-colors"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{c.owner.email}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{c.industry ?? "—"}</td>
                <td className="px-6 py-4"><VerificationStatusBadge status={c.verification_status} /></td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Pending events table ──────────────────────────────────────────────

function PendingEvents({ events }: { events: VerifiableEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
        <p className="mt-3 text-sm text-slate-400">
          No events awaiting verification.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Organizer</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/events/${e.id}`}
                    className="text-sm font-medium text-blue-400 hover:text-sky-300 transition-colors"
                  >
                    {e.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{e.organizer.name}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{e.category || "—"}</td>
                <td className="px-6 py-4"><VerificationStatusBadge status={e.verification_status} /></td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Recent activity feed ──────────────────────────────────────────────

const activityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "proposal.created": FileText,
  "proposal.submitted": FileText,
  "proposal.approved": CheckCircle2,
  "proposal.rejected": XCircle,
  "company.created": Building2,
  "company.verified": CheckCircle2,
  "company.rejected": XCircle,
  "event.created": Calendar,
  "event.verified": CheckCircle2,
  "event.rejected": XCircle,
};

const activityColors: Record<string, string> = {
  "proposal.created": "text-blue-400 bg-blue-500/10",
  "proposal.submitted": "text-sky-400 bg-sky-500/10",
  "proposal.approved": "text-emerald-400 bg-emerald-500/10",
  "proposal.rejected": "text-red-400 bg-red-500/10",
  "company.created": "text-purple-400 bg-purple-500/10",
  "company.verified": "text-emerald-400 bg-emerald-500/10",
  "company.rejected": "text-red-400 bg-red-500/10",
  "event.created": "text-sky-400 bg-sky-500/10",
  "event.verified": "text-emerald-400 bg-emerald-500/10",
  "event.rejected": "text-red-400 bg-red-500/10",
};

function RecentActivity({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <Activity className="mx-auto h-8 w-8 text-slate-500" />
        <p className="mt-3 text-sm text-slate-400">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 divide-y divide-slate-800">
      {entries.map((entry) => {
        const Icon = activityIcons[entry.action] ?? Activity;
        const colorClass = activityColors[entry.action] ?? "text-slate-400 bg-slate-500/10";

        return (
          <div
            key={entry.id}
            className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-800/50 transition-colors"
          >
            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-300">
                <span className="font-medium capitalize">
                  {entry.action.replace(/\./g, " ").replace(/_/g, " ")}
                </span>
                {entry.entity_type && (
                  <>
                    {" — "}
                    <span className="font-mono text-xs text-slate-500">
                      {entry.entity_type}
                    </span>
                  </>
                )}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
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
      icon: Building2,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20 hover:border-blue-500/40",
    },
    {
      label: "View Events",
      href: "/dashboard/events",
      icon: Calendar,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20 hover:border-sky-500/40",
    },
    {
      label: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20 hover:border-amber-500/40",
    },
    {
      label: "Activity Log",
      href: "/dashboard/activity",
      icon: Activity,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20 hover:border-purple-500/40",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className={`group flex items-center gap-3 rounded-2xl border bg-slate-900 px-5 py-4 font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${action.border}`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${action.bg}`}>
              <Icon className={`h-4 w-4 ${action.color}`} />
            </div>
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

// ─── Error fallback ────────────────────────────────────────────────────

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
      <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
      <p className="mt-2 text-sm text-red-300">{message}</p>
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Manager Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Review pending verifications, recent activity, and quick actions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/notifications"
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:text-white"
          >
            <Bell className="inline-block h-4 w-4 mr-1.5" />
            Notifications
          </Link>
          <Link
            href="/dashboard/activity"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            <Activity className="h-4 w-4" />
            Activity Log
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
                  <h2 className="text-lg font-semibold text-white">
                    Companies Awaiting Verification
                  </h2>
                  <Link
                    href="/dashboard/companies"
                    className="group inline-flex items-center gap-1 text-sm font-medium text-blue-400 transition-colors hover:text-sky-300"
                  >
                    View all
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <PendingCompanies companies={pendingCompanies} />
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    Events Awaiting Verification
                  </h2>
                  <Link
                    href="/dashboard/events"
                    className="group inline-flex items-center gap-1 text-sm font-medium text-blue-400 transition-colors hover:text-sky-300"
                  >
                    View all
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <PendingEvents events={pendingEvents} />
              </div>
            </div>

            {/* Right: Recent activity sidebar */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Recent Activity
                </h2>
                <Link
                  href="/dashboard/activity"
                  className="group inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-sky-300 transition-colors"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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
