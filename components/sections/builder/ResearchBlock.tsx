import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { researchNotes } from "@/lib/data/research";
import { BlockLabel } from "./BlockLabel";

export function ResearchBlock() {
  return (
    <div id="notes" className="scroll-mt-28">
      <BlockLabel
        n="B"
        title="Research & explorations"
        note="Short write-ups of architecture decisions and experiments from the builds above. Entries are published when they're real, and drafts are labelled as drafts."
      />
      <ul className="border-t hairline">
        {researchNotes.map((n, i) => (
          <Reveal as="li" key={n.slug} delay={i * 0.08} className="border-b hairline">
            <Link href={`/research/${n.slug}`} className="group grid gap-3 py-7 md:grid-cols-12 md:items-center md:gap-8">
              <div className="flex flex-wrap items-center gap-2 md:col-span-3">
                <span className="tag">{n.type}</span>
                <span className="tag border-dashed">{n.status}</span>
              </div>
              <div className="md:col-span-8">
                <h4 className="font-display text-2xl font-semibold uppercase leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
                  {n.title}
                </h4>
                <p className="mt-2 max-w-2xl text-muted">{n.summary}</p>
              </div>
              <ArrowUpRight className="hidden justify-self-end text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:block" size={24} />
            </Link>
          </Reveal>
        ))}
      </ul>
      <p className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
        Space reserved for: research publications · technical papers · open-source contributions
      </p>
    </div>
  );
}
