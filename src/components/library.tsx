import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudio } from "@/store/studio";

export function Library() {
  const library = useStudio((s) => s.library);
  const current = useStudio((s) => s.current);
  const selectEpisode = useStudio((s) => s.selectEpisode);
  const removeEpisode = useStudio((s) => s.removeEpisode);

  if (library.length === 0) return null;

  return (
    <section>
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Library
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">        {library.map((ep) => {
          const on = current?.id === ep.id;
          return (
            <li key={ep.id}>
              <div
                className={cn(
                  "flex items-start gap-2 rounded-[var(--radius-md)] border px-3 py-2.5",
                  on ? "border-primary bg-card" : "border-border bg-card/60",
                )}
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => selectEpisode(ep.id)}
                >
                  <p className="truncate text-sm text-foreground">{ep.title}</p>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    {ep.id} · {ep.domain}
                  </p>
                </button>
                {ep.id !== "TF-SAMPLE" && (
                  <button
                    type="button"
                    className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-muted hover:text-destructive"
                    onClick={() => removeEpisode(ep.id)}
                    aria-label={`Remove ${ep.title}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
