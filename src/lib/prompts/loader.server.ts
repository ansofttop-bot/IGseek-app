import { getSupabaseServerClient } from "~/lib/supabase/client";
import { SYSTEM_PROMPT } from "./system-prompt";

let cachedPrompt: string | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30_000;

export async function loadSystemPrompt(): Promise<string> {
  const now = Date.now();

  if (cachedPrompt && now - cacheTimestamp < CACHE_TTL) {
    return cachedPrompt;
  }

  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("system_prompts")
      .select("content")
      .eq("id", 1)
      .single();

    if (data?.content?.system && typeof data.content.system === "string") {
      cachedPrompt = data.content.system;
      cacheTimestamp = now;
      return cachedPrompt!;
    }
  } catch {
    // Fall through to default
  }

  cachedPrompt = SYSTEM_PROMPT;
  cacheTimestamp = now;
  return cachedPrompt;
}
