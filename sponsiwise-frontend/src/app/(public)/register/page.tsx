"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient, ApiError } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiClient.post("/auth/register", { email, password });
      // Backend sets HTTP-only cookies automatically.
      // Redirect on success — auth state will be resolved later via /auth/me.
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  //isme email already exist ka message nahi hai wo dekhana hai

  return (
    <>
      <main className="animate-fade-in-up mx-auto my-16 sm:my-20 max-w-[420px] rounded-2xl bg-white p-8 shadow-[0_8px_32px_rgba(96,165,250,0.2)] sm:p-10">
        <h1 className="text-center text-3xl font-bold text-blue-400">Create Account</h1>
        <p className="mt-2 mb-8 text-center text-slate-500">Join SponsiWise and get started</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-600">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all hover:border-blue-400/50 hover:bg-white focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-400/20"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-600">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all hover:border-blue-400/50 hover:bg-white focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-400/20"
            />
          </div>

          {error && <p className="animate-fade-in mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-400 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-500 hover:shadow-xl hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
            {loading ? "Registering…" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-400 transition-colors hover:text-blue-500 hover:underline">Log in</Link>
        </p>
      </main>
    </>
  );
}
