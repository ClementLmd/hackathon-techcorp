import { ChatPanel } from "@/components/chat/chat-panel";

export default function Home() {
  return (
    <main className="flex h-dvh flex-col">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col bg-card/40 sm:border-x sm:border-border/60 sm:shadow-sm sm:backdrop-blur-sm">
        <ChatPanel />
      </div>
    </main>
  );
}
