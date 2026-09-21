import { Drawer } from "vaul";
import { RankPlate } from "./rank-plate";
import { Button } from "./ui/button";
import type { Rank } from "@/lib/ranks";
import { xpNeededForRank, perkUnlockNote } from "@/lib/ranks";

export function RankLockedSheet({
  rank,
  xp,
  open,
  onOpenChange,
}: {
  rank: Rank | null;
  xp: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const needed = rank ? xpNeededForRank(xp, rank) : 0;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-navy/70" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-2xl border border-border bg-navy-2 p-6 pb-10 outline-none">
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />
          <Drawer.Title className="font-display text-3xl tracking-wide text-fg">Locked</Drawer.Title>
          {rank ? (
            <>
              <div className="mt-4">
                <RankPlate rank={rank} locked pips={0} />
              </div>
              <p className="mt-4 font-display text-2xl tabular-nums tracking-wide text-silver">
                {needed.toLocaleString()} XP to {rank.label} I
              </p>
              <p className="mt-2 font-display text-lg tracking-wide text-primary">{perkUnlockNote(rank)}</p>
              <p className="mt-2 text-sm text-muted">
                Logging cars earns XP. This plate stays locked until you reach it.
              </p>
            </>
          ) : null}
          <Button className="mt-6 w-full" size="lg" variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
