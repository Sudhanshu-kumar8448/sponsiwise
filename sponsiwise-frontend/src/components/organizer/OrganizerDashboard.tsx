import Link from "next/link";
import {
  fetchOrganizerDashboardStats,
  fetchIncomingProposals,
} from "@/lib/organizer-api";
import type { OrganizerDashboardStats } from "@/lib/types/organizer";
import type { IncomingProposal } from "@/lib/types/organizer";
import ProposalStatusBadge from "@/components/shared/ProposalStatusBadge";

// ─── Stats cards ───────────────────────────────────────────────────────

function StatsGrid({ stats }: { stats: OrganizerDashboardStats }) {
  const cards = [
    {
      label: "Total Events",
      value: stats.total_events,
      color: "text-green-600",
    },
    {
      label: "Published",
      value: stats.published_events,
      color: "text-blue-400",
    },
    {
      label: "Proposals Received",
      value: stats.total_proposals_received,
      color: "text-purple-600",
    },
    {
      label: "Pending Review",
      value: stats.pending_proposals,
      color: "text-yellow-600",
    },
    {
      label: "Approved",
      value: stats.approved_proposals,
      color: "text-green-600",
    },
    {
      label: "Sponsorship Revenue",
      value: `${stats.currency} ${stats.total_sponsorship_revenue.toLocaleString()}`,
      color: "text-gray-900",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, i) => (
        <div key={card.label} className="animate-scale-in rounded-xl bg-white p-5 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ animationDelay: `${i * 50}ms` }}>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
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

// ─── Recent incoming proposals table ───────────────────────────────────

function RecentProposals({ proposals }: { proposals: IncomingProposal[] }) {
  if (proposals.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow">
        <span className="text-4xl">📬</span>
        <p className="mt-3 text-sm text-gray-500">
          No sponsorship proposals received yet.
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Once sponsors submit proposals for your events, they&apos;ll appear
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up overflow-hidden rounded-xl bg-white shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Proposal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Sponsor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Event
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Received
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {proposals.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <Link
                  href={`/dashboard/proposals/${p.id}`}
                  className="text-sm font-medium text-green-700 hover:text-green-900"
                >
                  {p.title}
                </Link>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {p.sponsor.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.sponsor.logo_url}
                      alt={p.sponsor.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500">
                      {p.sponsor.name.charAt(0)}
                    </span>
                  )}
                  <span className="text-sm text-gray-700">
                    {p.sponsor.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {p.event.title}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {p.currency} {p.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <ProposalStatusBadge status={p.status} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
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

export default async function OrganizerDashboard() {
  let stats: OrganizerDashboardStats | null = null;
  let recentProposals: IncomingProposal[] = [];
  let error: string | null = null;

  try {
    const [statsRes, proposalsRes] = await Promise.all([
      fetchOrganizerDashboardStats(),
      fetchIncomingProposals({ page: 1, page_size: 5 }),
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Overview of your events and sponsorship activity.
          </p>
        </div>
        <Link
          href="/dashboard/events"
          className="rounded-lg bg-blue-400 px-4 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-blue-500 hover:shadow-md hover:-translate-y-0.5"
        >
          My Events
        </Link>
      </div>

      {error ? (
        <ErrorCard message={error} />
      ) : (
        <>
          {stats && <StatsGrid stats={stats} />}

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
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
