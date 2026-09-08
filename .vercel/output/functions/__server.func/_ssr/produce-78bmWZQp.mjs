import { a as assertGroqKey, i as STYLE_LOCK, l as isDomain, m as wordCount, n as LIMITS, o as clampText, p as sanitizeEpisode, u as redactSecrets } from "./sanitize-D806WHx3.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/produce-78bmWZQp.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var EPISODE_JSON_SCHEMA = {
	type: "object",
	additionalProperties: false,
	required: [
		"id",
		"topic",
		"domain",
		"title",
		"claim",
		"mechanism",
		"caveat",
		"confidence",
		"sources",
		"spokenScript",
		"wordCount",
		"durationSeconds",
		"aspectRatio",
		"hook",
		"body",
		"payoff",
		"captions",
		"shots",
		"onScreenText",
		"qaNotes"
	],
	properties: {
		id: { type: "string" },
		topic: { type: "string" },
		domain: { type: "string" },
		title: { type: "string" },
		claim: { type: "string" },
		mechanism: { type: "string" },
		caveat: { type: "string" },
		confidence: {
			type: "string",
			enum: [
				"high",
				"medium",
				"low"
			]
		},
		sources: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				required: ["title", "url"],
				properties: {
					title: { type: "string" },
					url: { type: "string" }
				}
			}
		},
		spokenScript: { type: "string" },
		wordCount: { type: "number" },
		durationSeconds: { type: "number" },
		aspectRatio: {
			type: "string",
			enum: ["9:16", "16:9"]
		},
		hook: { type: "string" },
		body: { type: "string" },
		payoff: { type: "string" },
		captions: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				required: ["t", "text"],
				properties: {
					t: { type: "string" },
					text: { type: "string" }
				}
			}
		},
		shots: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				required: [
					"id",
					"durationSeconds",
					"role",
					"firstFrame",
					"motion",
					"audio",
					"imaginePrompt"
				],
				properties: {
					id: { type: "string" },
					durationSeconds: { type: "number" },
					role: {
						type: "string",
						enum: [
							"hook",
							"mechanism",
							"payoff"
						]
					},
					firstFrame: { type: "string" },
					motion: { type: "string" },
					audio: { type: "string" },
					imaginePrompt: { type: "string" }
				}
			}
		},
		onScreenText: {
			type: "array",
			items: { type: "string" }
		},
		qaNotes: { type: "string" }
	}
};
var VOICES = /* @__PURE__ */ new Set([
	"austin",
	"hannah",
	"troy"
]);
function validateProduce(data) {
	const domain = data.domain;
	if (!isDomain(domain)) throw new Error("Unknown domain.");
	if (data.aspectRatio !== "9:16" && data.aspectRatio !== "16:9") throw new Error("Aspect must be 9:16 or 16:9.");
	if (data.durationSeconds !== 15 && data.durationSeconds !== 36) throw new Error("Duration must be 15 or 36 seconds.");
	if (!VOICES.has(data.voice)) throw new Error("Unknown voice.");
	return {
		apiKey: assertGroqKey(data.apiKey),
		topic: clampText(data.topic, LIMITS.topic),
		domain,
		aspectRatio: data.aspectRatio,
		durationSeconds: data.durationSeconds,
		voice: data.voice
	};
}
function fail(e) {
	const msg = e instanceof Error ? e.message : "Groq request failed.";
	throw new Error(redactSecrets(msg));
}
var testGroqKey_createServerFn_handler = createServerRpc({
	id: "4b3d8e784b31808f4aaf9eb31c6c668505f65f35627f1e45f9f971a8201d38a7",
	name: "testGroqKey",
	filename: "src/lib/produce.ts"
}, (opts) => testGroqKey.__executeServer(opts));
var testGroqKey = createServerFn({ method: "POST" }).validator((data) => ({ apiKey: assertGroqKey(data.apiKey) })).handler(testGroqKey_createServerFn_handler, async ({ data }) => {
	try {
		const { enforceRateLimit } = await import("./guard.server-Cnzxxcih.mjs");
		const { groqListModels } = await import("./groq.server-DRNRyRYv.mjs");
		await enforceRateLimit(data.apiKey, "test");
		return {
			ok: true,
			modelCount: await groqListModels(data.apiKey)
		};
	} catch (e) {
		fail(e);
	}
});
var produceEpisode_createServerFn_handler = createServerRpc({
	id: "61b541fdabb3ac26b7f646f28374af003893c5c0dcca440637c19f67f42a5013",
	name: "produceEpisode",
	filename: "src/lib/produce.ts"
}, (opts) => produceEpisode.__executeServer(opts));
var produceEpisode = createServerFn({ method: "POST" }).validator((data) => validateProduce(data)).handler(produceEpisode_createServerFn_handler, async ({ data }) => {
	try {
		const { enforceRateLimit } = await import("./guard.server-Cnzxxcih.mjs");
		await enforceRateLimit(data.apiKey, "produce");
		return await runProduce(data);
	} catch (e) {
		fail(e);
	}
});
var speakScript_createServerFn_handler = createServerRpc({
	id: "c6b7a39f89062deaf28ad2788605c7f5bff057160dd85599b93ab8fe07318a9b",
	name: "speakScript",
	filename: "src/lib/produce.ts"
}, (opts) => speakScript.__executeServer(opts));
var speakScript = createServerFn({ method: "POST" }).validator((data) => {
	if (!VOICES.has(data.voice)) throw new Error("Unknown voice.");
	return {
		apiKey: assertGroqKey(data.apiKey),
		text: clampText(data.text, LIMITS.speech),
		voice: data.voice
	};
}).handler(speakScript_createServerFn_handler, async ({ data }) => {
	try {
		const { enforceRateLimit } = await import("./guard.server-Cnzxxcih.mjs");
		const { groqSpeech } = await import("./groq.server-DRNRyRYv.mjs");
		await enforceRateLimit(data.apiKey, "speak");
		if (!data.text) throw new Error("Nothing to speak.");
		return await groqSpeech(data.apiKey, data.text, data.voice);
	} catch (e) {
		fail(e);
	}
});
async function runProduce(input) {
	const { groqChat } = await import("./groq.server-DRNRyRYv.mjs");
	const shotCount = input.durationSeconds === 36 ? 3 : 1;
	const maxWords = input.durationSeconds === 36 ? 85 : 36;
	const research = await groqChat(input.apiKey, {
		model: "groq/compound",
		messages: [{
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
BANNED VISUALS — what the generator will hallucinate`
		}, {
			role: "user",
			content: [
				`Domain: ${input.domain === "any" ? "any technology" : input.domain}`,
				input.topic ? `Requested topic: ${input.topic}` : "Pick the strongest unused fact in this domain.",
				`Format: ${input.aspectRatio}, ${input.durationSeconds}s, ${shotCount} shot(s).`
			].join("\n")
		}]
	}, 9e4);
	const briefing = clampText(research.content, LIMITS.research);
	if (/^REJECT\b/i.test(briefing)) throw new Error(briefing.slice(0, 400));
	const packed = await groqChat(input.apiKey, {
		model: "openai/gpt-oss-120b",
		temperature: .3,
		max_tokens: 3500,
		messages: [{
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
- Source URLs must be https.`
		}, {
			role: "user",
			content: briefing
		}],
		response_format: {
			type: "json_schema",
			json_schema: {
				name: "episode_pack",
				strict: true,
				schema: EPISODE_JSON_SCHEMA
			}
		}
	}, 6e4);
	let parsed;
	try {
		parsed = JSON.parse(packed.content);
	} catch {
		throw new Error("Packager returned invalid JSON. Retry the generate.");
	}
	if (!parsed.spokenScript || !parsed.claim) throw new Error("Packager omitted required fields. Retry the generate.");
	const script = clampText(parsed.spokenScript, LIMITS.script);
	return sanitizeEpisode({
		...parsed,
		spokenScript: script,
		wordCount: wordCount(script),
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		researchNotes: briefing,
		styleLock: STYLE_LOCK,
		aspectRatio: input.aspectRatio,
		durationSeconds: input.durationSeconds
	});
}
//#endregion
export { produceEpisode_createServerFn_handler, speakScript_createServerFn_handler, testGroqKey_createServerFn_handler };
