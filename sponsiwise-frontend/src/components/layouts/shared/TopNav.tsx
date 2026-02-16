import type { AuthUser } from "@/lib/types/roles";
import NotificationsDropdown from "@/components/shared/NotificationsDropdown";

interface TopNavProps {
  /** Authenticated user (null for public pages) */
  user: AuthUser | null;
  /** Optional page title */
  title?: string;
}

/**
 * Top navigation bar shared across authenticated layouts.
 * Server Component — no "use client" needed.
 */
export default function TopNav({ user, title }: TopNavProps) {
  return (
    <header className="flex h-14 sm:h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 shadow-sm">
      <div className="min-w-0 flex-1">
        {title && (
          <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {user && <NotificationsDropdown />}

        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden truncate max-w-[120px] text-sm text-slate-600 sm:inline md:max-w-[180px]">{user.email}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-400/20 text-sm font-semibold text-blue-600 ring-2 ring-blue-400/30">
              {user.email.charAt(0).toUpperCase()}
            </div>
          </div>
        ) : (
          <span className="text-sm text-slate-500">Not signed in</span>
        )}
      </div>
    </header>
  );
}
