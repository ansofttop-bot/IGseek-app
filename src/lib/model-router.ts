import type { Attachment } from "~/lib/types";

export interface ModelRoute {
  provider: "deepseek" | "gemini" | "openrouter" | "hf";
  baseUrl: string;
  model: string;
  apiKey: string;
}

export function routeModel(hasAttachments: boolean, attachments: Attachment[] = []): ModelRoute {
  const hasImages = attachments.some((a) => a.type === "image");

  if (hasImages || hasAttachments) {
    return {
      provider: "gemini",
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      model: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY!,
    };
  }

  return {
    provider: "deepseek",
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
    apiKey: process.env.DEEPSEEK_API_KEY!,
  };
}

export function routeReasoningModel(): ModelRoute {
  return {
    provider: "deepseek",
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-reasoner",
    apiKey: process.env.DEEPSEEK_API_KEY!,
  };
}

export function getImageGenModel(): ModelRoute {
  return {
    provider: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    model: "gemini-2.5-flash-image",
    apiKey: process.env.GEMINI_API_KEY!,
  };
}

export function getTranscriptionModel(): { baseUrl: string; model: string; apiKey: string } {
  return {
    baseUrl: "https://gateway.aitunnel.ru/v1",
    model: "openai/gpt-4o-transcribe",
    apiKey: process.env.OPENAI_TRANSCRIPTION_API_KEY || process.env.OPENROUTER_API_KEY!,
  };
}

export function getFallbackModel(): ModelRoute {
  return {
    provider: "openrouter",
    baseUrl: "https://openrouter.ai/api/v1",
    model: "anthropic/claude-3.5-sonnet",
    apiKey: process.env.OPENROUTER_API_KEY!,
  };
}
