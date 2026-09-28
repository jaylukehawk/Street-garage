import { Button } from "@/components/ui/button";
import { decalMeta, isRareDecal, type CollectibleDecalId } from "@/lib/street-decals";
import { decalSrc } from "@/lib/builds";

export function DecalDrop({
  id,
  onDone,
}: {
  id: CollectibleDecalId;
  onDone: () => void;
}) {
  const row = decalMeta(id);
  const rare = isRareDecal(id);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/80 px-5 pb-10 pt-16 sm:items-center">
      <div className={`w-full max-w-sm rounded-2xl border bg-navy-2 p-6 text-center text-[#f0d48a] ${rare ? "border-[#ffe7a0] shadow-[0_0_40px_rgba(240,212,138,0.25)]" : "border-[#f0d48a]"}`}>
        <p className="font-display text-xs tracking-[0.32em] text-silver">
          {rare ? "RARE FLAG UNLOCKED" : "DECAL UNLOCKED"}
        </p>
        <img
          src={decalSrc(id) ?? ""}
          alt={row?.label ?? id}
          className="mx-auto mt-5 size-36 object-contain"
        />
        <h2 className="mt-5 font-display text-3xl tracking-wide">{row?.label ?? id}</h2>
        <p className="mt-1 text-silver">
          {rare ? "Gold foil. Slap it on a finished build." : "Slap it on a finished build in the garage."}
        </p>
        <Button className="mt-6 w-full" size="lg" onClick={onDone}>
          Continue
        </Button>
      </div>
    </div>
  );
}
