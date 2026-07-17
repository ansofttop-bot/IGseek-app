import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BackgroundParticles } from "~/components/BackgroundParticles";
import { FloatingOrbs } from "~/components/FloatingOrbs";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function FoxLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M50 8L72 28L88 20L80 42L92 58L70 54L62 78L50 62L38 78L30 54L8 58L20 42L12 20L28 28L50 8Z"
        fill="#ef2222"
      />
      <path d="M50 28L38 42H62L50 28Z" fill="#050000" />
      <circle cx="40" cy="40" r="3.5" fill="#050000" />
      <circle cx="60" cy="40" r="3.5" fill="#050000" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8 8 0 01-8 8H7l-4 3V12a8 8 0 018-8h2a8 8 0 018 8z" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M21 16l-5-5-4 4-2-2-5 5" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4a3 3 0 00-3 3v1a3 3 0 00-2 2.8V14a3 3 0 003 3h1" />
      <path d="M15 4a3 3 0 013 3v1a3 3 0 012 2.8V14a3 3 0 01-3 3h-1" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9z" />
      <path d="M12 12l9-4.5M12 12v9M12 12L3 7.5" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8l-4 4 4 4" />
      <path d="M16 8l4 4-4 4" />
      <path d="M13 5l-2 14" />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 15c1.5 0 4 .5 6 2.5S14 22 14 22s2.5-1.5 4.5-3.5S21 12.5 21 11c0-4-3-8-8-8-1.5 0-5.5.5-7.5 2.5S3 12 3 13.5 3.5 15 5 15z" />
      <circle cx="14.5" cy="9.5" r="1.5" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v12" />
      <path d="M7 12l5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function IndexPage() {
  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-background text-foreground">
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <div className="mesh-gradient pointer-events-none absolute inset-0" />
      <BackgroundParticles />
      <FloatingOrbs />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col px-5 sm:px-8 lg:px-10">
        <header className="flex w-full items-center justify-between py-5">
          <div className="flex items-center gap-2.5">
            <FoxLogo className="h-7 w-7 drop-shadow-[0_0_12px_rgba(239,34,34,0.55)]" />
            <span className="text-[17px] font-semibold tracking-tight">IGseek</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/chat" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Поддержка
            </Link>
            <Link
              to="/auth"
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium transition hover:border-primary/40 hover:bg-primary/10"
            >
              Войти
            </Link>
          </div>
        </header>

        <main className="flex w-full flex-1 flex-col gap-14 pb-14 pt-4">
          <section className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="flex w-full flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                AI нового поколения
              </div>

              <h1 className="max-w-[14ch] text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em]">
                Умный
                <br />
                ассистент,
                <br />
                <span className="text-primary">который понимает.</span>
              </h1>

              <p className="max-w-[36rem] text-[15px] leading-7 text-muted-foreground sm:text-base">
                IGseek — это чат с профильными агентами, генерация изображений, веб-поиск и рассуждения. Всё в одном приложении.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/auth"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(239,34,34,0.35)] transition hover:bg-primary/90"
                >
                  Начать бесплатно
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex h-12 items-center rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm font-medium transition hover:border-white/20 hover:bg-white/[0.08]"
                >
                  У меня уже есть аккаунт
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CheckDot /> Приватность
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckDot /> Мгновенные ответы
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckDot /> Глубокое мышление
                </span>
              </div>
            </div>

              <div className="w-full">
              <div className="trailer-glow relative aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-[#2a0a0a] via-[#120404] to-[#080000]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,34,34,0.18),transparent_55%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-8 rounded-full bg-primary/20 blur-2xl animate-pulse-ring" />
                    <FoxLogo className="relative h-20 w-20 drop-shadow-[0_0_30px_rgba(239,34,34,0.7)] animate-float" />
                    <div className="absolute -inset-12">
                      <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-primary/60 animate-orbit" />
                      <div className="absolute bottom-2 left-0 h-1.5 w-1.5 rounded-full bg-primary/40 animate-orbit" style={{ animationDelay: "-4s" }} />
                      <div className="absolute right-0 top-1/2 h-1 w-1 rounded-full bg-primary/50 animate-orbit" style={{ animationDelay: "-8s" }} />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-md transition hover:bg-black/60"
                  aria-label="Смотреть трейлер"
                >
                  <svg className="ml-0.5 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-5 flex items-center gap-2 text-xs text-white/50">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  онлайн
                </div>
                <div className="absolute bottom-4 right-5 text-xs text-white/50">IGseek</div>
                <div className="animate-shimmer absolute inset-0 pointer-events-none" />
              </div>
            </div>
          </section>

          <section className="w-full">
            <div className="mb-4 flex w-full items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Возможности</span>
              <span>0.1</span>
            </div>
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <FeatureCard icon={<IconChat />} title="Чат с агентами" description="Эксперт, Учитель, Мастер, Хакер" index="01" />
              <FeatureCard icon={<IconImage />} title="Генерация изображений" description="Быстро и точно по описанию" index="02" />
              <FeatureCard icon={<IconSearch />} title="Веб-поиск" description="Актуальная информация из интернета" index="03" />
              <FeatureCard icon={<IconBrain />} title="Размышления" description="Видно, как ИИ рассуждает" index="04" />
            </div>
          </section>

          <section className="w-full">
            <div className="mb-3 flex w-full items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Скоро</span>
              <span className="rounded-full border border-primary/30 px-2.5 py-0.5 text-[10px] normal-case tracking-normal text-primary">
                В СЛЕД. ОБНОВЛЕНИИ
              </span>
            </div>

            <div className="card-glass w-full rounded-2xl p-5 sm:p-6">
              <div className="mb-4 flex items-start gap-3">
                <div className="icon-box text-primary">
                  <FoxLogo className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-base font-semibold">IGseek Engine</div>
                  <div className="text-sm text-muted-foreground">AI-конструктор приложений</div>
                </div>
              </div>

              <p className="mb-5 max-w-3xl text-sm leading-7 text-muted-foreground">
                Опишите идею — движок соберёт полноценное приложение: фронтенд, бэкенд, база данных, авторизация.
              </p>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <EngineItem icon={<IconBolt />} label="Промпт → код" />
                <EngineItem icon={<IconBox />} label="Готовые модули" />
                <EngineItem icon={<IconCode />} label="Живой редактор" />
                <EngineItem icon={<IconRocket />} label="Публикация" />
              </div>
            </div>
          </section>

          <section className="w-full">
            <details className="card-glass group w-full rounded-2xl">
              <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-medium">
                <span className="inline-flex items-center gap-2.5">
                  <span className="icon-box text-primary">
                    <IconDownload />
                  </span>
                  Установить приложение
                </span>
                <span className="text-muted-foreground transition group-open:rotate-180">▾</span>
              </summary>
              <div className="space-y-2 border-t border-white/5 px-5 pb-5 pt-3 text-sm text-muted-foreground">
                <p><span className="text-foreground">Chrome:</span> меню → Установить IGseek</p>
                <p><span className="text-foreground">Safari:</span> Поделиться → На экран «Домой»</p>
                <p><span className="text-foreground">Edge:</span> меню → Приложения → Установить этот сайт как приложение</p>
              </div>
            </details>
          </section>

          <footer className="w-full pt-2 text-center text-[11px] leading-relaxed text-muted-foreground/70">
            created by @very_contagent
            <br />
            tested by @FadingFriend
          </footer>
        </main>
      </div>
    </div>
  );
}

function CheckDot() {
  return (
    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[10px] text-primary">
      ✓
    </span>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  index,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  index: string;
}) {
  return (
    <div className="card-glass group flex min-h-[148px] w-full flex-col rounded-2xl p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(239,34,34,0.08)] hover:-translate-y-0.5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="icon-box text-primary transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(239,34,34,0.3)]">{icon}</div>
        <span className="text-[11px] text-muted-foreground/70">{index}</span>
      </div>
      <div className="text-sm font-semibold leading-5 text-foreground">{title}</div>
      <div className="mt-1.5 text-xs leading-5 text-muted-foreground">{description}</div>
    </div>
  );
}

function EngineItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="group flex w-full items-center gap-3 rounded-xl border border-white/5 bg-black/20 px-3.5 py-3 text-sm text-foreground/90 transition-all duration-300 hover:border-primary/20 hover:bg-primary/5">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_8px_rgba(239,34,34,0.2)]">
        {icon}
      </span>
      <span className="leading-none">{label}</span>
    </div>
  );
}
