import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefillSheet } from "@/components/refill-sheet";
import { activePerkLines, rankProgress, scanCap, xpFromSightings } from "@/lib/ranks";
import { REFILL_PRICE } from "@/lib/types";
import { useGarageStore } from "@/lib/store";
import { formatClock, formatDuration, msUntilMidnight } from "@/lib/utils";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const scansUsedToday = useGarageStore((s) => s.scansUsedToday);
  const sightings = useGarageStore((s) => s.sightings);
  const cap = scanCap(sightings);
  const remaining = Math.max(0, cap - scansUsedToday);
  const purchases = useGarageStore((s) => s.demoPurchases);
  const lastRefill = purchases[0] ?? null;
  const [left, setLeft] = useState(msUntilMidnight());
  const [refillOpen, setRefillOpen] = useState(false);
  const ratio = remaining / cap;
  const progress = rankProgress(xpFromSightings(sightings));
  const perks = activePerkLines(progress);

  useEffect(() => {
    const id = window.setInterval(() => setLeft(msUntilMidnight()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="px-5 pt-6 pb-4">
      <p className="font-display text-xs tracking-[0.32em] text-silver">GARAGE</p>
      <h1 className="mt-1 font-display text-4xl tracking-wide">Settings</h1>

      <section className="mt-6 rounded-xl border border-border bg-navy-2 p-4">
        <h2 className="font-display text-xl tracking-wide">Daily limit</h2>
        <p className="mt-2 font-display text-3xl tabular-nums tracking-wide">
          {remaining}{" "}
          <span className="text-lg text-silver">/ {cap} remaining</span>
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy-3">
          <div className="h-full bg-primary" style={{ width: `${Math.round(ratio * 100)}%` }} />
        </div>
        <ul className="mt-3 space-y-1 text-sm text-silver">
          {perks.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          Next free reset at midnight · {formatDuration(left)}
        </p>
        {remaining <= 0 ? (
          <button
            type="button"
            onClick={() => setRefillOpen(true)}
            className="mt-4 min-h-12 w-full rounded-md bg-silver font-display text-lg tracking-wide text-navy"
          >
            Refill {cap} scans — {REFILL_PRICE}
          </button>
        ) : null}
      </section>

      <section className="mt-4 rounded-xl border border-border bg-navy-2 p-4">
        <h2 className="font-display text-xl tracking-wide">Last refill</h2>
        {lastRefill ? (
          <>
            <p className="mt-2 text-fg">{formatClock(new Date(lastRefill.at))}</p>
            <p className="mt-1 text-sm text-silver">{lastRefill.note}</p>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted">
            No refill yet. You get {cap} free scans each calendar day.
          </p>
        )}
      </section>

      <section className="mt-4 rounded-xl border border-border bg-navy-2 p-4">
        <h2 className="font-display text-xl tracking-wide">Privacy</h2>
        <p className="mt-2 text-sm leading-relaxed text-silver">
          We do not store plates or owner details. Number plates are covered on
          every saved sighting and are never transcribed. Owners are never looked
          up. Map location is saved only if you allow GPS.
        </p>
      </section>

      <RefillSheet open={refillOpen} onOpenChange={setRefillOpen} />
    </main>
  );
}
