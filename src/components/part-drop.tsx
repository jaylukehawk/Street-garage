import { Button } from "@/components/ui/button";
import { SLOT_LABEL, type GaragePart } from "@/lib/parts";

const TONE: Record<GaragePart["rank"], string> = {
  S: "border-[#f0d48a] text-[#f0d48a]",
  A: "border-[#e8a87c] text-[#e8a87c]",
  B: "border-[#b9a0ff] text-[#b9a0ff]",
  C: "border-[#8cb4ff] text-[#8cb4ff]",
  D: "border-[#8fd4a8] text-[#8fd4a8]",
  E: "border-border text-silver",
};

export function PartDrop({
  part,
  onDone,
}: {
  part: GaragePart;
  onDone: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/80 px-5 pb-10 pt-16 sm:items-center">
      <div
        className={`w-full max-w-sm rounded-2xl border bg-navy-2 p-6 text-center ${TONE[part.rank]}`}
      >
        <p className="font-display text-xs tracking-[0.32em] text-silver">PART UNLOCKED</p>
        <div className="mt-5 flex items-center justify-center gap-4">
          <img
            src={`/parts/${part.slot}.jpg`}
            alt={SLOT_LABEL[part.slot]}
            className="size-28 rounded-full object-cover"
          />
          <img
            src={`/ranks/${part.rank}.jpg`}
            alt={part.rank}
            className="h-28 w-20 rounded-sm object-cover"
          />
        </div>
        <h2 className="mt-5 font-display text-3xl tracking-wide">
          {part.rank} {SLOT_LABEL[part.slot]}
        </h2>
        <p className="mt-1 text-silver">
          {part.make} {part.model}
        </p>
        <Button className="mt-6 w-full" size="lg" onClick={onDone}>
          Continue
        </Button>
      </div>
    </div>
  );
}
