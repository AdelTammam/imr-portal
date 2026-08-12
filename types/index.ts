/*
 * types/index.ts
 * Date: August 2026
 * Description: Shared TypeScript types for the IMR portal.
 *   Inputs:  none (type declarations only)
 *   Processing: Defines Movie and User shapes used across
 *     API routes, data stores, and React components.
 *   Outputs: Exported interfaces consumed throughout the app.
 */

// ─── Movie ────────────────────────────────────────────────────────────────────

export interface Movie {
  id:           string;
  title:        string;
  actors:       string;   // comma-separated list of actor names
  release_year: number;
  genre:        string;
  created_at:   string;
}

export interface MovieFormData {
  title:        string;
  actors:       string;
  release_year: string;  // string while in form, parsed to number on submit
  genre:        string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id:         string;
  email:      string;
  password:   string;  // bcrypt hash — never exposed to the client
  role:       "admin" | "user";
  created_at: string;
}
