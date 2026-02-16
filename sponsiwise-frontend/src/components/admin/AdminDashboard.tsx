import Link from "next/link";
import { fetchAdminDashboardStats } from "@/lib/admin-api";
import type { AdminDashboardStats } from "@/lib/types/admin";

export default async function AdminDashboard() {
  let stats: AdminDashboardStats | null = null;
  let error: string | null = null;

  try {
    stats = await fetchAdminDashboardStats();
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Failed to load dashboard metrics.";
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">
            {error ?? "Unable to load metrics."}
          </p>
        </div>
      </div>
    );
  }

  // ── Metric cards ───────────────────────────────────────────────────

  const topCards = [
    {
      label: "Total Users",
      value: stats.total_users,
      color: "text-red-600",
      href: "/dashboard/users",
    },
    {
      label: "Active Users",
      value: stats.active_users,
      color: "text-green-600",
      href: "/dashboard/users?status=active",
    },
    {
      label: "Inactive Users",
      value: stats.inactive_users,
      color: "text-gray-600",
      href: "/dashboard/users?status=inactive",
    },
    {
      label: "Recent Signups",
      value: stats.recent_registrations,
      color: "text-blue-400",
    },
  ];

  const entityCards = [
    {
      label: "Companies",
      value: stats.total_companies,
      icon: "🏢",
      color: "text-purple-600",
    },
    {
      label: "Events",
      value: stats.total_events,
      icon: "📅",
      color: "text-indigo-600",
    },
    {
      label: "Proposals",
      value: stats.total_proposals,
      icon: "📋",
      color: "text-amber-600",
    },
    {
      label: "Sponsorships",
      value: stats.total_sponsorships,
      icon: "🤝",
      color: "text-teal-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
        <p className="mt-1 text-sm text-gray-500">
          High-level tenant metrics at a glance
        </p>
      </div>

      {/* User metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topCards.map((card, i) => {
          const inner = (
            <div className="animate-scale-in rounded-xl bg-white p-5 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ animationDelay: `${i * 50}ms` }}>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                {card.label}
              </p>
              <p className={`mt-2 text-3xl font-bold ${card.color}`}>
                {card.value.toLocaleString()}
              </p>
            </div>
          );
          return card.href ? (
            <Link key={card.label} href={card.href}>
              {inner}
            </Link>
          ) : (
            <div key={card.label}>{inner}</div>
          );
        })}
      </div>

      {/* Entity metrics */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Platform Entities
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {entityCards.map((card, i) => (
            <div
              key={card.label}
              className="animate-fade-in-up rounded-xl bg-white p-5 shadow-md transition-all hover:shadow-lg"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{card.icon}</span>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  {card.label}
                </p>
              </div>
              <p className={`mt-2 text-3xl font-bold ${card.color}`}>
                {card.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Users by role breakdown */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Users by Role
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(stats.users_by_role).map(([role, count]) => (
            <Link
              key={role}
              href={`/dashboard/users?role=${role}`}
              className="rounded-xl bg-white p-4 shadow transition-shadow hover:shadow-md"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                {role}
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {count.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Signup trend chart (simple bar-like visualization) */}
      {stats.signup_trend.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Signup Trend (last 30 days)
          </h3>
          <div className="flex items-end gap-1" style={{ height: 120 }}>
            {(() => {
              const maxCount = Math.max(
                ...stats.signup_trend.map((d) => d.count),
                1,
              );
              return stats.signup_trend.map((day) => (
                <div
                  key={day.date}
                  className="group relative flex-1"
                  style={{ height: "100%" }}
                >
                  <div
                    className="absolute bottom-0 w-full rounded-t bg-blue-400 transition-all group-hover:bg-blue-500"
                    style={{
                      height: `${(day.count / maxCount) * 100}%`,
                      minHeight: day.count > 0 ? 2 : 0,
                    }}
                  />
                  {/* Tooltip on hover */}
                  <div className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                    {day.count}
                  </div>
                </div>
              ));
            })()}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-gray-400">
            <span>
              {new Date(stats.signup_trend[0].date).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" },
              )}
            </span>
            <span>
              {new Date(
                stats.signup_trend[stats.signup_trend.length - 1].date,
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/users"
            className="rounded-lg bg-blue-400 px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:bg-blue-500 hover:shadow-md hover:-translate-y-0.5"
          >
            Manage Users
          </Link>
          <Link
            href="/dashboard/users?status=inactive"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Inactive Users
          </Link>
        </div>
      </div>
    </div>
  );
}
