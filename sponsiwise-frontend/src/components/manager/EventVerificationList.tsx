import Link from "next/link";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchVerifiableEvents } from "@/lib/manager-api";
import type { VerifiableEvent } from "@/lib/types/manager";
import { VerificationStatus } from "@/lib/types/manager";
import { normalizeError } from "@/lib/errors";
import {
  SearchBar,
  FilterTabs,
  ErrorState,
  EmptyState,
  DataTable,
  Pagination,
  VerificationStatusBadge,
} from "@/components/shared";
import type { Column } from "@/components/shared/DataTable";

// ─── Filter tabs ───────────────────────────────────────────────────────

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: VerificationStatus.PENDING, label: "Pending" },
  { value: VerificationStatus.VERIFIED, label: "Verified" },
  { value: VerificationStatus.REJECTED, label: "Rejected" },
];

const PAGE_SIZE = 15;

// ─── Main component ────────────────────────────────────────────────────

interface EventVerificationListProps {
  searchParams: {
    page?: string;
    verification_status?: string;
    search?: string;
  };
}

export default async function EventVerificationList({
  searchParams,
}: EventVerificationListProps) {
  const page = Number(searchParams.page) || 1;
  const statusFilter = searchParams.verification_status ?? "";
  const search = searchParams.search;

  let events: VerifiableEvent[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const res = await fetchVerifiableEvents({
      page,
      page_size: PAGE_SIZE,
      verification_status: statusFilter || undefined,
      search,
    });
    events = res.data;
    total = res.total;
  } catch (err) {
    error = normalizeError(err, "Unable to load events. Please try again later.");
  }

  const hasFilter = !!statusFilter || !!search;

  // Build link helper
  function buildHref(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = {
      verification_status: statusFilter || undefined,
      search,
      ...overrides,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    return `/dashboard/events${qs ? `?${qs}` : ""}`;
  }

  // Column definitions
  const columns: Column<VerifiableEvent>[] = [
    {
      key: "title",
      header: "Event",
      render: (e) => (
        <Link
          href={`/dashboard/events/${e.id}`}
          className="text-sm font-medium text-blue-400 hover:text-sky-300 transition-colors"
        >
          {e.title}
        </Link>
      ),
    },
    {
      key: "organizer",
      header: "Organizer",
      render: (e) => (
        <div className="flex items-center gap-2">
          {e.organizer.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={e.organizer.logo_url}
              alt={e.organizer.name}
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-300">
              {e.organizer.name.charAt(0)}
            </span>
          )}
          <span className="text-sm text-slate-300">{e.organizer.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      hideOnMobile: true,
      render: (e) => (
        <span className="text-sm text-slate-400">{e.category || "—"}</span>
      ),
    },
    {
      key: "start_date",
      header: "Date",
      hideOnMobile: true,
      render: (e) => (
        <span className="text-sm text-slate-400">
          {new Date(e.start_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "verification_status",
      header: "Status",
      render: (e) => (
        <VerificationStatusBadge status={e.verification_status} />
      ),
    },
    {
      key: "created_at",
      header: "Created",
      hideOnMobile: true,
      render: (e) => (
        <span className="text-sm text-slate-500">
          {new Date(e.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "lifecycle",
      header: "",
      hideOnMobile: true,
      render: (e) => (
        <Link
          href={`/dashboard/events/${e.id}/lifecycle`}
          className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
        >
          📊 Lifecycle
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Event Verification
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Review and verify submitted events.
        </p>
      </div>

      {/* Search + filters */}
      <div className="space-y-4">
        <SearchBar
          defaultValue={search}
          placeholder="Event name or organizer…"
          color="amber"
          hiddenFields={{
            verification_status: statusFilter || undefined,
          }}
        />

        <div className="flex flex-wrap gap-2">
          <FilterTabs
            tabs={STATUS_TABS}
            activeValue={statusFilter}
            buildHref={(v) =>
              buildHref({ verification_status: v || undefined, page: undefined })
            }
            activeColor="bg-amber-600"
          />
        </div>
      </div>

      {/* Results */}
      {error ? (
        <ErrorState message={error} />
      ) : events.length === 0 ? (
        <EmptyState
          icon="📅"
          heading={hasFilter ? "No matching events" : "No events to review"}
          description={
            hasFilter
              ? "Try changing filters to see more results."
              : "All events have been reviewed."
          }
        />
      ) : (
        <>
          <p className="text-sm text-slate-500">
            Showing {events.length} of {total} event
            {total !== 1 ? "s" : ""}
          </p>

          <DataTable
            columns={columns}
            data={events}
            rowKey={(e) => e.id}
          />

          <Pagination
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            buildHref={(p) => buildHref({ page: String(p) })}
            showPageLabel={false}
          />
        </>
      )}
    </div>
  );
}
