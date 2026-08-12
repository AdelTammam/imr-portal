/*
 * app/api/movies/[id]/route.ts
 * Date: August 2026
 * Description: REST API endpoint for a single movie resource.
 *   Inputs:  URL param id — the movie's unique identifier.
 *     PUT body — partial Movie fields to update (all optional).
 *   Processing: GET returns the movie if it exists.
 *     PUT and DELETE require an authenticated admin session.
 *     PUT validates any provided fields before writing to the store.
 *     DELETE removes the record and returns 204 No Content.
 *   Outputs: JSON Movie object (GET/PUT) or empty 204 (DELETE).
 */

import { NextResponse } from "next/server";
import { auth }         from "@/auth";
import { moviesStore }  from "@/lib/movies-store";

// ─── GET /api/movies/[id] — public ───────────────────────────────────────────

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const movie  = moviesStore.getById(id);
  if (!movie) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(movie);
}

// ─── PUT /api/movies/[id] — admin only ───────────────────────────────────────

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body   = await req.json() as {
    title?:        string;
    actors?:       string;
    release_year?: number;
    genre?:        string;
  };

  // ─── Validate provided fields ─────────────────────────────────────────────
  if (body.title  !== undefined && !body.title.trim())
    return NextResponse.json({ error: "Title cannot be empty."  }, { status: 400 });
  if (body.actors !== undefined && !body.actors.trim())
    return NextResponse.json({ error: "Actors cannot be empty." }, { status: 400 });
  if (body.release_year !== undefined) {
    const yr = Number(body.release_year);
    if (!yr || yr < 1888 || yr > new Date().getFullYear() + 5)
      return NextResponse.json({ error: "Release year is invalid." }, { status: 400 });
  }

  const updated = moviesStore.update(id, {
    ...(body.title        && { title:        body.title.trim()   }),
    ...(body.actors       && { actors:       body.actors.trim()  }),
    ...(body.release_year && { release_year: Number(body.release_year) }),
    ...(body.genre        && { genre:        body.genre.trim()   }),
  });

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

// ─── DELETE /api/movies/[id] — admin only ────────────────────────────────────

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const ok     = moviesStore.remove(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
