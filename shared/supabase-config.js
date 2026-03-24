/**
 * Supabase Configuration — Mas d'Airaga Guest Portal
 *
 * These are PUBLIC keys (anon key). They are safe to commit.
 * Row-Level Security (RLS) on Supabase enforces access control.
 *
 * TODO: Replace with your actual Supabase project values after setup.
 */

const SUPABASE_URL  = "https://YOUR_PROJECT.supabase.co";    // ← replace after setup
const SUPABASE_ANON = "eyJ...YOUR_ANON_KEY_HERE";            // ← replace after setup

// Initialize Supabase client (loaded via CDN in HTML)
function getSupabase() {
  if (typeof supabase === "undefined") {
    console.error("Supabase JS library not loaded. Add the CDN script tag.");
    return null;
  }
  return supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
}
