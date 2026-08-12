/*
 * app/page.tsx
 * Date: August 2026
 * Description: Main movie catalogue page for the IMR portal.
 *   Inputs:  Current session (to determine admin status) and movie list
 *     fetched from /api/movies on mount and after any CRUD operation.
 *   Processing: Fetches all movies from the REST API and renders them
 *     in a responsive grid. Admin users see Add Movie button and inline
 *     Edit/Delete controls on each card. Supports search by title or actor,
 *     and genre filter. Manages modal state for add and edit operations.
 *   Outputs: Responsive movie grid with search, filter, and admin controls.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import MovieCard     from "@/app/components/MovieCard";
import AddMovieModal from "@/app/components/AddMovieModal";
import EditMovieModal from "@/app/components/EditMovieModal";
import type { Movie } from "@/types";

const GENRES = [
  "All", "Action", "Comedy", "Crime", "Drama", "Fantasy",
  "Historical Drama", "Horror", "Romance", "Sci-Fi", "Thriller",
];

export default function HomePage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  const [movies,      setMovies]      = useState<Movie[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [search,      setSearch]      = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [showAdd,     setShowAdd]     = useState(false);
  const [editTarget,  setEditTarget]  = useState<Movie | null>(null);

  // ─── Fetch movies from API ─────────────────────────────────────────────────
  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    try {
      const res  = await fetch("/api/movies");
      const data = await res.json() as Movie[];
      setMovies(data);
    } catch {
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  // ─── Delete handler ────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    await fetch(`/api/movies/${id}`, { method: "DELETE" });
    fetchMovies();
  };

  // ─── Filtered movie list ───────────────────────────────────────────────────
  const filtered = movies.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.actors.toLowerCase().includes(q);
    const matchesGenre = genreFilter === "All" || m.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ color: "var(--gold)" }} className="text-3xl font-black tracking-tight">
            Movie Catalogue
          </h1>
          <p style={{ color: "var(--text-muted)" }} className="text-sm mt-1">
            {filtered.length} of {movies.length} titles
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAdd(true)}
            style={{ background: "var(--gold)", color: "#09090f" }}
            className="px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity self-start sm:self-auto"
          >
            + Add Movie
          </button>
        )}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by title or actor…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "var(--bg-card)",
            border:     "1px solid var(--border)",
            color:      "var(--text)",
          }}
          className="flex-1 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors"
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          style={{
            background: "var(--bg-card)",
            border:     "1px solid var(--border)",
            color:      "var(--text)",
          }}
          className="rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors"
        >
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Movie grid */}
      {isLoading ? (
        <div style={{ color: "var(--text-muted)" }} className="text-center py-20 text-sm">
          Loading catalogue…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ color: "var(--text-muted)" }} className="text-center py-20">
          <div className="text-4xl mb-3">🎬</div>
          <p className="font-medium">No movies found.</p>
          {search && (
            <button onClick={() => setSearch("")}
              style={{ color: "var(--gold)" }} className="text-sm mt-2 hover:opacity-80">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isAdmin={isAdmin}
              onEdit={(m) => setEditTarget(m)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddMovieModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); fetchMovies(); }}
        />
      )}
      {editTarget && (
        <EditMovieModal
          movie={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={() => { setEditTarget(null); fetchMovies(); }}
        />
      )}
    </div>
  );
}
