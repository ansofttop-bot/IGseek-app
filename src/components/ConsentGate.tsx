import { useState } from "react";

interface Props {
  onAccept: () => void;
}

function FoxLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15L30 35L20 25L25 50L15 70L35 60L50 85L65 60L85 70L75 50L80 25L70 35L50 15Z" fill="#dc2626" />
    </svg>
  );
}

export function ConsentGate({ onAccept }: Props) {
  const [privacy, setPrivacy] = useState(false);
  const [tos, setTos] = useState(false);
  const [project, setProject] = useState(false);
  const [age, setAge] = useState(false);
  const allChecked = privacy && tos && project && age;

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-primary/5">
        <div className="mb-6 text-center">
          <FoxLogo className="mx-auto mb-3 h-10 w-10" />
          <h1 className="text-xl font-bold text-foreground">Добро пожаловать в IGseek</h1>
          <p className="text-sm text-muted-foreground">Пожалуйста, ознакомьтесь с документами</p>
        </div>

        <div className="mb-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
          <div className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Продолжая пользоваться сервисом, вы подтверждаете, что прочитали и принимаете указанные документы.</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-secondary p-4 transition-colors hover:bg-accent">
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => setPrivacy(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-foreground">
              Я прочитал(а){" "}
              <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80">
                Политика конфиденциальности
              </a>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-secondary p-4 transition-colors hover:bg-accent">
            <input
              type="checkbox"
              checked={tos}
              onChange={(e) => setTos(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-foreground">
              Я прочитал(а){" "}
              <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80">
                Пользовательское соглашение
              </a>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-secondary p-4 transition-colors hover:bg-accent">
            <input
              type="checkbox"
              checked={project}
              onChange={(e) => setProject(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-foreground">
              Я прочитал(а){" "}
              <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80">
                Соглашение проекта и нейросети
              </a>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-secondary p-4 transition-colors hover:bg-accent">
            <input
              type="checkbox"
              checked={age}
              onChange={(e) => setAge(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-foreground">
              Мне исполнилось 18 лет, я осознаю ответственность за использование сервиса.
            </span>
          </label>
        </div>

        <button
          onClick={onAccept}
          disabled={!allChecked}
          className="mt-6 w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-primary/40 disabled:text-white/60"
        >
          {allChecked ? "Продолжить" : "Отметьте все пункты"}
        </button>
      </div>
    </div>
  );
}
