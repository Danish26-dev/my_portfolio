import Link from "next/link";
import { Mail } from "lucide-react";
import { PhoenixMark } from "@/components/ui/Logo";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { navItems, site } from "@/lib/data/site";

export function Footer() {
  return (
    <footer className="relative border-t hairline bg-paper">
      <div className="container-page flex flex-col gap-10 py-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <PhoenixMark size={36} />
            <span className="font-display text-lg font-semibold uppercase tracking-[0.1em]">
              {site.name}
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted/75">
            Software Engineer | Agentic AI | Web3 | Full-Stack Development.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em]">
          {navItems.map((n) => (
            <Link
              key={n.id}
              href={n.id === "home" ? "/" : `/#${n.id}`}
              className="py-1 text-muted/75 transition-colors hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
          <Link href="/#education" className="py-1 text-muted/75 transition-colors hover:text-primary">
            Education
          </Link>
          <Link href="/#beyond" className="py-1 text-muted/75 transition-colors hover:text-primary">
            Beyond
          </Link>
        </nav>

        <div className="flex gap-3">
          <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-11 w-11 place-items-center border hairline text-muted/75 transition-colors hover:border-primary hover:text-primary">
            <GithubIcon />
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-11 w-11 place-items-center border hairline text-muted/75 transition-colors hover:border-primary hover:text-primary">
            <LinkedinIcon />
          </a>
          <a href={`mailto:${site.email}`} aria-label="Email" className="grid h-11 w-11 place-items-center border hairline text-muted/75 transition-colors hover:border-primary hover:text-primary">
            <Mail size={18} />
          </a>
        </div>
      </div>
      <div className="border-t hairline">
        <p className="container-page py-5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted/75">
          © 2026 {site.name}. Designed and built from scratch.
        </p>
      </div>
    </footer>
  );
}
