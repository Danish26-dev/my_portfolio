import Link from "next/link";
import { ArrowUpRight, Award } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import type { Project } from "@/lib/data/projects";
import { cn } from "@/lib/utils";

/** Shared story block for a featured project. `onBlue` flips it for the cobalt band. */
export function ProjectText({ project, onBlue = false, className }: { project: Project; onBlue?: boolean; className?: string }) {
  const { github, demo } = project.links;
  const href = `/projects/${project.slug}`;
  return (
    <div className={className}>
      <p className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] font-medium uppercase tracking-[0.2em]", onBlue ? "text-white/80" : "text-primary")}>
        <span className={onBlue ? "text-accent" : "text-muted"}>{project.index}</span>
        <span className={cn("h-px w-8", onBlue ? "bg-white/40" : "bg-primary/40")} />
        {project.category}
      </p>

      <h3 className={cn("mt-5 font-display text-[clamp(2.6rem,5.2vw,4.6rem)] font-semibold uppercase leading-[0.94] tracking-tightest", onBlue ? "text-white" : "text-ink")}>
        <Link href={href} className="transition-colors hover:text-accent">
          {project.name}
        </Link>
      </h3>
      {project.fullName && (
        <p className={cn("mt-2 font-mono text-[11px] uppercase tracking-[0.18em]", onBlue ? "text-white/70" : "text-muted")}>{project.fullName}</p>
      )}

      <p className={cn("mt-5 max-w-lg text-[1.05rem] leading-relaxed", onBlue ? "text-white/90" : "text-ink/85")}>{project.description}</p>

      {project.badge && (
        <p
          className={cn(
            "mt-6 inline-flex max-w-full items-start gap-2.5 border px-3 py-2 font-mono text-[11px] font-medium uppercase leading-snug tracking-[0.1em]",
            onBlue ? "border-accent bg-accent text-ink" : "border-accent bg-accent/20 text-ink"
          )}
        >
          <Award size={14} className={cn("mt-px shrink-0", onBlue ? "text-ink" : "text-accent-ink")} />
          <span>{project.badge}</span>
        </p>
      )}

      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology stack">
        {project.stack.map((s) => (
          <li
            key={s}
            className={cn(
              "border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em]",
              onBlue ? "border-white/35 text-white/90" : "border-ink/15 text-muted"
            )}
          >
            {s}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link href={href} className={onBlue ? "btn bg-paper text-primary hover:bg-accent hover:text-ink [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]" : "btn-primary"}>
          View case study <ArrowUpRight size={15} />
        </Link>
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className={onBlue ? "btn border border-white/50 text-white hover:bg-white/10" : "btn-ghost"}
          >
            <GithubIcon size={15} /> GitHub
          </a>
        )}
        {demo && (
          <a href={demo} target="_blank" rel="noopener noreferrer" className={onBlue ? "btn border border-white/50 text-white hover:bg-white/10" : "btn-ghost"}>
            Live demo <ArrowUpRight size={15} />
          </a>
        )}
      </div>
    </div>
  );
}
