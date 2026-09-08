# Aperture

**Tech-fact video desk.** Research, write, voice, then shoot.

Live: [https://aperture-beta-green.vercel.app/](https://aperture-beta-green.vercel.app/)

Aperture is a production contract generator for short technological-fact films. It does not hallucinate a finished clip. Groq Compound verifies a claim on the live web. GPT-OSS writes a timed episode pack. Orpheus speaks the script. You approve the fact, then paste Imagine prompts into Grok Imagine.

```text
  TOPIC ──► COMPOUND (search) ──► GPT-OSS (schema)
                │                       │
                ▼                       ▼
           sources                  episode pack
                                        │
                         ┌──────────────┼──────────────┐
                         ▼              ▼              ▼
                      script         shots         captions
                         │              │
                         ▼              ▼
                    Orpheus TTS    Grok Imagine
```

---

## Use it in four minutes

1. Open **[the live desk](https://aperture-beta-green.vercel.app/)**.
2. Click **Add Groq key**. Create a key at [console.groq.com](https://console.groq.com/keys). Paste `gsk_…`. **Save and test**.
3. Pick a domain (compute, chips, networks, security, robotics, space, materials, cognition) or **any**.
4. Leave the topic blank to let Compound choose, or name a subject (`HBM`, `TLS 1.3`, `EUV`).
5. Choose format: `9:16 · 15s`, `9:16 · 36s`, or `16:9 · 15s`. Choose voice: Austin, Hannah, Troy.
6. **Generate pack.** Read claim → mechanism → caveat. If the caveat kills the hook, discard it.
7. **Copy script** / **Voiceover** / **Markdown**. For each shot, **Imagine prompt** → paste into [Grok Imagine](https://grok.com/imagine). Burn captions in the editor. Do not ask Imagine to draw numbers or UI text.

A sample pack (*The GPU is waiting on bytes*) loads with no key so you can inspect the contract first.

---

## What you get

| Field | Purpose |
| --- | --- |
| Claim | One falsifiable sentence |
| Mechanism | How it actually works |
| Caveat | When the claim is false |
| Sources | https-only, at least two independent |
| Spoken script | Word-budgeted for 15s or 36s |
| Captions | ≤ 6 words, burned later — not generated in-frame |
| Shots | First frame, motion, audio, Imagine prompt |
| QA | Visual failure modes for this topic |

If Compound cannot source the fact, generation **rejects** instead of padding.

---

## Security

The key is **your** Groq spend. Treat the desk as a thin proxy.

| Control | Behavior |
| --- | --- |
| Storage | Session storage, this tab only. Closing the tab drops the key. Never localStorage, never `.env`, never git. |
| Transport | Browser → Aperture server function → `api.groq.com`. The key is not logged. Error strings strip `gsk_…`. |
| Shape | Keys must match `gsk_` + 20–200 safe characters before any network call. |
| Rate limits | Per hashed key + IP: 8 packs / 10 min, 16 voiceovers / 10 min, 30 key tests / 10 min. |
| Output | Episode fields clamped. Source URLs must be `https`, no credentials, no localhost. `javascript:` / `data:` dropped. |
| Links | `rel="noopener noreferrer nofollow"`. Page referrer is `no-referrer`. |
| Auth header | Set last so callers cannot override `Authorization`. |
| Audio | Voice payload capped at 6 MB. Script capped at 600 characters. |
| Clear | **Clear** in the key dialog wipes session storage immediately. |

Do not paste a production key on a shared machine. Rotate the key in the Groq console if the tab was left open.

Aperture does **not** store packs on a server. The library is local to your browser (compacted, max 20). That is a privacy feature and a backup limitation — export Markdown if a pack matters.

---

## Performance and scale

- Two Groq calls per pack, not a chat loop. Research is truncated before the packager to bound tokens.
- Packager uses strict JSON schema (`openai/gpt-oss-120b`) so the UI does not regex-parse prose.
- `max_tokens` is set on every completion. Timeouts: 90s research, 60s pack / speech, 15s key test.
- Library persist drops long research notes. Episode views are memoized. Audio uses object URLs, revoked on replace.
- In-memory rate limiter is per serverless isolate. It stops bursts; it is not a global quota. Groq’s own TPM/RPM remain the hard ceiling.
- No database. Horizontal scale is “more Vercel instances,” not a migration.

Cost is Groq’s. Compound + GPT-OSS 120B + Orpheus per pack is typically a fraction of a cent at current Groq list prices. Voice is the heavier audio call.

---

## Stack

- TanStack Start, React 19, Zustand
- Groq Cloud: `groq/compound`, `openai/gpt-oss-120b`, `canopylabs/orpheus-v1-english`
- Deployed on Vercel: [aperture-beta-green.vercel.app](https://aperture-beta-green.vercel.app/)

---

## Limits (by design)

Groq does not generate video. Imagine clips are 1–15 seconds. A 36s episode is three shots, edited together. Numbers and labels belong in captions you burn later — not in the image model.

Do not ship a pack whose sources you have not opened. Compound can still be wrong. The caveat field is the load-bearing part of the contract.

---

## License

Use for your own series. Keep Groq’s terms for the key you bring.
