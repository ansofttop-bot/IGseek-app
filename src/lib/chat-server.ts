import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "~/lib/supabase/client";
import { loadSystemPrompt } from "~/lib/prompts/loader.server";
import { routeModel, routeReasoningModel, getFallbackModel } from "~/lib/model-router";
import { getCannedAnswer } from "~/lib/gemini/canned-answers";
import type { Attachment } from "~/lib/types";

export const chatHandler = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const d = input as {
      message: string;
      attachments?: Attachment[];
      isImage?: boolean;
      isReasoning?: boolean;
      history?: Array<{ role: string; content: string }>;
    };
    return d;
  })
  .handler(async ({ data }) => {
    const systemPrompt = await loadSystemPrompt();
    const { message, attachments = [], isImage = false, isReasoning = false, history = [] } = data;

    const canned = getCannedAnswer(message);
    if (canned) return { content: canned, type: "text" as const };

    if (isImage) return await handleImageGen(message, attachments);

    const model = isReasoning ? routeReasoningModel() : routeModel(attachments.length > 0);
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history,
      { role: "user" as const, content: buildUserContent(message, attachments) },
    ];

    try {
      return await callProvider(model.baseUrl, model.model, model.apiKey, messages);
    } catch {
      const fallback = getFallbackModel();
      return await callProvider(fallback.baseUrl, fallback.model, fallback.apiKey, messages);
    }
  });

function buildUserContent(message: string, attachments: Attachment[]) {
  if (attachments.length === 0) return message;
  const parts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];
  for (const att of attachments) {
    if (att.type === "image" && att.base64) {
      parts.push({ type: "image_url", image_url: { url: `data:${att.mimeType};base64,${att.base64}` } });
    }
  }
  parts.push({ type: "text", text: message });
  return parts;
}

async function callProvider(baseUrl: string, model: string, apiKey: string, messages: unknown[]) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, stream: false }),
  });
  if (!response.ok) throw new Error(`Provider error: ${response.status}`);
  const json = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = json.choices?.[0]?.message?.content ?? "";
  return { content, type: "text" as const };
}

async function handleImageGen(message: string, attachments: Attachment[]) {
  const apiKey = process.env.GEMINI_API_KEY!;
  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
  for (const att of attachments) {
    if (att.type === "image" && att.base64) {
      parts.push({ inlineData: { mimeType: att.mimeType || "image/png", data: att.base64 } });
    }
  }
  parts.push({ text: message });
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-image-generation:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { responseModalities: ["TEXT", "IMAGE"] } }),
    }
  );
  if (!response.ok) return { content: "Ошибка генерации изображения", type: "error" as const };
  const resultData = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> } }> };
  let result = "";
  for (const part of resultData.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData) result += `\n\n![generated](data:${part.inlineData.mimeType};base64,${part.inlineData.data})\n\n`;
    if (part.text) result += part.text;
  }
  return { content: result, type: "text" as const };
}

export const subscribeFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const d = input as { userId: string };
    return d;
  })
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient();
    const { count } = await supabase.from("free_slots").select("*", { count: "exact", head: true });
    if (count !== null && count < 50) {
      await supabase.from("free_slots").insert({ user_id: data.userId });
      await supabase.from("subscriptions").upsert({
        user_id: data.userId, status: "active",
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        source: "free_slot",
      });
      return { success: true, free: true };
    }
    return { success: false, free: false, message: "Нет свободных слотов. Ожидается Platega." };
  });

export const transcribeFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return input as FormData;
  })
  .handler(async ({ data }) => {
    const audioFile = data.get("audio") as File | null;
    if (!audioFile) return { text: "" };

    const apiKey = process.env.OPENAI_TRANSCRIPTION_API_KEY || process.env.OPENROUTER_API_KEY || "";
    const response = await fetch("https://gateway.aitunnel.ru/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: data,
    });

    if (!response.ok) throw new Error("Transcription failed");
    const result = await response.json() as { text?: string };
    return { text: result.text || "" };
  });
