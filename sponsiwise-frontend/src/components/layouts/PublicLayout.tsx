interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for unauthenticated / public pages (home, login, register, etc.)
 * Simple centered layout with a top bar and footer.
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* ── Top bar ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-sm animate-fade-in">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a href="/" className="text-lg font-bold text-slate-900 transition-colors hover:text-blue-400">
            Sponsiwise
          </a>
          <nav className="flex items-center gap-2 sm:gap-4">
            <a
              href="/events"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-400"
            >
              Events
            </a>
            <a
              href="/login"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-400"
            >
              Log in
            </a>
            <a
              href="/register"
              className="rounded-lg bg-blue-400 px-3.5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-500 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign up
            </a>
          </nav>
        </div>
      </header>

      {/* ── Main content ──────────────────────────────── */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 sm:text-left">© 2026 Sponsiwise</p>
        </div>
      </footer>
    </div>
  );
}
