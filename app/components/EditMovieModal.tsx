/*
 * app/components/EditMovieModal.tsx
 * Date: August 2026
 * Description: Modal form for editing an existing movie record.
 *   Inputs:  movie — the Movie to edit (pre-fills all fields).
 *     onClose   — callback to close the modal without saving.
 *     onSuccess — callback invoked after a successful PUT request.
 *   Processing: Stores initial values in a ref for dirty-state detection.
 *     Save Changes button is disabled and faded when no fields have changed,
 *     and highlighted in gold when the form is dirty.
 *     Validates the release year before sending the PUT request.
 *   Outputs: A fixed-position dark modal overlay with the edit form.
 */

"use client";

import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react";
import type { Movie, MovieFormData } from "@/types";

interface EditMovieModalProps {
  movie:     Movie;
  onClose:   () => void;
  onSuccess: () => void;
}

const inputClass =
  "w-full rounded-lg px-4 py-2.5 text-sm border transition-colors " +
  "focus:outline-none focus:ring-2";

const GENRES = [
  "Action", "Comedy", "Crime", "Drama", "Fantasy",
  "Historical Drama", "Horror", "Romance", "Sci-Fi", "Thriller",
];

const CURRENT_YEAR = new Date().getFullYear();

export default function EditMovieModal({ movie, onClose, onSuccess }: EditMovieModalProps) {
  const [form, setForm] = useState<MovieFormData>({
    title:        movie.title,
    actors:       movie.actors,
    release_year: String(movie.release_year),
    genre:        movie.genre,
  });
  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ─── Dirty-state detection ─────────────────────────────────────────────────
  const initial = useRef<MovieFormData>({
    title:        movie.title,
    actors:       movie.actors,
    release_year: String(movie.release_year),
    genre:        movie.genre,
  });

  const isDirty = (Object.keys(form) as Array<keyof MovieFormData>).some(
    (key) => form[key] !== initial.current[key]
  );

  // ─── Escape key closes modal ───────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = (): string | null => {
    if (!form.title.trim())  return "Title is required.";
    if (!form.actors.trim()) return "At least one actor is required.";
    const yr = parseInt(form.release_year, 10);
    if (isNaN(yr) || yr < 1888 || yr > CURRENT_YEAR + 5)
      return `Release year must be between 1888 and ${CURRENT_YEAR + 5}.`;
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isDirty) return;
    const err = validate();
    if (err) { setError(err); return; }

    setError("");
    setIsLoading(true);

    const res = await fetch(`/api/movies/${movie.id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...form, release_year: parseInt(form.release_year, 10) }),
    });

    setIsLoading(false);

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setError(data.error ?? "Update failed. Please try again.");
      return;
    }

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)" }}
        className="w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-5">
          <h2 style={{ color: "var(--gold)" }} className="text-lg font-bold">
            Edit — {movie.title}
          </h2>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}
            className="hover:text-white transition-colors text-xl" aria-label="Close">✕</button>
        </div>

        {error && (
          <div style={{ background: "var(--red-dim)", border: "1px solid var(--red)", color: "var(--red)" }}
            className="rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

          <div>
            <label style={{ color: "var(--text-muted)" }} className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Title *</label>
            <input name="title" type="text" required value={form.title} onChange={handleChange}
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text)" }}
              className={inputClass + " focus:ring-yellow-600/30 focus:border-yellow-600"} />
          </div>

          <div>
            <label style={{ color: "var(--text-muted)" }} className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Actors * <span style={{ fontWeight: "normal" }}>(comma-separated)</span>
            </label>
            <input name="actors" type="text" required value={form.actors} onChange={handleChange}
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text)" }}
              className={inputClass + " focus:ring-yellow-600/30 focus:border-yellow-600"} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ color: "var(--text-muted)" }} className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Release Year *</label>
              <input name="release_year" type="number" required min={1888} max={CURRENT_YEAR + 5}
                value={form.release_year} onChange={handleChange}
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text)" }}
                className={inputClass + " focus:ring-yellow-600/30 focus:border-yellow-600"} />
            </div>
            <div>
              <label style={{ color: "var(--text-muted)" }} className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Genre *</label>
              <select name="genre" value={form.genre} onChange={handleChange}
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text)" }}
                className={inputClass + " focus:ring-yellow-600/30 focus:border-yellow-600"}>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Actions — Save Changes left of Cancel, dirty-state aware */}
          <div className="flex justify-center gap-3 pt-2">
            <button type="submit" disabled={isLoading || !isDirty}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200
                ${isDirty
                  ? "ring-2 ring-yellow-500/40 ring-offset-1"
                  : "opacity-40 cursor-not-allowed"
                }`}
              style={{
                background: isDirty ? "var(--gold)" : "var(--gold-dim)",
                color: "#09090f",
              }}>
              {isLoading ? "Saving\u2026" : "Save Changes"}
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
