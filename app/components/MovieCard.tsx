/*
 * app/components/MovieCard.tsx
 * Date: August 2026
 * Description: Individual movie card displayed in the catalogue grid.
 *   Inputs:  movie — the Movie object to display.
 *     isAdmin — boolean controlling edit/delete button visibility.
 *     onEdit   — callback to open the edit modal for this movie.
 *     onDelete — callback to delete this movie after confirmation.
 *   Processing: Renders title, colour-coded genre badge, release year,
 *     and actor tags. Genre colours are mapped to distinct pastel shades
 *     with dark text for maximum readability on the dark background.
 *     Admin controls are only rendered when isAdmin is true.
 *   Outputs: A styled dark card element with gold accent top border.
 */

"use client";

import type { Movie } from "@/types";

// ─── Genre colour map — bright pastels with dark text ────────────────────────
const GENRE_COLORS: Record<string, { bg: string; text: string }> = {
  "Action":           { bg: "#fca5a5", text: "#7f1d1d" },
  "Comedy":           { bg: "#fde68a", text: "#713f12" },
  "Crime":            { bg: "#c4b5fd", text: "#2e1065" },
  "Drama":            { bg: "#93c5fd", text: "#1e3a5f" },
  "Fantasy":          { bg: "#6ee7b7", text: "#064e3b" },
  "Historical Drama": { bg: "#fdba74", text: "#431407" },
  "Horror":           { bg: "#f87171", text: "#7f1d1d" },
  "Romance":          { bg: "#f9a8d4", text: "#831843" },
  "Sci-Fi":           { bg: "#a5b4fc", text: "#1e1b4b" },
  "Thriller":         { bg: "#e2e8f0", text: "#1e293b" },
};

const DEFAULT_GENRE_COLOR = { bg: "#d4af37", text: "#09090f" };

interface MovieCardProps {
  movie:    Movie;
  isAdmin:  boolean;
  onEdit:   (movie: Movie) => void;
  onDelete: (id: string) => void;
}

export default function MovieCard({ movie, isAdmin, onEdit, onDelete }: MovieCardProps) {
  const actors = movie.actors.split(",").map((a) => a.trim());
  const gc     = GENRE_COLORS[movie.genre] ?? DEFAULT_GENRE_COLOR;

  const handleDelete = () => {
    if (confirm(`Delete "${movie.title}"? This cannot be undone.`)) {
      onDelete(movie.id);
    }
  };

  return (
    <article
      style={{
        background: "var(--bg-card)",
        border:     "1px solid var(--border)",
        borderTop:  "3px solid var(--gold)",
      }}
      className="rounded-xl p-5 flex flex-col gap-4 hover:border-yellow-600 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 style={{ color: "var(--text)" }} className="font-bold text-lg leading-snug">
            {movie.title}
          </h3>
          <span
            style={{ background: gc.bg, color: gc.text }}
            className="inline-block mt-1.5 px-2.5 py-0.5 rounded text-xs font-bold"
          >
            {movie.genre}
          </span>
        </div>

        {/* Release year badge */}
        <div
          style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
          className="flex-shrink-0 px-3 py-1 rounded text-sm font-mono"
        >
          {movie.release_year}
        </div>
      </div>

      {/* Actors */}
      <div>
        <p style={{ color: "var(--text-muted)" }} className="text-xs uppercase tracking-wider mb-2 font-semibold">
          Cast
        </p>
        <div className="flex flex-wrap gap-1.5">
          {actors.map((actor) => (
            <span
              key={actor}
              style={{
                background: "var(--bg-panel)",
                color:      "var(--text-muted)",
                border:     "1px solid var(--border)",
              }}
              className="px-2.5 py-1 rounded text-xs"
            >
              {actor}
            </span>
          ))}
        </div>
      </div>

      {/* Admin controls */}
      {isAdmin && (
        <div style={{ borderTop: "1px solid var(--border)" }} className="flex gap-2 pt-3 mt-auto">
          <button
            onClick={() => onEdit(movie)}
            style={{ border: "1px solid var(--gold-dim)", color: "var(--gold)" }}
            className="flex-1 py-2 rounded text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            style={{ border: "1px solid var(--red-dim)", color: "var(--red)" }}
            className="flex-1 py-2 rounded text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
