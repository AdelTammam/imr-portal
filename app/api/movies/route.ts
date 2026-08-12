/*
 * app/api/movies/route.ts
 * Date: August 2026
 * Description: REST API endpoint for the movie collection.
 *   Inputs:  GET — no body required.
 *     POST — JSON body with title, actors, release_year, genre fields.
 *   Processing: GET returns all movies sorted newest-first from the store.
 *     POST validates required fields, parses release_year as an integer,
 *     and rejects requests from unauthenticated or non-admin sessions.
 *   Outputs: JSON array of Movie objects (GET) or the new Movie (POST).
 */

import { NextResponse }  from "next/server";
import { auth }          from "@/auth";
import { moviesStore }   from "@/lib/movies-store";

// ─── GET /api/movies — public, returns all movies ────────────────────────────

export async function GET() {
  const movies = moviesStore.getAll();
  return NextResponse.json(movies);
}

// ─── POST /api/movies — admin only, creates a new movie ──────────────────────

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as {
    title?:        string;
    actors?:       string;
    release_year?: number;
    genre?:        string;
  };

  // ─── Validate required fields ─────────────────────────────────────────────
  if (!body.title?.trim())  return NextResponse.json({ error: "Title is required."  }, { status: 400 });
  if (!body.actors?.trim()) return NextResponse.json({ error: "Actors are required." }, { status: 400 });
  if (!body.genre?.trim())  return NextResponse.json({ error: "Genre is required."  }, { status: 400 });

  const year = Number(body.release_year);
  if (!year || year < 1888 || year > new Date().getFullYear() + 5) {
    return NextResponse.json({ error: "Release year is invalid." }, { status: 400 });
  }

  const movie = moviesStore.add({
    title:        body.title.trim(),
    actors:       body.actors.trim(),
    release_year: year,
    genre:        body.genre.trim(),
  });

  return NextResponse.json(movie, { status: 201 });
}
