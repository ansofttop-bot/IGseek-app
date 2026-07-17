import { useState, useRef } from "react";
import { toast } from "sonner";
import type { Attachment } from "~/lib/types";
import { transcribeFn } from "~/lib/chat-server";

interface Props {
  onSend: (content: string, attachments?: Attachment[], isImage?: boolean, isReasoning?: boolean) => Promise<void>;
  streaming: boolean;
}

export function ChatComposer({ onSend, streaming }: Props) {
  const [text, setText] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const [reasoning, setReasoning] = useState(false);
  const [imageGen, setImageGen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [recording, setRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  async function handleSubmit() {
    if (streaming) return;
    if (!text.trim() && attachments.length === 0) return;
    await onSend(text, attachments, imageGen, reasoning);
    setText("");
    setAttachments([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        setAttachments((prev) => [
          ...prev,
          {
            type: file.type.startsWith("image/") ? "image" : "file",
            base64,
            mimeType: file.type,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], "voice.webm", { type: "audio/webm" });

        const formData = new FormData();
        formData.append("audio", file);
        formData.append("model", "openai/gpt-4o-transcribe");

        try {
          const result = await transcribeFn({ data: formData });
          if (result.text) {
            setText((prev) => (prev ? prev + " " + result.text : result.text));
            toast.success("Голос распознан");
          }
        } catch {
          toast.error("Ошибка распознавания голоса");
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);

      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
          setRecording(false);
        }
      }, 60_000);
    } catch {
      toast.error("Не удалось получить доступ к микрофону");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  const hasContent = text.trim().length > 0 || attachments.length > 0;

  return (
    <div className="border-t border-border bg-background px-4 py-3">
      {attachments.length > 0 && (
        <div className="mb-2 flex gap-2 flex-wrap">
          {attachments.map((att, i) => (
            <div key={i} className="relative group">
              {att.type === "image" ? (
                <img
                  src={`data:${att.mimeType};base64,${att.base64}`}
                  alt={att.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center text-xs text-muted-foreground p-1 text-center">
                  📄 {att.name}
                </div>
              )}
              <button
                onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.txt,.doc,.docx,.csv,.json"
      />

      <div className={`rounded-3xl border border-border bg-card p-2 transition-shadow ${streaming ? "composer-glow border-primary/50" : ""}`}>
        <div className="flex items-end gap-2 px-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full p-2.5 text-muted-foreground hover:bg-secondary transition-colors shrink-0"
            title="Прикрепить файл"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={streaming ? "IGseek отвечает..." : "Напишите сообщение..."}
              disabled={streaming}
              rows={1}
              className="w-full resize-none bg-transparent px-2 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
              style={{ minHeight: "24px", maxHeight: "120px" }}
            />
          </div>

          {hasContent ? (
            <button
              onClick={handleSubmit}
              disabled={streaming}
              className="rounded-full bg-primary p-3 text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`rounded-full p-3 transition-colors shrink-0 ${
                recording
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
              title={recording ? "Остановить запись" : "Голосовой ввод"}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}
        </div>

        <div className="mt-1 flex items-center gap-1 px-2 pb-1">
          <ToggleButton
            icon="🌐"
            label="Поиск"
            active={webSearch}
            onClick={() => setWebSearch(!webSearch)}
          />
          <ToggleButton
            icon="🧠"
            label="Размышления"
            active={reasoning}
            onClick={() => setReasoning(!reasoning)}
          />
          <ToggleButton
            icon="T"
            label=""
            active={false}
            onClick={() => {}}
          />
          <ToggleButton
            icon="🖼"
            label=""
            active={imageGen}
            onClick={() => setImageGen(!imageGen)}
          />
          <ToggleButton
            icon="💬"
            label=""
            active={false}
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

function ToggleButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <span>{icon}</span>
      {label && <span>{label}</span>}
    </button>
  );
}
