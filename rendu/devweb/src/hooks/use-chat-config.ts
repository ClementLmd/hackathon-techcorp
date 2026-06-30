"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_CONFIG,
  loadChatConfig,
  saveChatConfig,
  type ChatConfig,
} from "@/lib/chat-config";

export function useChatConfig() {
  const [config, setConfigState] = useState<ChatConfig>(DEFAULT_CONFIG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConfigState(loadChatConfig());
    setReady(true);
  }, []);

  const setConfig = useCallback((next: ChatConfig) => {
    setConfigState(next);
    saveChatConfig(next);
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, [setConfig]);

  return { config, setConfig, resetConfig, ready };
}
