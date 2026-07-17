import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useBrowserClient } from "~/hooks/useBrowserClient";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function FoxLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15L30 35L20 25L25 50L15 70L35 60L50 85L65 60L85 70L75 50L80 25L70 35L50 15Z" fill="#dc2626" />
    </svg>
  );
}

function ProfilePage() {
  const supabase = useBrowserClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [memory, setMemory] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setEmail(user.email || "");
        supabase
          .from("profiles")
          .select("username")
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => {
            if (data) setUsername(data.username || "");
          });
      }
    });
  }, [supabase]);

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    await supabase.from("profiles").upsert({ user_id: userId, username });
    setSaving(false);
  }

  const docs = [
    "Политика конфиденциальности",
    "Пользовательское соглашение",
    "Соглашение проекта и нейросети",
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <a href="/chat" className="rounded-lg p-2 hover:bg-secondary transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        <h1 className="text-lg font-bold text-foreground">Профиль</h1>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 space-y-4 px-4 py-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
              <FoxLogo className="h-10 w-10" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-lg font-bold text-foreground">{username || "Пользователь"}</h2>
                <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">PRO</span>
              </div>
              <p className="truncate text-sm text-muted-foreground">{email}</p>
              <p className="mt-1 text-xs text-primary">👑 Премиум (Бесплатно навсегда)</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="text-primary">⚡</span>
            Премиум доступ
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Безлимитные сообщения, все агенты, веб-поиск и размышление.
          </p>
          <a
            href="/subscribe"
            className="block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Управление подпиской
          </a>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="text-primary">🧠</span>
            Долговременная память
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Факты о вас, предпочтения, текущие проекты — то, что ассистент должен помнить между чатами.
          </p>
          <textarea
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            className="mb-3 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={4}
            placeholder="Например: я предпочитаю TypeScript, изучаю Rust, часовой пояс CET..."
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Сохранение..." : "Сохранить память"}
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="text-primary">📄</span>
            Документы
          </div>
          <div className="space-y-2">
            {docs.map((doc, i) => (
              <a
                key={i}
                href="#"
                className="flex items-center justify-between rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground hover:bg-accent transition-colors"
              >
                {doc}
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
