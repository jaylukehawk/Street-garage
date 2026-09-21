import { useEffect, useState } from "react";
import { RankMeter } from "./rank-pips";
import { RankPlate } from "./rank-plate";
import { cn } from "@/lib/utils";
import { perkUnlockNote } from "@/lib/ranks";
import { useGarageStore } from "@/lib/store";

type Stage = "bar" | "flash" | "done";

export function RankUp() {
  const event = useGarageStore((s) => s.pendingPipFill);
  const clear = useGarageStore((s) => s.clearPromotion);
  const [stage, setStage] = useState<Stage>("bar");
  const [barRatio, setBarRatio] = useState(0);
  const rankChange = Boolean(event && event.from.rank.id !== event.to.rank.id);

  useEffect(() => {
    if (!event) {
      setStage("bar");
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const promo = event.from.rank.id !== event.to.rank.id;
    if (reduce) {
      setStage("done");
      setBarRatio(event.to.ratio);
      const id = window.setTimeout(() => clear(), promo ? 2400 : 1200);
      return () => window.clearTimeout(id);
    }
    setStage("bar");
    setBarRatio(event.from.ratio);
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setBarRatio(1));
    });
    const flashAt = window.setTimeout(() => setStage("flash"), promo ? 380 : 300);
    const doneAt = window.setTimeout(
      () => {
        setStage("done");
        setBarRatio(event.to.ratio);
      },
      promo ? 1200 : 980,
    );
    const hideAt = window.setTimeout(() => clear(), promo ? 4400 : 1650);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(flashAt);
      window.clearTimeout(doneAt);
      window.clearTimeout(hideAt);
    };
  }, [event, clear]);

  if (!event) return null;

  const fillIndex =
    event.from.rank.id === event.to.rank.id && event.to.pips > event.from.pips
      ? event.from.pips
      : 4;
  const flashing = stage === "flash";
  const reveal = stage === "done" && rankChange;
  const pips =
    stage === "done"
      ? event.to.pips
      : flashing
        ? Math.min(5, rankChange ? 5 : event.from.pips + 1)
        : event.from.pips;
  const title = stage === "done" ? event.to.title : event.from.title;
  const xpInto =
    stage === "done"
      ? event.to.xpIntoLevel
      : stage === "flash"
        ? event.from.xpPerLevel
        : event.from.xpIntoLevel;
  const xpNeed = stage === "done" ? event.to.xpPerLevel : event.from.xpPerLevel;
  const shownRatio =
    stage === "done" ? event.to.ratio : stage === "bar" ? Math.max(barRatio, event.from.ratio) : 1;

  return (
    <button
      type="button"
      className={cn("rank-up", rankChange ? "rank-up-promo" : "rank-up-pip")}
      onClick={clear}
      aria-live="assertive"
    >
      {reveal ? <span className="rank-up-promo-flash" aria-hidden="true" /> : null}
      {reveal ? <span className="rank-up-burst" aria-hidden="true" /> : null}

      {reveal ? (
        <p className="relative z-10 font-display text-sm tracking-[0.36em] text-silver">PROMOTED TO</p>
      ) : (
        <h2 className="relative z-10 mt-2 font-display text-2xl tracking-wide text-fg">{title}</h2>
      )}

      {reveal ? (
        <div className="rank-plate-reveal relative z-10 mt-6 w-full max-w-sm">
          <RankPlate rank={event.to.rank} current roman="I" pips={1} />
          <p className="mt-4 font-display text-lg tracking-wide text-silver">{perkUnlockNote(event.to.rank)}</p>
        </div>
      ) : (
        <div className="relative z-10 mt-6 w-full max-w-sm rounded-lg border border-border bg-navy-2 px-4 py-3 text-left">
          <RankMeter
            title={title}
            pips={pips}
            xpInto={xpInto}
            xpNeed={xpNeed}
            ratio={shownRatio}
            flashIndex={flashing ? fillIndex : null}
            hideTitle
          />
        </div>
      )}
    </button>
  );
}
