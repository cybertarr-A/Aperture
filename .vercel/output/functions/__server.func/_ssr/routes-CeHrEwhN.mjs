import { i as __toESM } from "../_runtime.mjs";
import { a as assertGroqKey, c as episodeMarkdown, d as safeFilename, f as safeHttpsUrl, l as isDomain, n as LIMITS, o as clampText, r as SAMPLE_EPISODE, s as compactEpisode, t as DOMAINS, u as redactSecrets } from "./sanitize-D806WHx3.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as Radio, c as Download, d as Aperture, i as Trash2, l as Copy, n as Volume2, o as LoaderCircle, s as KeyRound, t as X, u as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CeHrEwhN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color,border-color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
			ghost: "text-foreground hover:bg-muted",
			outline: "border border-border bg-transparent hover:bg-muted",
			destructive: "bg-destructive text-white hover:opacity-90"
		},
		size: {
			default: "h-11 rounded-[var(--radius-sm)] px-4 text-sm",
			sm: "h-9 rounded-[var(--radius-sm)] px-3 text-xs",
			lg: "h-12 rounded-[var(--radius-md)] px-5 text-sm",
			icon: "size-11 rounded-[var(--radius-sm)]"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function CopyButton({ text, label = "Copy" }) {
	const [ok, setOk] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: "secondary",
		size: "sm",
		onClick: async () => {
			await navigator.clipboard.writeText(text);
			setOk(true);
			setTimeout(() => setOk(false), 1200);
		},
		children: [ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), ok ? "Copied" : label]
	});
}
function FramePreview({ episode }) {
	const vertical = episode.aspectRatio === "9:16";
	const [i, setI] = (0, import_react.useState)(0);
	const shot = episode.shots[i] ?? episode.shots[0];
	const caption = episode.captions[i] ?? episode.captions[0];
	const bands = (0, import_react.useMemo)(() => [
		12,
		28,
		44,
		61,
		73
	].map((top, n) => ({
		top,
		delay: n * 40,
		opacity: .08 + n % 3 * .04
	})), []);
	if (!shot) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-[#070708]", vertical ? "mx-auto aspect-[9/16] w-full max-w-[280px]" : "aspect-video w-full"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,rgba(139,154,168,0.16),transparent_55%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-40 mix-blend-overlay [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_3px)]" }),
				bands.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute left-[8%] right-[18%] h-px bg-foreground/25",
					style: {
						top: `${b.top}%`,
						opacity: b.opacity
					}
				}, b.top)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
					children: [
						shot.id,
						" · ",
						shot.role
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-4 bottom-8 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl leading-tight text-balance text-foreground",
						children: caption?.text ?? episode.onScreenText[0]
					})
				})
			]
		}), episode.shots.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center gap-2",
			children: episode.shots.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setI(idx),
				className: cn("h-9 min-w-9 rounded-full border px-3 text-xs uppercase tracking-wide", idx === i ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-muted"),
				children: s.id
			}, s.id))
		})]
	});
}
function Badge({ className, tone = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide", tone === "default" && "border-border text-muted-foreground", tone === "high" && "border-success/40 text-success", tone === "medium" && "border-warn/40 text-warn", tone === "low" && "border-destructive/40 text-destructive", className),
		...props
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
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
var testGroqKey = createServerFn({ method: "POST" }).validator((data) => ({ apiKey: assertGroqKey(data.apiKey) })).handler(createSsrRpc("4b3d8e784b31808f4aaf9eb31c6c668505f65f35627f1e45f9f971a8201d38a7"));
var produceEpisode = createServerFn({ method: "POST" }).validator((data) => validateProduce(data)).handler(createSsrRpc("61b541fdabb3ac26b7f646f28374af003893c5c0dcca440637c19f67f42a5013"));
var speakScript = createServerFn({ method: "POST" }).validator((data) => {
	if (!VOICES.has(data.voice)) throw new Error("Unknown voice.");
	return {
		apiKey: assertGroqKey(data.apiKey),
		text: clampText(data.text, LIMITS.speech),
		voice: data.voice
	};
}).handler(createSsrRpc("c6b7a39f89062deaf28ad2788605c7f5bff057160dd85599b93ab8fe07318a9b"));
var STORAGE = "aperture.groq.session";
function readSessionKey() {
	try {
		return sessionStorage.getItem(STORAGE) ?? "";
	} catch {
		return "";
	}
}
function writeSessionKey(key) {
	try {
		if (!key) sessionStorage.removeItem(STORAGE);
		else sessionStorage.setItem(STORAGE, key);
	} catch {}
}
var useStudio = create()(persist((set, get) => ({
	apiKey: "",
	keyOk: null,
	domain: "compute",
	topic: "",
	aspectRatio: "9:16",
	durationSeconds: 15,
	voice: "austin",
	current: SAMPLE_EPISODE,
	library: [SAMPLE_EPISODE],
	status: "idle",
	error: null,
	audioUrl: null,
	setApiKey: (apiKey) => {
		writeSessionKey(apiKey);
		set({
			apiKey,
			keyOk: null
		});
	},
	setKeyOk: (keyOk) => set({ keyOk }),
	setDomain: (domain) => set({ domain }),
	setTopic: (topic) => set({ topic: topic.slice(0, LIMITS.topic) }),
	setAspectRatio: (aspectRatio) => set({ aspectRatio }),
	setDuration: (durationSeconds) => set({ durationSeconds }),
	setVoice: (voice) => set({ voice }),
	setStatus: (status) => set({ status }),
	setError: (error) => set({ error }),
	setAudioUrl: (audioUrl) => {
		const prev = get().audioUrl;
		if (prev) URL.revokeObjectURL(prev);
		set({ audioUrl });
	},
	hydrateSession: () => {
		const apiKey = readSessionKey();
		if (apiKey) set({ apiKey });
	},
	clearKey: () => {
		writeSessionKey("");
		set({
			apiKey: "",
			keyOk: null
		});
	},
	saveEpisode: (ep) => set((s) => ({
		current: ep,
		library: [compactEpisode(ep), ...s.library.filter((e) => e.id !== ep.id)].slice(0, LIMITS.library),
		status: "ready",
		error: null,
		audioUrl: null
	})),
	selectEpisode: (id) => set((s) => ({
		current: s.library.find((e) => e.id === id) ?? s.current,
		audioUrl: null
	})),
	removeEpisode: (id) => set((s) => {
		const library = s.library.filter((e) => e.id !== id);
		return {
			library,
			current: s.current?.id === id ? library[0] ?? SAMPLE_EPISODE : s.current
		};
	})
}), {
	name: "aperture-studio",
	skipHydration: true,
	partialize: (s) => ({
		domain: s.domain,
		topic: s.topic,
		aspectRatio: s.aspectRatio,
		durationSeconds: s.durationSeconds,
		voice: s.voice,
		current: s.current ? compactEpisode(s.current) : null,
		library: s.library.map(compactEpisode).slice(0, LIMITS.library)
	})
}));
var EpisodeView = (0, import_react.memo)(function EpisodeView({ episode }) {
	const apiKey = useStudio((s) => s.apiKey);
	const voice = useStudio((s) => s.voice);
	const audioUrl = useStudio((s) => s.audioUrl);
	const setAudioUrl = useStudio((s) => s.setAudioUrl);
	const [speaking, setSpeaking] = (0, import_react.useState)(false);
	async function speak() {
		if (!apiKey.trim()) {
			toast.error("Add a Groq Cloud API key to generate voice.");
			return;
		}
		if (speaking) return;
		setSpeaking(true);
		try {
			const { mime, base64 } = await speakScript({ data: {
				apiKey,
				text: episode.spokenScript,
				voice
			} });
			const bin = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
			const url = URL.createObjectURL(new Blob([bin], { type: mime }));
			setAudioUrl(url);
		} catch (e) {
			toast.error(redactSecrets(e instanceof Error ? e.message : "Voice failed"));
		} finally {
			setSpeaking(false);
		}
	}
	function downloadPack() {
		const blob = new Blob([episodeMarkdown(episode)], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = safeFilename(episode.id);
		a.click();
		URL.revokeObjectURL(url);
	}
	const sources = episode.sources.filter((src) => safeHttpsUrl(src.url));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-[var(--radius-xl)] border border-border bg-card p-5 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs uppercase tracking-widest text-muted-foreground",
					children: [
						episode.id,
						" · ",
						episode.domain,
						" · ",
						episode.durationSeconds,
						"s ·",
						" ",
						episode.aspectRatio
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-2xl text-balance text-foreground sm:text-3xl",
					children: episode.title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: episode.confidence,
					children: episode.confidence
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_240px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							label: "Claim",
							body: episode.claim
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							label: "Mechanism",
							body: episode.mechanism
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							label: "Caveat",
							body: episode.caveat
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground",
								children: [
									"Spoken script · ",
									episode.wordCount,
									" words"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-pretty text-base leading-relaxed text-foreground",
								children: episode.spokenScript
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
										text: episode.spokenScript,
										label: "Copy script"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "secondary",
										size: "sm",
										onClick: () => void speak(),
										disabled: speaking,
										children: [speaking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {}), speaking ? "Rendering" : "Voiceover"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "secondary",
										size: "sm",
										onClick: downloadPack,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Markdown"]
									})
								]
							}),
							audioUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
								className: "mt-3 w-full",
								controls: true,
								src: audioUrl,
								preload: "none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("track", { kind: "captions" })
							})
						] }),
						sources.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground",
							children: "Sources"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5",
							children: sources.map((src) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: src.url,
									target: "_blank",
									rel: "noopener noreferrer nofollow",
									className: "text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground",
									children: src.title
								})
							}, src.url))
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FramePreview, { episode })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-widest text-muted-foreground",
					children: "Shots"
				}), episode.shots.map((shot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[var(--radius-lg)] border border-border bg-background p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs uppercase tracking-widest text-muted-foreground",
								children: [
									shot.id,
									" · ",
									shot.role,
									" · ",
									shot.durationSeconds,
									"s"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
								text: shot.imaginePrompt,
								label: "Imagine prompt"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-pretty text-foreground",
							children: shot.firstFrame
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-pretty text-muted-foreground",
							children: ["Motion: ", shot.motion]
						})
					]
				}, shot.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-[var(--radius-lg)] border border-border bg-background p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-widest text-muted-foreground",
					children: "QA"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-pretty text-muted-foreground",
					children: episode.qaNotes
				})]
			})
		]
	});
});
function Block({ label, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-pretty text-sm leading-relaxed text-foreground sm:text-base",
		children: body
	})] });
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-11 w-full rounded-[var(--radius-sm)] border border-border bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:opacity-40", className),
		...props
	});
}
function KeyDialog() {
	const apiKey = useStudio((s) => s.apiKey);
	const keyOk = useStudio((s) => s.keyOk);
	const setApiKey = useStudio((s) => s.setApiKey);
	const setKeyOk = useStudio((s) => s.setKeyOk);
	const clearKey = useStudio((s) => s.clearKey);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)("");
	async function save() {
		setBusy(true);
		try {
			const key = assertGroqKey(draft);
			setApiKey(key);
			const res = await testGroqKey({ data: { apiKey: key } });
			setKeyOk(true);
			toast.success(`Groq connected · ${res.modelCount} models`);
			setOpen(false);
		} catch (e) {
			setKeyOk(false);
			toast.error(redactSecrets(e instanceof Error ? e.message : "Key rejected"));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: keyOk ? "secondary" : "default",
		size: "sm",
		type: "button",
		onClick: () => {
			setDraft("");
			setOpen(true);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, {}), keyOk ? "Groq connected" : apiKey ? "Key not verified" : "Add Groq key"]
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-black/60",
			"aria-label": "Close",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "groq-key-title",
			className: "relative z-10 w-[min(440px,calc(100vw-2rem))] rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "groq-key-title",
						className: "font-display text-lg text-foreground",
						children: "Groq Cloud key"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex size-9 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-muted hover:text-foreground",
						onClick: () => setOpen(false),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Close"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-sm text-pretty text-muted-foreground",
					children: "Paste a key from console.groq.com. It lives in session storage for this tab only — never localStorage, never the repo. Closing the tab drops it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground",
					children: "API key"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					autoComplete: "off",
					spellCheck: false,
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					placeholder: "gsk_…"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap justify-end gap-2",
					children: [
						apiKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							type: "button",
							onClick: () => {
								clearKey();
								setDraft("");
								toast.success("Key cleared");
							},
							children: "Clear"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							type: "button",
							onClick: () => setOpen(false),
							children: "Cancel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							onClick: () => void save(),
							disabled: busy || !draft.trim(),
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : null, "Save and test"]
						})
					]
				})
			]
		})]
	})] });
}
function Library() {
	const library = useStudio((s) => s.library);
	const current = useStudio((s) => s.current);
	const selectEpisode = useStudio((s) => s.selectEpisode);
	const removeEpisode = useStudio((s) => s.removeEpisode);
	if (library.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground",
		children: "Library"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "grid gap-2 sm:grid-cols-2",
		children: ["        ", library.map((ep) => {
			const on = current?.id === ep.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex items-start gap-2 rounded-[var(--radius-md)] border px-3 py-2.5", on ? "border-primary bg-card" : "border-border bg-card/60"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "min-w-0 flex-1 text-left",
					onClick: () => selectEpisode(ep.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm text-foreground",
						children: ep.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-[11px] uppercase tracking-wide text-muted-foreground",
						children: [
							ep.id,
							" · ",
							ep.domain
						]
					})]
				}), ep.id !== "TF-SAMPLE" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-muted hover:text-destructive",
					onClick: () => removeEpisode(ep.id),
					"aria-label": `Remove ${ep.title}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
				})]
			}) }, ep.id);
		})]
	})] });
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-[var(--radius-md)] border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:opacity-40", className),
		...props
	});
}
var FORMATS = [
	{
		label: "9:16 · 15s",
		aspect: "9:16",
		duration: 15
	},
	{
		label: "9:16 · 36s",
		aspect: "9:16",
		duration: 36
	},
	{
		label: "16:9 · 15s",
		aspect: "16:9",
		duration: 15
	}
];
function Producer() {
	const s = useStudio();
	const busy = s.status === "researching";
	async function generate() {
		if (!s.apiKey.trim()) {
			toast.error("Add a Groq Cloud API key first.");
			return;
		}
		if (busy) return;
		s.setStatus("researching");
		s.setError(null);
		try {
			const ep = await produceEpisode({ data: {
				apiKey: s.apiKey,
				topic: s.topic,
				domain: s.domain,
				aspectRatio: s.aspectRatio,
				durationSeconds: s.durationSeconds,
				voice: s.voice
			} });
			s.saveEpisode(ep);
			toast.success(ep.title);
		} catch (e) {
			const msg = redactSecrets(e instanceof Error ? e.message : "Produce failed");
			s.setStatus("error");
			s.setError(msg);
			toast.error(msg);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-[var(--radius-xl)] border border-border bg-card p-5 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-widest text-muted-foreground",
					children: "Desk"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl text-foreground",
					children: "Produce a pack"
				})] }), busy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }), "Researching"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground",
				children: "Topic"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: s.topic,
				maxLength: LIMITS.topic,
				onChange: (e) => s.setTopic(e.target.value),
				placeholder: "Leave blank to let Compound pick a fact, or name a subject — HBM, lithography, BGP, TLS 1.3…",
				rows: 3
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground",
				children: "Domain"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: ["any", ...DOMAINS].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => s.setDomain(d),
					className: cn("h-9 rounded-full border px-3 text-xs capitalize", s.domain === d ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-muted"),
					children: d
				}, d))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground",
				children: "Format"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: FORMATS.map((f) => {
					const on = s.aspectRatio === f.aspect && s.durationSeconds === f.duration;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							s.setAspectRatio(f.aspect);
							s.setDuration(f.duration);
						},
						className: cn("h-9 rounded-full border px-3 font-mono text-xs", on ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-muted"),
						children: f.label
					}, f.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground",
				children: "Voice"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: [
					"austin",
					"hannah",
					"troy"
				].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => s.setVoice(v),
					className: cn("h-9 rounded-full border px-3 text-xs capitalize", s.voice === v ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-muted"),
					children: v
				}, v))
			}),
			s.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-pretty text-destructive",
				children: s.error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-6 w-full",
				size: "lg",
				onClick: () => void generate(),
				disabled: busy,
				children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, {}), busy ? "Running Compound" : "Generate pack"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-pretty text-muted-foreground",
				children: "Compound searches the web. GPT-OSS writes the contract. Groq does not render picture — copy Imagine prompts after you approve the claim."
			})
		]
	});
}
function Home() {
	const current = useStudio((s) => s.current);
	(0, import_react.useEffect)(() => {
		useStudio.persist.rehydrate();
		useStudio.getState().hydrateSession();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 items-center justify-center rounded-[var(--radius-md)] border border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aperture, { className: "size-5 text-accent-steel" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl leading-none text-foreground",
						children: "Aperture"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs uppercase tracking-widest text-muted-foreground",
						children: "Tech-fact desk"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyDialog, {})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Producer, {}),
				current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EpisodeView, { episode: current }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, {})
			]
		})]
	});
}
//#endregion
export { Home as component };
