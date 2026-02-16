"use client";

import { useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ChevronLeft, ChevronRight, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { UserRole } from "@/lib/types/roles";
import type { NavItem } from "./navigation";

// ─── Sidebar context for collapse state ────────────────────────────────

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => { },
  mobileOpen: false,
  setMobileOpen: () => { },
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// ─── Dynamic Lucide icon ───────────────────────────────────────────────

function DynamicIcon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const IconComp = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!IconComp) return <span className={className}>•</span>;
  return <IconComp className={className} />;
}

// ─── Sidebar ───────────────────────────────────────────────────────────

interface SidebarProps {
  role: UserRole;
  items: NavItem[];
  accentClass?: string;
}

export default function Sidebar({
  role,
  items,
  accentClass = "bg-brand-50 text-brand-600",
}: SidebarProps) {
  const pathname = usePathname();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center justify-between border-b border-border-light px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-400 shadow-md shadow-brand-500/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-text-primary">
              Sponsi<span className="gradient-text">wise</span>
            </span>
          )}
        </Link>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Close button (mobile only) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="flex lg:hidden h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-surface-muted"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                group flex items-center gap-3 rounded-xl px-3 py-2.5
                text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-gradient-to-r from-brand-500/10 to-brand-300/5 text-brand-600 border-l-[3px] border-brand-500 shadow-sm"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary border-l-[3px] border-transparent"
                }
                ${collapsed ? "justify-center px-2" : ""}
              `}
              title={collapsed ? item.label : undefined}
            >
              <DynamicIcon
                name={item.icon}
                className={`h-5 w-5 shrink-0 transition-colors ${isActive
                    ? "text-brand-500"
                    : "text-text-muted group-hover:text-text-secondary"
                  }`}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Role badge */}
      <div className="border-t border-border-light p-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${accentClass}`}
        >
          {!collapsed && role}
          {collapsed && role.charAt(0)}
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl animate-slide-in-left">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex h-full flex-col border-r border-border-light bg-white
          transition-all duration-300
          ${collapsed ? "w-[68px]" : "w-64"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
