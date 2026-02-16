import type { ReactNode } from "react";

// ─── Colour lookup (safe for Tailwind's class scanner) ─────────────────

const focusRing: Record<string, string> = {
  blue:  "focus:border-blue-500 focus:ring-blue-500",
  red:   "focus:border-red-400 focus:ring-red-400",
  amber: "focus:border-amber-500 focus:ring-amber-500",
  green: "focus:border-green-500 focus:ring-green-500",
};

const buttonBg: Record<string, string> = {
  blue:  "bg-blue-600 hover:bg-blue-700",
  red:   "bg-red-600 hover:bg-red-700",
  amber: "bg-amber-600 hover:bg-amber-700",
  green: "bg-green-600 hover:bg-green-700",
};

// ─── Props ─────────────────────────────────────────────────────────────

interface SearchBarProps {
  /** Current search value (for `defaultValue`) */
  defaultValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /**
   * Accent colour key (e.g. "red", "amber", "green").
   * Controls focus ring and submit button colours.
   * Default: "blue"
   */
  color?: string;
  /**
   * Additional hidden fields to preserve existing query params.
   * Rendered as `<input type="hidden" name={key} value={value} />`.
   */
  hiddenFields?: Record<string, string | undefined>;
  /** Optional extra content (e.g. a select dropdown) rendered after the input */
  children?: ReactNode;
}

/**
 * Generic search bar wrapped in a GET `<form>`.
 *
 * - Submits to the same page (no action needed)
 * - Preserves other query params via `hiddenFields`
 * - Server Component safe (stateless)
 */
export default function SearchBar({
  defaultValue,
  placeholder = "Search…",
  color = "blue",
  hiddenFields,
  children,
}: SearchBarProps) {
  return (
    <form className="rounded-xl bg-white p-4 shadow">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <input
            type="text"
            name="search"
            defaultValue={defaultValue}
            placeholder={placeholder}
            className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 ${focusRing[color] ?? focusRing.blue}`}
          />
        </div>

        {children}

        {/* Preserve existing query params */}
        {hiddenFields &&
          Object.entries(hiddenFields).map(
            ([key, value]) =>
              value && (
                <input key={key} type="hidden" name={key} value={value} />
              ),
          )}

        <button
          type="submit"
          className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${buttonBg[color] ?? buttonBg.blue}`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
