import type { AuthUser } from "@/lib/types/roles";
import { UserRole } from "@/lib/types/roles";
import { navigationByRole } from "./shared/navigation";
import Sidebar from "./shared/Sidebar";
import TopNav from "./shared/TopNav";

interface OrganizerLayoutProps {
  user: AuthUser;
  children: React.ReactNode;
}

/**
 * Layout for ORGANIZER role.
 * Sidebar navigation with organizer-specific menu items + accent colour.
 */
export default function OrganizerLayout({
  user,
  children,
}: OrganizerLayoutProps) {
  const items = navigationByRole[UserRole.ORGANIZER];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        role={UserRole.ORGANIZER}
        items={items}
        accentClass="bg-blue-100 text-blue-700"
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav user={user} title="Organizer Portal" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
