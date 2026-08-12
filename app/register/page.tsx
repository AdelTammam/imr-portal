/*
 * app/register/page.tsx
 * Date: August 2026
 * Description: New user registration page for the IMR portal.
 *   Inputs:  Email, password, and confirm-password fields.
 *   Processing: Validates that the email is non-empty, password is at
 *     least 8 characters, and both password fields match before POSTing
 *     to /api/users/register. On success, auto-signs the user in via
 *     NextAuth and redirects to the home page.
 *   Outputs: Centered dark registration card with IMR branding.
 */

"use client";

import { useState, type FormEvent } from "react";
import { signIn }    from "next-auth/react";
import { useRouter }  from "next/navigation";
import Link           from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputStyle = {
    background: "var(--bg-input)",
    border:     "1px solid var(--border)",
    color:      "var(--text)",
  } as React.CSSProperties;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ─── Client-side validation ──────────────────────────────────────────────
    if (!email.trim())              return setError("Email is required.");
    if (password.length < 8)        return setError("Password must be at least 8 characters.");
    if (password !== confirm)        return setError("Passwords do not match.");

    setError("");
    setIsLoading(true);

    // ─── Register via API ────────────────────────────────────────────────────
    const res = await fetch("/api/users/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setIsLoading(false);
      setError(data.error ?? "Registration failed. Please try again.");
      return;
    }

    // ─── Auto sign-in after successful registration ──────────────────────────
    await signIn("credentials", { email, password, redirect: false });
    setIsLoading(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div
      className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4"
      style={{ background: "var(--bg-deep)" }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border:     "1px solid var(--border)",
          borderTop:  "3px solid var(--gold)",
        }}
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            style={{ background: "var(--gold)", color: "#09090f" }}
            className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-sm mx-auto mb-4"
          >
            IMR
          </div>
          <h1 style={{ color: "var(--text)" }} className="text-2xl font-bold">
            Create Account
          </h1>
          <p style={{ color: "var(--text-muted)" }} className="text-sm mt-1">
            Join the IMR staff portal
          </p>
        </div>

        {error && (
          <div
            style={{ background: "var(--red-dim)", border: "1px solid var(--red)", color: "var(--red)" }}
            className="rounded-lg px-4 py-3 mb-5 text-sm"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label style={{ color: "var(--text-muted)" }}
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@imr.com" required style={inputStyle}
              className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors" />
          </div>

          <div>
            <label style={{ color: "var(--text-muted)" }}
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Password <span style={{ fontWeight: "normal" }}>(min. 8 characters)</span>
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required style={inputStyle}
              className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors" />
          </div>

          <div>
            <label style={{ color: "var(--text-muted)" }}
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••" required style={inputStyle}
              className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors" />
          </div>

          <button type="submit" disabled={isLoading}
            style={{ background: isLoading ? "var(--gold-dim)" : "var(--gold)", color: "#09090f" }}
            className="w-full py-3 rounded-lg text-sm font-bold mt-2 hover:opacity-90 transition-opacity disabled:cursor-not-allowed">
            {isLoading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p style={{ color: "var(--text-muted)" }} className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--gold)" }} className="font-semibold hover:opacity-80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
