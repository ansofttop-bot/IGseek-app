export interface Attachment {
  type: "image" | "file";
  url?: string;
  base64?: string;
  mimeType?: string;
  name?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  agent?: string;
  attachments?: Attachment[];
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  agent: string;
  updated_at: string;
}

export interface Subscription {
  user_id: string;
  status: "active" | "inactive" | "expired";
  expires_at: string | null;
  source: string;
}
