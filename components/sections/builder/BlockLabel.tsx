import { Reveal } from "@/components/ui/Reveal";

/** Sub-heading used inside a chapter: letter, title, hairline. */
export function BlockLabel({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <Reveal className="mb-9">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs font-medium text-primary">{n}</span>
        <h3 className="font-display text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">{title}</h3>
        <span className="h-px flex-1 bg-ink/15" />
      </div>
      {note && <p className="mt-3 max-w-2xl text-muted">{note}</p>}
    </Reveal>
  );
}
