import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Journey } from "@/components/sections/Journey";
import { explore, philosophy } from "@/lib/data/profile";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="container-page">
        <SectionHeading index="01" eyebrow="About" lines={["Beyond", "the code."]} id="about-title" />

        <div className="grid gap-14 lg:grid-cols-12">
          <div className="space-y-6 text-lg leading-relaxed text-ink/80 lg:col-span-6">
            <Reveal>
              <p>
                I am <span className="text-ink">Md Danish Ali</span>, a Computer Science and
                Engineering undergraduate at Sambhram Institute of Technology.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p>
                My engineering interests revolve around Agentic AI, Web3, full-stack development
                and emerging technologies.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p>
                I enjoy building systems that combine intelligent automation, decentralized
                infrastructure and practical software engineering.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <p>
                Hackathons have been an important part of my journey, allowing me to experiment
                with unfamiliar technologies, collaborate under pressure and transform ideas into
                working products.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:col-span-6 lg:gap-10">
            <Reveal>
              <h3 className="eyebrow">My engineering philosophy</h3>
              <ol className="mt-6 space-y-4">
                {philosophy.map((p, i) => (
                  <li key={p} className="flex gap-4 border-t hairline pt-4">
                    <span className="font-mono text-[11px] text-primary">0{i + 1}</span>
                    <span className="text-ink/90">{p}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={0.12}>
              <h3 className="eyebrow">What I explore</h3>
              <ul className="mt-6 space-y-4">
                {explore.map((p) => (
                  <li key={p} className="flex gap-4 border-t hairline pt-4">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                    <span className="text-ink/90">{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <Journey />
      </div>
    </section>
  );
}
