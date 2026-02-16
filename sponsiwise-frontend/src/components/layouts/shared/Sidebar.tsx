import type { UserRole } from "@/lib/types/roles";
import type { NavItem } from "./navigation";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  /** Current user role — drives which nav items render */
  role: UserRole;
  /** Navigation items to display */
  items: NavItem[];
  /** Currently active pathname (for highlighting) */
  currentPath?: string;
  /** Accent color class for the role badge (e.g. "bg-blue-100 text-blue-800") */
  accentClass?: string;
}

/**
 * Shared sidebar used by all authenticated layouts.
 * Rendering is fully server-side — the caller passes role + items.
 */
export default function Sidebar({
  role,
  items,
  currentPath,
  accentClass = "bg-blue-100 text-blue-700",
}: SidebarProps) {
  return (
    <aside className="flex h-full w-56 flex-shrink-0 flex-col border-r border-slate-200 bg-white shadow-sm lg:w-64 animate-slide-in-left">
      {/* ── Brand ─────────────────────────────────────── */}
      <div className="flex h-14 sm:h-16 items-center gap-2 border-b border-slate-200 px-4 sm:px-6">
        <span className="text-lg font-bold text-slate-900">Sponsiwise</span>
      </div>

      {/* ── Navigation ────────────────────────────────── */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4 sm:px-3">
        {items.map((item) => (
          <SidebarItem
              label={item.label}
              href={item.href}
              icon={item.icon}
              active={currentPath === item.href}
            />
        ))}
      </nav>

      {/* ── Role badge ────────────────────────────────── */}
      <div className="border-t border-slate-200 px-3 py-3 sm:px-4">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm ${accentClass}`}
        >
          {role}
        </span>
      </div>
    </aside>
  );
}
