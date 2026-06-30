import type { UIMessage } from "ai";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";

function getText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { text: string }).text)
    .join("");
}

export function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = getText(message);

  return (
    <div className={cn("flex w-full gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="size-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm",
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{text}</p>
        ) : (
          <Markdown content={text} />
        )}
      </div>

      {isUser && (
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <User className="size-4" />
        </div>
      )}
    </div>
  );
}
