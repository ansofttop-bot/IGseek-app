import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Conversation } from "~/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat?: () => void;
  userId: string | null;
  supabase: SupabaseClient;
}

function FoxLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15L30 35L20 25L25 50L15 70L35 60L50 85L65 60L85 70L75 50L80 25L70 35L50 15Z" fill="#dc2626" />
    </svg>
  );
}

export function Sidebar({
  open,
  onClose,
  conversations,
  activeId,
  onSelect,
  onDelete,
  onNewChat,
  userId,
  supabase,
}: Props) {
  const [tab, setTab] = useState<"chats" | "projects">("chats");
  const [search, setSearch] = useState("");

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-border bg-sidebar transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-lg font-bold text-foreground">
            <FoxLogo className="h-6 w-6" />
            IGseek
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 pb-3">
          <div className="flex rounded-xl bg-secondary p-1">
            <button
              onClick={() => setTab("chats")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                tab === "chats" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Чаты
            </button>
            <button
              onClick={() => setTab("projects")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                tab === "projects" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Проекты
            </button>
          </div>
        </div>

        {tab === "chats" && (
          <>
            <div className="px-4 pb-3">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск в чатах..."
                  className="w-full rounded-xl border border-border bg-secondary py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Мои чаты</span>
              <button
                onClick={onNewChat}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2">
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Пока нет чатов. Начните первый!
                </div>
              )}
              {filtered.map((conv) => (
                <div
                  key={conv.id}
                  className={`group mb-1 flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer transition-colors ${
                    activeId === conv.id
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  onClick={() => {
                    onSelect(conv.id);
                    onClose();
                  }}
                >
                  <span className="flex-1 truncate text-sm">{conv.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="opacity-0 text-destructive transition-opacity group-hover:opacity-100"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </nav>
          </>
        )}

        {tab === "projects" && (
          <div className="flex flex-1 flex-col items-center justify-center px-4 text-center text-muted-foreground">
            <div className="mb-3 rounded-2xl bg-secondary p-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div className="font-medium text-foreground">Пока нет проектов</div>
            <div className="text-sm">Нажмите +, чтобы создать первый</div>
          </div>
        )}

        <div className="border-t border-border p-2">
          <div className="mb-2 grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1">
            <a href="/" className="flex flex-col items-center gap-1 rounded-lg py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Главная
            </a>
            <a href="/chat" className="flex flex-col items-center gap-1 rounded-lg py-2 text-xs text-primary bg-primary/10">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Чат
            </a>
            <a href="/profile" className="flex flex-col items-center gap-1 rounded-lg py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Профиль
            </a>
          </div>

          {userId && (
            <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                <FoxLogo className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-medium text-foreground">Пользователь</div>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Выйти
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
