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

const X = (x: number) => (x * 36 + 200).toFixed(1);
const Y = (y: number) => (214 - y * 36).toFixed(1);
const toPath = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${X(x)} ${Y(y)}`).join("") + "Z";

/**
 * Flat SVG phoenix built from the same feather specs as the 3D model: monochrome cobalt,
 * layered feathers, one continuous head-and-beak form, no facial details.
 * Shown while WebGL loads, when it is unavailable, or if the scene fails.
 */
export function PhoenixFallback({ className }: { className?: string }) {
  const specs = buildFeatherSpecs();
  const back = specs.filter((s) => s.pass === 0);
  const front = specs.filter((s) => s.pass === 1);
  const body = Array.from({ length: 90 }, (_, i) => {
    const t = i / 89;
    const [cx, cy] = spinePoint(t);
    return { cx, cy, r: bodyRadius(t) };
  });
  const shade = (tone: number) => (tone < 0.35 ? "#0B2F9E" : tone < 0.65 ? "#1546D9" : "#5B82F0");
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <g strokeWidth="0.5" stroke="#0B2F9E" strokeOpacity="0.45" fillOpacity="0.9">
        {back.map((s, i) => (
          <path key={i} d={toPath(featherOutline(s))} fill={shade(s.tone)} />
        ))}
      </g>
      <g fill="#1546D9" fillOpacity="0.95">
        {body.map((c, i) => (
          <circle key={i} cx={X(c.cx)} cy={Y(c.cy)} r={(c.r * 36).toFixed(1)} />
        ))}
      </g>
      <g strokeWidth="0.5" stroke="#0B2F9E" strokeOpacity="0.45" fillOpacity="0.92">
        {front.map((s, i) => (
          <path key={i} d={toPath(featherOutline(s))} fill={shade(s.tone)} />
        ))}
      </g>
    </svg>
  );
}