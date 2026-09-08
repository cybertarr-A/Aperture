//#region node_modules/.nitro/vite/services/ssr/assets/episode-BOYxOjLE.js
var DOMAINS = [
	"compute",
	"chips",
	"networks",
	"security",
	"robotics",
	"space",
	"materials",
	"cognition"
];
var STYLE_LOCK = "Photoreal technical documentary. Cool tungsten key, faint cyan rim. Shallow depth of field, 35mm lens feel. Clean lab, fab, rack, or workshop set. No logos, no readable screens, no watermarks, no on-screen text, no celebrity likeness. Motion is slow and physically plausible — one camera move only.";
var SAMPLE_EPISODE = {
	id: "TF-SAMPLE",
	createdAt: (/* @__PURE__ */ new Date()).toISOString(),
	topic: "GPU memory stalls",
	domain: "compute",
	title: "The GPU is waiting on bytes",
	claim: "On many real GPU workloads, throughput is limited by memory movement, not by how fast the math units can multiply.",
	mechanism: "Matrix units only fire when operands sit in on-chip SRAM. If tiles miss cache, the chip stalls on HBM. Bandwidth and locality dominate peak FLOPs.",
	caveat: "Compute-bound kernels exist — dense GEMM with high arithmetic intensity can saturate tensor cores. The stall shows up on bandwidth-heavy or poorly tiled work.",
	confidence: "high",
	sources: [{
		title: "Williams, Waterman, Patterson — Roofline model (CACM)",
		url: "https://doi.org/10.1145/1498765.1498785"
	}, {
		title: "NVIDIA — GPU performance background (memory hierarchy)",
		url: "https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/"
	}],
	spokenScript: "Your GPU is often waiting on memory, not math. Matrix units sit idle while data crawls from HBM. Faster multiply is useless if the bytes never arrive.",
	wordCount: 32,
	durationSeconds: 15,
	aspectRatio: "9:16",
	hook: "A dense accelerator board. HBM stacks glow. Compute dies sit dark.",
	body: "A pulse of light crawls from memory stacks toward compute tiles — and stalls.",
	payoff: "Compute tiles stay dim. Memory stays bright. The wait is the work.",
	captions: [
		{
			t: "0.0",
			text: "Waiting on memory"
		},
		{
			t: "5.0",
			text: "Not waiting on math"
		},
		{
			t: "11.0",
			text: "Bytes never arrive"
		}
	],
	shots: [
		{
			id: "S1",
			durationSeconds: 5,
			role: "hook",
			firstFrame: "Macro of a dark GPU board, HBM stacks at the edge catching tungsten light, cyan rim on the package.",
			motion: "Slow 8 percent push-in. Dust motes. No new objects.",
			audio: "Low HVAC room tone, faint coil whine.",
			imaginePrompt: "Photoreal technical documentary. Cool tungsten key, faint cyan rim. Shallow depth of field, 35mm. Macro of a dense GPU board on a dark lab bench, HBM stacks catching light, compute package in shadow. Slow 8 percent push-in over 5 seconds. Dust motes. Audio: HVAC and faint coil whine. No logos, no readable text, no watermarks. 9:16."
		},
		{
			id: "S2",
			durationSeconds: 5,
			role: "mechanism",
			firstFrame: "Cutaway of package: HBM stacks, on-package interconnect, compute tiles. Honest hardware, not a UI schematic.",
			motion: "One pulse of light travels HBM to interconnect, then hesitates before the tiles.",
			audio: "Soft servo, then a held silence.",
			imaginePrompt: "Photoreal technical documentary. Package cutaway of a GPU: HBM stacks, short interconnect, compute tiles. One slow pulse of light travels from memory toward compute and hesitates. Camera locked. 5 seconds. No UI, no labels, no logos. 9:16."
		},
		{
			id: "S3",
			durationSeconds: 5,
			role: "payoff",
			firstFrame: "Same board as S1. Memory stacks bright, compute tiles dim.",
			motion: "Hold. Tiny heat shimmer over HBM. No camera move.",
			audio: "Room tone only.",
			imaginePrompt: "Photoreal technical documentary. Same GPU board. HBM stacks remain bright, compute dies stay dim. Hold with faint heat shimmer. 5 seconds. No text, no logos. 9:16."
		}
	],
	onScreenText: [
		"Waiting on memory",
		"Not on math",
		"Bytes never arrive"
	],
	qaNotes: "Do not draw fake FLOP counters or named vendor marks. Prefer real packages over cartoon transistors. Arithmetic intensity is the caveat — dense GEMM can be compute-bound.",
	researchNotes: "Sample pack. Roofline: operational intensity vs peak FLOPs and peak bandwidth. CUDA best-practices: hide memory latency, coalesce, use shared memory.",
	styleLock: STYLE_LOCK
};
function wordCount(text) {
	return text.trim().split(/\s+/).filter(Boolean).length;
}
function episodeMarkdown(ep) {
	const shots = ep.shots.map((s) => `### ${s.id} · ${s.role} · ${s.durationSeconds}s\n\n**First frame:** ${s.firstFrame}\n\n**Motion:** ${s.motion}\n\n**Audio:** ${s.audio}\n\n**Imagine prompt:**\n\n${s.imaginePrompt}`).join("\n\n");
	const sources = ep.sources.map((s) => `- ${s.title} — ${s.url}`).join("\n");
	const captions = ep.captions.map((c) => `- ${c.t}s  ${c.text}`).join("\n");
	return `# ${ep.title}

ID: ${ep.id}
Domain: ${ep.domain}
Duration: ${ep.durationSeconds}s · ${ep.aspectRatio}
Confidence: ${ep.confidence}

## Claim
${ep.claim}

## Mechanism
${ep.mechanism}

## Caveat
${ep.caveat}

## Spoken script (${ep.wordCount} words)
${ep.spokenScript}

## Captions
${captions}

## Sources
${sources}

## Style lock
${ep.styleLock}

## Shots
${shots}

## QA
${ep.qaNotes}
`;
}
//#endregion
export { wordCount as a, episodeMarkdown as i, SAMPLE_EPISODE as n, STYLE_LOCK as r, DOMAINS as t };
