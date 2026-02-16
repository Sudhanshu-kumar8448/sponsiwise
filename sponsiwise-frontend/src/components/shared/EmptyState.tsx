import type { ReactNode } from "react";

// ─── Props ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  /** Icon or emoji displayed prominently (default: 📭) */
  icon?: ReactNode;
  /** Primary heading (e.g. "No results found") */
  heading: string;
  /** Optional subtitle with additional context */
  description?: string;
  /** Optional CTA (link or button) */
  action?: ReactNode;
}

/**
 * Generic empty state for lists / tables with no data.
 *
 * - Server Component safe
 * - Zero domain knowledge
 * - Matches the white-card-with-icon pattern used across dashboards
 */
export default function EmptyState({
  icon = "📭",
  heading,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 shadow">
      <span className="text-5xl">{icon}</span>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">{heading}</h2>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
