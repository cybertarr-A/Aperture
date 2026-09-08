import { useState } from "react";
import { KeyRound, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { testGroqKey } from "@/lib/produce";
import { assertGroqKey, redactSecrets } from "@/lib/sanitize";
import { useStudio } from "@/store/studio";

export function KeyDialog() {
  const apiKey = useStudio((s) => s.apiKey);
  const keyOk = useStudio((s) => s.keyOk);
  const setApiKey = useStudio((s) => s.setApiKey);
  const setKeyOk = useStudio((s) => s.setKeyOk);
  const clearKey = useStudio((s) => s.clearKey);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");

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

  return (
    <>
      <Button
        variant={keyOk ? "secondary" : "default"}
        size="sm"
        type="button"
        onClick={() => {
          setDraft("");
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
              Paste a key from console.groq.com. It lives in session storage for
              this tab only — never localStorage, never the repo. Closing the tab
              drops it.
            </p>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              API key
            </label>
            <Input
              type="password"
              autoComplete="off"
              spellCheck={false}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="gsk_…"
            />
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              {apiKey ? (
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    clearKey();
                    setDraft("");
                    toast.success("Key cleared");
                  }}
                >
                  Clear
                </Button>
              ) : null}
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
