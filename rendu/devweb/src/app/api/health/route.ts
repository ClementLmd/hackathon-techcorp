import { checkOllamaHealth } from "@/lib/ollama-health";

const DEFAULT_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const baseURL = searchParams.get("baseURL") ?? DEFAULT_BASE_URL;
  const model = searchParams.get("model") ?? process.env.OLLAMA_MODEL ?? undefined;

  const result = await checkOllamaHealth(baseURL, model);

  return Response.json(result, {
    status: result.connected ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
