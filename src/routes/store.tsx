import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { CogAmount } from "@/components/cog-amount";
import { Button } from "@/components/ui/button";
import { COG_PACKS, SCAN_RESET_COST } from "@/lib/shop";
import { useGarageStore } from "@/lib/store";
import { scanCap } from "@/lib/ranks";

export const Route = createFileRoute("/store")({ component: StorePage });

function StorePage() {
  const cogs = useGarageStore((s) => s.cogs ?? 0);
  const buyCogPack = useGarageStore((s) => s.buyCogPack);
  const resetScans = useGarageStore((s) => s.resetScans);
  const remaining = useGarageStore((s) => s.remainingScans());
  const garagePlus = useGarageStore((s) => s.garagePlus);
  const sightings = useGarageStore((s) => s.sightings);
  const cap = scanCap(sightings, garagePlus);
  const empty = remaining <= 0;

  return (
    <main className="px-5 pt-6 pb-8">
      <p className="font-display text-xs tracking-[0.32em] text-silver">SHOP</p>
      <div className="mt-1 flex items-end justify-between gap-3">
        <h1 className="font-display text-4xl tracking-wide">Store</h1>
        <CogAmount amount={cogs} className="font-display text-2xl text-[#f0d48a]" />
      </div>
      <p className="mt-2 text-sm text-muted">
        Preview cogs for testing. No payment is taken. Play Billing comes in a later update.
      </p>

      <section className="mt-6 space-y-3">
        {COG_PACKS.map((pack) => (
          <article key={pack.id} className="rounded-xl border border-border bg-navy-2 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CogAmount amount={pack.amount} className="font-display text-3xl text-[#f0d48a]" />
                <p className="mt-1 text-sm text-silver">{pack.price}</p>
              </div>
              <Button
                variant="metal"
                onClick={() => {
                  buyCogPack(pack.id);
                  toast(`Added ${pack.amount}`);
                }}
              >
                Add preview
              </Button>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-xl border border-border bg-navy-2 p-4">
        <h2 className="font-display text-xl tracking-wide">Reset scans</h2>
        <p className="mt-2 text-sm text-silver">
          Out of daily scans? Reset the {cap} scan counter for{" "}
          <CogAmount amount={SCAN_RESET_COST} className="align-middle text-[#f0d48a]" />.
        </p>
        <p className="mt-1 text-sm text-muted">{remaining} / {cap} left today</p>
        <Button
          className="mt-4 w-full"
          size="lg"
          variant="metal"
          disabled={!empty || cogs < SCAN_RESET_COST}
          onClick={() => {
            const result = resetScans();
            if (!result.ok) toast("Not enough");
          }}
        >
          {empty ? (
            <>
              Reset scans · <CogAmount amount={SCAN_RESET_COST} />
            </>
          ) : (
            "Scans still remaining"
          )}
        </Button>
        {empty && cogs < SCAN_RESET_COST ? (
          <p className="mt-2 text-sm text-[#f0d48a]">Buy a pack above first.</p>
        ) : null}
      </section>

      <Link
        to="/"
        className="mt-6 flex min-h-12 items-center justify-center rounded-md border border-border font-display text-lg"
      >
        Back to Scan
      </Link>
    </main>
  );
}
