export interface StreamChunk {
  type: "text" | "done" | "error" | "image";
  content?: string;
  error?: string;
}

export function createStreamResponse(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  encoder: TextEncoder
): Response {
  const stream = new ReadableStream({
    async start(controller) {
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          clearInterval(heartbeatInterval);
        }
      }, 10_000);

      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
                );
              } else {
                try {
                  const parsed = JSON.parse(data);
                  const chunk: StreamChunk = {
                    type: "text",
                    content: parsed.choices?.[0]?.delta?.content ?? "",
                  };
                  if (chunk.content) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
                    );
                  }
                } catch {
                  // skip malformed JSON
                }
              }
            }
          }
        }
      } finally {
        clearInterval(heartbeatInterval);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      Connection: "keep-alive",
    },
  });
}
