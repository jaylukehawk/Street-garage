import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MakePlate } from "@/components/medal";
import { RankLockedSheet } from "@/components/rank-locked-sheet";
import { RankPlate } from "@/components/rank-plate";
import { tierForCount } from "@/lib/badges";
import { specialCounts } from "@/lib/specials";
import {
  RANKS,
  activePerkLines,
  nextPerkNote,
  pipsForRank,
  rankProgress,
  xpFromSightings,
  type Rank,
} from "@/lib/ranks";
import { useGarageStore } from "@/lib/store";
import { cn, slugify } from "@/lib/utils";

export const Route = createFileRoute("/trophies")({ component: TrophiesPage });

function TrophiesPage() {
  const sightings = useGarageStore((s) => s.sightings);
  const xp = xpFromSightings(sightings);
  const progress = rankProgress(xp);
  const [lockedRank, setLockedRank] = useState<Rank | null>(null);
  const rows = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sightings) map.set(s.make, (map.get(s.make) ?? 0) + 1);
    return [...map.entries()]
      .map(([make, count]) => ({ make, count }))
      .sort((a, b) => b.count - a.count || a.make.localeCompare(b.make));
  }, [sightings]);
  const unlocked = rows.filter((row) => tierForCount(row.count)).length;
  const classes = useMemo(() => specialCounts(sightings), [sightings]);
  return (
    <main className="px-5 pt-6 pb-4">
      <p className="font-display text-xs tracking-[0.32em] text-silver">SERVICE</p>
      <h1 className="mt-1 font-display text-4xl tracking-wide">Trophies</h1>

      <section className="mt-6">
        <h2 className="font-display text-xl tracking-wide">Service record</h2>
        <p className="mt-1 font-display text-sm tabular-nums text-silver">
          {progress.title} · {progress.xpIntoLevel.toLocaleString()} / {progress.xpPerLevel.toLocaleString()}
          {progress.maxed ? ` · Prestige ${progress.prestige}` : ""}
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-3">
          <div className="h-full bg-silver" style={{ width: `${Math.round(progress.ratio * 100)}%` }} />
        </div>
        <div className="mt-4 rounded-xl border border-border bg-navy-2 p-4">
          <h3 className="font-display text-lg tracking-wide">Prestige perks</h3>
          <ul className="mt-2 space-y-1 text-sm text-silver">
            {activePerkLines(progress).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">Next: {nextPerkNote(progress)}</p>
        </div>
        <div className="cabinet mt-4">
          <div className="cabinet-inner">
            <div className="cabinet-header">
              <p>RANKS</p>
            </div>
            <div className="plate-rack">
              {RANKS.map((rank) => {
                const state = pipsForRank(xp, rank);
                const plate = (
                  <RankPlate
                    rank={rank}
                    locked={state.locked}
                    current={state.current}
                    roman={state.current ? progress.roman : state.filled === 5 ? "V" : state.locked ? undefined : "I"}
                    pips={state.filled}
                  />
                );
                if (!state.locked) {
                  return (
                    <div key={rank.id} className={cn("plate-slot", state.current && "rank-current-slot")}>
                      {plate}
                    </div>
                  );
                }
                return (
                  <button
                    key={rank.id}
                    type="button"
                    className="plate-slot w-full text-left"
                    onClick={() => setLockedRank(rank)}
                    aria-label={`${rank.label} locked, show XP needed`}
                  >
                    {plate}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl tracking-wide">Make plates</h2>
        <p className="mt-1 text-sm text-muted">
          {unlocked} unlocked · Bronze at 10
        </p>
        <div className="cabinet mt-4">
          <div className="cabinet-inner">
            <div className="cabinet-header">
              <p>STREET GARAGE</p>
            </div>
            {rows.length === 0 ? (
              <p className="px-6 py-16 text-center text-sm text-muted">
                Photograph a car to stamp the first plate.
              </p>
            ) : (
              <div className="plate-rack">
                {rows.map((row) => (
                  <Link
                    key={row.make}
                    to="/collection/$make"
                    params={{ make: slugify(row.make) }}
                    className="plate-slot"
                  >
                    <MakePlate make={row.make} count={row.count} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="mt-8">
        <h2 className="font-display text-xl tracking-wide">Class badges</h2>
        <p className="mt-1 text-sm text-muted">
          Same metal as makes. Bronze 10 · Silver 100 · Gold 500 · Platinum 2,500 · Diamond 10,000.
        </p>
        <div className="cabinet mt-4">
          <div className="cabinet-inner">
            <div className="cabinet-header">
              <p>SPECIALS</p>
            </div>
            <div className="plate-rack">
              {classes.map((row) => (
                <div key={row.id} className="plate-slot">
                  <MakePlate make={row.label} count={row.count} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <RankLockedSheet
        rank={lockedRank}
        xp={xp}
        open={Boolean(lockedRank)}
        onOpenChange={(open) => {
          if (!open) setLockedRank(null);
        }}
      />
    </main>
  );
}
