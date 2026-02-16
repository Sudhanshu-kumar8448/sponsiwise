"use client";

import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Users,
  Calendar,
  Shield,
  ChevronRight,
  Star,
} from "lucide-react";
import { MotionWrapper } from "@/components/ui";

// ─── Feature data ──────────────────────────────────────────────────────

const features = [
  {
    icon: <Target className="h-6 w-6" />,
    title: "For Sponsors",
    description:
      "Discover events that align with your brand. Manage proposals, track ROI, and build lasting partnerships effortlessly.",
    color: "from-blue-500 to-cyan-400",
    bg: "bg-blue-50",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "For Organizers",
    description:
      "Attract the right sponsors for your events. Streamline communication and close deals faster than ever.",
    color: "from-violet-500 to-purple-400",
    bg: "bg-violet-50",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "For Managers",
    description:
      "Oversee your portfolio with powerful dashboards. Monitor approvals, verification, and performance in real-time.",
    color: "from-emerald-500 to-teal-400",
    bg: "bg-emerald-50",
  },
];

const steps = [
  {
    step: "01",
    title: "Sign Up",
    description: "Create your free account in seconds. Choose your role — sponsor, organizer, or both.",
  },
  {
    step: "02",
    title: "Discover & Connect",
    description: "Browse events, explore sponsorship tiers, and find the perfect match for your brand or event.",
  },
  {
    step: "03",
    title: "Submit & Track",
    description: "Send proposals, manage negotiations, and track every stage of your sponsorship lifecycle.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director, TechVentures",
    quote: "Sponsiwise transformed how we manage event partnerships. The ROI tracking alone saved us 20+ hours per quarter.",
    rating: 5,
  },
  {
    name: "Raj Patel",
    role: "Event Organizer, DevConf",
    quote: "Finding quality sponsors was always a headache. With Sponsiwise, we filled all our tiers in record time.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Brand Manager, NovaCorp",
    quote: "The platform&apos;s transparency and lifecycle tracking gives us complete confidence in every partnership.",
    rating: 5,
  },
];

// ─── Page ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-brand-50 px-4 pb-20 pt-16 sm:pb-28 sm:pt-24">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-brand-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-brand-300/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-300/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <MotionWrapper>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
                <Zap className="h-3.5 w-3.5" />
                Sponsorship made simple
              </span>
            </MotionWrapper>

            <MotionWrapper delay={0.1}>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                Connect{" "}
                <span className="gradient-text">Sponsors</span>
                <br />
                with{" "}
                <span className="gradient-text">Events</span>
              </h1>
            </MotionWrapper>

            <MotionWrapper delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
                Sponsiwise is the platform that makes sponsorship management
                effortless. Find events to sponsor, or attract sponsors to your
                events — all in one place.
              </p>
            </MotionWrapper>

            <MotionWrapper delay={0.3}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/30"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/events"
                  className="group inline-flex items-center gap-2 rounded-xl border-2 border-brand-200 bg-white px-8 py-4 text-base font-semibold text-brand-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10"
                >
                  Explore Events
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </MotionWrapper>

            {/* Trust indicators */}
            <MotionWrapper delay={0.4}>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-emerald-500" /> Verified Partners
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-brand-500" /> 1000+ Users
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500" /> 4.9/5 Rating
                </span>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionWrapper>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Why <span className="gradient-text">Sponsiwise</span>?
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                Everything you need to manage sponsorships — whether you&apos;re
                funding, organizing, or overseeing.
              </p>
            </div>
          </MotionWrapper>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {features.map((feature, i) => (
              <MotionWrapper key={feature.title} delay={i * 0.1}>
                <div className="group rounded-2xl border border-border-light bg-white p-8 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-card-hover)]">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section className="bg-gradient-to-b from-brand-50/50 to-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionWrapper>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                Get started in three simple steps
              </p>
            </div>
          </MotionWrapper>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <MotionWrapper key={step.step} delay={i * 0.15}>
                <div className="relative rounded-2xl border border-border-light bg-white p-8 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
                  <span className="text-5xl font-black text-brand-100">
                    {step.step}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionWrapper>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Loved by Teams Everywhere
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                See what our users have to say
              </p>
            </div>
          </MotionWrapper>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <MotionWrapper key={t.name} delay={i * 0.1}>
                <div className="flex flex-col rounded-2xl border border-border-light bg-white p-8 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star
                        key={si}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-text-secondary">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 border-t border-border-light pt-4">
                    <p className="text-sm font-semibold text-text-primary">
                      {t.name}
                    </p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionWrapper>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 px-8 py-16 text-center shadow-2xl shadow-brand-500/25 sm:px-16 sm:py-20">
              {/* Decorative shapes */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-white/5" />

              <div className="relative">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Ready to get started?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-lg text-blue-100/80">
                  Create your free account and explore what Sponsiwise can do
                  for you. No credit card required.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-brand-600 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    Sign up for free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/10"
                  >
                    Browse Events
                  </Link>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>
    </div>
  );
}
