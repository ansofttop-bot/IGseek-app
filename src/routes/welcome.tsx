import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/welcome")({
  component: WelcomePage,
});

function WelcomePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-2">
          <svg
            viewBox="0 0 120 40"
            className="mx-auto h-16 w-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="8" width="12" height="24" rx="2" fill="#dc2626" />
            <rect x="4" y="28" width="12" height="8" rx="2" fill="#656363" />
            <rect x="4" y="8" width="12" height="4" rx="1" fill="#CFCECD" />
            <rect x="20" y="8" width="12" height="24" rx="2" fill="#dc2626" />
            <rect x="20" y="28" width="12" height="8" rx="2" fill="#656363" />
            <text x="40" y="28" fill="#f5f0f0" fontSize="20" fontFamily="monospace" fontWeight="bold">
              IGseek
            </text>
          </svg>
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            IG<span className="text-primary">seek</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-чат с генерацией изображений, голосовым вводом и мультиагентной системой
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/auth"
            className="rounded-lg bg-primary px-8 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Начать
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left text-sm text-muted-foreground">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-lg">💬</div>
            <div className="mt-1 font-medium text-foreground">Мультиагентный чат</div>
            <div>4 специализации: Expert, Teacher, Empath, Hacker</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-lg">🎨</div>
            <div className="mt-1 font-medium text-foreground">Генерация картинок</div>
            <div>Создавайте и редактируйте изображения прямо в чате</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-lg">🎙</div>
            <div className="mt-1 font-medium text-foreground">Голосовой ввод</div>
            <div>Говорите — IGseek поймёт и ответит</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-lg">📱</div>
            <div className="mt-1 font-medium text-foreground">Мобильное приложение</div>
            <div>Установите на Android как PWA или APK</div>
          </div>
        </div>
      </div>
    </div>
  );
}
