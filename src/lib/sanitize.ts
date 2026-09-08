import {
  DOMAINS,
  STYLE_LOCK,
  type AspectRatio,
  type Confidence,
  type Domain,
  type Episode,
  type Shot,
  type ShotRole,
  type Source,
} from "./episode";

export const LIMITS = {
  topic: 400,
  title: 160,
  claim: 600,
  paragraph: 1200,
  script: 700,
  prompt: 1800,
  notes: 2000,
  research: 8000,
  caption: 80,
  sources: 6,
  shots: 3,
  library: 20,
  speech: 600,
  audioBytes: 6_000_000,
} as const;

export function clampText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\u0000/g, "").trim().slice(0, max);
}

export function redactSecrets(text: string): string {
  return text.replace(/gsk_[A-Za-z0-9_-]+/g, "gsk_***");
}

export function assertGroqKey(apiKey: string): string {
  const key = apiKey.trim();
  if (!/^gsk_[A-Za-z0-9_-]{20,200}$/.test(key)) {
    throw new Error("Groq key must look like gsk_… from console.groq.com");
  }
  return key;
}

export function safeHttpsUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.endsWith(".local") ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host.startsWith("0.") ||
      host.endsWith(".internal")
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function safeEpisodeId(raw: string): string {
  const id = clampText(raw, 40).replace(/[^A-Za-z0-9_-]/g, "");
  return id.length >= 4 ? id : `TF-${Date.now().toString(36).toUpperCase()}`;
}

export function safeFilename(id: string): string {
  return `${safeEpisodeId(id)}.md`;
}

function asConfidence(v: unknown): Confidence {
  return v === "high" || v === "medium" || v === "low" ? v : "medium";
}

function asAspect(v: unknown): AspectRatio {
  return v === "16:9" ? "16:9" : "9:16";
}

function asRole(v: unknown): ShotRole {
  return v === "mechanism" || v === "payoff" || v === "hook" ? v : "hook";
}

function asDomain(v: unknown): string {
  if (v === "any") return "any";
  if (typeof v === "string" && (DOMAINS as readonly string[]).includes(v)) return v;
  return "compute";
}

function sanitizeSource(s: Source): Source | null {
  const url = safeHttpsUrl(s.url);
  if (!url) return null;
  return { title: clampText(s.title, 160) || url, url };
}

function sanitizeShot(s: Shot, i: number): Shot {
  return {
    id: clampText(s.id, 12) || `S${i + 1}`,
    durationSeconds: Math.min(15, Math.max(1, Math.round(Number(s.durationSeconds) || 5))),
    role: asRole(s.role),
    firstFrame: clampText(s.firstFrame, LIMITS.paragraph),
    motion: clampText(s.motion, LIMITS.paragraph),
    audio: clampText(s.audio, 240),
    imaginePrompt: clampText(s.imaginePrompt, LIMITS.prompt),
  };
}

export function sanitizeEpisode(raw: Episode): Episode {
  const sources = (raw.sources ?? [])
    .map(sanitizeSource)
    .filter((s): s is Source => Boolean(s))
    .slice(0, LIMITS.sources);

  const shots = (raw.shots ?? []).slice(0, LIMITS.shots).map(sanitizeShot);
  const script = clampText(raw.spokenScript, LIMITS.script);

  return {
    ...raw,
    id: safeEpisodeId(raw.id),
    topic: clampText(raw.topic, LIMITS.topic),
    domain: asDomain(raw.domain),
    title: clampText(raw.title, LIMITS.title) || "Untitled pack",
    claim: clampText(raw.claim, LIMITS.claim),
    mechanism: clampText(raw.mechanism, LIMITS.paragraph),
    caveat: clampText(raw.caveat, LIMITS.paragraph),
    confidence: asConfidence(raw.confidence),
    sources,
    spokenScript: script,
    wordCount: script.split(/\s+/).filter(Boolean).length,
    durationSeconds: raw.durationSeconds === 36 ? 36 : 15,
    aspectRatio: asAspect(raw.aspectRatio),
    hook: clampText(raw.hook, 280),
    body: clampText(raw.body, 280),
    payoff: clampText(raw.payoff, 280),
    captions: (raw.captions ?? []).slice(0, 6).map((c) => ({
      t: clampText(c.t, 12),
      text: clampText(c.text, LIMITS.caption),
    })),
    shots,
    onScreenText: (raw.onScreenText ?? []).slice(0, 4).map((t) => clampText(t, LIMITS.caption)),
    qaNotes: clampText(raw.qaNotes, LIMITS.notes),
    researchNotes: clampText(raw.researchNotes, LIMITS.research),
    styleLock: STYLE_LOCK,
  };
}

export function compactEpisode(ep: Episode): Episode {
  return { ...ep, researchNotes: clampText(ep.researchNotes, 400) };
}

export function isDomain(v: string): v is Domain {
  return v === "any" || (DOMAINS as readonly string[]).includes(v);
}
