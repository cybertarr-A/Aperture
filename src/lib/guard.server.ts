import { getRequest } from "@tanstack/react-start/server";

type Bucket = { hits: number[]; limit: number; windowMs: number };

const WINDOWS: Record<string, { limit: number; windowMs: number }> = {
  produce: { limit: 8, windowMs: 10 * 60 * 1000 },
  speak: { limit: 16, windowMs: 10 * 60 * 1000 },
  test: { limit: 30, windowMs: 10 * 60 * 1000 },
};

const buckets = new Map<string, Bucket>();

async function fingerprint(apiKey: string): Promise<string> {
  const req = getRequest();
  const ip =
    req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req?.headers.get("x-real-ip") ||
    "local";
  const data = new TextEncoder().encode(`${ip}:${apiKey}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(digest).toString("hex").slice(0, 20);
}

export async function enforceRateLimit(
  apiKey: string,
  action: keyof typeof WINDOWS,
): Promise<void> {
  const spec = WINDOWS[action];
  const id = `${action}:${await fingerprint(apiKey)}`;
  const now = Date.now();
  const bucket = buckets.get(id) ?? { hits: [], ...spec };
  bucket.hits = bucket.hits.filter((t) => now - t < spec.windowMs);
  if (bucket.hits.length >= spec.limit) {
    throw new Error("Rate limit: wait a few minutes before retrying.");
  }
  bucket.hits.push(now);
  buckets.set(id, bucket);

  if (buckets.size > 4000) {
    for (const [k, b] of buckets) {
      if (b.hits.every((t) => now - t > b.windowMs)) buckets.delete(k);
    }
  }
}
