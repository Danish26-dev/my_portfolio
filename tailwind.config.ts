import type { Config } from "tailwindcss";

/**
 * LOCKED PALETTE
 *   paper   #EDECE6  warm beige, page background
 *   primary #1546D9  cobalt blue: headings, interaction, emphasis
 *   accent  #F9B318  sun yellow: highlights and small details
 *   ink     #111827  supporting dark, typography
 *   muted   #586274  secondary text
 *   white   #FFFFFF  translucent surfaces
 * Derived shades (tints/shades of the above, not new hues): paper2, primary.deep,
 * primary.soft, accent.ink (AA-contrast yellow for small text).
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
        primary: { DEFAULT: "#1546D9", deep: "#0F34A8", soft: "#5B82F0" },
        accent: { DEFAULT: "#F9B318", ink: "#8A5A00" },
        ink: "#111827",
        muted: "#586274",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
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
