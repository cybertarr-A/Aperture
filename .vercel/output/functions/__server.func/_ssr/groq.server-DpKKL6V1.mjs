//#region node_modules/.nitro/vite/services/ssr/assets/groq.server-DpKKL6V1.js
var GROQ = "https://api.groq.com/openai/v1";
var GroqError = class extends Error {
	status;
	constructor(message, status = 500) {
		super(message);
		this.name = "GroqError";
		this.status = status;
	}
};
function groqMessage(json, fallback) {
	if (json && typeof json === "object" && "error" in json) {
		const err = json.error;
		if (err?.message) return err.message;
	}
	return fallback;
}
async function groqFetch(apiKey, path, init, timeoutMs) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), timeoutMs);
	try {
		return await fetch(`${GROQ}${path}`, {
			...init,
			signal: ctrl.signal,
			headers: {
				Authorization: `Bearer ${apiKey}`,
				...init.headers ?? {}
			}
		});
	} catch (e) {
		if (e instanceof Error && e.name === "AbortError") throw new GroqError("Groq timed out. Try again.");
		throw e;
	} finally {
		clearTimeout(timer);
	}
}
async function groqChat(apiKey, body, timeoutMs = 9e4) {
	const res = await groqFetch(apiKey, "/chat/completions", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	}, timeoutMs);
	const json = await res.json();
	if (!res.ok) throw new GroqError(groqMessage(json, res.statusText), res.status);
	const message = json.choices?.[0]?.message;
	const content = message?.content?.trim() ?? "";
	if (!content) throw new GroqError("Groq returned an empty reply.");
	return {
		content,
		executedTools: message?.executed_tools ?? []
	};
}
async function groqSpeech(apiKey, input, voice) {
	const res = await groqFetch(apiKey, "/audio/speech", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			model: "canopylabs/orpheus-v1-english",
			input,
			voice,
			response_format: "wav"
		})
	}, 6e4);
	if (!res.ok) {
		let json = null;
		try {
			json = await res.json();
		} catch {
			json = null;
		}
		throw new GroqError(groqMessage(json, res.statusText), res.status);
	}
	return {
		mime: "audio/wav",
		base64: Buffer.from(await res.arrayBuffer()).toString("base64")
	};
}
async function groqListModels(apiKey) {
	const res = await groqFetch(apiKey, "/models", { method: "GET" }, 15e3);
	const json = await res.json();
	if (!res.ok) throw new GroqError(groqMessage(json, res.statusText), res.status);
	return (json.data ?? []).map((m) => m.id).filter((id) => Boolean(id));
}
//#endregion
export { groqChat, groqListModels, groqSpeech };
