"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
];

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── Navbar ───────────────────────────────────── */}
      <header className="sticky top-0 z-50 glass-strong shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-400 shadow-md shadow-brand-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary group-hover:text-brand-500 transition-colors">
              Sponsi<span className="gradient-text">wise</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
                  ${pathname === link.href
                    ? "bg-brand-50 text-brand-600"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-[var(--radius-button)] px-4 py-2 text-sm font-semibold text-text-secondary transition-all hover:text-brand-600"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-[var(--radius-button)] bg-gradient-to-r from-brand-500 to-brand-400 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/20 transition-all hover:shadow-lg hover:from-brand-600 hover:to-brand-500 active:scale-[0.97]"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-muted md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="animate-fade-in border-t border-border bg-white px-4 pb-6 pt-4 md:hidden">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    block rounded-lg px-4 py-2.5 text-sm font-medium transition-all
                    ${pathname === link.href
                      ? "bg-brand-50 text-brand-600"
                      : "text-text-secondary hover:bg-surface-muted"
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-[var(--radius-button)] border-2 border-brand-200 px-4 py-2.5 text-center text-sm font-semibold text-brand-600 transition-all hover:bg-brand-50"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="rounded-[var(--radius-button)] bg-gradient-to-r from-brand-500 to-brand-400 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Main ─────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-border bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-400">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-text-primary">
                  Sponsiwise
                </span>
              </div>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                The modern platform connecting sponsors with events. Simplify
                sponsorship management.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-sm font-semibold text-text-primary">Platform</h4>
              <ul className="mt-3 space-y-2">
                {["Events", "How It Works", "Pricing"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/events"
                      className="text-sm text-text-secondary transition-colors hover:text-brand-500"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-text-primary">Company</h4>
              <ul className="mt-3 space-y-2">
                {["About", "Contact", "Careers"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/about"
                      className="text-sm text-text-secondary transition-colors hover:text-brand-500"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-text-primary">Legal</h4>
              <ul className="mt-3 space-y-2">
                {["Privacy Policy", "Terms of Service"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/"
                      className="text-sm text-text-secondary transition-colors hover:text-brand-500"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
            <p className="text-sm text-text-muted">
              © 2026 Sponsiwise. All rights reserved.
            </p>
            <div className="flex gap-4">
              <span className="text-sm text-text-muted">Made with 💙</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
