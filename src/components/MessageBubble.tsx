import type { Message } from "~/lib/types";

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-foreground"
        }`}
      >
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 flex gap-2 flex-wrap">
            {message.attachments.map((att, i) =>
              att.type === "image" && att.base64 ? (
                <img
                  key={i}
                  src={`data:${att.mimeType};base64,${att.base64}`}
                  alt="attachment"
                  className="max-h-48 rounded-lg"
                />
              ) : (
                <div key={i} className="text-xs text-muted-foreground bg-background/20 rounded px-2 py-1">
                  📄 {att.name}
                </div>
              )
            )}
          </div>
        )}

        {message.content && (
          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap break-words">
            {renderMarkdown(message.content)}
          </div>
        )}
      </div>
    </div>
  );
}

function renderMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).replace(/^\w+\n/, "");
      return (
        <pre key={i} className="rounded-lg bg-background/50 p-3 overflow-x-auto text-sm my-2">
          <code>{code}</code>
        </pre>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-background/50 px-1.5 py-0.5 text-sm">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
