export type ChatConfig = {
  /** Nom du modele charge dans le serveur d'inference (ex: phi3.5). */
  model: string;
  /** System prompt injecte cote serveur avant la conversation. */
  systemPrompt: string;
  /** Creativite du modele (0 = deterministe, 1 = creatif). */
  temperature: number;
  /** Nombre max de tokens generes par reponse. */
  maxOutputTokens: number;
};

export const DEFAULT_SYSTEM_PROMPT = [
  "Tu es Phi-3.5-Financial, l'assistant IA de TechCorp Industries specialise en finance et business.",
  "Reponds de maniere claire, structuree et professionnelle, en francais par defaut.",
  "Lorsque c'est pertinent, utilise des listes et du formatage markdown.",
  "Si une question sort de ton domaine ou demande un conseil financier reglemente, precise tes limites.",
].join(" ");

export const DEFAULT_CONFIG: ChatConfig = {
  model: process.env.NEXT_PUBLIC_OLLAMA_MODEL ?? "phi3.5",
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  temperature: 0.7,
  maxOutputTokens: 1024,
};
