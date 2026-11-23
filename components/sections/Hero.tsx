"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDownRight, Download, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { HeroBackground } from "@/components/three/HeroBackground";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { site } from "@/lib/data/site";
import { easeOutExpo } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
};

export function Hero() {
  const reduce = useReducedMotion();
  const [go, setGo] = useState(false);

  // Wait for the preloader on the first visit of a session.
  useEffect(() => {
    const seen = sessionStorage.getItem("wp-preloaded");
    const t = setTimeout(() => setGo(true), seen ? 100 : 2000);
    return () => clearTimeout(t);
  }, []);

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 36 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 1, ease: easeOutExpo } },
  };

  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <HeroBackground />

      <motion.div
        className="container-page relative z-10 pb-24 pt-28 sm:pt-32"
        variants={container}
        initial="hidden"
        animate={go ? "show" : "hidden"}
      >
        <div className="max-w-4xl">
          <motion.p variants={item} className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-primary/60" />
            Hello, I&apos;m
          </motion.p>

          <h1 id="hero-title" className="mt-5">
            <motion.span
              variants={item}
              className="display block text-[clamp(3rem,min(10vw,15vh),8.2rem)]"
            >
              Md Danish
              <span className="block text-primary">
                Ali
              </span>
            </motion.span>
          </h1>

          <motion.p variants={item} className="mt-5 font-mono text-[12px] uppercase tracking-[0.22em] text-muted/75 sm:text-[13px]">
            Software Engineer <span className="mx-2 text-primary/60">|</span> Agentic AI{" "}
            <span className="mx-2 text-primary/60">|</span> Web3
          </motion.p>

          <motion.h2
            variants={item}
            className="mt-9 max-w-2xl font-display text-[clamp(1.35rem,2.7vw,2.15rem)] font-medium uppercase leading-[1.12] tracking-tight text-ink"
          >
            Building intelligent systems at the edge of what&apos;s possible.
          </motion.h2>

          <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
            I engineer AI-driven applications, decentralized systems and full-stack products,
            transforming ambitious ideas into working technology.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#projects" className="btn-primary">
              Explore my work <ArrowDownRight size={16} />
            </a>
            <a href={site.resume} download className="btn-ghost">
              <Download size={15} /> Download resume
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex gap-2">
              <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="grid h-11 w-11 place-items-center border hairline bg-paper/40 text-ink/80 backdrop-blur-sm transition-colors hover:border-primary hover:text-primary">
                <GithubIcon />
              </a>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="grid h-11 w-11 place-items-center border hairline bg-paper/40 text-ink/80 backdrop-blur-sm transition-colors hover:border-primary hover:text-primary">
                <LinkedinIcon />
              </a>
              <a href={`mailto:${site.email}`} aria-label="Send email" className="grid h-11 w-11 place-items-center border hairline bg-paper/40 text-ink/80 backdrop-blur-sm transition-colors hover:border-primary hover:text-primary">
                <Mail size={18} />
              </a>
            </div>
            <a href="#contact" className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/80">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <span className="transition-colors group-hover:text-primary">
                Open to collaborations &amp; hackathons
              </span>
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to explore"
        initial={{ opacity: 0 }}
        animate={{ opacity: go ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/75 hover:text-primary sm:flex"
      >
        Scroll to explore
        <span className="relative h-10 w-px overflow-hidden bg-ink/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-primary"
            animate={reduce ? undefined : { y: [-16, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
