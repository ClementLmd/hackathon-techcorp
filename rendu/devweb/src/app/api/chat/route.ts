import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const DEFAULT_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const model = body?.model ?? process.env.OLLAMA_MODEL ?? "phi3.5";
    const system =
      body?.system ??
      process.env.OLLAMA_SYSTEM_PROMPT ??
      "You are a helpful financial assistant focused on corporate finance and business.";
    const temperature = typeof body?.temperature === "number" ? body.temperature : 0.2;
    const maxOutputTokens =
      typeof body?.maxOutputTokens === "number"
        ? body.maxOutputTokens
        : typeof body?.max_tokens === "number"
          ? body.max_tokens
          : 1024;
    const baseURL = body?.baseURL ?? process.env.OLLAMA_BASE_URL ?? DEFAULT_BASE_URL;

    const ollama = createOpenAICompatible({
      name: "ollama",
      baseURL,
    });

    const result = streamText({
      model: ollama(model),
      system,
      temperature,
      maxOutputTokens,
      messages: await convertToModelMessages(messages),
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
