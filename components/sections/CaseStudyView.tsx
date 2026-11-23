import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Award } from "lucide-react";
import { ArchitectureDiagram } from "@/components/ui/ArchitectureDiagram";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { getAdjacentFeatured, type Project } from "@/lib/data/projects";

function Block({
  n,
  title,
  children,
  id,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="grid gap-8 border-t hairline py-14 sm:py-20 lg:grid-cols-12">
      <Reveal className="lg:col-span-4">
        <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-primary">{n}</p>
        <h2 id={`${id}-h`} className="mt-3 font-display text-3xl font-semibold uppercase leading-none tracking-tight sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.08} className="lg:col-span-8">
        {children}
      </Reveal>
    </section>
  );
}

function Pending({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-muted/50 p-5">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted/75">To complete</p>
      <p className="mt-2 text-muted/75">{text}</p>
    </div>
  );
}

const Paragraphs = ({ items }: { items: string[] }) => (
  <div className="space-y-5 text-lg leading-relaxed text-muted">
    {items.map((t) => (
      <p key={t}>{t}</p>
    ))}
  </div>
);

export function CaseStudyView({ project }: { project: Project }) {
  const cs = project.caseStudy!;
  const { prev, next } = getAdjacentFeatured(project.slug);
  const { github, demo } = project.links;

  return (
    <article>
      {/* hero */}
      <header className="relative overflow-hidden border-b hairline pb-16 pt-36 sm:pt-44">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
        <div
          className="pointer-events-none absolute -right-40 top-0 h-[600px] w-[600px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(21,70,217,0.28), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(249,179,24,0.3), transparent 70%)" }}
        />
        <div className="container-page relative">
          <Link href="/#projects" className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted/75 transition-colors hover:text-primary">
            <ArrowLeft size={14} /> All projects
          </Link>
          <div className="mt-10 grid items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow">Case study {project.index}</p>
              <h1 className="display mt-5 text-[clamp(3rem,10vw,8rem)]">
                <LineReveal lines={[project.name]} />
              </h1>
              {project.fullName && (
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted/75">{project.fullName}</p>
              )}
              <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted">{project.description}</p>
              <p className="mt-5 text-sm text-muted/75">{project.category}</p>

              {project.badge && (
                <p className="mt-6 inline-flex items-start gap-2.5 border border-accent bg-accent/20 px-3 py-2 font-mono text-[11px] font-medium uppercase leading-snug tracking-[0.1em] text-ink">
                  <Award size={14} className="mt-px shrink-0 text-accent-ink" />
                  <span>{project.badge}</span>
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {github ? (
                  <a href={github} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    <GithubIcon size={15} /> GitHub
                  </a>
                ) : (
                  <span className="btn border border-dashed border-muted/50 text-muted/75" aria-disabled="true">
                    Repository link not added yet
                  </span>
                )}
                {demo ? (
                  <a href={demo} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                    Live demo <ArrowUpRight size={15} />
                  </a>
                ) : (
                  <span className="btn border border-dashed border-muted/50 text-muted/75" aria-disabled="true">
                    Demo link not added yet
                  </span>
                )}
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="glass aspect-[4/3] overflow-hidden">
                <ProjectVisual kind={project.visual} label={project.name} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-px border hairline bg-ink/10 text-sm">
                <div className="bg-paper p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted/75">Status</dt>
                  <dd className="mt-1">{project.status}</dd>
                </div>
                <div className="bg-paper p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted/75">Domain</dt>
                  <dd className="mt-1">{project.filters.join(" · ")}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </header>

      <div className="container-page">
        <Block n="01" title="Project overview" id="overview">
          <Paragraphs items={cs.overview} />
        </Block>
        <Block n="02" title="Problem statement" id="problem">
          <Paragraphs items={cs.problem} />
        </Block>
        <Block n="03" title="Solution" id="solution">
          <Paragraphs items={cs.solution} />
        </Block>
        <Block n="04" title="System architecture" id="architecture">
          <ArchitectureDiagram nodes={cs.architecture.nodes} edges={cs.architecture.edges} note={cs.architecture.note} />
        </Block>
        <Block n="05" title="Technology stack" id="stack">
          <div className="grid gap-6 sm:grid-cols-2">
            {cs.stackGroups.map((g) => (
              <div key={g.label} className="border-t hairline pt-4">
                <p className="eyebrow">{g.label}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((i) => (
                    <li key={i} className="border border-primary/30 bg-primary/[0.05] px-3 py-1.5 text-sm text-ink">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>
        <Block n="06" title="Engineering contributions" id="contributions">
          {cs.contributions.items.length > 0 && (
            <ul className="space-y-3 text-lg text-muted">
              {cs.contributions.items.map((c) => (
                <li key={c} className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                  {c}
                </li>
              ))}
            </ul>
          )}
          {cs.contributions.pending && <Pending text={cs.contributions.pending} />}
        </Block>
        <Block n="07" title="Important technical decisions" id="decisions">
          <ol className="space-y-8">
            {cs.decisions.map((d, i) => (
              <li key={d.title} className="grid gap-2 sm:grid-cols-[3rem_1fr]">
                <span className="font-mono text-sm font-medium text-primary">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold uppercase tracking-tight">{d.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{d.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Block>
        <Block n="08" title="Challenges and solutions" id="challenges">
          {cs.challenges.items.length > 0 && (
            <ul className="space-y-6">
              {cs.challenges.items.map((c) => (
                <li key={c.challenge} className="border-l-2 border-primary/50 pl-5">
                  <p className="font-display text-lg font-semibold">{c.challenge}</p>
                  <p className="mt-1 text-muted">{c.solution}</p>
                </li>
              ))}
            </ul>
          )}
          {cs.challenges.pending && <Pending text={cs.challenges.pending} />}
        </Block>
        <Block n="09" title="Outcomes and recognition" id="outcomes">
          <ul className="space-y-4">
            {cs.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-3 border border-accent bg-accent/15 p-4 text-lg text-ink">
                <Award size={18} className="mt-1 shrink-0 text-accent-ink" />
                {o}
              </li>
            ))}
          </ul>
        </Block>
        <Block n="10" title="GitHub & demo" id="links">
          {github || demo ? (
            <div className="flex flex-wrap gap-3">
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <GithubIcon size={15} /> Source code
                </a>
              )}
              {demo && (
                <a href={demo} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  Live demo <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          ) : (
            <Pending text="No repository or deployment URLs have been added yet. Set links.github and links.demo for this project in lib/data/projects.ts." />
          )}
        </Block>
      </div>

      {/* prev / next */}
      <nav aria-label="More case studies" className="grid border-t hairline sm:grid-cols-2">
        <Link href={`/projects/${prev.slug}`} className="group border-b hairline p-8 transition-colors hover:bg-primary/[0.05] sm:border-b-0 sm:border-r sm:p-12">
          <p className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted/75">
            <ArrowLeft size={14} /> Previous
          </p>
          <p className="mt-3 font-display text-3xl font-semibold uppercase tracking-tight transition-colors group-hover:text-primary sm:text-4xl">
            {prev.name}
          </p>
        </Link>
        <Link href={`/projects/${next.slug}`} className="group p-8 text-left transition-colors hover:bg-primary/[0.05] sm:p-12 sm:text-right">
          <p className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted/75 sm:justify-end">
            Next <ArrowRight size={14} />
          </p>
          <p className="mt-3 font-display text-3xl font-semibold uppercase tracking-tight transition-colors group-hover:text-primary sm:text-4xl">
            {next.name}
          </p>
        </Link>
      </nav>
    </article>
  );
}
