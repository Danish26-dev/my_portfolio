"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="grid min-h-[100svh] place-items-center px-6 text-center">
      <div>
        <p className="eyebrow">Something went wrong</p>
        <h1 className="display mt-4 text-[clamp(2.4rem,8vw,5rem)]">Turbulence.</h1>
        <p className="mx-auto mt-5 max-w-md text-muted/75">An unexpected error interrupted this page.</p>
        <button type="button" onClick={reset} className="btn-primary mt-8">
          Try again
        </button>
      </div>
    </section>
  );
}
