// Next.js Route Handler: /api/chat
// Forwards chat messages to an OpenAI-compatible inference server (Ollama)
// and proxies the streaming response back to the browser.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const temperature = body?.temperature ?? 0.2;
    const max_tokens = body?.max_tokens ?? 512;

    const systemPrompt = process.env.OLLAMA_SYSTEM_PROMPT ??
      'You are a helpful financial assistant focused on corporate finance and business.';

    const model = process.env.OLLAMA_MODEL ?? 'phi3.5';
    const base = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1';

    const payload = {
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature,
      max_tokens,
      stream: true,
    };

    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(text, { status: res.status });
    }

    const contentType = res.headers.get('content-type') ?? 'text/event-stream';
    const stream = res.body;

    return new Response(stream, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), {
      status: 500,
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
