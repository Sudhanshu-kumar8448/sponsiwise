import type { TimelineEntry, TimelineType } from "@/lib/types/manager";

/**
 * LifecycleTimeline — vertical timeline of all lifecycle actions.
 *
 * Each entry has:
 *  - Icon (different per type: email, proposal, verification)
 *  - Title
 *  - Description
 *  - Status badge (SENT/FAILED/APPROVED/REJECTED/etc.)
 *  - Timestamp formatted
 *  - Recipient if email
 *
 * Visual distinction:
 *  - Success (green): verified, approved, sent
 *  - Failure (red): rejected, failed
 *  - Pending (yellow): submitted, status_changed
 *  - Neutral (gray): created, audit
 *
 * ──────────────────────────────────────────────────────────────────
 * TEST SCENARIOS (in comments)
 * ──────────────────────────────────────────────────────────────────
 *
 * Case 1: Event created, no proposals, not verified
 *   → Only EVENT_CREATED entry shown, gray/neutral
 *
 * Case 2: Event verified, 2 proposals submitted, 1 approved, emails sent
 *   → Multiple entries, green/yellow badges, email entries showing recipients
 *
 * Case 3: Email failed
 *   → EMAIL_FAILED entry has red badge, description shows error
 *
 * Case 4: Multiple proposals
 *   → Deduplicated entries, each proposal has its own timeline items
 */

// ─── Visual config per timeline type ───────────────────────────────────

interface TypeVisual {
  icon: string;
  label: string;
  color: "green" | "red" | "yellow" | "gray" | "blue" | "purple";
}

const typeVisuals: Record<TimelineType, TypeVisual> = {
  EVENT_CREATED:           { icon: "📅", label: "Event Created",       color: "gray" },
  EVENT_VERIFIED:          { icon: "✅", label: "Event Verified",      color: "green" },
  EVENT_REJECTED:          { icon: "❌", label: "Event Rejected",      color: "red" },
  PROPOSAL_SUBMITTED:      { icon: "📤", label: "Proposal Submitted",  color: "yellow" },
  PROPOSAL_APPROVED:       { icon: "✅", label: "Proposal Approved",   color: "green" },
  PROPOSAL_REJECTED:       { icon: "❌", label: "Proposal Rejected",   color: "red" },
  PROPOSAL_STATUS_CHANGED: { icon: "🔄", label: "Status Changed",     color: "yellow" },
  EMAIL_SENT:              { icon: "📧", label: "Email Sent",         color: "green" },
  EMAIL_FAILED:            { icon: "📧", label: "Email Failed",       color: "red" },
  AUDIT_LOG:               { icon: "📝", label: "Audit Entry",        color: "gray" },
};

const colorClasses: Record<TypeVisual["color"], {
  dot: string;
  badge: string;
  badgeText: string;
  line: string;
  iconBg: string;
}> = {
  green:  { dot: "bg-green-500",  badge: "bg-green-100",  badgeText: "text-green-700",  line: "bg-green-200",  iconBg: "bg-green-100 text-green-700" },
  red:    { dot: "bg-red-500",    badge: "bg-red-100",    badgeText: "text-red-700",    line: "bg-red-200",    iconBg: "bg-red-100 text-red-700" },
  yellow: { dot: "bg-yellow-500", badge: "bg-yellow-100", badgeText: "text-yellow-700", line: "bg-yellow-200", iconBg: "bg-yellow-100 text-yellow-700" },
  gray:   { dot: "bg-gray-400",   badge: "bg-gray-100",   badgeText: "text-gray-600",   line: "bg-gray-200",   iconBg: "bg-gray-100 text-gray-600" },
  blue:   { dot: "bg-blue-500",   badge: "bg-blue-100",   badgeText: "text-blue-700",   line: "bg-blue-200",   iconBg: "bg-blue-100 text-blue-700" },
  purple: { dot: "bg-purple-500", badge: "bg-purple-100", badgeText: "text-purple-700", line: "bg-purple-200", iconBg: "bg-purple-100 text-purple-700" },
};

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Single timeline entry ─────────────────────────────────────────────

function TimelineItem({
  entry,
  isLast,
}: {
  entry: TimelineEntry;
  isLast: boolean;
}) {
  const visual = typeVisuals[entry.type] ?? typeVisuals.AUDIT_LOG;
  const colors = colorClasses[visual.color];

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {/* Vertical connector line */}
      {!isLast && (
        <div
          className={`absolute left-[17px] top-10 bottom-0 w-0.5 ${colors.line}`}
        />
      )}

      {/* Icon circle */}
      <span
        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${colors.iconBg}`}
      >
        {visual.icon}
      </span>

      {/* Content card */}
      <div className="flex-1 rounded-lg bg-white px-4 py-3 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between gap-2">
          {/* Title + badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-gray-900">{visual.label}</p>
            {entry.status && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge} ${colors.badgeText}`}
              >
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                {entry.status}
              </span>
            )}
          </div>

          {/* Timestamp */}
          <time className="shrink-0 text-xs text-gray-400">
            {formatTimestamp(entry.timestamp)}
          </time>
        </div>

        {/* Description */}
        {entry.description && (
          <p className="mt-1 text-sm text-gray-600">{entry.description}</p>
        )}

        {/* Recipient (for email entries) */}
        {entry.recipient && (
          <p className="mt-1 text-xs text-gray-500">
            <span className="font-medium">To:</span> {entry.recipient}
          </p>
        )}

        {/* Subject (for email entries) */}
        {entry.subject && (
          <p className="mt-0.5 text-xs text-gray-500">
            <span className="font-medium">Subject:</span> {entry.subject}
          </p>
        )}

        {/* Actor info */}
        {entry.actorId && (
          <p className="mt-1 text-xs text-gray-400">
            By: {entry.actorId.slice(0, 8)}…
            {entry.actorRole && (
              <span className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                {entry.actorRole}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main timeline component ───────────────────────────────────────────

export default function LifecycleTimeline({
  timeline,
}: {
  timeline: TimelineEntry[];
}) {
  if (timeline.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 shadow text-center">
        <span className="text-3xl">📭</span>
        <p className="mt-2 text-sm text-gray-500">No lifecycle events yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gray-50 p-6 shadow">
      <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Event Timeline
      </h3>
      <div>
        {timeline.map((entry, idx) => (
          <TimelineItem
            key={`${entry.type}-${entry.entityId}-${entry.timestamp}-${idx}`}
            entry={entry}
            isLast={idx === timeline.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
