import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "~/lib/supabase/client";

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
});

export const getProfile = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    return data as { user_id: string; username: string; created_at: string } | null;
  });

export const hasRole = createServerFn({ method: "GET" })
  .validator((data: { userId: string; role: string }) => data)
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient();
    const result = await supabase.rpc("has_role", {
      _user_id: data.userId,
      _role: data.role,
    });
    return (result as { data: boolean })?.data ?? false;
  });
