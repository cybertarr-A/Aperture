import { useMemo, useState } from "react";
import type { Episode } from "@/lib/episode";
import { cn } from "@/lib/utils";

export function FramePreview({ episode }: { episode: Episode }) {
  const vertical = episode.aspectRatio === "9:16";
  const [i, setI] = useState(0);
  const shot = episode.shots[i] ?? episode.shots[0];
  const caption = episode.captions[i] ?? episode.captions[0];
  const bands = useMemo(
    () =>
      [12, 28, 44, 61, 73].map((top, n) => ({
        top,
        delay: n * 40,
        opacity: 0.08 + (n % 3) * 0.04,
      })),
    [],
  );

  if (!shot) return null;

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-[#070708]",
          vertical ? "mx-auto aspect-[9/16] w-full max-w-[280px]" : "aspect-video w-full",
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,rgba(139,154,168,0.16),transparent_55%)]" />
        <div className="absolute inset-0 opacity-40 mix-blend-overlay [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_3px)]" />
        {bands.map((b) => (
          <div
            key={b.top}
            className="absolute left-[8%] right-[18%] h-px bg-foreground/25"
            style={{ top: `${b.top}%`, opacity: b.opacity }}
          />
        ))}
        <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {shot.id} · {shot.role}
        </div>
        <div className="absolute inset-x-4 bottom-8 text-center">
          <p className="font-display text-xl leading-tight text-balance text-foreground">
            {caption?.text ?? episode.onScreenText[0]}
          </p>
        </div>
      </div>
      {episode.shots.length > 1 && (
        <div className="flex justify-center gap-2">
          {episode.shots.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setI(idx)}
              className={cn(
                "h-9 min-w-9 rounded-full border px-3 text-xs uppercase tracking-wide",
                idx === i
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {s.id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
