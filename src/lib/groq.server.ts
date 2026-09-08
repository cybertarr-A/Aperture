import { LIMITS, redactSecrets } from "./sanitize";

const GROQ = "https://api.groq.com/openai/v1";

export class GroqError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(redactSecrets(message));
    this.name = "GroqError";
    this.status = status;
  }
}

function groqMessage(json: unknown, fallback: string): string {
  if (json && typeof json === "object" && "error" in json) {
    const err = (json as { error?: { message?: string } }).error;
    if (err?.message) return redactSecrets(err.message);
  }
  return fallback;
}

async function groqFetch(
  apiKey: string,
  path: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${GROQ}${path}`, {
      ...init,
      signal: ctrl.signal,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return res;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new GroqError("Groq timed out. Try again.");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export type ChatResult = {
  content: string;
};

export async function groqChat(
  apiKey: string,
  body: Record<string, unknown>,
  timeoutMs = 90000,
): Promise<ChatResult> {
  const res = await groqFetch(
    apiKey,
    "/chat/completions",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ max_tokens: 4096, ...body }),
    },
    timeoutMs,
  );
  const json = (await res.json()) as {
    error?: { message?: string };
    choices?: Array<{ message?: { content?: string } }>;
  };
  if (!res.ok) {
    throw new GroqError(groqMessage(json, res.statusText), res.status);
  }
  const content = json.choices?.[0]?.message?.content?.trim() ?? "";
  if (!content) throw new GroqError("Groq returned an empty reply.");
  return { content };
}

export async function groqSpeech(
  apiKey: string,
  input: string,
  voice: string,
): Promise<{ mime: string; base64: string }> {
  const res = await groqFetch(
    apiKey,
    "/audio/speech",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "canopylabs/orpheus-v1-english",
        input: input.slice(0, LIMITS.speech),
        voice,
        response_format: "wav",
      }),
    },
    60000,
  );
  if (!res.ok) {
    let json: unknown = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }
    throw new GroqError(groqMessage(json, res.statusText), res.status);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength > LIMITS.audioBytes) {
    throw new GroqError("Voiceover exceeded size cap.");
  }
  return { mime: "audio/wav", base64: buf.toString("base64") };
}

export async function groqListModels(apiKey: string): Promise<number> {
  const res = await groqFetch(apiKey, "/models", { method: "GET" }, 15000);
  const json = (await res.json()) as {
    error?: { message?: string };
    data?: unknown[];
  };
  if (!res.ok) {
    throw new GroqError(groqMessage(json, res.statusText), res.status);
  }
  return json.data?.length ?? 0;
}
