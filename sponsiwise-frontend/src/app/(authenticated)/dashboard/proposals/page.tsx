import Link from "next/link";
import { getServerUser } from "@/lib/auth";
import { UserRole } from "@/lib/types/roles";
import { fetchSponsorProposals } from "@/lib/sponsor-api";
import type { Proposal } from "@/lib/types/sponsor";
import { ProposalStatus } from "@/lib/types/sponsor";
import ProposalStatusBadge from "@/components/shared/ProposalStatusBadge";
import OrganizerProposalsList from "@/components/organizer/OrganizerProposalsList";

// ─── Filter tabs ───────────────────────────────────────────────────────

const statusFilters: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Draft", value: ProposalStatus.DRAFT },
  { label: "Submitted", value: ProposalStatus.SUBMITTED },
  { label: "Under Review", value: ProposalStatus.UNDER_REVIEW },
  { label: "Approved", value: ProposalStatus.APPROVED },
  { label: "Rejected", value: ProposalStatus.REJECTED },
  { label: "Withdrawn", value: ProposalStatus.WITHDRAWN },
];

// ─── Empty state ───────────────────────────────────────────────────────

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 shadow">
      <span className="text-5xl">📋</span>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        {hasFilter ? "No matching proposals" : "No proposals yet"}
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        {hasFilter
          ? "Try removing filters to see all proposals."
          : "Browse events and submit your first sponsorship proposal."}
      </p>
      {!hasFilter && (
        <Link
          href="/dashboard/events"
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Browse events
        </Link>
      )}
    </div>
  );
}

// ─── Error state ───────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <span className="text-4xl">⚠️</span>
      <p className="mt-3 text-sm text-red-700">{message}</p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────

interface ProposalsListPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    event_id?: string;
  }>;
}

export default async function ProposalsListPage({
  searchParams,
}: ProposalsListPageProps) {
  const params = await searchParams;
  const user = await getServerUser();

  // Organizer role → incoming proposals inbox
  if (user?.role === UserRole.ORGANIZER) {
    return <OrganizerProposalsList searchParams={params} />;
  }

  // Default: Sponsor proposals
  const page = Number(params.page) || 1;
  const statusFilter = params.status ?? "";

  let proposals: Proposal[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const res = await fetchSponsorProposals({
      page,
      page_size: 10,
      status: statusFilter || undefined,
    });
    proposals = res.data;
    total = res.total;
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Unable to load proposals. Please try again later.";
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Proposals</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track all your sponsorship proposals.
          </p>
        </div>
        <Link
          href="/dashboard/events"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          New proposal
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => {
          const isActive = f.value === statusFilter;
          return (
            <Link
              key={f.value}
              href={`/dashboard/proposals${f.value ? `?status=${f.value}` : ""}`}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {/* Results */}
      {error ? (
        <ErrorState message={error} />
      ) : proposals.length === 0 ? (
        <EmptyState hasFilter={!!statusFilter} />
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Showing {proposals.length} of {total} proposal
            {total !== 1 ? "s" : ""}
          </p>

          <div className="overflow-hidden rounded-xl bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Proposal
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
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {proposals.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/proposals/${p.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {p.title}
                      </Link>
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
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 10 && (
            <div className="flex justify-center gap-4 pt-4">
              {page > 1 && (
                <Link
                  href={`/dashboard/proposals?page=${page - 1}${statusFilter ? `&status=${statusFilter}` : ""}`}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ← Previous
                </Link>
              )}
              {page * 10 < total && (
                <Link
                  href={`/dashboard/proposals?page=${page + 1}${statusFilter ? `&status=${statusFilter}` : ""}`}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
