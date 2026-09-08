import { createServerFn } from "@tanstack/react-start";
import type { AspectRatio, Domain, Episode, VoiceId } from "./episode";
import { STYLE_LOCK, wordCount } from "./episode";
import { EPISODE_JSON_SCHEMA } from "./schema";

export type ProduceInput = {
  apiKey: string;
  topic: string;
  domain: Domain;
  aspectRatio: AspectRatio;
  durationSeconds: 15 | 36;
  voice: VoiceId;
};

function requireKey(apiKey: string) {
  const key = apiKey.trim();
  if (key.length < 10) throw new Error("Paste a Groq Cloud API key first.");
  return key;
}

function fail(e: unknown): never {
  if (e instanceof Error) throw new Error(e.message);
  throw new Error("Groq request failed.");
}

export const testGroqKey = createServerFn({ method: "POST" })
  .validator((data: { apiKey: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { groqListModels } = await import("./groq.server");
      const models = await groqListModels(requireKey(data.apiKey));
      return { ok: true as const, modelCount: models.length };
    } catch (e) {
      fail(e);
    }
  });

export const produceEpisode = createServerFn({ method: "POST" })
  .validator((data: ProduceInput) => data)
  .handler(async ({ data }): Promise<Episode> => {
    try {
      return await runProduce(data);
    } catch (e) {
      fail(e);
    }
  });

export const speakScript = createServerFn({ method: "POST" })
  .validator((data: { apiKey: string; text: string; voice: VoiceId }) => data)
  .handler(async ({ data }) => {
    try {
      const { groqSpeech } = await import("./groq.server");
      const text = data.text.trim();
      if (!text) throw new Error("Nothing to speak.");
      return await groqSpeech(requireKey(data.apiKey), text, data.voice);
    } catch (e) {
      fail(e);
    }
  });

async function runProduce(input: ProduceInput): Promise<Episode> {
  const { groqChat } = await import("./groq.server");
  const apiKey = requireKey(input.apiKey);
  const shotCount = input.durationSeconds === 36 ? 3 : 1;
  const maxWords = input.durationSeconds === 36 ? 85 : 36;

  const research = await groqChat(
    apiKey,
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
SOURCES — title and URL, at least two independent ones
CONFIDENCE — high, medium, or low
VISUAL NOTES — real objects to film, not diagrams of internals we cannot see
BANNED VISUALS — what the generator will hallucinate`,
        },
        {
          role: "user",
          content: [
            `Domain: ${input.domain === "any" ? "any technology" : input.domain}`,
            input.topic.trim()
              ? `Requested topic: ${input.topic.trim()}`
              : "Pick the strongest unused fact in this domain.",
            `Format: ${input.aspectRatio}, ${input.durationSeconds}s, ${shotCount} shot(s).`,
          ].join("\n"),
        },
      ],
    },
    90000,
  );

  if (/^REJECT\b/i.test(research.content)) {
    throw new Error(research.content.slice(0, 400));
  }

  const packed = await groqChat(
    apiKey,
    {
      model: "openai/gpt-oss-120b",
      temperature: 0.3,
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
- caption text ≤ 6 words each.`,
        },
        {
          role: "user",
          content: research.content,
        },
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

  let raw: Omit<Episode, "createdAt" | "researchNotes" | "styleLock">;
  try {
    raw = JSON.parse(packed.content) as Omit<
      Episode,
      "createdAt" | "researchNotes" | "styleLock"
    >;
  } catch {
    throw new Error("Packager returned invalid JSON. Retry the generate.");
  }

  if (!raw.spokenScript || !raw.claim) {
    throw new Error("Packager omitted required fields. Retry the generate.");
  }
  const script = raw.spokenScript.trim();
  return {
    ...raw,
    spokenScript: script,
    wordCount: wordCount(script),
    createdAt: new Date().toISOString(),
    researchNotes: research.content,
    styleLock: STYLE_LOCK,
    aspectRatio: input.aspectRatio,
    durationSeconds: input.durationSeconds,
  };
}
