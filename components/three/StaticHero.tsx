import { bodyRadius, buildFeatherSpecs, featherOutline, spinePoint } from "./phoenix/model";

/** CSS-only backdrop: sunlit colour fields and a faint grid. Always rendered under the canvas. */
export function HeroBackdrop({ sun = "78% 34%" }: { sun?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(34% 44% at ${sun}, rgba(249,179,24,0.26), transparent 70%), radial-gradient(46% 56% at 72% 52%, rgba(21,70,217,0.12), transparent 72%), radial-gradient(40% 40% at 4% 100%, rgba(249,179,24,0.10), transparent 70%)`,
        }}
      />
      <div className="bg-grid absolute inset-0 opacity-70" />
    </div>
  );
}

const toPath = (pts: [number, number][]) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"}${(x * 40 + 200).toFixed(1)} ${(190 - y * 40).toFixed(1)}`).join("") + "Z";

/**
 * Flat SVG phoenix built from the same feather specs as the 3D model.
 * Shown while WebGL loads, when it is unavailable, or if the scene fails.
 */
export function PhoenixFallback({ className }: { className?: string }) {
  const specs = buildFeatherSpecs();
  const body: [number, number][] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const [cx, cy] = spinePoint(t);
    body.push([cx + bodyRadius(t), cy]);
  }
  for (let i = 40; i >= 0; i--) {
    const t = i / 40;
    const [cx, cy] = spinePoint(t);
    body.push([cx - bodyRadius(t), cy]);
  }
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="pf-wing" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#1546D9" stopOpacity="0.55" />
          <stop offset="1" stopColor="#1546D9" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {specs.map((s, i) => (
        <path key={i} d={toPath(featherOutline(s))} fill="url(#pf-wing)" stroke="#1546D9" strokeOpacity="0.25" strokeWidth="0.5" />
      ))}
      <path d={toPath(body)} fill="#1546D9" fillOpacity="0.55" />
      <path d="M187 81 Q164 84 159 103 Q171 96 187 92Z" fill="#F9B318" />
      <circle cx="191" cy="85" r="2.2" fill="#F9B318" />
    </svg>
  );
}
