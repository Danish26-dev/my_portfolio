import Link from "next/link";
import { PhoenixMark } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden px-6 text-center">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative">
        <PhoenixMark size={72} className="mx-auto opacity-80" />
        <p className="eyebrow mt-8">Error 404</p>
        <h1 className="display mt-4 text-[clamp(3rem,10vw,7rem)]">Lost in the deep.</h1>
        <p className="mx-auto mt-5 max-w-md text-muted">
          This page drifted out of reach. The surface is still where you left it.
        </p>
        <Link href="/" className="btn-primary mt-9">
          Back to the surface
        </Link>
      </div>
    </section>
  );
}
