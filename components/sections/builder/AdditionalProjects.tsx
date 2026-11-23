"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { additionalProjects, type Project } from "@/lib/data/projects";
import { cn, easeOutExpo } from "@/lib/utils";
import { BlockLabel } from "./BlockLabel";

function Row({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <li className="border-b hairline">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center gap-4 py-5 text-left sm:gap-8"
      >
        <span className="w-8 font-mono text-[11px] text-muted">{project.index}</span>
        <span className="flex-1">
          <span className="block font-display text-2xl font-semibold uppercase tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
            {project.name}
          </span>
          <span className="mt-1 block text-sm text-muted">{project.tagline}</span>
        </span>
        <span className="hidden gap-2 sm:flex">
          {project.filters.map((f) => (
            <span key={f} className="tag">
              {f}
            </span>
          ))}
        </span>
        <ChevronDown size={18} className={cn("shrink-0 text-primary transition-transform duration-500", open && "rotate-180")} />
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
            <div className="grid gap-6 pb-7 sm:pl-16 md:grid-cols-2">
              <div>
                <p className="eyebrow">What it is</p>
                <p className="mt-3 text-ink/85">{project.description}</p>
                <p className="mt-4 flex flex-wrap gap-2">
                  <span className="tag">{project.category}</span>
                  <span className="tag">{project.status}</span>
                </p>
              </div>
              <div className="border border-dashed border-muted/50 p-4">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">Write-up pending</p>
                <p className="mt-2 text-sm text-muted">
                  Stack, outcome and links will appear here once they&apos;re added to <code className="text-primary">lib/data/projects.ts</code>.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function AdditionalProjects() {
  return (
    <div id="more-projects" className="scroll-mt-28">
      <BlockLabel n="C" title="More builds" note="Smaller projects and experiments that sit outside the four case studies." />
      <Reveal>
        <ul className="border-t hairline">
          {additionalProjects.map((p) => (
            <Row key={p.slug} project={p} />
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
