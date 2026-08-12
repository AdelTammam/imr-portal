/*
 * app/dashboard/page.tsx
 * Date: August 2026
 * Description: Admin-only dashboard showing catalogue statistics.
 *   Inputs:  Current session (server-side auth check) and movie list
 *     fetched from /api/movies.
 *   Processing: Redirects non-admin users to the home page. Fetches
 *     movie data and computes genre breakdown and year range stats.
 *     Provides quick-action links to the main catalogue for CRUD operations.
 *   Outputs: Admin stats dashboard with summary cards and genre breakdown.
 */

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Movie } from "@/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);

  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && !isAdmin) { router.push("/"); return; }
    fetch("/api/movies")
      .then((r) => r.json())
      .then((data: Movie[]) => setMovies(data));
  }, [status, isAdmin, router]);

  if (status === "loading") {
    return <div style={{ color: "var(--text-muted)" }} className="text-center py-20">Loading…</div>;
  }

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const genres = [...new Set(movies.map((m) => m.genre))];
  const years  = movies.map((m) => m.release_year);
  const oldest = years.length ? Math.min(...years) : "—";
  const newest = years.length ? Math.max(...years) : "—";

  const genreCounts = genres.map((g) => ({
    genre: g,
    count: movies.filter((m) => m.genre === g).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 style={{ color: "var(--gold)" }} className="text-3xl font-black tracking-tight">
          Admin Dashboard
        </h1>
        <p style={{ color: "var(--text-muted)" }} className="text-sm mt-1">
          Logged in as {session?.user?.email}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Movies",  value: movies.length, color: "var(--gold)"  },
          { label: "Genres",        value: genres.length, color: "var(--text)"  },
          { label: "Oldest Film",   value: oldest,        color: "var(--text-muted)" },
          { label: "Newest Film",   value: newest,        color: "var(--text-muted)" },
        ].map((s) => (
          <div key={s.label}
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            className="rounded-xl p-5 text-center">
            <div style={{ color: s.color, fontSize: "2rem" }} className="font-black">{s.value}</div>
            <div style={{ color: "var(--text-muted)" }} className="text-xs mt-1 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Genre breakdown */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        className="rounded-xl p-6 mb-6">
        <h2 style={{ color: "var(--text)" }} className="font-bold mb-4">Genre Breakdown</h2>
        <div className="flex flex-col gap-2">
          {genreCounts.map((g) => (
            <div key={g.genre} className="flex items-center gap-3">
              <span style={{ color: "var(--text-muted)" }} className="text-sm w-36 truncate">{g.genre}</span>
              <div className="flex-1 rounded-full overflow-hidden" style={{ background: "var(--bg-panel)", height: "8px" }}>
                <div style={{
                  width:      `${(g.count / movies.length) * 100}%`,
                  background: "var(--gold)",
                  height:     "8px",
                  borderRadius: "9999px",
                  transition: "width 0.5s ease",
                }} />
              </div>
              <span style={{ color: "var(--gold)" }} className="text-sm font-mono w-6 text-right">{g.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick action */}
      <Link href="/"
        style={{ background: "var(--gold)", color: "#09090f" }}
        className="inline-block px-6 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
        → Manage Movie Catalogue
      </Link>
    </div>
  );
}
