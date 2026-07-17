import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { createBrowserClient } from "~/lib/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function FoxLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15L30 35L20 25L25 50L15 70L35 60L50 85L65 60L85 70L75 50L80 25L70 35L50 15Z" fill="#dc2626" />
    </svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function getClient() {
    return createBrowserClient();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getClient();
    if (!supabase) { setError("Supabase не настроен. Заполни .env файл."); return; }
    setLoading(true);
    setError("");
    try {
      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });
      if (result.error) {
        setError(result.error.message);
      } else {
        navigate({ to: "/chat" });
      }
    } catch {
      setError("Произошла ошибка. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const supabase = getClient();
    if (!supabase) { setError("Supabase не настроен. Заполни .env файл."); return; }
    setError("");
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/auth/callback" },
      });
      if (oauthError) setError(oauthError.message);
    } catch {
      setError("Не удалось запустить вход через Google");
    }
  }

  async function handleApple() {
    const supabase = getClient();
    if (!supabase) { setError("Supabase не настроен. Заполни .env файл."); return; }
    setError("");
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: { redirectTo: window.location.origin + "/auth/callback" },
      });
      if (oauthError) setError(oauthError.message);
    } catch {
      setError("Не удалось запустить вход через Apple");
    }
  }

  async function handleResetPassword() {
    const supabase = getClient();
    if (!supabase) { setError("Supabase не настроен. Заполни .env файл."); return; }
    if (!email) { setError("Введите email для сброса пароля"); return; }
    setError("");
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (resetError) setError(resetError.message);
      else setError("Письмо для сброса пароля отправлено");
    } catch {
      setError("Не удалось отправить письмо");
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <FoxLogo className="mx-auto mb-4 h-12 w-12" />
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">IGseek · Auth</div>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Войдите в аккаунт</h1>
          <p className="mt-1 text-sm text-muted-foreground">Умный AI-ассистент нового поколения</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-primary/5">
          <div className="mb-6 flex rounded-xl bg-secondary p-1">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ВХОД
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              РЕГИСТРАЦИЯ
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-secondary py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Продолжить с Google
            </button>
            <button
              onClick={handleApple}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-secondary py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Продолжить с Apple
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">или</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Логин</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1 w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading
                ? "Загрузка..."
                : mode === "login"
                  ? "ВОЙТИ"
                  : "ЗАРЕГИСТРИРОВАТЬСЯ"}
            </button>
          </form>

          {mode === "login" && (
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
            >
              Забыли пароль?
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-xs uppercase tracking-wider text-muted-foreground">
          Один аккаунт на устройство. Продолжая, вы соглашаетесь с политикой конфиденциальности
        </p>
      </div>
    </div>
  );
}
