import type { UIMessage } from "ai";

export const HISTORY_STORAGE_KEY = "techcorp-chat-history";

function isUIMessage(value: unknown): value is UIMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  if (typeof message.id !== "string") return false;
  if (message.role !== "user" && message.role !== "assistant" && message.role !== "system") {
    return false;
  }
  if (!Array.isArray(message.parts)) return false;
  return message.parts.every(
    (part) =>
      part &&
      typeof part === "object" &&
      typeof (part as { type?: unknown }).type === "string",
  );
}

export function loadChatHistory(): UIMessage[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isUIMessage);
  } catch {
    return [];
  }
}

export function saveChatHistory(messages: UIMessage[]): void {
  if (typeof window === "undefined") return;
  if (messages.length === 0) {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return;
  }
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(messages));
}

export function clearChatHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}
