import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"span"> & { tone?: "default" | "high" | "medium" | "low" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        tone === "default" && "border-border text-muted-foreground",
        tone === "high" && "border-success/40 text-success",
        tone === "medium" && "border-warn/40 text-warn",
        tone === "low" && "border-destructive/40 text-destructive",
        className,
      )}
      {...props}
    />
  );
}
