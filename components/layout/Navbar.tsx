"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navAlias, navItems, site } from "@/lib/data/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { PhoenixMark } from "@/components/ui/Logo";
import { cn, easeOutExpo } from "@/lib/utils";

const ids = [
  "home",
  "about",
  "projects",
  "achievements",
  "expertise",
  "education",
  "research",
  "beyond",
  "contact",
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sectionActive = useActiveSection(ids, isHome);

  let active = navAlias[sectionActive] ?? sectionActive;
  if (!isHome) {
    if (pathname.startsWith("/projects")) active = "projects";
    else if (pathname.startsWith("/research")) active = "research";
    else active = "";
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const href = (id: string) => (id === "home" ? "/" : `/#${id}`);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: easeOutExpo }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-5"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-5",
            scrolled || open
              ? "border-ink/10 bg-paper/75 shadow-[0_10px_40px_-15px_rgba(15,23,42,0.28)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
          )}
        >
          <Link href="/" className="group flex items-center gap-2.5" aria-label={`${site.name} — home`}>
            <PhoenixMark size={30} className="transition-transform duration-500 group-hover:-translate-y-0.5" />
            <span className="hidden font-display text-sm font-semibold uppercase tracking-[0.12em] sm:block">
              Danish<span className="text-accent">.</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={href(item.id)}
                  aria-current={active === item.id ? "page" : undefined}
                  className={cn(
                    "relative block rounded-full px-3.5 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] transition-colors",
                    active === item.id ? "text-primary" : "text-muted/75 hover:text-ink"
                  )}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-primary/30 bg-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={site.resume}
              download
              className="hidden border border-primary/50 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary hover:text-paper sm:block"
            >
              Resume
            </a>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-paper/95 px-8 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
          >
            <ul className="space-y-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: easeOutExpo }}
                >
                  <Link
                    href={href(item.id)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-baseline gap-4 py-2 font-display text-4xl font-semibold uppercase tracking-tight",
                      active === item.id ? "text-primary" : "text-ink"
                    )}
                  >
                    <span className="font-mono text-[11px] text-muted/75">0{i + 1}</span>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <a href={site.resume} download className="btn-primary mt-10 self-start">
              Download resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
