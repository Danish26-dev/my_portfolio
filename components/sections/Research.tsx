import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { noteTypes, researchNotes } from "@/lib/data/research";

export function Research() {
  return (
    <section id="research" aria-labelledby="res-title" className="section">
      <div className="container-page">
        <SectionHeading index="06" eyebrow="Research & engineering notes" lines={["Curiosity,", "written down."]} id="res-title">
          A home for papers, experiments, architecture explorations and articles. Entries are added only
          when they are real, and drafts are labelled as drafts.
        </SectionHeading>

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 className="eyebrow">Notes</h3>
            <ul className="mt-6 border-t hairline">
              {researchNotes.map((n, i) => (
                <Reveal as="li" key={n.slug} delay={i * 0.08} className="border-b hairline">
                  <Link href={`/research/${n.slug}`} className="group block py-7">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="tag">{n.type}</span>
                      <span className="tag border-dashed">{n.status}</span>
                    </div>
                    <h4 className="mt-4 flex items-start justify-between gap-6 font-display text-2xl font-semibold uppercase leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
                      {n.title}
                      <ArrowUpRight className="mt-1 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" size={22} />
                    </h4>
                    <p className="mt-3 max-w-xl text-muted/75">{n.summary}</p>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.1} className="lg:col-span-5">
            <h3 className="eyebrow">What this section will hold</h3>
            <ul className="mt-6 divide-y divide-ink/10 border hairline">
              {noteTypes.map((t) => (
                <li key={t.type} className="flex items-baseline justify-between gap-4 px-4 py-3.5">
                  <span className="text-ink/90">{t.type}</span>
                  <span className="hidden text-right text-xs text-muted/75 sm:block">{t.blurb}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
