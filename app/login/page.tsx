/*
 * app/login/page.tsx
 * Date: August 2026
 * Description: Staff login page for the IMR portal.
 *   Inputs:  Email and password entered by the user.
 *   Processing: Submits credentials to NextAuth signIn with the
 *     "credentials" provider. Redirects to the home page on success,
 *     or displays an error message on failure. Validates that both
 *     fields are non-empty before submitting.
 *   Outputs: Centered dark login card with IMR branding.
 */

"use client";

import { useState, type FormEvent } from "react";
import { signIn }   from "next-auth/react";
import { useRouter } from "next/navigation";
import Link          from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputStyle = {
    background: "var(--bg-input)",
    border:     "1px solid var(--border)",
    color:      "var(--text)",
  } as React.CSSProperties;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4"
      style={{ background: "var(--bg-deep)" }}
    >
      <div
        style={{
          background:  "var(--bg-card)",
          border:      "1px solid var(--border)",
          borderTop:   "3px solid var(--gold)",
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
            Staff Login
          </h1>
          <p style={{ color: "var(--text-muted)" }} className="text-sm mt-1">
            Sign in to manage the movie catalogue
          </p>
        </div>

        {/* Error */}
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
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@imr.com" required
              style={inputStyle}
              className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors" />
          </div>

          <div>
            <label style={{ color: "var(--text-muted)" }}
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required
              style={inputStyle}
              className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors" />
          </div>

          <button type="submit" disabled={isLoading}
            style={{ background: isLoading ? "var(--gold-dim)" : "var(--gold)", color: "#09090f" }}
            className="w-full py-3 rounded-lg text-sm font-bold mt-2 hover:opacity-90 transition-opacity disabled:cursor-not-allowed">
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p style={{ color: "var(--text-muted)" }} className="text-sm text-center mt-6">
          No account?{" "}
          <Link href="/register" style={{ color: "var(--gold)" }} className="font-semibold hover:opacity-80">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
