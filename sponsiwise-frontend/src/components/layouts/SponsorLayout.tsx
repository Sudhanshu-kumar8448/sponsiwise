import type { AuthUser } from "@/lib/types/roles";
import { UserRole } from "@/lib/types/roles";
import { navigationByRole } from "./shared/navigation";
import Sidebar from "./shared/Sidebar";
import TopNav from "./shared/TopNav";

interface SponsorLayoutProps {
  user: AuthUser;
  children: React.ReactNode;
}

/**
 * Layout for SPONSOR role.
 * Sidebar navigation with sponsor-specific menu items + accent colour.
 */
export default function SponsorLayout({ user, children }: SponsorLayoutProps) {
  const items = navigationByRole[UserRole.SPONSOR];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        role={UserRole.SPONSOR}
        items={items}
        accentClass="bg-blue-100 text-blue-700"
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav user={user} title="Sponsor Portal" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
