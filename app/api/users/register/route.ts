/*
 * app/api/users/register/route.ts
 * Date: August 2026
 * Description: User registration endpoint for the IMR portal.
 *   Inputs:  JSON body with email and password fields.
 *   Processing: Validates email format and password length (min 8 chars).
 *     Checks that the email is not already registered in the user store.
 *     Hashes the password with bcrypt (cost factor 12) before storing.
 *     New users are assigned the "user" role by default.
 *   Outputs: 201 with a success message, or 400/409 with an error message.
 */

import { NextResponse } from "next/server";
import bcrypt           from "bcryptjs";
import { usersStore }   from "@/lib/users-store";

export async function POST(req: Request) {
  const body = await req.json() as { email?: string; password?: string };

  // ─── Validate inputs ──────────────────────────────────────────────────────
  if (!body.email?.trim())
    return NextResponse.json({ error: "Email is required." }, { status: 400 });

  if (!body.password || body.password.length < 8)
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );

  // ─── Check for duplicate email ────────────────────────────────────────────
  if (usersStore.findByEmail(body.email)) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  // ─── Hash password and create user ───────────────────────────────────────
  const hashed = await bcrypt.hash(body.password, 12);
  usersStore.create(body.email.trim(), hashed, "user");

  return NextResponse.json({ message: "Account created successfully." }, { status: 201 });
}
