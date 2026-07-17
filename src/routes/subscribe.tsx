import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useBrowserClient } from "~/hooks/useBrowserClient";
import { subscribeFn } from "~/lib/chat-server";
import { toast } from "sonner";

export const Route = createFileRoute("/subscribe")({
  component: SubscribePage,
});

function FoxLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15L30 35L20 25L25 50L15 70L35 60L50 85L65 60L85 70L75 50L80 25L70 35L50 15Z" fill="#dc2626" />
    </svg>
  );
}

export default function SubscribePage() {
  const supabase = useBrowserClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        supabase
          .from("subscriptions")
          .select("status, expires_at")
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setStatus(data.status);
              setExpiresAt(data.expires_at);
            }
          });
      }
    });
  }, [supabase]);

  async function handleSubscribe() {
    if (!userId) return;
    setLoading(true);
    try {
      const result = await subscribeFn({ data: { userId } });
      if (result.free) {
        setStatus("active");
        toast.success("Вам выдана бесплатная подписка на 30 дней!");
      } else {
        toast.info(result.message);
      }
    } catch {
      toast.error("Ошибка при оформлении подписки");
    } finally {
      setLoading(false);
    }
  }

  const features = [
    "Безлимитные сообщения ко всем агентам",
    "Мультиагентный режим (объединённый ответ)",
    "Веб-поиск и режим размышления",
    "Вложения до 20 МБ (фото, документы, аудио, видео, код)",
    "Долговременная память",
  ];

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
        <h1 className="text-lg font-bold text-foreground">Подписка</h1>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 space-y-4 px-4 py-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20">
              <FoxLogo className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">IGseek Premium</h2>
              <p className="text-sm text-muted-foreground">Подписка на 30 дней</p>
            </div>
          </div>

          <div className="relative mt-6">
            {status === "active" ? (
              <div className="flex items-center justify-between rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Подписка активна
                </div>
                <span className="text-xs font-medium uppercase text-green-400">Бесплатно</span>
              </div>
            ) : (
              <>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-foreground">0</span>
                  <span className="text-sm text-muted-foreground">₽ / 30 дней</span>
                </div>
                <div className="mb-4 text-xs text-primary">
                  ⚡ Осталось бесплатных мест: 50 из 50
                </div>
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H5.52a2 2 0 00-1.98 1.73l-.43 3.02a2 2 0 001.65 2.25L12 10V6.5m0 6.5v13m0-13V6a4 4 0 014-4h2.48a2 2 0 011.98 1.73l.43 3.02a2 2 0 01-1.65 2.25L12 10" />
                  </svg>
                  {loading ? "Загрузка..." : "Забрать бесплатно"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="text-primary">⚡</span>
            Что входит
          </div>
          <ul className="space-y-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="text-primary">✓</span>
                {feature}
              </li>
            ))}
          </ul>
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
