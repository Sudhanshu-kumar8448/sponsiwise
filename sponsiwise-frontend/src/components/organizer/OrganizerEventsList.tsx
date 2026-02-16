import Link from "next/link";
import { fetchOrganizerEvents } from "@/lib/organizer-api";
import type { OrganizerEvent } from "@/lib/types/organizer";

// ─── Event status badge ────────────────────────────────────────────────

const eventStatusConfig: Record<string, { label: string; className: string }> =
  {
    draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
    published: { label: "Published", className: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
    completed: {
      label: "Completed",
      className: "bg-blue-100 text-blue-700",
    },
  };

function EventStatusBadge({ status }: { status: string }) {
  const config = eventStatusConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

// ─── Event card ────────────────────────────────────────────────────────

function OrganizerEventCard({ event }: { event: OrganizerEvent }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow transition-shadow hover:shadow-md">
      {/* Image / placeholder */}
      <div className="aspect-[16/9] w-full bg-gray-200">
        {event.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <span className="text-3xl">📅</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <EventStatusBadge status={event.status} />
          {event.category && (
            <span className="inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
              {event.category}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
          {event.description}
        </p>

        <div className="mt-auto pt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>📍 {event.location}</span>
          <span>
            🗓{" "}
            {new Date(event.start_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Proposal summary */}
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-center">
          <div>
            <p className="text-xs text-gray-500">Proposals</p>
            <p className="text-sm font-bold text-gray-900">
              {event.total_proposals}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-sm font-bold text-yellow-600">
              {event.pending_proposals}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-sm font-bold text-green-600">
              {event.currency} {event.total_sponsorship_amount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Link
            href={`/dashboard/events/${event.id}`}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View details
          </Link>
          <Link
            href={`/dashboard/proposals?event_id=${event.id}`}
            className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors"
          >
            View proposals
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Empty / error states ──────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl">📅</span>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        No events yet
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        You haven&apos;t created any events. Get started by creating your first
        event.
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl">⚠️</span>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        Something went wrong
      </h2>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

// ─── Filter tabs ───────────────────────────────────────────────────────

const statusFilters = [
  { label: "All", value: "" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

// ─── Main component ────────────────────────────────────────────────────

interface OrganizerEventsListProps {
  searchParams: {
    page?: string;
    status?: string;
    search?: string;
  };
}

export default async function OrganizerEventsList({
  searchParams,
}: OrganizerEventsListProps) {
  const page = Number(searchParams.page) || 1;
  const statusFilter = searchParams.status ?? "";
  const search = searchParams.search;

  let events: OrganizerEvent[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const res = await fetchOrganizerEvents({
      page,
      page_size: 12,
      status: statusFilter || undefined,
      search,
    });
    events = res.data;
    total = res.total;
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Unable to load events. Please try again later.";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your events and track sponsorship activity.
        </p>
      </div>

      {/* Search + filters */}
      <form
        method="GET"
        className="flex flex-wrap items-end gap-4 rounded-xl bg-white p-4 shadow"
      >
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="search"
            className="mb-1 block text-xs font-medium text-gray-700"
          >
            Search
          </label>
          <input
            id="search"
            name="search"
            type="text"
            defaultValue={search ?? ""}
            placeholder="Event name or keyword…"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div className="min-w-[160px]">
          <label
            htmlFor="status"
            className="mb-1 block text-xs font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={statusFilter}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            {statusFilters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {error ? (
        <ErrorState message={error} />
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Showing {events.length} of {total} event
            {total !== 1 ? "s" : ""}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <OrganizerEventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          {total > 12 && (
            <div className="flex justify-center gap-4 pt-4">
              {page > 1 && (
                <Link
                  href={`/dashboard/events?page=${page - 1}${statusFilter ? `&status=${statusFilter}` : ""}${search ? `&search=${search}` : ""}`}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ← Previous
                </Link>
              )}
              {page * 12 < total && (
                <Link
                  href={`/dashboard/events?page=${page + 1}${statusFilter ? `&status=${statusFilter}` : ""}${search ? `&search=${search}` : ""}`}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
