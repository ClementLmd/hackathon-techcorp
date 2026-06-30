"use client";

import type { ChatStatus, UIMessage } from "ai";
import { useEffect, useRef } from "react";
import { clearChatHistory, loadChatHistory, saveChatHistory } from "@/lib/chat-history";

export function useChatHistoryPersistence(
  messages: UIMessage[],
  status: ChatStatus,
  setMessages: (messages: UIMessage[]) => void,
) {
  const hydrated = useRef(false);

  useEffect(() => {
    const stored = loadChatHistory();
    if (stored.length > 0) {
      setMessages(stored);
    }
    hydrated.current = true;
  }, [setMessages]);

  useEffect(() => {
    if (!hydrated.current) return;
    if (status === "streaming" || status === "submitted") return;
    saveChatHistory(messages);
  }, [messages, status]);
}

export { clearChatHistory };
