/*
 * app/components/AddMovieModal.tsx
 * Date: August 2026
 * Description: Modal form for adding a new movie to the catalogue.
 *   Inputs:  onClose — callback to close the modal without saving.
 *     onSuccess — callback invoked after a successful POST, triggers list refresh.
 *   Processing: Validates that all required fields are non-empty and
 *     that the release year is a four-digit number between 1888 and 2030.
 *     POSTs the validated data to /api/movies and calls onSuccess on 200.
 *     Displays an inline error banner if the request fails.
 *   Outputs: A fixed-position dark modal overlay with the add-movie form.
 */

"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import type { MovieFormData } from "@/types";

interface AddMovieModalProps {
  onClose:   () => void;
  onSuccess: () => void;
}

// ─── Shared input style ───────────────────────────────────────────────────────
const inputClass =
  "w-full rounded-lg px-4 py-2.5 text-sm border transition-colors " +
  "focus:outline-none focus:ring-2";

const GENRES = [
  "Action", "Comedy", "Crime", "Drama", "Fantasy",
  "Historical Drama", "Horror", "Romance", "Sci-Fi", "Thriller",
];

const CURRENT_YEAR = new Date().getFullYear();

export default function AddMovieModal({ onClose, onSuccess }: AddMovieModalProps) {
  const [form, setForm] = useState<MovieFormData>({
    title:        "",
    actors:       "",
    release_year: "",
    genre:        "Drama",
  });
  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ─── Field change handler ──────────────────────────────────────────────────
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ─── Client-side validation ────────────────────────────────────────────────
  const validate = (): string | null => {
    if (!form.title.trim())  return "Title is required.";
    if (!form.actors.trim()) return "At least one actor is required.";
    const yr = parseInt(form.release_year, 10);
    if (isNaN(yr) || yr < 1888 || yr > CURRENT_YEAR + 5)
      return `Release year must be between 1888 and ${CURRENT_YEAR + 5}.`;
    return null;
  };

  // ─── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError("");
    setIsLoading(true);

    const res = await fetch("/api/movies", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        ...form,
        release_year: parseInt(form.release_year, 10),
      }),
    });

    setIsLoading(false);

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setError(data.error ?? "Failed to add movie. Please try again.");
      return;
    }

    onSuccess();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "var(--bg-panel)", border: "1px solid var(--border)" }}
        className="w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ color: "var(--gold)" }} className="text-lg font-bold">
            Add New Movie
          </h2>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}
            className="hover:text-white transition-colors text-xl" aria-label="Close">✕</button>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{ background: "var(--red-dim)", border: "1px solid var(--red)", color: "var(--red)" }}
            className="rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

          {/* Title */}
          <div>
            <label style={{ color: "var(--text-muted)" }} className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input name="title" type="text" required value={form.title} onChange={handleChange}
              placeholder="e.g. Inception"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text)" }}
              className={inputClass + " focus:ring-yellow-600/30 focus:border-yellow-600"} />
          </div>

          {/* Actors */}
          <div>
            <label style={{ color: "var(--text-muted)" }} className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Actors * <span style={{ color: "var(--text-muted)", fontWeight: "normal" }}>(comma-separated)</span>
            </label>
            <input name="actors" type="text" required value={form.actors} onChange={handleChange}
              placeholder="e.g. Leonardo DiCaprio, Joseph Gordon-Levitt"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text)" }}
              className={inputClass + " focus:ring-yellow-600/30 focus:border-yellow-600"} />
          </div>

          {/* Year + Genre row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ color: "var(--text-muted)" }} className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                Release Year *
              </label>
              <input name="release_year" type="number" required min={1888} max={CURRENT_YEAR + 5}
                value={form.release_year} onChange={handleChange} placeholder="e.g. 2008"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text)" }}
                className={inputClass + " focus:ring-yellow-600/30 focus:border-yellow-600"} />
            </div>

            <div>
              <label style={{ color: "var(--text-muted)" }} className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                Genre *
              </label>
              <select name="genre" value={form.genre} onChange={handleChange}
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text)" }}
                className={inputClass + " focus:ring-yellow-600/30 focus:border-yellow-600"}>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3 pt-2">
            <button type="submit" disabled={isLoading}
              style={{ background: isLoading ? "var(--gold-dim)" : "var(--gold)", color: "#09090f" }}
              className="px-6 py-2.5 rounded-lg text-sm font-bold transition-opacity disabled:cursor-not-allowed">
              {isLoading ? "Adding…" : "Add Movie"}
            </button>
            <button type="button" onClick={onClose}
              style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
              className="px-5 py-2.5 rounded-lg text-sm hover:text-white transition-colors">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
