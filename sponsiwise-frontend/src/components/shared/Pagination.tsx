import Link from "next/link";

// ─── Props ─────────────────────────────────────────────────────────────

interface PaginationProps {
  /** Current page (1-indexed) */
  page: number;
  /** Total number of items across all pages */
  total: number;
  /** Items per page */
  pageSize: number;
  /**
   * Build the href for a given page number.
   * Caller is responsible for preserving existing query params.
   */
  buildHref: (page: number) => string;
  /** Show "Page X of Y" label (default: true) */
  showPageLabel?: boolean;
}

/**
 * Generic pagination bar with Previous / Next links.
 *
 * - Server Component safe
 * - Does not fetch or know about data domains
 * - Uses `<Link>` for instant client-side navigation
 */
export default function Pagination({
  page,
  total,
  pageSize,
  buildHref,
  showPageLabel = true,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-6 py-3 shadow">
      {showPageLabel ? (
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </p>
      ) : (
        <span />
      )}

      <div className="flex gap-2">
        {page > 1 && (
          <Link
            href={buildHref(page - 1)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Previous
          </Link>
        )}
        {page < totalPages && (
          <Link
            href={buildHref(page + 1)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
