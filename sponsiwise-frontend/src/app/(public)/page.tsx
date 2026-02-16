import Link from "next/link";
import { fetchPlatformStats } from "@/lib/public-api";
import type { PlatformStats } from "@/lib/types/public";

// ─── Stats section (fetched from API, graceful fallback) ───────────

async function StatsSection() {
  let stats: PlatformStats | null = null;

  try {
    stats = await fetchPlatformStats();
  } catch {
    /* API down or endpoint missing — render nothing */
  }

  if (!stats) return null;

  const items = [
    { label: "Events", value: stats.total_events, icon: "🎪" },
    { label: "Sponsors", value: stats.total_sponsors, icon: "🤝" },
    { label: "Organizers", value: stats.total_organizers, icon: "🎯" },
  ];

  return (
    <section className="py-20">
      <h2 className="mb-12 text-center text-2xl font-bold text-gray-800">
        Trusted by the Community
      </h2>
      <div className="grid gap-8 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="group animate-fade-in-up rounded-2xl border border-blue-400/20 bg-white p-8 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/30 hover:shadow-[0_12px_32px_rgba(96,165,250,0.2)] sm:p-10"
          >
            <span className="mb-3 inline-block text-4xl">{item.icon}</span>
            <p className="text-4xl font-extrabold text-blue-400 transition-transform duration-300 group-hover:scale-110 sm:text-5xl">
              {item.value.toLocaleString()}
            </p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-gray-400">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen space-y-0 bg-gradient-to-b from-blue-400/5 via-white to-blue-400/5">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-20 text-center sm:py-28">
        {/* Decorative blurred orbs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl sm:h-[28rem] sm:w-[28rem]" />

        <div className="relative mx-auto max-w-3xl animate-[fadeInUp_0.7s_ease-out]">
          <span className="mb-4 inline-block rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-500">
            Sponsorship made simple
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Connect <span className="text-blue-400">Sponsors</span>{" "}
            with <span className="text-blue-400">Events</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
            Sponsiwise is the platform that makes sponsorship management
            effortless. Find events to sponsor, or attract sponsors to your
            events&nbsp;— all in one place.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center rounded-xl bg-blue-400 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl"
            >
              Get Started Free →
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center rounded-xl border-2 border-blue-400/40 bg-white px-8 py-3.5 text-sm font-semibold text-blue-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-400/20"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live stats (optional — fails gracefully) ── */}
      <div className="mx-auto max-w-5xl px-4">
        <StatsSection />
      </div>

      {/* ── Features ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="text-center text-2xl font-bold text-slate-800 sm:text-3xl">
          Why <span className="text-blue-400">Sponsiwise</span>?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-gray-400">
          Everything you need to manage sponsorships — whether you&apos;re
          funding, organizing, or overseeing.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "For Sponsors",
              icon: "💼",
              description:
                "Discover events that align with your brand. Manage proposals, track ROI, and build lasting partnerships.",
            },
            {
              title: "For Organizers",
              icon: "📋",
              description:
                "Attract the right sponsors for your events. Streamline communication and close deals faster.",
            },
            {
              title: "For Managers",
              icon: "📊",
              description:
                "Oversee your team's portfolio. Monitor performance, approvals, and reporting from one dashboard.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group animate-fade-in-up rounded-2xl border border-blue-400/15 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/30 hover:shadow-lg sm:p-8"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-2xl transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </span>
              <h3 className="text-lg font-bold text-gray-800">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 to-blue-500 px-6 py-12 text-center shadow-xl sm:px-8 sm:py-16">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5" />

          <div className="relative">
            <h2 className="text-3xl font-bold text-white">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-blue-100/80">
              Create a free account and explore what Sponsiwise can do for you.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-400 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </section>

      {/* Keyframes for entrance animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
