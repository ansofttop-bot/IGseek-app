import { useRef } from "react";
import { createBrowserClient } from "~/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export function useBrowserClient(): SupabaseClient {
  const ref = useRef<SupabaseClient | null>(null);
  if (!ref.current) {
    ref.current = createBrowserClient()!;
  }
  return ref.current;
}
