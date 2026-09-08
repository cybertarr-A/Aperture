import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Aperture } from "lucide-react";
import { EpisodeView } from "@/components/episode-view";
import { KeyDialog } from "@/components/key-dialog";
import { Library } from "@/components/library";
import { Producer } from "@/components/producer";
import { useStudio } from "@/store/studio";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const current = useStudio((s) => s.current);

  useEffect(() => {
    void useStudio.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-[var(--radius-md)] border border-border">
              <Aperture className="size-5 text-accent-steel" />
            </span>
            <div>
              <p className="font-display text-xl leading-none text-foreground">Aperture</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                Tech-fact desk
              </p>
            </div>
          </div>
          <KeyDialog />
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
        <Producer />
        {current ? <EpisodeView episode={current} /> : null}
        <Library />
      </main>
    </div>
  );
}
