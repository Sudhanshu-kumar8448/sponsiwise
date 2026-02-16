import Link from "next/link";

// ─── Tab definition ────────────────────────────────────────────────────

export interface FilterTab {
  /** Unique key and query-param value */
  value: string;
  /** Display label */
  label: string;
}

// ─── Props ─────────────────────────────────────────────────────────────

interface FilterTabsProps {
  /** Available tabs */
  tabs: FilterTab[];
  /** Currently active tab value */
  activeValue: string;
  /** Build href for a tab; caller preserves other query params */
  buildHref: (value: string) => string;
  /** Tailwind colour class for the active pill (e.g. "bg-red-600") */
  activeColor?: string;
}

/**
 * Generic filter pill tabs.
 *
 * - Server Component safe
 * - The caller defines what the tabs mean and where they link
 * - Renders pill links as a Fragment — caller provides the flex wrapper
 */
export default function FilterTabs({
  tabs,
  activeValue,
  buildHref,
  activeColor = "bg-gray-900",
}: FilterTabsProps) {
  return (
    <>
      {tabs.map((tab) => {
        const isActive = tab.value === activeValue;
        return (
          <Link
            key={tab.value}
            href={buildHref(tab.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? `${activeColor} text-white`
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </>
  );
}
