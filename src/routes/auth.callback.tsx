import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useBrowserClient } from "~/hooks/useBrowserClient";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const supabase = useBrowserClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate({ to: "/chat" });
      } else {
        navigate({ to: "/auth" });
      }
    });
  }, [supabase, navigate]);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <div className="text-sm text-muted-foreground">Загрузка...</div>
      </div>
    </div>
  );
}
