"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, FileText, Loader2, Mail, Phone, Send } from "lucide-react";
import { ResumeLink } from "@/components/layout/ResumeViewer";
import { useState } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/data/site";
import { cn } from "@/lib/utils";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(v: Fields): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (v.message.trim().length < 10) e.message = "Tell me a little more (at least 10 characters).";
  return e;
}

type Status = "idle" | "invalid" | "sending" | "sent" | "failed";

/**
 * Sends the message to the inbox in `site.email` through a form-to-email relay (see site.contactEndpoint).
 * If the relay is unreachable the visitor gets a prefilled mailto link instead of losing their message.
 */
function ContactForm() {
  const [values, setValues] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [honey, setHoney] = useState("");
  const [sentTo, setSentTo] = useState("");

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
    if (status === "invalid" || status === "failed") setStatus("idle");
  };

  const fallbackHref = () => {
    const subject = `Portfolio message from ${values.name.trim() || "a visitor"}`;
    const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`;
    return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus("invalid");
      return;
    }
    if (honey) {
      // a bot filled the hidden field: pretend it worked
      setStatus("sent");
      return;
    }
    setStatus("sending");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch(site.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          _subject: `Portfolio message from ${values.name.trim()}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (!res.ok || data.success === false || data.success === "false") throw new Error("send failed");
      setSentTo(values.email.trim());
      setValues({ name: "", email: "", message: "" });
      setStatus("sent");
    } catch {
      setStatus("failed");
    } finally {
      clearTimeout(timer);
    }
  };

  const field = (k: keyof Fields) =>
    cn(
      "w-full border bg-paper/60 px-4 py-3.5 text-base text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-primary",
      errors[k] ? "border-red-600/70" : "border-ink/15"
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-5" aria-describedby="form-status">
      {/* honeypot: invisible to people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this empty
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Name</label>
          <input id="c-name" name="name" autoComplete="name" value={values.name} onChange={set("name")} className={field("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} placeholder="Your name" />
          {errors.name && <p id="e-name" className="mt-1.5 text-sm text-red-700">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="c-email" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Your email</label>
          <input id="c-email" name="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={set("email")} className={field("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "e-email" : undefined} placeholder="you@example.com" />
          {errors.email && <p id="e-email" className="mt-1.5 text-sm text-red-700">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="c-msg" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Message</label>
        <textarea id="c-msg" name="message" rows={5} value={values.message} onChange={set("message")} className={cn(field("message"), "resize-y")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "e-msg" : undefined} placeholder="What are you building?" />
        {errors.message && <p id="e-msg" className="mt-1.5 text-sm text-red-700">{errors.message}</p>}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto">
          {status === "sending" ? (
            <>
              Sending <Loader2 size={15} className="animate-spin" />
            </>
          ) : (
            <>
              Send message <Send size={15} />
            </>
          )}
        </button>
        <div id="form-status" role="status" aria-live="polite" className="min-h-6 text-sm">
          <AnimatePresence mode="wait">
            {status === "sent" && (
              <motion.p key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 text-primary">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>Message sent{sentTo ? `. I'll reply to ${sentTo}.` : "."}</span>
              </motion.p>
            )}
            {status === "invalid" && (
              <motion.p key="err" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-red-700">
                <AlertCircle size={16} /> Please fix the highlighted fields.
              </motion.p>
            )}
            {status === "failed" && (
              <motion.p key="fail" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>
                  Couldn&apos;t send that just now.{" "}
                  <a href={fallbackHref()} className="underline underline-offset-4">
                    Email me directly
                  </a>{" "}
                  and your message will be prefilled.
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
}
export function Contact() {
  const links = [
    { href: `mailto:${site.email}`, icon: <Mail size={18} />, label: "Email", value: site.email, ext: false },
    { href: site.github, icon: <GithubIcon />, label: "GitHub", value: "github.com/Danish26-dev", ext: true },
    { href: site.linkedin, icon: <LinkedinIcon />, label: "LinkedIn", value: "linkedin.com/in/md-danish-ali-dev", ext: true },
    { href: site.phoneHref, icon: <Phone size={18} />, label: "Phone", value: site.phone, ext: false },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="section relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        style={{ background: "radial-gradient(60% 80% at 50% 100%, rgba(21,70,217,0.14), transparent 70%)" }}
      />
      <div className="container-page relative">
        <SectionHeading
          index="07"
          eyebrow="The next build starts here"
          lines={["Have something", "*interesting* to build?"]}
          id="contact-title"
        >
          I&apos;m always interested in challenging engineering problems, ambitious collaborations and opportunities to build
          technology that matters.
        </SectionHeading>

        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <a href={`mailto:${site.email}`} className="btn-primary w-full sm:w-auto">
                <Mail size={15} /> Email me
              </a>
              <ResumeLink className="btn-ghost mt-3 w-full sm:ml-3 sm:mt-0 sm:w-auto">
                <FileText size={15} /> View resume
              </ResumeLink>
            </Reveal>
            <ul className="mt-10 border-t hairline">
              {links.map((l, i) => (
                <Reveal as="li" key={l.label} delay={i * 0.06} className="border-b hairline">
                  <a
                    href={l.href}
                    {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 py-4 transition-colors hover:text-primary"
                  >
                    <span className="grid h-10 w-10 place-items-center border hairline text-primary">{l.icon}</span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">{l.label}</span>
                      <span className="block break-all text-ink/90 group-hover:text-primary">{l.value}</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="glass p-6 sm:p-10">
              <h3 className="mb-6 font-display text-2xl font-semibold uppercase tracking-tight">Send a message</h3>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
