"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, FileText, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { site } from "@/lib/data/site";
import { easeOutExpo } from "@/lib/utils";

const DOWNLOAD_NAME = "Md-Danish-Ali-Resume.pdf";

const ResumeContext = createContext<{ open: () => void }>({ open: () => {} });

/** Wraps the app. Any <ResumeLink> opens the same viewer. */
export function ResumeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    opener.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    // Give focus back to whatever opened the viewer.
    requestAnimationFrame(() => opener.current?.focus?.({ preventScroll: true }));
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ResumeContext.Provider value={value}>
      {children}
      <ResumeModal open={isOpen} onClose={close} />
    </ResumeContext.Provider>
  );
}

/**
 * A normal link to the PDF that opens the viewer on click.
 * Ctrl/Cmd/Shift-click, middle-click, or no JavaScript: it opens the PDF in a new tab.
 */
export function ResumeLink({ children, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { open } = useContext(ResumeContext);
  return (
    <a
      href={site.resume}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        open();
      }}
    >
      {children}
    </a>
  );
}

function ResumeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const desktop = useMediaQuery("(min-width: 768px)");
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // Lock page scroll (on <html>, so it doesn't clash with the nav menu's body lock).
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  // Escape to close, Tab stays inside the dialog.
  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialog.current) return;
      const items = Array.from(
        dialog.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), iframe")
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] grid place-items-center bg-ink/55 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label="Resume"
            className="flex h-[min(92vh,1000px)] w-full max-w-4xl flex-col overflow-hidden border border-ink/15 bg-paper shadow-glow"
            initial={{ y: 36, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b hairline px-4 py-3 sm:px-5">
              <p className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
                <FileText size={15} /> Resume
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={site.resume}
                  download={DOWNLOAD_NAME}
                  className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-accent hover:text-ink"
                >
                  <Download size={14} /> Download
                </a>
                <a
                  href={site.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden items-center gap-2 border border-primary/50 px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary/10 sm:inline-flex"
                >
                  <ExternalLink size={14} /> New tab
                </a>
                <button
                  ref={closeBtn}
                  type="button"
                  onClick={onClose}
                  aria-label="Close resume"
                  className="grid h-10 w-10 place-items-center border border-ink/15 text-ink transition-colors hover:border-primary hover:text-primary"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {desktop ? (
              <iframe
                title="Md Danish Ali resume (PDF)"
                src={`${site.resume}#view=FitH&navpanes=0`}
                className="min-h-0 w-full flex-1 bg-white"
              />
            ) : (
              // Phone browsers don't render PDFs inline reliably, so offer the file directly.
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <FileText size={44} className="text-primary" />
                <p className="max-w-xs text-muted">
                  PDF previews are unreliable on phones. Open the resume in your browser&apos;s viewer, or save a copy.
                </p>
                <a href={site.resume} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <ExternalLink size={15} /> Open resume
                </a>
                <a href={site.resume} download={DOWNLOAD_NAME} className="btn-ghost">
                  <Download size={15} /> Download PDF
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
