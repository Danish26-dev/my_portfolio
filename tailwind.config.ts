import type { Config } from "tailwindcss";

/**
 * Palette (light theme)
 *   paper   #EDECE6  page background        (--color-bg)
 *   primary #1546D9  brand blue             (--color-primary)
 *   accent  #F9B318  amber highlight        (--color-accent)
 *   muted   #1E293B  dark neutral for copy  (--color-text-muted)
 * Derived (not in the brief): paper2 / ink / primary.deep / accent.ink are
 * tints and shades of the above, used for surfaces, headings and AA-contrast text.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#EDECE6",
        paper2: "#E2E1D8",
        primary: { DEFAULT: "#1546D9", deep: "#0F34A8" },
        accent: { DEFAULT: "#F9B318", ink: "#8A5A00" },
        ink: "#0F172A",
        muted: "#1E293B",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.045em" },
      maxWidth: { page: "1280px" },
      boxShadow: {
        glow: "0 30px 80px -30px rgba(21,70,217,0.45)",
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-8px,0)" },
        },
        flow: {
          to: { strokeDashoffset: "-24" },
        },
      },
      animation: {
        drift: "drift 6s ease-in-out infinite",
        flow: "flow 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
