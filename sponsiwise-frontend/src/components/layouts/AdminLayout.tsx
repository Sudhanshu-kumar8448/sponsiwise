"use client";

import type { AuthUser } from "@/lib/types/roles";
import { UserRole } from "@/lib/types/roles";
import { navigationByRole } from "./shared/navigation";
import Sidebar, { SidebarProvider } from "./shared/Sidebar";
import TopNav from "./shared/TopNav";

interface AdminLayoutProps {
  user: AuthUser;
  children: React.ReactNode;
}

export default function AdminLayout({ user, children }: AdminLayoutProps) {
  const items = navigationByRole[UserRole.ADMIN];

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-surface-muted">
        <Sidebar
          role={UserRole.ADMIN}
          items={items}
          accentClass="bg-rose-50 text-rose-600"
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNav user={user} title="Admin Console" />

          <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
