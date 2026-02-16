import type { ReactNode } from "react";

// ─── Badge variant configuration ───────────────────────────────────────

export interface BadgeVariant {
  label: string;
  className: string;
  /** Optional leading dot (for status indicators) */
  dot?: string;
}

// ─── Props ─────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  /**
   * The raw status value (e.g. "approved", "pending", "active").
   * Looked up in `variants` to find display config.
   */
  status: string;
  /**
   * Map of status values → visual config.
   * Passed by the caller so the badge has zero domain knowledge.
   */
  variants: Record<string, BadgeVariant>;
  /** Fallback when status is not in variants */
  fallback?: BadgeVariant;
  /** Optional children to render after the label */
  children?: ReactNode;
}

const DEFAULT_FALLBACK: BadgeVariant = {
  label: "Unknown",
  className: "bg-gray-100 text-gray-600",
};

/**
 * Generic, domain-agnostic status badge.
 *
 * All colour / label knowledge lives in the `variants` prop passed
 * by the consumer — this component only renders a styled pill.
 *
 * Server Component safe.
 *
 * @example
 * ```tsx
 * const proposalVariants = {
 *   approved: { label: "Approved", className: "bg-green-100 text-green-700" },
 *   rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
 * };
 *
 * <StatusBadge status={proposal.status} variants={proposalVariants} />
 * ```
 */
export default function StatusBadge({
  status,
  variants,
  fallback = DEFAULT_FALLBACK,
  children,
}: StatusBadgeProps) {
  const cfg = variants[status] ?? fallback;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
    >
      {cfg.dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      )}
      {cfg.label}
      {children}
    </span>
  );
}
