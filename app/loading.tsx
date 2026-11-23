export default function Loading() {
  return (
    <div className="grid min-h-[60svh] place-items-center" role="status" aria-label="Loading">
      <div className="h-px w-40 overflow-hidden bg-ink/10">
        <div className="h-px w-1/2 animate-[flow_1.2s_ease-in-out_infinite] bg-primary" />
      </div>
    </div>
  );
}
