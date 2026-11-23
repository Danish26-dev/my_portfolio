"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredProjects, projectFilters, type Project, type ProjectFilter } from "@/lib/data/projects";
import { cn } from "@/lib/utils";
import { AutomatonViz } from "./projects/AutomatonViz";
import { FrabViz } from "./projects/FrabViz";
import { IdentipiViz } from "./projects/IdentipiViz";
import { InkLinkViz } from "./projects/InkLinkViz";
import { ProjectText } from "./projects/ProjectText";

const get = (slug: string) => featuredProjects.find((p) => p.slug === slug)!;

/**
 * Chapter 03. Four projects, four layouts: each one is presented the way its system actually works.
 * The filter spotlights a domain by dimming the rest, so the page never reflows under the reader.
 */
export function Projects() {
  const [filter, setFilter] = useState<ProjectFilter | "All">("All");
  const dim = (p: Project) => (filter === "All" || p.filters.includes(filter) ? "" : "opacity-[0.22] saturate-50");
  const frab = get("frab");
  const ink = get("inklink");
  const auto = get("automaton-nexus");
  const idp = get("identipi");

  return (
    <section id="projects" aria-labelledby="projects-title" className="section">
      <div className="container-page">
        <SectionHeading
          index="03"
          eyebrow="Built, tested and shipped"
          lines={["Ideas are easy.", "*Engineering the system* is the work."]}
          id="projects-title"
        >
          Four builds from the last two hackathon seasons. Each is shown the way it works: pick an agent, switch a flow, watch a
          pipeline run.
        </SectionHeading>

        <Reveal>
          <div role="group" aria-label="Spotlight projects by domain" className="mb-16 flex flex-wrap items-center gap-2 sm:mb-24">
            <span className="mr-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">Spotlight</span>
            {(["All", ...projectFilters] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "relative isolate px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] transition-colors",
                  filter === f ? "text-paper" : "text-muted hover:text-ink"
                )}
              >
                {filter === f && (
                  <motion.span layoutId="filter-pill" className="absolute inset-0 -z-10 bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                )}
                {f}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="space-y-24 sm:space-y-36">
        {/* 01 — FRAB: wide interactive architecture */}
        <Reveal>
          <article className={cn("container-page grid items-center gap-10 transition-all duration-500 lg:grid-cols-12 lg:gap-14", dim(frab))} aria-label={frab.name}>
            <div className="glass relative p-5 sm:p-8 lg:col-span-7">
              <span className="absolute -top-3 left-6 bg-paper px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Interactive · pick an agent</span>
              <FrabViz />
            </div>
            <ProjectText project={frab} className="lg:col-span-5" />
          </article>
        </Reveal>

        {/* 02 — InkLink: narrow story, oversized network, outlined wordmark */}
        <Reveal className="relative">
         <div className={cn("transition-all duration-500", dim(ink))}>
          <span aria-hidden="true" className="text-outline pointer-events-none absolute -top-32 left-0 hidden select-none whitespace-nowrap font-display text-[clamp(7rem,17vw,15rem)] font-semibold uppercase leading-none opacity-30 md:block">
            InkLink
          </span>
          <article className="container-page relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14" aria-label={ink.name}>
            <ProjectText project={ink} className="lg:col-span-5 lg:pt-10" />
            <div className="glass relative p-5 sm:p-8 lg:col-span-7 lg:translate-y-10">
              <span className="absolute -top-3 right-6 bg-paper px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Interactive · switch the flow</span>
              <InkLinkViz />
            </div>
          </article>
         </div>
        </Reveal>

        {/* 03 — Automaton Nexus: full-bleed cobalt band */}
        <Reveal>
          <article className={cn("relative overflow-hidden bg-primary py-20 transition-all duration-500 sm:py-28", dim(auto))} aria-label={auto.name}>
            <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px]" aria-hidden="true" />
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/90 blur-[2px]" aria-hidden="true" />
            <div className="container-page relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <ProjectText project={auto} onBlue className="lg:col-span-5" />
              <div className="lg:col-span-7">
                <AutomatonViz />
              </div>
            </div>
          </article>
        </Reveal>

        {/* 04 — IdentiPI: split card with a gold spine */}
        <Reveal>
          <article className={cn("container-page transition-all duration-500", dim(idp))} aria-label={idp.name}>
            <div className="grid border hairline bg-white/45 backdrop-blur-sm lg:grid-cols-12">
              <div className="border-b-4 border-accent p-6 sm:p-10 lg:col-span-5 lg:border-b-0 lg:border-r-4">
                <ProjectText project={idp} />
              </div>
              <div className="p-6 sm:p-10 lg:col-span-7">
                <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Interactive · share vs. prove</p>
                <IdentipiViz />
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
