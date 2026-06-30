export type HealthResult = {
  connected: boolean;
  baseURL: string;
  model?: string;
  modelAvailable?: boolean;
  error?: string;
};

const HEALTH_TIMEOUT_MS = 5_000;

function ollamaRoot(baseURL: string): string {
  return baseURL.replace(/\/v1\/?$/, "").replace(/\/$/, "");
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timeout);
  }
}

function modelMatches(available: string, expected: string): boolean {
  return available === expected || available.startsWith(`${expected}:`);
}

export async function checkOllamaHealth(
  baseURL: string,
  model?: string,
): Promise<HealthResult> {
  const normalized = baseURL.replace(/\/$/, "");

  try {
    const openAiRes = await fetchWithTimeout(`${normalized}/models`);

    if (openAiRes.ok) {
      const data = (await openAiRes.json()) as { data?: { id: string }[] };
      const models = data.data?.map((m) => m.id) ?? [];
      const modelAvailable = model
        ? models.some((id) => modelMatches(id, model))
        : undefined;

      return { connected: true, baseURL: normalized, model, modelAvailable };
    }

    const root = ollamaRoot(normalized);
    const tagsRes = await fetchWithTimeout(`${root}/api/tags`);

    if (!tagsRes.ok) {
      return {
        connected: false,
        baseURL: normalized,
        model,
        error: `Serveur injoignable (HTTP ${tagsRes.status})`,
      };
    }

    const tags = (await tagsRes.json()) as { models?: { name: string }[] };
    const models = tags.models?.map((m) => m.name) ?? [];
    const modelAvailable = model
      ? models.some((id) => modelMatches(id, model))
      : undefined;

    return { connected: true, baseURL: normalized, model, modelAvailable };
  } catch (err) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "Delai de connexion depasse"
        : err instanceof Error
          ? err.message
          : "Serveur injoignable";

    return { connected: false, baseURL: normalized, model, error: message };
  }
}
