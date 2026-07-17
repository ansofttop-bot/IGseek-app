import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function getSupabaseServerClient(): SupabaseClient {
  return createClient(
    process.env.SUPABASE_URL || "https://pjclfhgkseklhgvetdua.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqY2xmaGdrc2VrbGhndmV0ZHVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE5OTQxMiwiZXhwIjoyMDk5Nzc1NDEyfQ.Jjc0wovV-HJMwDH08uaLnKVLyoeWLqCTEbBoja2iWCQ",
    { auth: { persistSession: false } }
  );
}

let _browserClient: SupabaseClient | null = null;

export function createBrowserClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (_browserClient) return _browserClient;

  const url = import.meta.env.VITE_SUPABASE_URL || "https://pjclfhgkseklhgvetdua.supabase.co";
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqY2xmaGdrc2VrbGhndmV0ZHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxOTk0MTIsImV4cCI6MjA5OTc3NTQxMn0.4z0VOnmpdP_F5jNRGk8HwRExa0wQba14ldNCTbJFXcI";
  if (!url || !key) return null;

  _browserClient = createClient(url, key);
  return _browserClient;
}
