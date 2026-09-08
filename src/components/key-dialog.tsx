import { useState } from "react";
import { KeyRound, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { testGroqKey } from "@/lib/produce";
import { useStudio } from "@/store/studio";

export function KeyDialog() {
  const apiKey = useStudio((s) => s.apiKey);
  const keyOk = useStudio((s) => s.keyOk);
  const setApiKey = useStudio((s) => s.setApiKey);
  const setKeyOk = useStudio((s) => s.setKeyOk);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState(apiKey);

  async function save() {
    setBusy(true);
    try {
      setApiKey(draft.trim());
      const res = await testGroqKey({ data: { apiKey: draft.trim() } });
      setKeyOk(true);
      toast.success(`Groq connected · ${res.modelCount} models`);
      setOpen(false);
    } catch (e) {
      setKeyOk(false);
      toast.error(e instanceof Error ? e.message : "Key rejected");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        variant={keyOk ? "secondary" : "default"}
        size="sm"
        type="button"
        onClick={() => {
          setDraft(useStudio.getState().apiKey);
          setOpen(true);
        }}
      >
        <KeyRound />
        {keyOk ? "Groq connected" : apiKey ? "Key not verified" : "Add Groq key"}
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="groq-key-title"
            className="relative z-10 w-[min(440px,calc(100vw-2rem))] rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 id="groq-key-title" className="font-display text-lg text-foreground">
                Groq Cloud key
              </h2>
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <p className="mb-4 text-sm text-pretty text-muted-foreground">
              Create a key in the Groq console. It stays in this browser and is sent
              only to Groq when you generate a pack or a voiceover.
            </p>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              API key
            </label>
            <Input
              type="password"
              autoComplete="off"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="gsk_…"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => void save()}
                disabled={busy || !draft.trim()}
              >
                {busy ? <LoaderCircle className="animate-spin" /> : null}
                Save and test
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
