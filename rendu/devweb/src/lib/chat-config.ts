export type ChatConfig = {
  /** URL OpenAI-compatible du serveur d'inference (ex: http://localhost:11434/v1). */
  baseURL: string;
  /** Nom du modele charge dans le serveur d'inference (ex: phi3.5). */
  model: string;
  /** System prompt injecte cote serveur avant la conversation. */
  systemPrompt: string;
  /** Creativite du modele (0 = deterministe, 1 = creatif). */
  temperature: number;
  /** Nombre max de tokens generes par reponse. */
  maxOutputTokens: number;
};

export const STORAGE_KEY = "techcorp-chat-config";

export const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_OLLAMA_BASE_URL ?? "http://localhost:11434/v1";

export const DEFAULT_SYSTEM_PROMPT = [
  "Tu es Phi-3.5-Financial, l'assistant IA de TechCorp Industries spécialisé en finance et business.",
  "Réponds de manière claire, structurée et professionnelle, en français par défaut.",
  "Lorsque c'est pertinent, utilise des listes et du formatage markdown.",
  "Si une question sort de ton domaine ou demande un conseil financier réglementé, précise tes limites.",
].join(" ");

export const DEFAULT_CONFIG: ChatConfig = {
  baseURL: DEFAULT_BASE_URL,
  model: process.env.NEXT_PUBLIC_OLLAMA_MODEL ?? "phi3.5",
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  temperature: 0.7,
  maxOutputTokens: 1024,
};

function isChatConfig(value: unknown): value is ChatConfig {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.baseURL === "string" &&
    typeof c.model === "string" &&
    typeof c.systemPrompt === "string" &&
    typeof c.temperature === "number" &&
    typeof c.maxOutputTokens === "number"
  );
}

export function loadChatConfig(): ChatConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed: unknown = JSON.parse(raw);
    return isChatConfig(parsed) ? { ...DEFAULT_CONFIG, ...parsed } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveChatConfig(config: ChatConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}
