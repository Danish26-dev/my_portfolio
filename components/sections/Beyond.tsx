import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LazyBeyondScene } from "@/components/three/LazyBeyondScene";
import { hobbies } from "@/lib/data/profile";

function Aquascape() {
  return (
    <svg viewBox="0 0 200 80" className="h-20 w-full" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => {
        const x = 8 + i * 14;
        const h = 22 + ((i * 17) % 38);
        return (
          <path
            key={i}
            d={`M${x} 80 C${x - 6} ${80 - h * 0.5} ${x + 8} ${80 - h * 0.8} ${x} ${80 - h}`}
            fill="none"
            stroke={i % 3 === 0 ? "#F9B318" : "#1546D9"}
            strokeOpacity={0.55 + (i % 4) * 0.12}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function ChessGrid() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20" aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => {
        const x = i % 4;
        const y = Math.floor(i / 4);
        return (
          <rect
            key={i}
            x={x * 20}
            y={y * 20}
            width="20"
            height="20"
            fill={(x + y) % 2 ? "#1546D9" : "#F7F6F1"}
            stroke="#1E293B"
            strokeOpacity="0.2"
          />
        );
      })}
    </svg>
  );
}

export function Beyond() {
  return (
    <section id="beyond" aria-labelledby="beyond-title" className="section overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <LazyBeyondScene />
      </div>
      <div className="container-page relative">
        <SectionHeading index="07" eyebrow="Beyond engineering" lines={["Off the", "keyboard."]} id="beyond-title" />

        <div className="grid gap-5 md:grid-cols-5">
          <Reveal className="md:col-span-3">
            <article className="glass h-full p-7 sm:p-10">
              <Aquascape />
              <h3 className="mt-6 font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
                {hobbies[0].title}
              </h3>
              <p className="mt-3 max-w-md text-ink/80">{hobbies[0].body}</p>
            </article>
          </Reveal>
          <Reveal delay={0.12} className="md:col-span-2">
            <article className="glass h-full p-7 sm:p-10">
              <ChessGrid />
              <h3 className="mt-6 font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
                {hobbies[1].title}
              </h3>
              <p className="mt-3 text-ink/80">{hobbies[1].body}</p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
