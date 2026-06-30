import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";
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

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
