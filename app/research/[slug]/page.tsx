import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { getProject } from "@/lib/data/projects";
import { getNote, researchNotes } from "@/lib/data/research";

export function generateStaticParams() {
  return researchNotes.map((n) => ({ slug: n.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const n = getNote(params.slug);
  return n ? { title: n.title, description: n.summary } : {};
}

/** Reusable article template for every entry in lib/data/research.ts. */
export default function NotePage({ params }: { params: { slug: string } }) {
  const note = getNote(params.slug);
  if (!note) notFound();
  const project = note.relatedProject ? getProject(note.relatedProject) : undefined;

  return (
    <article className="pb-24 pt-36 sm:pt-44">
      <div className="container-page">
        <Link href="/#research" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-primary">
          <ArrowLeft size={14} /> Research & notes
        </Link>

        <header className="mt-10 max-w-4xl">
          <div className="flex flex-wrap gap-3">
            <span className="tag">{note.type}</span>
            <span className="tag border-dashed">{note.status}</span>
          </div>
          <h1 className="display mt-6 text-[clamp(2.2rem,6vw,4.8rem)]">
            <LineReveal lines={[note.title]} />
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink/80">{note.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {note.tags.map((t) => (
              <li key={t} className="tag">{t}</li>
            ))}
          </ul>
        </header>

        <div className="mt-16 max-w-3xl space-y-12">
          {note.sections.map((s) => (
            <Reveal key={s.heading}>
              <section>
                <h2 className="font-display text-2xl font-semibold uppercase tracking-tight">{s.heading}</h2>
                <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink/85">
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}

          {note.externalUrl && (
            <a href={note.externalUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Read the full piece <ArrowUpRight size={15} />
            </a>
          )}

          {project?.caseStudy && (
            <Link href={`/projects/${project.slug}`} className="group flex items-center justify-between border hairline p-6 transition-colors hover:border-primary/50">
              <span>
                <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">Related project</span>
                <span className="mt-1 block font-display text-2xl font-semibold uppercase group-hover:text-primary">{project.name}</span>
              </span>
              <ArrowUpRight className="text-primary" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
