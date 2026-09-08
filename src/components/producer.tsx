import { LoaderCircle, Radio } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DOMAINS, type Domain } from "@/lib/episode";
import { produceEpisode } from "@/lib/produce";
import { LIMITS, redactSecrets } from "@/lib/sanitize";
import { cn } from "@/lib/utils";
import { useStudio } from "@/store/studio";

const FORMATS: Array<{ label: string; aspect: "9:16" | "16:9"; duration: 15 | 36 }> = [
  { label: "9:16 · 15s", aspect: "9:16", duration: 15 },
  { label: "9:16 · 36s", aspect: "9:16", duration: 36 },
  { label: "16:9 · 15s", aspect: "16:9", duration: 15 },
];

export function Producer() {
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
      const ep = await produceEpisode({
        data: {
          apiKey: s.apiKey,
          topic: s.topic,
          domain: s.domain,
          aspectRatio: s.aspectRatio,
          durationSeconds: s.durationSeconds,
          voice: s.voice,
        },
      });
      s.saveEpisode(ep);
      toast.success(ep.title);
    } catch (e) {
      const msg = redactSecrets(e instanceof Error ? e.message : "Produce failed");
      s.setStatus("error");
      s.setError(msg);
      toast.error(msg);
    }
  }

  return (
    <section className="rounded-[var(--radius-xl)] border border-border bg-card p-5 sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Desk
          </p>
          <h2 className="font-display text-2xl text-foreground">Produce a pack</h2>
        </div>
        {busy && (
          <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <LoaderCircle className="size-3.5 animate-spin" />
            Researching
          </span>
        )}
      </div>

      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Topic
      </label>
      <Textarea
        value={s.topic}
        maxLength={LIMITS.topic}
        onChange={(e) => s.setTopic(e.target.value)}
        placeholder="Leave blank to let Compound pick a fact, or name a subject — HBM, lithography, BGP, TLS 1.3…"
        rows={3}
      />

      <p className="mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Domain
      </p>
      <div className="flex flex-wrap gap-1.5">
        {(["any", ...DOMAINS] as Domain[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => s.setDomain(d)}
            className={cn(
              "h-9 rounded-full border px-3 text-xs capitalize",
              s.domain === d
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {d}
          </button>
        ))}
      </div>

      <p className="mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Format
      </p>
      <div className="flex flex-wrap gap-1.5">
        {FORMATS.map((f) => {
          const on = s.aspectRatio === f.aspect && s.durationSeconds === f.duration;
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => {
                s.setAspectRatio(f.aspect);
                s.setDuration(f.duration);
              }}
              className={cn(
                "h-9 rounded-full border px-3 font-mono text-xs",
                on
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <p className="mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Voice
      </p>
      <div className="flex flex-wrap gap-1.5">
        {(["austin", "hannah", "troy"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => s.setVoice(v)}
            className={cn(
              "h-9 rounded-full border px-3 text-xs capitalize",
              s.voice === v
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {s.error && (
        <p className="mt-4 text-sm text-pretty text-destructive">{s.error}</p>
      )}

      <Button
        className="mt-6 w-full"
        size="lg"
        onClick={() => void generate()}
        disabled={busy}
      >
        {busy ? <LoaderCircle className="animate-spin" /> : <Radio />}
        {busy ? "Running Compound" : "Generate pack"}
      </Button>
      <p className="mt-3 text-xs text-pretty text-muted-foreground">
        Compound searches the web. GPT-OSS writes the contract. Groq does not
        render picture — copy Imagine prompts after you approve the claim.
      </p>
    </section>
  );
}
