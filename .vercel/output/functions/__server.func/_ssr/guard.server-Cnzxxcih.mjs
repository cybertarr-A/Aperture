import { i as getRequest } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guard.server-Cnzxxcih.js
var WINDOWS = {
	produce: {
		limit: 8,
		windowMs: 6e5
	},
	speak: {
		limit: 16,
		windowMs: 6e5
	},
	test: {
		limit: 30,
		windowMs: 6e5
	}
};
var buckets = /* @__PURE__ */ new Map();
async function fingerprint(apiKey) {
	const req = getRequest();
	const ip = req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req?.headers.get("x-real-ip") || "local";
	const data = new TextEncoder().encode(`${ip}:${apiKey}`);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return Buffer.from(digest).toString("hex").slice(0, 20);
}
async function enforceRateLimit(apiKey, action) {
	const spec = WINDOWS[action];
	const id = `${action}:${await fingerprint(apiKey)}`;
	const now = Date.now();
	const bucket = buckets.get(id) ?? {
		hits: [],
		...spec
	};
	bucket.hits = bucket.hits.filter((t) => now - t < spec.windowMs);
	if (bucket.hits.length >= spec.limit) throw new Error("Rate limit: wait a few minutes before retrying.");
	bucket.hits.push(now);
	buckets.set(id, bucket);
	if (buckets.size > 4e3) {
		for (const [k, b] of buckets) if (b.hits.every((t) => now - t > b.windowMs)) buckets.delete(k);
	}
}
//#endregion
export { enforceRateLimit };
