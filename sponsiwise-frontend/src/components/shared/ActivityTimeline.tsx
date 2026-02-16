import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  ArrowUpRight,
  RefreshCw,
  Edit3,
  ArrowLeft,
  ChevronLeft,
  Activity,
} from "lucide-react";
import { fetchAuditLogs } from "@/lib/audit-api";
import type { AuditLogEntry } from "@/lib/types/audit";
import { normalizeError } from "@/lib/errors";
import { FilterTabs, ErrorState, EmptyState, Pagination, StatusBadge } from "@/components/shared";
import type { BadgeVariant } from "@/components/shared";

// ─── Action → visual config ───────────────────────────────────────────

const actionIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "proposal.created": FileText,
  "proposal.submitted": ArrowUpRight,
  "proposal.approved": CheckCircle2,
  "proposal.rejected": XCircle,
  "proposal.withdrawn": ArrowLeft,
  "proposal.status_changed": RefreshCw,
  "company.created": Building2,
  "company.verified": CheckCircle2,
  "company.rejected": XCircle,
  "company.updated": Edit3,
  "event.created": Calendar,
  "event.verified": CheckCircle2,
  "event.rejected": XCircle,
  "event.updated": Edit3,
};

const actionColors: Record<string, string> = {
  "proposal.created": "text-blue-400 bg-blue-500/10",
  "proposal.submitted": "text-amber-400 bg-amber-500/10",
  "proposal.approved": "text-emerald-400 bg-emerald-500/10",
  "proposal.rejected": "text-red-400 bg-red-500/10",
  "proposal.withdrawn": "text-slate-400 bg-slate-500/10",
  "proposal.status_changed": "text-amber-400 bg-amber-500/10",
  "company.created": "text-purple-400 bg-purple-500/10",
  "company.verified": "text-emerald-400 bg-emerald-500/10",
  "company.rejected": "text-red-400 bg-red-500/10",
  "company.updated": "text-blue-400 bg-blue-500/10",
  "event.created": "text-sky-400 bg-sky-500/10",
  "event.verified": "text-emerald-400 bg-emerald-500/10",
  "event.rejected": "text-red-400 bg-red-500/10",
  "event.updated": "text-blue-400 bg-blue-500/10",
};

// ─── Action → StatusBadge variants ─────────────────────────────────────

const actionBadgeVariants: Record<string, BadgeVariant> = {
  created: { label: "Created", className: "bg-blue-500/10 text-blue-400", dot: "bg-blue-500" },
  submitted: { label: "Submitted", className: "bg-amber-500/10 text-amber-400", dot: "bg-amber-500" },
  approved: { label: "Approved", className: "bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-500" },
  rejected: { label: "Rejected", className: "bg-red-500/10 text-red-400", dot: "bg-red-500" },
  verified: { label: "Verified", className: "bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-500" },
  withdrawn: { label: "Withdrawn", className: "bg-slate-500/10 text-slate-400", dot: "bg-slate-400" },
  updated: { label: "Updated", className: "bg-blue-500/10 text-blue-400", dot: "bg-blue-500" },
  status_changed: { label: "Status Changed", className: "bg-amber-500/10 text-amber-400", dot: "bg-amber-500" },
};

// ─── Filter tabs ───────────────────────────────────────────────────────

const ENTITY_TABS = [
  { value: "", label: "All" },
  { value: "Proposal", label: "Proposals" },
  { value: "Company", label: "Companies" },
  { value: "Event", label: "Events" },
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

function leafAction(action: string): string {
  const parts = action.split(".");
  return parts[parts.length - 1] ?? action;
}

// ─── Timeline entry row ────────────────────────────────────────────────

function TimelineEntry({ entry }: { entry: AuditLogEntry }) {
  const Icon = actionIconMap[entry.action] ?? Activity;
  const colorClass = actionColors[entry.action] ?? "text-slate-400 bg-slate-500/10";
  const leaf = leafAction(entry.action);

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {/* Vertical line */}
      <div className="absolute left-[17px] top-10 bottom-0 w-px bg-slate-800 last:hidden" />

      {/* Icon */}
      <div
        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colorClass}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Content card */}
      <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-slate-300">
            {describeAction(entry)}
          </p>
          <StatusBadge
            status={leaf}
            variants={actionBadgeVariants}
          />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span>
            by <strong className="text-slate-300">{entry.actorRole}</strong>
          </span>
          <span className="text-slate-700">•</span>
          <time dateTime={entry.createdAt}>
            {new Date(entry.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
          <span className="text-slate-700">•</span>
          <span className="rounded-lg bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
            {entry.entityType}
          </span>
        </div>

        {/* Metadata preview */}
        {entry.metadata && Object.keys(entry.metadata).length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer text-[10px] text-slate-500 hover:text-slate-300">
              Details
            </summary>
            <pre className="mt-1 max-h-24 overflow-auto rounded-lg border border-slate-800 bg-slate-800/50 p-2 text-[10px] text-slate-400">
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Activity History
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Timeline of system actions within your scope.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 self-start rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white sm:self-center"
        >
          <ChevronLeft className="h-4 w-4" />
          Dashboard
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
          <p className="text-sm text-slate-500">
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
