"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Award } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import type { Project } from "@/lib/data/projects";
import { cn, easeOutExpo } from "@/lib/utils";

export function FeaturedProject({ project, flip }: { project: Project; flip: boolean }) {
  const reduce = useReducedMotion();
  const { github, demo } = project.links;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: reduce ? 0 : 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: easeOutExpo }}
      className="group relative grid items-stretch gap-0 border hairline bg-paper2/40 lg:grid-cols-12"
    >
      {/* visual */}
      <Link
        href={`/projects/${project.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className={cn(
          "relative block aspect-[4/3] overflow-hidden border-b hairline lg:col-span-5 lg:aspect-auto lg:min-h-[360px] lg:border-b-0",
          flip ? "lg:order-2 lg:border-l" : "lg:border-r"
        )}
      >
        <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]">
          <ProjectVisual kind={project.visual} label={project.name} />
        </div>
        <div className="bg-grid absolute inset-0 opacity-40" />
        <span className="absolute left-5 top-4 font-display text-6xl font-semibold text-outline opacity-70">
          {project.index}
        </span>
      </Link>

      {/* content */}
      <div className={cn("flex flex-col justify-between gap-8 p-6 sm:p-9 lg:col-span-7", flip && "lg:order-1")}>
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="eyebrow">{project.category}</p>
            <span className="tag">{project.status}</span>
          </div>
          <h3 className="mt-5 font-display text-4xl font-semibold uppercase leading-none tracking-tightest sm:text-5xl">
            <Link href={`/projects/${project.slug}`} className="transition-colors group-hover:text-primary">
              {project.name}
            </Link>
          </h3>
          {project.fullName && (
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted/75">
              {project.fullName}
            </p>
          )}
          <p className="mt-5 max-w-xl leading-relaxed text-ink/80">{project.description}</p>

          {project.badge && (
            <p className="mt-6 inline-flex items-start gap-2.5 border border-accent bg-accent/20 px-3 py-2 font-mono text-[11px] font-medium uppercase leading-snug tracking-[0.1em] text-ink">
              <Award size={14} className="mt-px shrink-0 text-accent-ink" />
              <span>{project.badge}</span>
            </p>
          )}

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology stack">
            {project.stack.map((s) => (
              <li key={s} className="tag">
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/projects/${project.slug}`} className="btn-primary">
            View case study <ArrowUpRight size={15} />
          </Link>
          {github ? (
            <a href={github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <GithubIcon size={15} /> GitHub
            </a>
          ) : null}
          {demo ? (
            <a href={demo} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Live demo <ArrowUpRight size={15} />
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
