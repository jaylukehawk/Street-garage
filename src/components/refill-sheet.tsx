import { Drawer } from "vaul";
import { Button } from "./ui/button";
import { REFILL_PRICE } from "@/lib/types";
import { scanCap } from "@/lib/ranks";
import { formatDuration, msUntilMidnight } from "@/lib/utils";
import { useGarageStore } from "@/lib/store";
import { useEffect, useState } from "react";

export function RefillSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const refill = useGarageStore((s) => s.refillScans);
  const cap = useGarageStore((s) => scanCap(s.sightings));
  const [left, setLeft] = useState(msUntilMidnight());

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setLeft(msUntilMidnight()), 1000);
    return () => window.clearInterval(id);
  }, [open]);

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-navy/70" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-2xl border border-border bg-navy-2 p-6 pb-10 outline-none">
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />
          <Drawer.Title className="font-display text-3xl tracking-wide text-fg">
            Refill {cap} scans
          </Drawer.Title>
          <p className="mt-2 text-silver">
            {REFILL_PRICE} · prototype checkout. No card is taken.
          </p>
          <p className="mt-4 text-sm text-muted">
            Next free reset at midnight · in {formatDuration(left)}
          </p>
          <Button
            className="mt-6 w-full"
            size="lg"
            variant="metal"
            onClick={() => {
              refill();
              onOpenChange(false);
            }}
          >
            Confirm
          </Button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
