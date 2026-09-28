import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { CogAmount } from "@/components/cog-amount";
import { RefillSheet } from "@/components/refill-sheet";
import { SCAN_RESET_COST } from "@/lib/shop";
import { useGarageStore } from "@/lib/store";
import { scanCap } from "@/lib/ranks";
import { formatDuration, msUntilMidnight } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: ScanHub });

function ScanHub() {
  const navigate = useNavigate();
  const sightings = useGarageStore((s) => s.sightings);
  const scansUsedToday = useGarageStore((s) => s.scansUsedToday);
  const garagePlus = useGarageStore((s) => s.garagePlus);
  const remaining = Math.max(0, scanCap(sightings, garagePlus) - scansUsedToday);
  const cap = scanCap(sightings, garagePlus);
  const cogs = useGarageStore((s) => s.cogs ?? 0);
  const [refillOpen, setRefillOpen] = useState(false);
  const [left, setLeft] = useState(msUntilMidnight());
  const locked = remaining <= 0;
  const ratio = remaining / cap;
  const circ = 2 * Math.PI * 54;
  const dash = circ * ratio;

  useEffect(() => {
    const id = window.setInterval(() => setLeft(msUntilMidnight()), 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="flex min-h-full flex-1 flex-col bg-navy px-5 pt-5">
      <header className="flex items-center justify-between gap-3">
        <Link
          to="/store"
          className="flex min-h-11 items-center gap-3 rounded-md border border-border bg-navy-2 px-4 font-display text-lg"
        >
          Store
          <CogAmount amount={cogs} className="text-[#f0d48a]" />
        </Link>
        <Link
          to="/settings"
          aria-label="Settings"
          className="flex size-11 items-center justify-center rounded-md border border-border bg-navy-2 text-silver"
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
              Reset scans · <CogAmount amount={SCAN_RESET_COST} className="text-navy" iconClassName="text-navy" />
            </button>
          </>
        ) : null}
      </div>
      <RefillSheet open={refillOpen} onOpenChange={setRefillOpen} />
    </main>
  );
}
