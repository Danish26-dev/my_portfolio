"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TerminalSquare, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { achievements } from "@/lib/data/achievements";
import { projects } from "@/lib/data/projects";
import { skillCategories } from "@/lib/data/skills";
import { site } from "@/lib/data/site";
import { easeOutExpo } from "@/lib/utils";

type Line = { kind: "in" | "out"; text: string };

const commands: Record<string, () => string[]> = {
  help: () => [
    "Available commands:",
    "  about          who I am",
    "  projects       featured and additional projects",
    "  skills         technology categories",
    "  achievements   hackathon recognition",
    "  contact        ways to reach me",
    "  clear          clear the screen",
  ],
  about: () => [
    `${site.name}: ${site.description}`,
    "Interests: Agentic AI, Web3, full-stack engineering, emerging technologies.",
  ],
  projects: () =>
    projects.map(
      (p) => `${p.index}  ${p.name.padEnd(16)} ${p.featured ? "[featured]" : "          "} ${p.tagline}`
    ),
  skills: () =>
    skillCategories.map((c) => `${c.label}: ${c.skills.map((s) => s.name).join(", ")}`),
  achievements: () =>
    achievements.map(
      (a) => `${a.index}  ${a.title} | ${a.event} | ${a.project}${a.prize ? ` | ${a.prize}` : ""}`
    ),
  contact: () => [
    `Email:    ${site.email}`,
    `GitHub:   ${site.github}`,
    `LinkedIn: ${site.linkedin}`,
    `Phone:    ${site.phone}`,
  ],
};

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const boot = useCallback(() => {
    setLines([
      { kind: "out", text: "DANISH.OS v1.0 — an interactive index of this portfolio." },
      { kind: "out", text: "Type 'help' to see commands." },
    ]);
  }, []);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      boot();
      setTimeout(() => input.current?.focus(), 50);
    } else if (wasOpen.current) {
      trigger.current?.focus({ preventScroll: true });
    }
  }, [open, boot]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "clear") return setLines([]);
    const out = commands[cmd]
      ? commands[cmd]()
      : [`command not found: ${cmd}. Type 'help'.`];
    setLines((l) => [
      ...l,
      { kind: "in", text: cmd },
      ...out.map((text) => ({ kind: "out" as const, text })),
    ]);
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open DANISH.OS terminal"
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center gap-2 rounded-full border border-primary/40 bg-paper/80 font-mono text-[11px] uppercase tracking-[0.16em] text-primary backdrop-blur-md transition-colors hover:bg-primary/15 sm:bottom-8 sm:right-8 sm:w-auto sm:px-4"
      >
        <TerminalSquare size={16} />
        <span className="hidden sm:inline">Danish.OS</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-paper/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="DANISH.OS terminal"
              className="flex h-[min(520px,80vh)] w-full max-w-2xl flex-col overflow-hidden border border-primary/30 bg-paper shadow-glow"
              initial={{ y: 30, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b hairline px-4 py-2.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                  danish.os
                </span>
                <button type="button" aria-label="Close terminal" onClick={() => setOpen(false)} className="text-muted hover:text-ink">
                  <X size={16} />
                </button>
              </div>
              <div
                ref={scroller}
                className="flex-1 space-y-1 overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed"
                onClick={() => input.current?.focus()}
                aria-live="polite"
              >
                {lines.map((l, i) => (
                  <pre
                    key={i}
                    className={`whitespace-pre-wrap break-words font-mono ${l.kind === "in" ? "text-primary" : "text-ink/85"}`}
                  >
                    {l.kind === "in" ? `> ${l.text}` : l.text}
                  </pre>
                ))}
              </div>
              <form
                className="flex items-center gap-2 border-t hairline px-4 py-3 font-mono text-[13px]"
                onSubmit={(e) => {
                  e.preventDefault();
                  run(value);
                  setValue("");
                }}
              >
                <span className="text-primary">&gt;</span>
                <input
                  ref={input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  aria-label="Terminal command"
                  autoComplete="off"
                  spellCheck={false}
                  className="flex-1 bg-transparent text-ink outline-none placeholder:text-muted/60"
                  placeholder="type a command, e.g. help"
                />
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
