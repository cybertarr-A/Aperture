import { createServerFn } from "@tanstack/react-start";
import type { AspectRatio, Domain, Episode, VoiceId } from "./episode";
import { STYLE_LOCK, wordCount } from "./episode";
import { EPISODE_JSON_SCHEMA } from "./schema";
import {
  LIMITS,
  assertGroqKey,
  clampText,
  isDomain,
  redactSecrets,
  sanitizeEpisode,
} from "./sanitize";

export type ProduceInput = {
  apiKey: string;
  topic: string;
  domain: Domain;
  aspectRatio: AspectRatio;
  durationSeconds: 15 | 36;
  voice: VoiceId;
};

const VOICES = new Set<VoiceId>(["austin", "hannah", "troy"]);

function validateProduce(data: ProduceInput): ProduceInput {
  const domain = data.domain;
  if (!isDomain(domain)) throw new Error("Unknown domain.");
  if (data.aspectRatio !== "9:16" && data.aspectRatio !== "16:9") {
    throw new Error("Aspect must be 9:16 or 16:9.");
  }
  if (data.durationSeconds !== 15 && data.durationSeconds !== 36) {
    throw new Error("Duration must be 15 or 36 seconds.");
  }
  if (!VOICES.has(data.voice)) throw new Error("Unknown voice.");
  return {
    apiKey: assertGroqKey(data.apiKey),
    topic: clampText(data.topic, LIMITS.topic),
    domain,
    aspectRatio: data.aspectRatio,
    durationSeconds: data.durationSeconds,
    voice: data.voice,
  };
}

function fail(e: unknown): never {
  const msg = e instanceof Error ? e.message : "Groq request failed.";
  throw new Error(redactSecrets(msg));
}

export const testGroqKey = createServerFn({ method: "POST" })
  .validator((data: { apiKey: string }) => ({ apiKey: assertGroqKey(data.apiKey) }))
  .handler(async ({ data }) => {
    try {
      const { enforceRateLimit } = await import("./guard.server");
      const { groqListModels } = await import("./groq.server");
      await enforceRateLimit(data.apiKey, "test");
      const modelCount = await groqListModels(data.apiKey);
      return { ok: true as const, modelCount };
    } catch (e) {
      fail(e);
    }
  });

export const produceEpisode = createServerFn({ method: "POST" })
  .validator((data: ProduceInput) => validateProduce(data))
  .handler(async ({ data }): Promise<Episode> => {
    try {
      const { enforceRateLimit } = await import("./guard.server");
      await enforceRateLimit(data.apiKey, "produce");
      return await runProduce(data);
    } catch (e) {
      fail(e);
    }
  });

export const speakScript = createServerFn({ method: "POST" })
  .validator((data: { apiKey: string; text: string; voice: VoiceId }) => {
    if (!VOICES.has(data.voice)) throw new Error("Unknown voice.");
    return {
      apiKey: assertGroqKey(data.apiKey),
      text: clampText(data.text, LIMITS.speech),
      voice: data.voice,
    };
  })
  .handler(async ({ data }) => {
    try {
      const { enforceRateLimit } = await import("./guard.server");
      const { groqSpeech } = await import("./groq.server");
      await enforceRateLimit(data.apiKey, "speak");
      if (!data.text) throw new Error("Nothing to speak.");
      return await groqSpeech(data.apiKey, data.text, data.voice);
    } catch (e) {
      fail(e);
    }
  });

async function runProduce(input: ProduceInput): Promise<Episode> {
  const { groqChat } = await import("./groq.server");
  const shotCount = input.durationSeconds === 36 ? 3 : 1;
  const maxWords = input.durationSeconds === 36 ? 85 : 36;

  const research = await groqChat(
    input.apiKey,
    {
      model: "groq/compound",
      messages: [
        {
          role: "system",
          content: `You are the research desk for a technological-facts video series.
Search the web. Prefer primary sources, review papers, vendor docs, and standards.
Pick ONE underexplored, true technological fact.
Reject trivia, listicles, and unsourced numbers.
If the claim cannot be sourced, say REJECT and explain.

Return a briefing with these headings:
CLAIM — one falsifiable sentence
MECHANISM — how it actually works
CAVEAT — when the claim is false
SOURCES — title and URL, at least two independent https sources
CONFIDENCE — high, medium, or low
VISUAL NOTES — real objects to film, not diagrams of internals we cannot see
BANNED VISUALS — what the generator will hallucinate`,
        },
        {
          role: "user",
          content: [
            `Domain: ${input.domain === "any" ? "any technology" : input.domain}`,
            input.topic
              ? `Requested topic: ${input.topic}`
              : "Pick the strongest unused fact in this domain.",
            `Format: ${input.aspectRatio}, ${input.durationSeconds}s, ${shotCount} shot(s).`,
          ].join("\n"),
        },
      ],
    },
    90000,
  );

  const briefing = clampText(research.content, LIMITS.research);
  if (/^REJECT\b/i.test(briefing)) {
    throw new Error(briefing.slice(0, 400));
  }

  const packed = await groqChat(
    input.apiKey,
    {
      model: "openai/gpt-oss-120b",
      temperature: 0.3,
      max_tokens: 3500,
      messages: [
        {
          role: "system",
          content: `You write production packs for short technological-fact videos.
Turn the research briefing into the JSON schema.
Rules:
- spokenScript is spoken English, not essay prose.
- spokenScript word count must be ≤ ${maxWords}. Count the words yourself.
- ${shotCount} shot(s). If one shot, role is hook and duration is ${input.durationSeconds}.
- If three shots: hook, mechanism, payoff, durations 12/12/12.
- aspectRatio is exactly "${input.aspectRatio}".
- durationSeconds is ${input.durationSeconds}.
- Imagine prompts: one paragraph, still frame first, then motion, then sound.
- Prefix every Imagine prompt with this style lock: ${STYLE_LOCK}
- No on-screen text inside Imagine prompts. Captions are separate.
- Prefer macro objects (wafer, rack, cable, motor, board) over fake internals.
- Do not invent numbers that are not in the briefing.
- id like TF-YYYYMMDD-01.
- onScreenText: 3 lines, each ≤ 6 words.
- caption text ≤ 6 words each.
- Source URLs must be https.`,
        },
        { role: "user", content: briefing },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "episode_pack",
          strict: true,
          schema: EPISODE_JSON_SCHEMA,
        },
      },
    },
    60000,
  );

  let parsed: Omit<Episode, "createdAt" | "researchNotes" | "styleLock">;
  try {
    parsed = JSON.parse(packed.content) as typeof parsed;
  } catch {
    throw new Error("Packager returned invalid JSON. Retry the generate.");
  }

  if (!parsed.spokenScript || !parsed.claim) {
    throw new Error("Packager omitted required fields. Retry the generate.");
  }

  const script = clampText(parsed.spokenScript, LIMITS.script);
  return sanitizeEpisode({
    ...parsed,
    spokenScript: script,
    wordCount: wordCount(script),
    createdAt: new Date().toISOString(),
    researchNotes: briefing,
    styleLock: STYLE_LOCK,
    aspectRatio: input.aspectRatio,
    durationSeconds: input.durationSeconds,
  });
}
