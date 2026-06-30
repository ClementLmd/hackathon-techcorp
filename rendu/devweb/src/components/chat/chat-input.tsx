"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatInputProps = {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
};

export function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <div className="flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={1}
        placeholder="Posez une question sur la finance, le business..."
        className="max-h-[200px] min-h-[40px] w-full resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
      />
      {isStreaming ? (
        <Button type="button" size="icon" variant="secondary" onClick={onStop} className="shrink-0">
          <Square className="size-4" />
          <span className="sr-only">Arreter</span>
        </Button>
      ) : (
        <Button
          type="button"
          size="icon"
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="shrink-0"
        >
          <ArrowUp className="size-4" />
          <span className="sr-only">Envoyer</span>
        </Button>
      )}
    </div>
  );
}
