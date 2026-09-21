import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookmarkButton({
  on,
  onClick,
  label,
  className,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-md text-silver",
        className,
      )}
    >
      <Bookmark
        className="size-6"
        strokeWidth={on ? 2.2 : 1.8}
        fill={on ? "currentColor" : "none"}
      />
    </button>
  );
}
