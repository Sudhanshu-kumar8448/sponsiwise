import Link from "next/link";
import type { ReactNode } from "react";

// ─── Column definition ─────────────────────────────────────────────────

export interface Column<T> {
  /** Unique key for React list rendering */
  key: string;
  /** Header text displayed in `<th>` */
  header: string;
  /** Render function for each cell */
  render: (row: T) => ReactNode;
  /** Optional: extra classes on `<th>` and `<td>` */
  className?: string;
  /** When true the column is hidden below `sm:` breakpoint */
  hideOnMobile?: boolean;
}

// ─── Props ─────────────────────────────────────────────────────────────

interface DataTableProps<T> {
  /** Column definitions */
  columns: Column<T>[];
  /** Rows to display */
  data: T[];
  /** Unique key extractor per row */
  rowKey: (row: T) => string;
  /** Optional: href builder for clickable rows */
  rowHref?: (row: T) => string;
}

/**
 * Generic, domain-agnostic data table.
 *
 * - Server Component safe (no state, no effects)
 * - Zero business logic — all data & column config via props
 * - Consistent styling that mirrors every dashboard table
 */
export default function DataTable<T>({
  columns,
  data,
  rowKey,
  rowHref,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-md">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  col.hideOnMobile ? "hidden sm:table-cell" : ""
                } ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {data.map((row) => {
            const key = rowKey(row);
            const href = rowHref?.(row);

            return (
              <tr
                key={key}
                className="transition-colors hover:bg-slate-50"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-6 py-4 ${
                      col.hideOnMobile ? "hidden sm:table-cell" : ""
                    } ${col.className ?? ""}`}
                  >
                    {/* If the row is linkable, wrap the first column */}
                    {href && col.key === columns[0].key ? (
                      <Link href={href} className="block">
                        {col.render(row)}
                      </Link>
                    ) : (
                      col.render(row)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
