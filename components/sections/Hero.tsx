"use client";

import { motion, useTransform, type Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ArrowDownRight, FileText, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ResumeLink } from "@/components/layout/ResumeViewer";
import { HeroBackground } from "@/components/three/HeroBackground";
import { HeroBackdrop } from "@/components/three/StaticHero";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { SplitText } from "@/components/ui/SplitText";
import { useStoryProgress } from "@/hooks/useStoryProgress";
import { site } from "@/lib/data/site";
import { easeOutExpo } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
};

/**
 * Chapter 01. The section is taller than the screen and the stage inside it is pinned, so the
 * phoenix can spread its wings and dissolve while the visitor scrolls (natural scrolling, no hijack).
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const progress = useStoryProgress(ref, "lg");
  const reduce = useReducedMotion();
  const [go, setGo] = useState(false);
  const fitRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);

  // On the pinned (desktop) hero the copy has to fit the viewport: scale it down on short screens.
  useEffect(() => {
    const measure = () => {
      const el = fitRef.current;
      if (!el) return;
      const pinned = window.matchMedia("(min-width: 1024px)").matches;
      const need = el.offsetHeight;
      setFit(pinned && need > 0 ? Math.min(1, (window.innerHeight - 150) / need) : 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (fitRef.current) ro.observe(fitRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Wait for the preloader on the first visit of a session.
  useEffect(() => {
    const seen = sessionStorage.getItem("wp-preloaded");
    const t = setTimeout(() => setGo(true), seen ? 150 : 1900);
    return () => clearTimeout(t);
  }, []);

  const opacity = useTransform(progress, [0, 0.3, 0.62], [1, 1, 0]);
  const lift = useTransform(progress, [0, 0.62], [0, -70]);
  const cue = useTransform(progress, [0, 0.08], [1, 0]);

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.9, ease: easeOutExpo } },
  };

  const social =
    "grid h-11 w-11 place-items-center border hairline bg-white/50 text-ink backdrop-blur-sm transition-colors hover:border-primary hover:text-primary";

  return (
    <section id="home" ref={ref} aria-labelledby="hero-title" className="relative lg:h-[185svh]">
      <div className="relative overflow-hidden lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:items-center">
        <HeroBackdrop />
        {/* Phones/tablets: the bird gets its own stage above the copy (so it can never overlap the name).
            Desktop: the same box becomes the full-bleed background of the pinned hero. */}
        <div className="relative z-0 mt-[68px] h-[clamp(290px,44svh,430px)] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
          <HeroBackground progress={progress} />
        </div>

        <motion.div
          className="container-page relative z-10 pb-20 pt-4 lg:pb-14 lg:pt-24"
          style={reduce ? undefined : { opacity, y: lift }}
        >
          <div ref={fitRef} style={fit < 1 ? { transform: `scale(${fit})`, transformOrigin: "left center" } : undefined}>
          <motion.div
            className="max-w-[46rem]"
            variants={container}
            initial="hidden"
            animate={go ? "show" : "hidden"}
          >
            <motion.p variants={item} className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-primary/60" />
              Computer Science Undergraduate · Engineering the future
            </motion.p>

            <h1 id="hero-title" className="mt-5">
              <SplitText
                lines={["Md Danish", "_Ali_"]}
                play={go}
                delay={0.25}
                stagger={0.035}
                className="display block text-[clamp(3rem,min(8.2vw,12.6vh),7.6rem)]"
              />
            </h1>

            <motion.p
              variants={item}
              className="mt-5 font-mono text-[12px] font-medium uppercase tracking-[0.22em] text-muted sm:text-[13px]"
            >
              Software Engineer <span className="mx-2 text-accent">/</span> Agentic AI{" "}
              <span className="mx-2 text-accent">/</span> Web3
            </motion.p>

            <motion.h2
              variants={item}
              className="mt-6 max-w-[34rem] font-display text-[clamp(1.4rem,2.35vw,2.15rem)] font-medium leading-[1.16] tracking-tight text-ink"
            >
              I build systems where <span className="em-serif">intelligent agents</span>,{" "}
              <span className="em-serif">decentralized infrastructure</span> and software engineering meet.
            </motion.h2>

            <motion.p variants={item} className="mt-5 max-w-[32rem] text-base leading-relaxed text-muted sm:text-[1.0625rem]">
              From multi-agent financial investigations to privacy-first decentralized applications, I enjoy turning
              complex technical ideas into products that actually work.
            </motion.p>

            <motion.div variants={item} className="mt-7 flex flex-wrap items-center gap-4">
              <a href="#projects" className="btn-primary">
                Explore my work <ArrowDownRight size={16} />
              </a>
              <ResumeLink className="btn-ghost">
                <FileText size={15} /> Download resume
              </ResumeLink>
            </motion.div>

            <motion.div variants={item} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex gap-2">
                <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className={social}>
                  <GithubIcon />
                </a>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className={social}>
                  <LinkedinIcon />
                </a>
                <a href={`mailto:${site.email}`} aria-label="Send email" className={social}>
                  <Mail size={18} />
                </a>
              </div>
              <a href="#contact" className="group -my-2 flex items-center gap-3 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                <span className="transition-colors group-hover:text-primary">Open to collaborations &amp; hackathons</span>
              </a>
            </motion.div>
          </motion.div>
          </div>
        </motion.div>

        <motion.a
          href="#about"
          aria-label="Scroll to explore"
          style={{ opacity: cue }}
          initial={{ y: 8 }}
          animate={{ y: go ? 0 : 8 }}
          className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted hover:text-primary sm:flex"
        >
          Scroll to explore
          <span className="relative h-10 w-px overflow-hidden bg-ink/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-4 bg-primary"
              animate={reduce ? undefined : { y: [-16, 40] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.a>
      </div>
    </section>
  );
}
