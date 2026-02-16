import type { AuthUser } from "@/lib/types/roles";
import { UserRole } from "@/lib/types/roles";
import { navigationByRole } from "./shared/navigation";
import Sidebar from "./shared/Sidebar";
import TopNav from "./shared/TopNav";

interface ManagerLayoutProps {
  user: AuthUser;
  children: React.ReactNode;
}

/**
 * Layout for MANAGER role.
 * Sidebar navigation with manager-specific menu items + accent colour.
 */
export default function ManagerLayout({ user, children }: ManagerLayoutProps) {
  const items = navigationByRole[UserRole.MANAGER];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        role={UserRole.MANAGER}
        items={items}
        accentClass="bg-blue-100 text-blue-700"
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav user={user} title="Manager Console" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
