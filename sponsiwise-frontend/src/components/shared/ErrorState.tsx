import type { ReactNode } from "react";

// ─── Props ─────────────────────────────────────────────────────────────

interface ErrorStateProps {
  /** Error message to display */
  message: string;
  /** Optional icon or emoji shown above the message (default: ⚠️) */
  icon?: ReactNode;
  /** Optional heading (default: none) */
  heading?: string;
  /** Optional retry or navigation link */
  action?: ReactNode;
}

/**
 * Generic error card for displaying fetch/operation failures.
 *
 * - Server Component safe
 * - Zero domain knowledge — message and optional icon via props
 */
export default function ErrorState({
  message,
  icon = "⚠️",
  heading,
  action,
}: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      {icon && <span className="text-4xl">{icon}</span>}
      {heading && (
        <h2 className="mt-3 text-lg font-semibold text-gray-900">
          {heading}
        </h2>
      )}
      <p className={`${heading ? "mt-1" : "mt-3"} text-sm text-red-700`}>
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
