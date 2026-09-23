import { cn } from "@/lib/utils";
import { tierForCount, type TierId } from "@/lib/badges";
import type { SpecialId } from "@/lib/specials";

const RING: Record<TierId | "locked", string> = {
  locked: "border-[#7a8492]",
  bronze: "border-[#c4a06a]",
  silver: "border-[#e8eef5]",
  gold: "border-[#f0d48a]",
  platinum: "border-white",
  diamond: "border-[#d5f0ff]",
};

export function ClassPlate({
  id,
  label,
  count,
  className,
}: {
  id: SpecialId;
  label: string;
  count: number;
  className?: string;
}) {
  const tier = tierForCount(count);
  const locked = !tier;
  return (
    <div className={cn("flex flex-col items-center gap-1 px-2 py-3", className)}>
      <div
        className={cn(
          "size-36 overflow-hidden rounded-full border-4 bg-navy",
          RING[tier?.id ?? "locked"],
          locked && "grayscale opacity-70",
        )}
      >
        <img src={`/badges/${id}.jpg`} alt={label} className="size-full object-cover" />
      </div>
      <p className="font-display text-lg tabular-nums">{count}</p>
    </div>
  );
}