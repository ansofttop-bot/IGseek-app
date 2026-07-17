import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useBrowserClient } from "~/hooks/useBrowserClient";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const supabase = useBrowserClient();
  const [prompt, setPrompt] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase.rpc("has_role", {
          _user_id: user.id,
          _role: "admin",
        });
        setIsAdmin(data ?? false);

        if (data) {
          const { data: row } = await supabase
            .from("system_prompts")
            .select("content")
            .eq("id", 1)
            .single();
          if (row?.content?.system) {
            setPrompt(row.content.system);
          }
        }
      }
    });
  }, [supabase]);

  async function handleSave() {
    setLoading(true);
    setSaved(false);

    const { error } = await supabase
      .from("system_prompts")
      .upsert({ id: 1, content: { system: prompt } }, { onConflict: "id" });

    if (!error) setSaved(true);
    setLoading(false);
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-destructive">Доступ запрещён</h1>
          <p className="text-muted-foreground">Нужна роль admin</p>
          <a href="/chat" className="text-primary hover:underline">
            ← Назад к чату
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border px-4 py-3 flex items-center gap-3">
        <a href="/chat" className="rounded-lg p-2 hover:bg-secondary transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        <h1 className="text-lg font-bold text-foreground">⚙️ Админ — System Prompt</h1>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Редактируйте единый системный промт для IGseek. Сохранение вступит в силу через 30 сек (кэш).
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-[60vh] rounded-xl border border-border bg-secondary px-4 py-3 text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Системный промт..."
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
          {saved && (
            <span className="text-sm text-green-500">✓ Сохранено</span>
          )}
        </div>
      </main>
    </div>
  );
}
