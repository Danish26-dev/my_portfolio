/** CSS-only backdrop: soft colour fields and a faint grid. Always rendered under the canvas. */
export function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 56% at 74% 46%, rgba(21,70,217,0.16), transparent 70%), radial-gradient(30% 36% at 88% 14%, rgba(249,179,24,0.22), transparent 70%), radial-gradient(40% 40% at 6% 100%, rgba(249,179,24,0.12), transparent 70%)",
        }}
      />
      <div className="bg-grid absolute inset-0 opacity-70" />
    </div>
  );
}

/** Flat SVG stand-in for the 3D object. Shown when WebGL is unavailable or the scene fails. */
export function StaticArt() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute right-[-8%] top-[14%] h-auto w-[min(70vw,640px)] opacity-80 max-md:right-[-24%] max-md:top-[4%] max-md:w-[320px] max-md:opacity-50"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sa-core" cx="35%" cy="30%" r="75%">
          <stop stopColor="#5b84ff" />
          <stop offset="1" stopColor="#1546D9" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="200" rx="170" ry="62" transform="rotate(-24 200 200)" fill="none" stroke="#F9B318" strokeWidth="3" />
      <ellipse cx="200" cy="200" rx="150" ry="110" transform="rotate(32 200 200)" fill="none" stroke="#1E293B" strokeWidth="1.5" opacity="0.7" />
      <circle cx="200" cy="200" r="86" fill="url(#sa-core)" />
      <circle cx="318" cy="132" r="9" fill="#F9B318" />
      <circle cx="96" cy="262" r="7" fill="#1E293B" />
    </svg>
  );
}
