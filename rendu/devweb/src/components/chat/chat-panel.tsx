"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { AlertTriangle, RotateCcw, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatConfig } from "@/hooks/use-chat-config";
import { clearChatHistory, useChatHistoryPersistence } from "@/hooks/use-chat-history";
import { useServerHealth } from "@/hooks/use-server-health";
import { ChatInput } from "./chat-input";
import { ConnectionBadge } from "./connection-badge";
import { MessageBubble } from "./message-bubble";
import { SettingsDialog } from "./settings-dialog";

const SUGGESTIONS = [
  "Explique-moi ce qu'est l'EBITDA.",
  "Quels sont les risques d'un investissement en actions ?",
  "Résume les bases d'un business plan.",
];

export function ChatPanel() {
  const { config, setConfig, resetConfig, ready } = useChatConfig();
  const health = useServerHealth(config.baseURL, config.model, ready);
  const { messages, sendMessage, status, stop, error, regenerate, setMessages, clearError } =
    useChat();

  useChatHistoryPersistence(messages, status, setMessages);

  const requestBody = () => ({
    baseURL: config.baseURL,
    model: config.model,
    system: config.systemPrompt,
    temperature: config.temperature,
    maxOutputTokens: config.maxOutputTokens,
  });

  const isStreaming = status === "submitted" || status === "streaming";
  const isServerDown = health.status === "disconnected";
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  function handleSend(text: string) {
    clearError();
    sendMessage({ text }, { body: requestBody() });
  }

  function newConversation() {
    stop();
    clearError();
    setMessages([]);
    clearChatHistory();
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/10 bg-primary px-4 py-3 text-primary-foreground sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-sm">
            <TrendingUp className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-none tracking-tight">
              TechCorp Industries
            </p>
            <p className="mt-0.5 truncate text-xs text-primary-foreground/75">
              Phi-3.5-Financial
            </p>
            <div className="mt-1.5">
              <ConnectionBadge status={health.status} onRefresh={health.refresh} inverted />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <SettingsDialog config={config} onSave={setConfig} onReset={resetConfig} inverted />
          <Button
            variant="ghost"
            size="sm"
            onClick={newConversation}
            disabled={isEmpty && !isStreaming}
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <RotateCcw className="size-4" />
            <span className="hidden sm:inline">Nouvelle conversation</span>
          </Button>
        </div>
      </header>

      {isServerDown && (
        <div className="flex items-start gap-2 border-b border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive sm:px-6">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>
            Serveur d&apos;inférence injoignable
            {health.result?.error ? ` : ${health.result.error}` : ""}. Vérifiez l&apos;URL et le
            modèle dans les réglages, ou démarrez Ollama localement.
          </p>
        </div>
      )}

      {health.status === "connected" && health.result?.modelAvailable === false && (
        <div className="flex items-start gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-900 sm:px-6 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>
            Le modèle &quot;{config.model}&quot; n&apos;est pas chargé sur le serveur. Exécutez par
            exemple <code className="rounded bg-muted px-1">ollama run {config.model}</code>.
          </p>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6">
          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center sm:py-16">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                <Sparkles className="size-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Assistant financier TechCorp
                </h2>
                <p className="mx-auto max-w-md text-sm text-muted-foreground">
                  Posez vos questions finance et business. Les réponses sont générées en temps réel
                  par le modèle Phi-3.5-Financial.
                </p>
              </div>
              <div className="flex w-full max-w-lg flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    disabled={isServerDown}
                    className="cursor-pointer rounded-full border border-primary/15 bg-card px-3 py-1.5 text-left text-sm text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => <MessageBubble key={message.id} message={message} />)
          )}

          {status === "submitted" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-2 animate-pulse rounded-full bg-primary" />
              Le modèle réfléchit...
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm sm:flex-row sm:items-start">
              <div className="flex flex-1 items-start gap-3">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
                <div className="flex-1">
                  <p className="font-medium text-destructive">Une erreur est survenue</p>
                  <p className="text-muted-foreground">
                    {error?.message ?? "Impossible de contacter le serveur d'inférence."}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => regenerate({ body: requestBody() })}>
                <RotateCcw className="size-4" />
                Réessayer
              </Button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t bg-card/80 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <ChatInput
            onSend={handleSend}
            onStop={stop}
            isStreaming={isStreaming}
            disabled={status === "error" || isServerDown}
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Entrée pour envoyer · Maj+Entrée pour un saut de ligne · Modèle expérimental, vérifiez
            les informations importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
