# Contrat API `/api/chat` (DEV WEB)

Ce contrat permet de developper l'UI (etape 3) et la route (etape 2) en parallele.

## Endpoint
`POST /api/chat`

## Corps de la requete (envoye par le front via `useChat` + `DefaultChatTransport`)

```jsonc
{
  "messages": [ /* UIMessage[] de l'AI SDK (avec .parts) */ ],
  "model": "phi3.5",                // ChatConfig.model
  "system": "Tu es Phi-3.5-Financial...", // ChatConfig.systemPrompt
  "temperature": 0.7,                // ChatConfig.temperature
  "maxOutputTokens": 1024            // ChatConfig.maxOutputTokens
}
```

## Reponse attendue
Un flux de messages UI de l'AI SDK (streaming), produit par :

```ts
import { convertToModelMessages, streamText, createUIMessageStreamResponse, toUIMessageStream } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
});

export async function POST(req: Request) {
  const { messages, model, system, temperature, maxOutputTokens } = await req.json();
  const result = streamText({
    model: ollama(model ?? process.env.OLLAMA_MODEL ?? "phi3.5"),
    system,
    temperature,
    maxOutputTokens,
    messages: await convertToModelMessages(messages),
  });
  return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) });
}
```

> Le front est tolerant : si `model/system/temperature/maxOutputTokens` sont absents, la route
> doit utiliser ses propres valeurs par defaut (variables d'environnement).

## Variables d'environnement (cote serveur)
- `OLLAMA_BASE_URL` (defaut `http://localhost:11434/v1`)
- `OLLAMA_MODEL` (defaut `phi3.5`)
