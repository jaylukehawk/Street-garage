import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { RankPlate } from "@/components/rank-plate";
import { RefillSheet } from "@/components/refill-sheet";
import { REFILL_PRICE } from "@/lib/types";
import { useGarageStore } from "@/lib/store";
import { rankProgress, scanCap, xpFromSightings } from "@/lib/ranks";
import { formatDuration, msUntilMidnight } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: ScanHub });

function ScanHub() {
  const navigate = useNavigate();
  const sightings = useGarageStore((s) => s.sightings);
  const scansUsedToday = useGarageStore((s) => s.scansUsedToday);
  const garagePlus = useGarageStore((s) => s.garagePlus);
  const remaining = Math.max(0, scanCap(sightings, garagePlus) - scansUsedToday);
  const cap = scanCap(sightings, garagePlus);
  const purchases = useGarageStore((s) => s.demoPurchases);
  const [refillOpen, setRefillOpen] = useState(false);
  const [left, setLeft] = useState(msUntilMidnight());
  const locked = remaining <= 0;
  const ratio = remaining / cap;
  const circ = 2 * Math.PI * 54;
  const dash = circ * ratio;
  const rank = rankProgress(xpFromSightings(sightings));

  useEffect(() => {
    const id = window.setInterval(() => setLeft(msUntilMidnight()), 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="flex min-h-full flex-1 flex-col bg-navy px-5 pt-5">
      <header className="relative">
        <Link to="/trophies" className="block pr-14">
          <RankPlate rank={rank.rank} current roman={rank.roman} pips={rank.pips} />
        </Link>
        <Link
          to="/settings"
          aria-label="Settings"
          className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-md border border-border bg-navy-2 text-silver"
        >
          <Settings className="size-5" />
        </Link>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center pb-4">
        <button
          type="button"
          aria-label={locked ? "Scans empty" : "Open camera"}
          onClick={() => (locked ? setRefillOpen(true) : navigate({ to: "/scan" }))}
          className="relative size-64"
        >
          <svg viewBox="0 0 140 140" className="absolute inset-0 size-full -rotate-90">
            <circle cx="70" cy="70" r="54" fill="none" stroke="var(--color-navy-3)" strokeWidth="6" />
            <circle
              cx="70"
              cy="70"
              r="54"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
            />
          </svg>
          <span
            className={`absolute inset-[18px] flex items-center justify-center rounded-full metal-ring p-[7px] ${locked ? "" : "scan-pulse"}`}
          >
            <span className="flex size-full items-center justify-center rounded-full bg-navy text-fg">
              {locked ? (
                <Lock className="size-12 text-silver" />
              ) : (
                <span className="font-display text-4xl tracking-[0.18em]">SCAN</span>
              )}
            </span>
          </span>
        </button>
        <p className="mt-6 font-display text-3xl tabular-nums tracking-wide text-silver">
          {remaining} / {cap}
        </p>
        {locked ? (
          <>
            <p className="mt-2 text-sm text-muted">Next free reset at midnight · {formatDuration(left)}</p>
            <button
              type="button"
              onClick={() => setRefillOpen(true)}
              className="mt-4 min-h-12 rounded-md bg-silver px-5 font-display text-lg tracking-wide text-navy"
            >
              Refill {cap} scans — {REFILL_PRICE}
            </button>
          </>
        ) : null}
        {purchases[0] ? (
          <p className="mt-2 text-xs text-muted">{purchases[0].note} · restored scans</p>
        ) : null}
      </div>
      <RefillSheet open={refillOpen} onOpenChange={setRefillOpen} />
    </main>
  );
}
