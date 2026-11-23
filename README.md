# Md Danish Ali — Portfolio

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind · Framer Motion · Three.js / React Three Fiber (custom GLSL).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## The story

The page is one narrative in seven chapters, closed by an epilogue. The chapter rail on wide screens tracks progress.

| # | Chapter | Component |
| --- | --- | --- |
| 01 | Introduction (pinned hero, phoenix spreads and dissolves as you scroll) | `sections/Hero.tsx` |
| 02 | The engineer behind the builds | `sections/About.tsx` |
| 03 | Built, tested and shipped (four bespoke project layouts) | `sections/Projects.tsx`, `sections/projects/*` |
| 04 | Recognition | `sections/Achievements.tsx` |
| 05 | The technologies I work with | `sections/Expertise.tsx` |
| 06 | The builder beyond the projects (education, notes, more builds, hobbies) | `sections/Builder.tsx`, `sections/builder/*` |
| 07 | The next build starts here | `sections/Contact.tsx` |
| — | Epilogue: the phoenix re-forms and disperses into water | `sections/Outro.tsx` |

Scrolling stays native. Only the hero and the epilogue are pinned (`position: sticky`), because the phoenix animation needs a scroll range to play in.

## Design system (locked)

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#EDECE6` | Page background |
| `primary` | `#1546D9` | Headings emphasis, interaction, the phoenix |
| `accent` | `#F9B318` | Highlights, beak, prize details |
| `ink` | `#111827` | Typography |
| `muted` | `#586274` | Secondary text |
| white | `#FFFFFF` | Translucent surfaces |

Defined in `tailwind.config.ts` and as CSS variables in `app/globals.css`. Shades derived from these (`paper2`, `primary.deep`, `accent.ink` for AA-contrast small text) are tints, not new hues.

Type: Bricolage Grotesque (display), Inter (body), JetBrains Mono (labels), Instrument Serif italic (one emphasised phrase per headline, written as `*phrase*` in headline strings).

## The Water Phoenix

Built procedurally, with no models or textures:

- `components/three/phoenix/model.ts` — feather specs: 11 primaries, 9 secondaries and coverts per wing (mirrored), 9 tail plumes, 4 crest plumes, body spine and radii. Also feeds the SVG fallback.
- `geometry.ts` — feather strips, lathed body and head, beak, water ribbons, and ~7,800 droplets sampled on the surfaces.
- `shaders.ts` — wing flap with a travelling wave, droplet gathering and dispersal, pointer repulsion, water-feather shading, waterline.
- `PhoenixCanvas.tsx` — the story state machine (`form`, `spread`, `disperse`) driven by scroll progress, plus placement and pointer parallax.

Performance: code-split (`next/dynamic`), pauses off-screen and on hidden tabs, ~3,400 droplets and DPR 1 on phones, adaptive DPR, a static SVG phoenix without WebGL, a frozen frame for `prefers-reduced-motion`.

## Where content lives (edit these, not components)

| File | Content |
| --- | --- |
| `lib/data/site.ts` | Contact details, links, nav, resume path |
| `lib/data/projects.ts` | Projects, case studies, diagrams, GitHub/demo links |
| `lib/data/achievements.ts` | Awards (exact titles/prizes), logo, certificate and photo paths |
| `lib/data/skills.ts` | Skill categories (projects reference skill ids) |
| `lib/data/profile.ts` | Principles, timeline, education, hobbies |
| `lib/data/research.ts` | Notes (article template at `/research/[slug]`) |

## Still to supply (nothing was invented)

- **Case-study "Challenges"** sections and the five smaller projects' write-ups.
- **Event logos, certificates and photos**: drop files in `public/logos`, `public/certificates`, `public/photos` and set the paths in `achievements.ts`.
- **Athernex Hackathon year** (the timeline shows "Date to confirm").
- **PrintX paper**: listed only once publication details and a link exist.
- **Live demo URLs** for each project.
- Verify the **FRAB agent roles** (Watchman = detection, Detective = investigation, Jurist = compliance analysis, Scribe = reporting). They follow the order in the resume line and should be confirmed.

## Resume

`public/Md-Danish-Ali-Resume.pdf`. Every resume button uses `ResumeLink` (`components/layout/ResumeViewer.tsx`): a click opens an in-page viewer with **Download** and **New tab**; Ctrl/Cmd-click, or no JavaScript, opens the PDF in a new tab. Replace the PDF to update it, keeping the filename.

## Contact form

No backend is configured. Submitting validates input, then opens a prefilled `mailto:`. To use a real service (Formspree, Resend, ...), replace the body of `submit` in `components/sections/Contact.tsx` with a `fetch()` call.

## Deploy to Vercel

Dashboard: import `Danish26-dev/my_portfolio` at [vercel.com/new](https://vercel.com/new), preset **Next.js**, defaults for everything else.

CLI:

```bash
npm i -g vercel
vercel login
vercel            # preview
vercel --prod     # production
```

Then set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) to the live URL and redeploy, so canonical links, the sitemap and Open Graph use it.

## Notes

- `/opengraph-image` is rendered on demand because `@vercel/og` fails to prerender on Windows paths with spaces.
- Hydration safety: use `hooks/useReducedMotion` instead of Framer's `useReducedMotion`; the server cannot know the preference.
