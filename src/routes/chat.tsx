import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { useBrowserClient } from "~/hooks/useBrowserClient";
import { agents, type Agent } from "~/lib/agents";
import type { Message, Conversation, Attachment } from "~/lib/types";
import { Sidebar } from "~/components/Sidebar";
import { ConsentGate } from "~/components/ConsentGate";
import { ChatComposer } from "~/components/ChatComposer";
import { MessageBubble } from "~/components/MessageBubble";
import { chatHandler } from "~/lib/chat-server";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});

function FoxLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15L30 35L20 25L25 50L15 70L35 60L50 85L65 60L85 70L75 50L80 25L70 35L50 15Z" fill="#dc2626" />
    </svg>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Доброе утро";
  if (hour >= 12 && hour < 17) return "Добрый день";
  if (hour >= 17 && hour < 22) return "Добрый вечер";
  return "Доброй ночи";
}

const suggestions = [
  "Объясни принцип работы блокчейна",
  "Объясни разницу между REST и GraphQL",
  "Объясни теорему Пифагора школьнику",
  "Придумай 5 идей для стартапа в сфере ИИ",
];

function ChatPage() {
  const supabase = useBrowserClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        loadConversations(user.id);
      }
    }).catch(() => {});
  }, [supabase]);

  const consentAccepted = localStorage.getItem("igseek_consent") === "true";

  useEffect(() => {
    if (consentAccepted) setConsent(true);
  }, [consentAccepted]);

  const handleConsent = () => {
    localStorage.setItem("igseek_consent", "true");
    setConsent(true);
  };

  async function loadConversations(uid: string) {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", uid)
      .order("updated_at", { ascending: false });
    if (data) setConversations(data);
  }

  async function loadMessages(convId: string) {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
    setActiveConversation(convId);
  }

  async function createConversation() {
    if (!userId) return;
    const { data } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        title: "Новый чат",
        agent: selectedAgent.id,
      })
      .select()
      .single();
    if (data) {
      setConversations((prev) => [data, ...prev]);
      setActiveConversation(data.id);
      setMessages([]);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string, attachments: Attachment[] = [], isImage = false, isReasoning = false) => {
      if (!content.trim() && attachments.length === 0) return;
      if (!userId) return;

      let convId = activeConversation;
      if (!convId) {
        const { data } = await supabase
          .from("conversations")
          .insert({
            user_id: userId,
            title: content.slice(0, 50) || "Новый чат",
            agent: selectedAgent.id,
          })
          .select()
          .single();
        if (!data) return;
        convId = data.id;
        setConversations((prev) => [data, ...prev]);
        setActiveConversation(convId);
      }

      const userMsg: Message = {
        id: crypto.randomUUID(),
        conversation_id: convId!,
        role: "user",
        content,
        attachments,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      await supabase.from("messages").insert(userMsg);

      setStreaming(true);

      try {
        const result = await chatHandler({ data: {
          message: content,
          attachments,
          isImage,
          isReasoning,
          history: messages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role, content: m.content })),
        } });

        const assistantContent = result.content;
        const assistantId = crypto.randomUUID();

        const assistantMsg: Message = {
          id: assistantId,
          conversation_id: convId!,
          role: "assistant",
          content: assistantContent,
          agent: selectedAgent.id,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (assistantContent) {
          await supabase.from("messages").insert({
            id: assistantId,
            conversation_id: convId,
            role: "assistant",
            content: assistantContent,
            agent: selectedAgent.id,
          });
        }
      } catch (err) {
        console.error("Chat error:", err);
      } finally {
        setStreaming(false);
      }
    },
    [userId, activeConversation, selectedAgent, supabase]
  );

  async function deleteConversation(id: string) {
    await supabase.from("messages").delete().eq("conversation_id", id);
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversation === id) {
      setActiveConversation(null);
      setMessages([]);
    }
  }

  if (!consent) return <ConsentGate onAccept={handleConsent} />;

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeId={activeConversation}
        onSelect={(id) => loadMessages(id)}
        onDelete={deleteConversation}
        onNewChat={createConversation}
        userId={userId}
        supabase={supabase}
      />

      <main className="flex flex-1 flex-col h-dvh relative">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-secondary transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span>Новый чат</span>
              <button className="text-muted-foreground hover:text-foreground">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedAgent(agents[0])}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedAgent.id === agents[0].id
                  ? "border border-primary/50 bg-primary/10 text-primary"
                  : "border border-border bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="mr-1">👥</span>Все
            </button>
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedAgent.id === agent.id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="mr-1">{agent.icon}</span>
                {agent.name}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FoxLogo className="mb-4 h-14 w-14" />
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">AI · v1.0</div>
              <h1 className="text-4xl font-bold text-foreground mb-2">IGseek</h1>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Ассистент нового поколения. Понимает контекст, отвечает по делу.
              </p>
              <div className="text-xl font-medium text-foreground mb-1">{getGreeting()}</div>
              <div className="text-sm text-muted-foreground mb-6">Активный агент: {selectedAgent.name}</div>

              <div className="w-full max-w-md space-y-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground hover:bg-accent transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.length > 0 && (
            <div className="space-y-4 pb-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <ChatComposer
          onSend={sendMessage}
          streaming={streaming}
        />
      </main>
    </div>
  );
}
