import { useState } from "react";
import { Download, LoaderCircle, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { CopyButton } from "@/components/copy-button";
import { FramePreview } from "@/components/frame-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { episodeMarkdown, type Episode } from "@/lib/episode";
import { speakScript } from "@/lib/produce";
import { useStudio } from "@/store/studio";

export function EpisodeView({ episode }: { episode: Episode }) {
  const apiKey = useStudio((s) => s.apiKey);
  const voice = useStudio((s) => s.voice);
  const audioUrl = useStudio((s) => s.audioUrl);
  const setAudioUrl = useStudio((s) => s.setAudioUrl);
  const [speaking, setSpeaking] = useState(false);

  async function speak() {
    if (!apiKey.trim()) {
      toast.error("Add a Groq Cloud API key to generate voice.");
      return;
    }
    setSpeaking(true);
    try {
      const { mime, base64 } = await speakScript({
        data: { apiKey, text: episode.spokenScript, voice },
      });
      const bin = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bin], { type: mime }));
      setAudioUrl(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Voice failed");
    } finally {
      setSpeaking(false);
    }
  }

  function downloadPack() {
    const blob = new Blob([episodeMarkdown(episode)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${episode.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <article className="rounded-[var(--radius-xl)] border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {episode.id} · {episode.domain} · {episode.durationSeconds}s ·{" "}
            {episode.aspectRatio}
          </p>
          <h2 className="mt-1 font-display text-2xl text-balance text-foreground sm:text-3xl">
            {episode.title}
          </h2>
        </div>
        <Badge tone={episode.confidence}>{episode.confidence}</Badge>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0 space-y-6">
          <Block label="Claim" body={episode.claim} />
          <Block label="Mechanism" body={episode.mechanism} />
          <Block label="Caveat" body={episode.caveat} />

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Spoken script · {episode.wordCount} words
            </p>
            <p className="text-pretty text-base leading-relaxed text-foreground">
              {episode.spokenScript}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton text={episode.spokenScript} label="Copy script" />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => void speak()}
                disabled={speaking}
              >
                {speaking ? <LoaderCircle className="animate-spin" /> : <Volume2 />}
                {speaking ? "Rendering" : "Voiceover"}
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={downloadPack}>
                <Download />
                Markdown
              </Button>
            </div>
            {audioUrl && (
              <audio className="mt-3 w-full" controls src={audioUrl}>
                <track kind="captions" />
              </audio>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Sources
            </p>
            <ul className="space-y-1.5">
              {episode.sources.map((src) => (
                <li key={src.url} className="text-sm">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    {src.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FramePreview episode={episode} />
      </div>

      <div className="mt-8 space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Shots
        </p>
        {episode.shots.map((shot) => (
          <div
            key={shot.id}
            className="rounded-[var(--radius-lg)] border border-border bg-background p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {shot.id} · {shot.role} · {shot.durationSeconds}s
              </p>
              <CopyButton text={shot.imaginePrompt} label="Imagine prompt" />
            </div>
            <p className="mt-2 text-sm text-pretty text-foreground">{shot.firstFrame}</p>
            <p className="mt-1 text-sm text-pretty text-muted-foreground">
              Motion: {shot.motion}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-background p-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          QA
        </p>
        <p className="mt-2 text-sm text-pretty text-muted-foreground">{episode.qaNotes}</p>
      </div>
    </article>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-pretty text-sm leading-relaxed text-foreground sm:text-base">
        {body}
      </p>
    </div>
  );
}
