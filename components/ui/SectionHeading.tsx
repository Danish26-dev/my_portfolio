import type { ReactNode } from "react";
import { LineReveal, Reveal } from "./Reveal";

export function SectionHeading({
  index,
  eyebrow,
  lines,
  children,
  id,
}: {
  index: string;
  eyebrow: string;
  lines: ReactNode[];
  children?: ReactNode;
  id?: string;
}) {
  return (
    <header className="mb-14 sm:mb-20">
      <Reveal>
        <p className="eyebrow flex items-center gap-4">
          <span className="text-muted/75">{index}</span>
          <span className="h-px w-10 bg-primary/50" />
          {eyebrow}
        </p>
      </Reveal>
      <h2 id={id} className="h-section mt-6 max-w-5xl">
        <LineReveal lines={lines} />
      </h2>
      {children && (
        <Reveal delay={0.2} className="mt-8 max-w-2xl text-lg leading-relaxed text-muted/75">
          {children}
        </Reveal>
      )}
    </header>
  );
}
