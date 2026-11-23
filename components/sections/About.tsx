"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { Journey } from "@/components/sections/Journey";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollWords } from "@/components/ui/ScrollWords";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AgentGraphSketch, CredentialSketch, Float, PacketFlowSketch } from "@/components/ui/TechSketches";
import { explore, philosophy } from "@/lib/data/profile";

/** Chapter 02. Who is behind the builds, and how they think. */
export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section ref={ref} id="about" aria-labelledby="about-title" className="section overflow-hidden">
      <div className="container-page relative">
        <SectionHeading
          index="02"
          eyebrow="The engineer behind the builds"
          lines={["Not just writing code.", "*Understanding systems.*"]}
          id="about-title"
        />

        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScrollWords
              className="font-display text-[clamp(1.5rem,2.7vw,2.4rem)] font-medium leading-[1.22] tracking-tight text-ink"
              text="I'm a Computer Science and Engineering undergraduate at Sambhram Institute of Technology, interested in the engineering behind intelligent and decentralized systems."
            />
            <Reveal className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
              <p>
                My work spans Agentic AI, Web3 and full-stack development. I enjoy exploring how these technologies
                connect, experimenting with emerging infrastructure and building applications that solve practical
                problems.
              </p>
            </Reveal>

            <Reveal className="mt-14">
              <h3 className="eyebrow">What I explore</h3>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {explore.map((e) => (
                  <li key={e} className="border border-primary/25 bg-white/50 px-3.5 py-2 text-sm text-ink backdrop-blur-sm">
                    {e}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* margin notes: sketches of the systems behind the work, drifting at different speeds */}
            <div className="mt-14 grid grid-cols-3 gap-4 sm:gap-8">
              {[
                { c: <AgentGraphSketch />, l: "Agents under a supervisor", from: 40, to: -40 },
                { c: <CredentialSketch />, l: "Credential, proof, verifier", from: 70, to: -70 },
                { c: <PacketFlowSketch />, l: "Private document flow", from: 20, to: -20 },
              ].map((s) => (
                <figure key={s.l}>
                  <Float progress={scrollYProgress} from={s.from} to={s.to} className="h-20 w-full sm:h-28">
                    {s.c}
                  </Float>
                  <figcaption className="mt-2 font-mono text-[9.5px] uppercase leading-snug tracking-[0.14em] text-muted">{s.l}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Reveal>
              <h3 className="eyebrow">How I work</h3>
            </Reveal>
            <ol className="mt-6 border-t hairline">
              {philosophy.map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 0.06} className="border-b hairline py-5">
                  <div className="flex gap-4">
                    <span className="mt-1 font-mono text-[11px] font-medium text-primary">0{i + 1}</span>
                    <div>
                      <p className="font-display text-lg font-semibold leading-tight tracking-tight text-ink">{p.title}</p>
                      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{p.proof}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>

        <Journey />
      </div>
    </section>
  );
}
