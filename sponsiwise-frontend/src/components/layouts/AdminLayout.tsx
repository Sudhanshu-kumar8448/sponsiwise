import type { AuthUser } from "@/lib/types/roles";
import { UserRole } from "@/lib/types/roles";
import { navigationByRole } from "./shared/navigation";
import Sidebar from "./shared/Sidebar";
import TopNav from "./shared/TopNav";

interface AdminLayoutProps {
  user: AuthUser;
  children: React.ReactNode;
}

/**
 * Layout for ADMIN role.
 * Sidebar navigation with full admin menu + distinctive accent.
 */
export default function AdminLayout({ user, children }: AdminLayoutProps) {
  const items = navigationByRole[UserRole.ADMIN];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        role={UserRole.ADMIN}
        items={items}
        accentClass="bg-blue-100 text-blue-700"
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav user={user} title="Admin Panel" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
