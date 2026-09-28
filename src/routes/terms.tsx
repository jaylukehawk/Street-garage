import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({ component: TermsPage });

function TermsPage() {
  return (
    <main className="px-5 pt-6 pb-10">
      <p className="font-display text-xs tracking-[0.32em] text-silver">LEGAL</p>
      <h1 className="mt-1 font-display text-4xl tracking-wide">Terms</h1>
      <p className="mt-2 text-sm text-muted">Last updated 28 September 2026</p>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-silver">
        <p>
          Street Garage is a hobby game. You photograph cars in public, collect
          parts and build a garage. Use it for fun, not for tracking people or
          vehicles.
        </p>
        <p>
          Do not photograph in places photography is banned. Do not try to read
          or store number plates. Do not use the app to identify owners.
        </p>
        <p>
          Progress is saved on your device. Clearing site data or uninstalling
          can wipe a local garage. Preview cogs and tester codes are not real
          purchases until Google Play Billing is switched on.
        </p>
        <p>
          The identify result can be wrong. Treat make and model as a game guess,
          not an official record.
        </p>
        <p>
          Hawkz Gaming may update the game, these terms, or take a feature down.
          The app is provided as-is.
        </p>
      </div>

      <Link
        to="/settings"
        className="mt-8 flex min-h-12 items-center justify-center rounded-md border border-border font-display text-lg"
      >
        Back to Settings
      </Link>
    </main>
  );
}
