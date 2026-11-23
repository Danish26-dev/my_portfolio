import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { education } from "@/lib/data/profile";

export function Education() {
  return (
    <section id="education" aria-labelledby="edu-title" className="section">
      <div className="container-page">
        <SectionHeading index="05" eyebrow="Education" lines={["The academic", "foundation."]} id="edu-title" />

        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="relative border-l border-primary/40 pl-8 sm:pl-12">
              <span className="absolute -left-[7px] top-1 h-3.5 w-3.5 rotate-45 border border-primary bg-paper" />
              <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-primary">
                {education.start} <span className="mx-2 text-muted/75">→</span> {education.end}
              </p>
              <h3 className="mt-4 font-display text-3xl font-semibold uppercase leading-[1.02] tracking-tight sm:text-5xl">
                {education.institution}
              </h3>
              <p className="mt-4 max-w-lg text-lg text-ink/80">{education.degree}</p>

              <div className="mt-10 flex items-end gap-4">
                <span className="font-display text-7xl font-semibold leading-none text-primary sm:text-8xl">8.3</span>
                <span className="pb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted/75">
                  / 10 CGPA
                </span>
              </div>
              <span className="sr-only">CGPA {education.cgpa}</span>

              <span className="absolute -left-[7px] bottom-0 h-3.5 w-3.5 rotate-45 border border-dashed border-muted bg-paper" />
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-5">
            <h3 className="eyebrow">Relevant coursework</h3>
            <ul className="mt-6 grid gap-px border hairline bg-ink/5 sm:grid-cols-2">
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
    </section>
  );
}
