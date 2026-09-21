import { Link } from "@tanstack/react-router";
import { CarPortrait } from "./car-portrait";
import { BookmarkButton } from "./bookmark-button";
import { formatClock } from "@/lib/utils";
import { useGarageStore } from "@/lib/store";
import type { Sighting } from "@/lib/types";

export function SightingRow({ sighting }: { sighting: Sighting }) {
  const favouriteIds = useGarageStore((s) => s.favouriteIds);
  const toggleFavourite = useGarageStore((s) => s.toggleFavourite);
  const on = (favouriteIds ?? []).includes(sighting.id);

  return (
    <div className="flex min-h-20 items-center gap-2 rounded-lg border border-border bg-navy-2 p-2 pr-1">
      <Link
        to="/history/$id"
        params={{ id: sighting.id }}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <div className="size-16 overflow-hidden rounded-md bg-navy-3">
          <CarPortrait
            photo={sighting.photo}
            make={sighting.make}
            model={sighting.model}
            colour={sighting.colour}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg tracking-wide text-fg">
            {sighting.make} {sighting.model}
          </p>
          <p className="truncate text-sm text-muted">
            {formatClock(new Date(sighting.seenAt))} · {sighting.locationName}
          </p>
        </div>
      </Link>
      <BookmarkButton
        on={on}
        label={on ? "Remove favourite" : "Save favourite"}
        onClick={() => toggleFavourite(sighting.id)}
      />
    </div>
  );
}
