/*
 * lib/movies-store.ts
 * Date: August 2026
 * Description: In-memory movie data store for development.
 *   Inputs:  CRUD operations called from API route handlers.
 *   Processing: Uses a module-level global array so data persists
 *     across hot-reloads in development. Seeded with classic films.
 *     Each mutation returns the updated record or a success boolean.
 *   Outputs: Movie objects or arrays consumed by API responses.
 *   Note: Replace with Supabase queries once the project is connected.
 */

import { randomUUID } from "crypto";
import type { Movie } from "@/types";

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED: Movie[] = [
  {
    id:           "1",
    title:        "The Godfather",
    actors:       "Marlon Brando, Al Pacino, James Caan",
    release_year: 1972,
    genre:        "Crime / Drama",
    created_at:   "2026-01-01T00:00:00Z",
  },
  {
    id:           "2",
    title:        "Pulp Fiction",
    actors:       "John Travolta, Samuel L. Jackson, Uma Thurman",
    release_year: 1994,
    genre:        "Crime",
    created_at:   "2026-01-02T00:00:00Z",
  },
  {
    id:           "3",
    title:        "The Shawshank Redemption",
    actors:       "Tim Robbins, Morgan Freeman, Bob Gunton",
    release_year: 1994,
    genre:        "Drama",
    created_at:   "2026-01-03T00:00:00Z",
  },
  {
    id:           "4",
    title:        "The Dark Knight",
    actors:       "Christian Bale, Heath Ledger, Aaron Eckhart",
    release_year: 2008,
    genre:        "Action",
    created_at:   "2026-01-04T00:00:00Z",
  },
  {
    id:           "5",
    title:        "Schindler's List",
    actors:       "Liam Neeson, Ralph Fiennes, Ben Kingsley",
    release_year: 1993,
    genre:        "Historical Drama",
    created_at:   "2026-01-05T00:00:00Z",
  },
];

// ─── Global store (persists across hot-reloads in dev) ────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var _imrMovies: Movie[] | undefined;
}

if (!global._imrMovies) {
  global._imrMovies = [...SEED];
}

// ─── Store API ────────────────────────────────────────────────────────────────

export const moviesStore = {
  /** Return all movies, newest first. */
  getAll: (): Movie[] =>
    [...global._imrMovies!].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),

  /** Find a single movie by id. */
  getById: (id: string): Movie | undefined =>
    global._imrMovies!.find((m) => m.id === id),

  /** Add a new movie and return it. */
  add: (data: Omit<Movie, "id" | "created_at">): Movie => {
    const movie: Movie = {
      ...data,
      id:         randomUUID(),
      created_at: new Date().toISOString(),
    };
    global._imrMovies!.push(movie);
    return movie;
  },

  /** Update fields of an existing movie. Returns null if not found. */
  update: (id: string, data: Partial<Omit<Movie, "id" | "created_at">>): Movie | null => {
    const idx = global._imrMovies!.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    global._imrMovies![idx] = { ...global._imrMovies![idx], ...data };
    return global._imrMovies![idx];
  },

  /** Remove a movie by id. Returns true if deleted. */
  remove: (id: string): boolean => {
    const idx = global._imrMovies!.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    global._imrMovies!.splice(idx, 1);
    return true;
  },
};
