"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { AlertTriangle, Bot, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_CONFIG, type ChatConfig } from "@/lib/chat-config";
import { ChatInput } from "./chat-input";
import { MessageBubble } from "./message-bubble";

const SUGGESTIONS = [
  "Explique-moi ce qu'est l'EBITDA.",
  "Quels sont les risques d'un investissement en actions ?",
  "Resume les bases d'un business plan.",
];

export function ChatPanel({ config = DEFAULT_CONFIG }: { config?: ChatConfig }) {
  const { messages, sendMessage, status, stop, error, regenerate, setMessages, clearError } =
    useChat();

  const requestBody = () => ({
    model: config.model,
    system: config.systemPrompt,
    temperature: config.temperature,
    maxOutputTokens: config.maxOutputTokens,
  });

  const isStreaming = status === "submitted" || status === "streaming";
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
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="size-4" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Phi-3.5-Financial</p>
            <p className="text-xs text-muted-foreground">TechCorp Industries</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={newConversation} disabled={isEmpty && !isStreaming}>
          <RotateCcw className="size-4" />
          Nouvelle conversation
        </Button>
      </header>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6">
          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Sparkles className="size-7" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Assistant financier TechCorp</h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  Posez vos questions finance et business. Les reponses sont generees en temps reel
                  par le modele Phi-3.5-Financial.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="cursor-pointer rounded-full border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
              <span className="size-2 animate-pulse rounded-full bg-muted-foreground" />
              Le modele reflechit...
            </div>
          )}

          {status === "error" && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <div className="flex-1">
                <p className="font-medium text-destructive">Une erreur est survenue</p>
                <p className="text-muted-foreground">
                  {error?.message ?? "Impossible de contacter le serveur d'inference."}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => regenerate({ body: requestBody() })}>
                <RotateCcw className="size-4" />
                Reessayer
              </Button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t bg-background px-4 py-3">
        <div className="mx-auto w-full max-w-3xl">
          <ChatInput
            onSend={handleSend}
            onStop={stop}
            isStreaming={isStreaming}
            disabled={status === "error"}
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Entree pour envoyer, Maj+Entree pour un saut de ligne. Modele experimental, verifiez les
            informations importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
