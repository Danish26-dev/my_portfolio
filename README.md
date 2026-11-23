# Md Danish Ali — Portfolio

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind · Framer Motion · Three.js / React Three Fiber / Drei.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Design system

Light theme. Palette lives in `app/globals.css` (CSS variables) and `tailwind.config.ts` (utility classes).

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` / `paper` | `#EDECE6` | Page background |
| `--color-primary` / `primary` | `#1546D9` | Brand blue: actions, links, 3D core |
| `--color-accent` / `accent` | `#F9B318` | Highlights, hover states, 3D ring |
| `--color-text-muted` / `muted` | `#1E293B` | Body copy |

Derived shades (not in the original palette): `paper2` (surface), `ink` (headings), `primary.deep`, `accent.ink` (an AA-contrast amber for text).

The hero is a real-time 3D "agent core" (`components/three/HeroScene.tsx`): a distorted blue sphere with orbiting rings, beads and satellite shapes, lit by a custom light rig. There are no external models or HDR downloads. It pauses off-screen, lowers quality on phones, and falls back to a static SVG without WebGL.

## Where content lives (edit these, not components)

| File | Content |
| --- | --- |
| `lib/data/site.ts` | Contact details, links, nav, resume path |
| `lib/data/projects.ts` | Projects, case studies, architecture diagrams, repo/demo links |
| `lib/data/achievements.ts` | Awards (exact titles/prizes), logo + certificate paths |
| `lib/data/skills.ts` | Skill categories (projects reference skill ids) |
| `lib/data/profile.ts` | Philosophy, journey timeline, education, hobbies |
| `lib/data/research.ts` | Research / engineering notes (article template at `/research/[slug]`) |

## Things still to supply (nothing was invented)

- **Resume:** `public/Md-Danish-Ali-Resume.pdf` is a generated stand-in built from the facts in the brief (`npm run resume`). Replace it with the official PDF using the same filename.
- **Repo / demo URLs:** set `links.github` / `links.demo` per project. Buttons appear automatically; until then case pages show "not added yet".
- **Case-study gaps:** "Engineering contributions" and "Challenges" show dashed *To complete* panels. The five additional projects (Yuktidoot, Odyssey, LactIQ, Klaim, Guruko) have name + tagline only.
- **Architecture diagrams** are drafts derived from the stated components; verify flow and grouping.
- **Logos / certificates:** add files to `public/logos` / `public/certificates` and set `logo` / `certificate` on the achievement.
- **Athernex Hackathon year** is unknown, so the timeline shows "Date to confirm".
- **PrintX paper** is deliberately not listed. Add it to `research.ts` once publication details and a link exist.

## Contact form

No backend is configured. Submitting validates input, then opens a prefilled `mailto:` to the address in `site.ts`. To use a real service (Formspree, Resend, ...), replace the body of `submit` in `components/sections/Contact.tsx` with a `fetch()` call.

## Deploy to Vercel

Option A, dashboard (recommended): push to GitHub, then on [vercel.com/new](https://vercel.com/new) import `Danish26-dev/my_portfolio`. Vercel detects Next.js; keep the defaults.

Option B, CLI:

```bash
npm i -g vercel
vercel login
vercel            # preview deployment (first run links the project)
vercel --prod     # production deployment
```

After the first deploy, set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) to your final URL under Project Settings → Environment Variables, then redeploy so canonical links, the sitemap and Open Graph tags use it.

## Performance notes

- 3D is code-split (`next/dynamic`, `ssr:false`); the Beyond scene only loads near the viewport.
- Scenes pause when off-screen or the tab is hidden. Phones and low-core devices get lower geometry detail and DPR 1; `PerformanceMonitor` drops DPR under load.
- No WebGL, or a scene error, falls back to a static SVG. `prefers-reduced-motion` freezes the 3D animation and simplifies Framer Motion.
- `/opengraph-image` is rendered on demand because `@vercel/og` fails to prerender on Windows paths with spaces.
