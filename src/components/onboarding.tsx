import { Button } from "./ui/button";
import { useGarageStore } from "@/lib/store";

export function Onboarding() {
  const complete = useGarageStore((s) => s.completeOnboarding);

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-navy/92 sm:items-center sm:justify-center">
      <div className="w-full max-w-lg rounded-t-2xl border border-border bg-navy-2 px-6 pb-10 pt-8 sm:rounded-2xl">
        <p className="font-display text-sm tracking-[0.28em] text-silver">STREET GARAGE</p>
        <h1 className="mt-3 font-display text-4xl leading-none tracking-wide text-fg">
          Photograph cars you see.
        </h1>
        <ul className="mt-6 space-y-3 text-lg text-silver">
          <li>Build your garage.</li>
          <li>Earn metal for each make.</li>
          <li>30 scans a day.</li>
        </ul>
        <Button className="mt-8 w-full" size="lg" onClick={complete}>
          Start scanning
        </Button>
      </div>
    </div>
  );
}
