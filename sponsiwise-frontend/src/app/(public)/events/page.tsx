import Link from "next/link";
import { fetchPublicEvents } from "@/lib/public-api";
import type { PublicEvent } from "@/lib/types/public";

// ─── Event card ────────────────────────────────────────────────────────

function EventCard({ event }: { event: PublicEvent }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
    >
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

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category tag */}
        {event.category && (
          <span className="mb-2 inline-block self-start rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
            {event.category}
          </span>
        )}

        <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-400">
          {event.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
          {event.description}
        </p>

        {/* Meta */}
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

        {/* Organizer */}
        {event.organizer && (
          <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
            {event.organizer.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.organizer.logo_url}
                alt={event.organizer.name}
                className="h-5 w-5 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-500">
                {event.organizer.name.charAt(0)}
              </span>
            )}
            <span className="text-xs text-gray-500">
              {event.organizer.name}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl">🔍</span>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        No events found
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        There are no published events at the moment. Check back soon!
      </p>
    </div>
  );
}

// ─── Error state ───────────────────────────────────────────────────────

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

// ─── Page (Server Component) ───────────────────────────────────────────

interface ExploreEventsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function ExploreEventsPage({
  searchParams,
}: ExploreEventsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = params.category;
  const search = params.search;

  let events: PublicEvent[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const res = await fetchPublicEvents({
      page,
      page_size: 12,
      category,
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
    <div className="space-y-6 sm:space-y-8">
      {/* ── Header ────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Explore Events</h1>
        <p className="mt-1 text-gray-600">
          Discover published events looking for sponsors.
        </p>
      </div>

      {/* ── Filters (basic — search + category) ──────── */}
      <form
        method="GET"
        className="flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="min-w-[160px]">
          <label
            htmlFor="category"
            className="mb-1 block text-xs font-medium text-gray-700"
          >
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={category ?? ""}
            placeholder="e.g. Tech, Sports…"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-blue-400 px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:bg-blue-500 hover:shadow-md hover:-translate-y-0.5"
        >
          Search
        </button>
      </form>

      {/* ── Results ───────────────────────────────────── */}
      {error ? (
        <ErrorState message={error} />
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Showing {events.length} of {total} events
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* ── Pagination (simple prev/next) ──────────── */}
          {total > 12 && (
            <div className="flex justify-center gap-4 pt-4">
              {page > 1 && (
                <Link
                  href={`/events?page=${page - 1}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ← Previous
                </Link>
              )}
              {page * 12 < total && (
                <Link
                  href={`/events?page=${page + 1}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
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
