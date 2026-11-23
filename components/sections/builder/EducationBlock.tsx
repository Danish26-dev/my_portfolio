import { Reveal } from "@/components/ui/Reveal";
import { education } from "@/lib/data/profile";
import { BlockLabel } from "./BlockLabel";

export function EducationBlock() {
  return (
    <div id="education" className="scroll-mt-28">
      <BlockLabel n="A" title="Education" />
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div className="relative border-l-2 border-primary/50 pl-8 sm:pl-12">
            <span className="absolute -left-[7px] top-1 h-3 w-3 rotate-45 bg-primary" />
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-primary">
              {education.start} <span className="mx-2 text-muted">→</span> {education.end}
            </p>
            <h4 className="mt-4 font-display text-3xl font-semibold uppercase leading-[1.02] tracking-tight sm:text-5xl">
              {education.institution}
            </h4>
            <p className="mt-4 max-w-lg text-lg text-ink/85">{education.degree}</p>

            <div className="mt-10 flex items-end gap-4">
              <span className="font-display text-7xl font-semibold leading-none text-primary sm:text-8xl">8.3</span>
              <span className="pb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">/ 10 CGPA</span>
            </div>
            <span className="sr-only">CGPA {education.cgpa}</span>
            <span className="absolute -left-[7px] bottom-0 h-3 w-3 rotate-45 border border-dashed border-muted bg-paper" />
          </div>
        </Reveal>

        <Reveal delay={0.12} className="lg:col-span-5">
          <h4 className="eyebrow">Relevant coursework</h4>
          <ul className="mt-6 grid gap-px border hairline bg-ink/10 sm:grid-cols-2">
            {education.coursework.map((c, i) => (
              <li key={c} className="flex gap-3 bg-paper px-4 py-3.5 text-sm text-ink/90">
                <span className="font-mono text-[10.5px] text-primary">{String(i + 1).padStart(2, "0")}</span>
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
