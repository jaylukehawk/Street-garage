import { cn } from "@/lib/utils";

export function RankPips({
  filled,
  locked = false,
  flashIndex = null,
}: {
  filled: number;
  locked?: boolean;
  flashIndex?: number | null;
}) {
  return (
    <div className="rank-pips" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "rank-pip",
            (i < filled || i === flashIndex) && !locked && "rank-pip-on",
            locked && "rank-pip-lock",
            i === flashIndex && !locked && "rank-pip-flash",
          )}
        />
      ))}
    </div>
  );
}

export function RankMeter({
  title,
  pips,
  xpInto,
  xpNeed,
  ratio,
  flashIndex = null,
  prestige,
  hideTitle = false,
}: {
  title: string;
  pips: number;
  xpInto: number;
  xpNeed: number;
  ratio: number;
  flashIndex?: number | null;
  prestige?: number;
  hideTitle?: boolean;
}) {
  return (
    <div>
      {hideTitle ? null : <p className="font-display text-xl tracking-wide">{title}</p>}
      <div className="mt-2">
        <RankPips filled={pips} flashIndex={flashIndex} />
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="font-display text-sm tabular-nums text-silver">
          {xpInto} / {xpNeed}
        </p>
        {prestige != null ? <p className="text-xs text-muted">Prestige {prestige}</p> : null}
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy-3">
        <div className="rank-xp-fill" style={{ width: `${Math.round(Math.min(1, Math.max(0, ratio)) * 100)}%` }} />
      </div>
    </div>
  );
}
