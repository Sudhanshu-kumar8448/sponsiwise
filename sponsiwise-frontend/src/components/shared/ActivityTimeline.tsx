import Link from "next/link";
import { fetchAuditLogs } from "@/lib/audit-api";
import type { AuditLogEntry } from "@/lib/types/audit";
import { normalizeError } from "@/lib/errors";
import { FilterTabs, ErrorState, EmptyState, Pagination, StatusBadge } from "@/components/shared";
import type { BadgeVariant } from "@/components/shared";

// ─── Action → visual config ───────────────────────────────────────────

const actionIcons: Record<string, { icon: string; color: string }> = {
  "proposal.created":       { icon: "📋", color: "bg-blue-100 text-blue-700" },
  "proposal.submitted":     { icon: "📤", color: "bg-yellow-100 text-yellow-700" },
  "proposal.approved":      { icon: "✅", color: "bg-green-100 text-green-700" },
  "proposal.rejected":      { icon: "❌", color: "bg-red-100 text-red-700" },
  "proposal.withdrawn":     { icon: "↩️", color: "bg-gray-100 text-gray-600" },
  "proposal.status_changed":{ icon: "🔄", color: "bg-amber-100 text-amber-700" },
  "company.created":        { icon: "🏢", color: "bg-purple-100 text-purple-700" },
  "company.verified":       { icon: "✅", color: "bg-green-100 text-green-700" },
  "company.rejected":       { icon: "❌", color: "bg-red-100 text-red-700" },
  "company.updated":        { icon: "✏️", color: "bg-blue-100 text-blue-700" },
  "event.created":          { icon: "📅", color: "bg-blue-100 text-blue-700" },
  "event.verified":         { icon: "✅", color: "bg-green-100 text-green-700" },
  "event.rejected":         { icon: "❌", color: "bg-red-100 text-red-700" },
  "event.updated":          { icon: "✏️", color: "bg-blue-100 text-blue-700" },
};

const defaultIcon = { icon: "📌", color: "bg-gray-100 text-gray-600" };

// ─── Action → StatusBadge variants ─────────────────────────────────────

const actionBadgeVariants: Record<string, BadgeVariant> = {
  created:   { label: "Created",   className: "bg-blue-100 text-blue-700",   dot: "bg-blue-500" },
  submitted: { label: "Submitted", className: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  approved:  { label: "Approved",  className: "bg-green-100 text-green-700", dot: "bg-green-500" },
  rejected:  { label: "Rejected",  className: "bg-red-100 text-red-700",     dot: "bg-red-500" },
  verified:  { label: "Verified",  className: "bg-green-100 text-green-700", dot: "bg-green-500" },
  withdrawn: { label: "Withdrawn", className: "bg-gray-100 text-gray-600",   dot: "bg-gray-400" },
  updated:   { label: "Updated",   className: "bg-blue-100 text-blue-700",   dot: "bg-blue-500" },
  status_changed: { label: "Status Changed", className: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
};

// ─── Filter tabs ───────────────────────────────────────────────────────

const ENTITY_TABS = [
  { value: "",         label: "All" },
  { value: "Proposal", label: "Proposals" },
  { value: "Company",  label: "Companies" },
  { value: "Event",    label: "Events" },
];

const PAGE_SIZE = 20;

// ─── Human-readable description ────────────────────────────────────────

function describeAction(entry: AuditLogEntry): string {
  const parts = entry.action.split(".");
  const entity = parts[0] ?? "item";
  const verb = parts[1] ?? "modified";

  const entityName = entity.charAt(0).toUpperCase() + entity.slice(1);

  const shortId = entry.entityId.length > 8
    ? entry.entityId.slice(0, 8) + "…"
    : entry.entityId;

  return `${entityName} ${shortId} was ${verb}`;
}

/** Extract the leaf action (e.g. "proposal.approved" → "approved") */
function leafAction(action: string): string {
  const parts = action.split(".");
  return parts[parts.length - 1] ?? action;
}

// ─── Timeline entry row ────────────────────────────────────────────────

function TimelineEntry({ entry }: { entry: AuditLogEntry }) {
  const visual = actionIcons[entry.action] ?? defaultIcon;
  const leaf = leafAction(entry.action);

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {/* Vertical line */}
      <div className="absolute left-[17px] top-10 bottom-0 w-px bg-gray-200 last:hidden" />

      {/* Icon */}
      <span
        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${visual.color}`}
      >
        {visual.icon}
      </span>

      {/* Content card */}
      <div className="flex-1 rounded-lg bg-white px-4 py-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-gray-900">
            {describeAction(entry)}
          </p>
          <StatusBadge
            status={leaf}
            variants={actionBadgeVariants}
          />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span>
            by <strong className="text-gray-700">{entry.actorRole}</strong>
          </span>
          <span className="text-gray-300">•</span>
          <time dateTime={entry.createdAt}>
            {new Date(entry.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
          <span className="text-gray-300">•</span>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">
            {entry.entityType}
          </span>
        </div>

        {/* Metadata preview */}
        {entry.metadata && Object.keys(entry.metadata).length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer text-[10px] text-gray-400 hover:text-gray-600">
              Details
            </summary>
            <pre className="mt-1 max-h-24 overflow-auto rounded bg-gray-50 p-2 text-[10px] text-gray-600">
              {JSON.stringify(entry.metadata, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────

interface ActivityTimelineProps {
  searchParams: {
    page?: string;
    entityType?: string;
    action?: string;
  };
}

/**
 * Generic activity timeline backed by GET /audit-logs.
 *
 * Works for all authenticated roles:
 *   - USER / SPONSOR / ORGANIZER → own actions
 *   - MANAGER / ADMIN → tenant-wide activity
 *
 * Server Component — all data fetched server-side.
 */
export default async function ActivityTimeline({
  searchParams,
}: ActivityTimelineProps) {
  const page = Number(searchParams.page) || 1;
  const entityType = searchParams.entityType ?? "";
  const actionFilter = searchParams.action ?? "";

  let entries: AuditLogEntry[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const res = await fetchAuditLogs({
      page,
      pageSize: PAGE_SIZE,
      entityType: entityType || undefined,
      action: actionFilter || undefined,
    });
    entries = res.data;
    total = res.total;
  } catch (err) {
    error = normalizeError(
      err,
      "Unable to load activity history. Please try again later.",
    );
  }

  // ── Link builder ───────────────────────────────────────────────────

  function buildHref(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = {
      entityType: entityType || undefined,
      action: actionFilter || undefined,
      ...overrides,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    return `/dashboard/activity${qs ? `?${qs}` : ""}`;
  }

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Activity History
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Timeline of system actions within your scope.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Entity type filter tabs */}
      <div className="flex flex-wrap gap-2">
        <FilterTabs
          tabs={ENTITY_TABS}
          activeValue={entityType}
          buildHref={(v) =>
            buildHref({ entityType: v || undefined, page: undefined })
          }
          activeColor="bg-blue-600"
        />
      </div>

      {/* Results */}
      {error ? (
        <ErrorState message={error} />
      ) : entries.length === 0 ? (
        <EmptyState
          icon="📋"
          heading="No activity found"
          description={
            entityType
              ? `No ${entityType.toLowerCase()} activity to display.`
              : "There is no recent activity to display."
          }
        />
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Showing {entries.length} of {total}{" "}
            {total !== 1 ? "entries" : "entry"}
          </p>

          {/* Timeline */}
          <div className="relative pl-0">
            {entries.map((entry) => (
              <TimelineEntry key={entry.id} entry={entry} />
            ))}
          </div>

          <Pagination
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            buildHref={(p) => buildHref({ page: String(p) })}
          />
        </>
      )}
    </div>
  );
}
