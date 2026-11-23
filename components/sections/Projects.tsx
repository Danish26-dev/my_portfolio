"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FeaturedProject } from "./FeaturedProject";
import {
  additionalProjects,
  featuredProjects,
  projectFilters,
  type Project,
  type ProjectFilter,
} from "@/lib/data/projects";
import { cn, easeOutExpo } from "@/lib/utils";

function AdditionalRow({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b hairline"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center gap-4 py-5 text-left sm:gap-8"
      >
        <span className="w-8 font-mono text-[11px] text-muted/75">{project.index}</span>
        <span className="flex-1">
          <span className="block font-display text-2xl font-semibold uppercase tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
            {project.name}
          </span>
          <span className="mt-1 block text-sm text-muted/75">{project.tagline}</span>
        </span>
        <span className="hidden gap-2 sm:flex">
          {project.filters.map((f) => (
            <span key={f} className="tag">
              {f}
            </span>
          ))}
        </span>
        <ChevronDown
          size={18}
          className={cn("shrink-0 text-primary transition-transform duration-500", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 pb-7 pl-0 sm:pl-16 md:grid-cols-2">
              <div>
                <p className="eyebrow">Overview</p>
                <p className="mt-3 text-ink/85">{project.description}</p>
                <p className="mt-4 flex flex-wrap gap-2">
                  <span className="tag">{project.category}</span>
                  <span className="tag">{project.status}</span>
                </p>
              </div>
              <div className="border border-dashed border-muted/40 p-4">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted/75">
                  To complete
                </p>
                <p className="mt-2 text-sm text-muted/75">
                  Stack, status, achievements and links have not been provided yet. Add them in{" "}
                  <code className="text-primary">lib/data/projects.ts</code> and this card will update
                  automatically.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<ProjectFilter | "All">("All");
  const match = (p: Project) => filter === "All" || p.filters.includes(filter);
  const featured = featuredProjects.filter(match);
  const more = additionalProjects.filter(match);

  return (
    <section id="projects" aria-labelledby="projects-title" className="section">
      <div className="container-page">
        <SectionHeading index="02" eyebrow="Selected work" lines={["Systems", "I've shipped."]} id="projects-title">
          Four featured builds with full case studies, and five more projects from the workshop.
        </SectionHeading>

        <Reveal>
          <div role="group" aria-label="Filter projects by domain" className="mb-12 flex flex-wrap gap-2">
            {(["All", ...projectFilters] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "relative isolate px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                  filter === f ? "text-paper" : "text-muted/75 hover:text-ink"
                )}
              >
                {filter === f && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 -z-10 bg-primary"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className={cn(filter !== f && "border-b border-transparent")}>{f}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="space-y-8">
          <AnimatePresence>
            {featured.map((p, i) => (
              <FeaturedProject key={p.slug} project={p} flip={i % 2 === 1} />
            ))}
          </AnimatePresence>
        </div>

        {more.length > 0 && (
          <div className="mt-20">
            <Reveal>
              <h3 className="eyebrow">More projects</h3>
            </Reveal>
            <ul className="mt-6 border-t hairline">
              <AnimatePresence>
                {more.map((p) => (
                  <AdditionalRow key={p.slug} project={p} />
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}

        {featured.length === 0 && more.length === 0 && (
          <p className="text-muted/75">No projects match this filter yet.</p>
        )}
      </div>
    </section>
  );
}
