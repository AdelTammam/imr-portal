/*
 * lib/supabase.ts
 * Date: August 2026
 * Description: Supabase client initialisation for the IMR portal.
 *   Inputs:  NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 *     environment variables from .env.local.
 *   Processing: Creates and exports a singleton Supabase client.
 *     Returns null when environment variables are not yet configured
 *     so the app can fall back to the in-memory store during development.
 *   Outputs: Supabase client instance or null.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ─── Export null when env vars are not yet set ───────────────────────────────

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;
