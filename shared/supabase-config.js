/**
 * Supabase Configuration — Mas Airaga Guest Portal
 *
 * These are PUBLIC keys (anon key). They are safe to commit.
 * Row-Level Security (RLS) on Supabase enforces access control.
 *
 * TODO: Replace with your actual Supabase project values after setup.
 */

const SUPABASE_URL  = "https://ffkloapaxghwrenqfila.supabase.co";    // ← replace after setup
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZma2xvYXBheGdod3JlbnFmaWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTE3NTEsImV4cCI6MjA4OTkyNzc1MX0.J6KYv6eJcXF4ImyYuU3yxnbFBO1Kn7PKFyl8TMRhSHA";            // ← replace after setup

// Initialize Supabase client (loaded via CDN in HTML)
function getSupabase() {
  if (typeof supabase === "undefined") {
    console.error("Supabase JS library not loaded. Add the CDN script tag.");
    return null;
  }
  return supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
}
