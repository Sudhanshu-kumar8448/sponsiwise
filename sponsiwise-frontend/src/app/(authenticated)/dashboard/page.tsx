import Link from "next/link";
import { getServerUser } from "@/lib/auth";
import { UserRole } from "@/lib/types/roles";
import {
  fetchSponsorDashboardStats,
  fetchSponsorProposals,
} from "@/lib/sponsor-api";
import type { SponsorDashboardStats, Proposal } from "@/lib/types/sponsor";
import ProposalStatusBadge from "@/components/shared/ProposalStatusBadge";
import OrganizerDashboard from "@/components/organizer/OrganizerDashboard";
import ManagerDashboard from "@/components/manager/ManagerDashboard";
import AdminDashboard from "@/components/admin/AdminDashboard";

// ─── Stats cards ───────────────────────────────────────────────────────

function StatsGrid({ stats }: { stats: SponsorDashboardStats }) {
  const cards = [
    {
      label: "Total Proposals",
      value: stats.total_proposals,
      color: "text-blue-400",
    },
    {
      label: "Pending",
      value: stats.pending_proposals,
      color: "text-yellow-600",
    },
    {
      label: "Approved",
      value: stats.approved_proposals,
      color: "text-green-600",
    },
    {
      label: "Active Sponsorships",
      value: stats.total_sponsorships,
      color: "text-purple-600",
    },
    {
      label: "Total Invested",
      value: `${stats.currency} ${stats.total_invested.toLocaleString()}`,
      color: "text-gray-900",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, i) => (
        <div key={card.label} className="animate-scale-in rounded-xl bg-white p-5 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ animationDelay: `${i * 50}ms` }}>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {card.label}
          </p>
          <p className={`mt-2 text-2xl font-bold ${card.color}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Recent proposals table ────────────────────────────────────────────

function RecentProposals({ proposals }: { proposals: Proposal[] }) {
  if (proposals.length === 0) {
  return (
    <div className="animate-fade-in-up rounded-xl bg-white p-8 text-center shadow-md">
        <span className="text-4xl">📋</span>
        <p className="mt-3 text-sm text-slate-500">
          You haven&apos;t created any proposals yet.
        </p>
        <Link
          href="/dashboard/events"
          className="mt-4 inline-block rounded-lg bg-blue-400 px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:bg-blue-500 hover:shadow-md hover:-translate-y-0.5"
        >
          Browse events
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up overflow-hidden rounded-xl bg-white shadow-md">
      <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 sm:px-6">
              Proposal
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 sm:px-6">
              Event
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 sm:px-6">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 sm:px-6">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 sm:px-6">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {proposals.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-slate-50">
              <td className="px-4 py-4 sm:px-6">
                <Link
                  href={`/dashboard/proposals/${p.id}`}
                  className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-600"
                >
                  {p.title}
                </Link>
              </td>
              <td className="px-4 py-4 text-sm text-slate-600 sm:px-6">
                {p.event.title}
              </td>
              <td className="px-4 py-4 text-sm font-medium text-slate-900 sm:px-6">
                {p.currency} {p.amount.toLocaleString()}
              </td>
              <td className="px-4 py-4 sm:px-6">
                <ProposalStatusBadge status={p.status} />
              </td>
              <td className="px-4 py-4 text-sm text-slate-500 sm:px-6">
                {new Date(p.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
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

// ─── Page ──────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const user = await getServerUser();

  // Admin role → system overview dashboard
  if (user?.role === UserRole.ADMIN) {
    return <AdminDashboard />;
  }

  // Manager role → verification dashboard
  if (user?.role === UserRole.MANAGER) {
    return <ManagerDashboard />;
  }

  // Organizer role → separate dashboard
  if (user?.role === UserRole.ORGANIZER) {
    return <OrganizerDashboard />;
  }

  // Default: Sponsor dashboard
  let stats: SponsorDashboardStats | null = null;
  let recentProposals: Proposal[] = [];
  let error: string | null = null;

  try {
    const [statsRes, proposalsRes] = await Promise.all([
      fetchSponsorDashboardStats(),
      fetchSponsorProposals({ page: 1, page_size: 5 }),
    ]);
    stats = statsRes;
    recentProposals = proposalsRes.data;
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Unable to load dashboard data. Please try again later.";
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Overview of your sponsorship activity.
          </p>
        </div>
        <Link
          href="/dashboard/events"
          className="rounded-lg bg-blue-400 px-4 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-blue-500 hover:shadow-md hover:-translate-y-0.5 self-start sm:self-center"
        >
          Browse events
        </Link>
      </div>

      {error ? (
        <ErrorCard message={error} />
      ) : (
        <>
          {stats && <StatsGrid stats={stats} />}

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Proposals
              </h2>
              <Link
                href="/dashboard/proposals"
                className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-600"
              >
                View all →
              </Link>
            </div>
            <RecentProposals proposals={recentProposals} />
          </div>
        </>
      )}
    </div>
  );
}
