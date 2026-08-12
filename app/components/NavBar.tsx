/*
 * app/components/NavBar.tsx
 * Date: August 2026
 * Description: Static navigation bar for the IMR portal.
 *   Inputs:  Current NextAuth session (client-side via useSession hook).
 *   Processing: Reads the session to determine auth state and role.
 *     Shows Dashboard link for admin users. Shows Sign Out when logged in,
 *     Log In and Register when logged out.
 *   Outputs: Sticky top navigation bar with IMR branding and auth controls.
 */

"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function NavBar() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  return (
    <nav style={{
      background:   "var(--bg-card)",
      borderBottom: "1px solid var(--gold-dim)",
    }}
      className="sticky top-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div style={{ background: "var(--gold)", color: "#09090f" }}
            className="w-9 h-9 rounded flex items-center justify-center font-black text-sm tracking-tight"
          >
            IMR
          </div>
          <div>
            <div style={{ color: "var(--text)" }} className="font-bold text-base leading-none">
              Internet Movies Rental
            </div>
            <div style={{ color: "var(--text-muted)" }} className="text-xs mt-0.5">
              Movie Database Portal
            </div>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-5">
          <Link href="/"
            style={{ color: "var(--text-muted)" }}
            className="text-sm font-medium hover:text-white transition-colors"
          >
            Movies
          </Link>

          {isAdmin && (
            <Link href="/dashboard"
              style={{ color: "var(--gold)" }}
              className="text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Dashboard
            </Link>
          )}

          {session ? (
            <>
              <span style={{ color: "var(--text-muted)" }} className="text-xs">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                  border: "1px solid var(--red-dim)",
                  color:  "var(--red)",
                }}
                className="px-4 py-1.5 rounded text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login"
                style={{ color: "var(--text-muted)" }}
                className="text-sm font-medium hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link href="/register"
                style={{ background: "var(--gold)", color: "#09090f" }}
                className="px-4 py-1.5 rounded text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
