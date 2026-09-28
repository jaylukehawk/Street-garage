import { Cog } from "lucide-react";
import { cn } from "@/lib/utils";

export function CogAmount({
  amount,
  className,
  iconClassName,
}: {
  amount: number;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 tabular-nums", className)}>
      <span>{amount}</span>
      <Cog className={cn("size-[1em] text-[#f0d48a]", iconClassName)} aria-hidden />
      <span className="sr-only">Cogs</span>
    </span>
  );
}
