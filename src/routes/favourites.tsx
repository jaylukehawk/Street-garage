import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SightingRow } from "@/components/sighting-row";
import { useGarageStore } from "@/lib/store";

export const Route = createFileRoute("/favourites")({ component: FavouritesPage });

function FavouritesPage() {
  const sightings = useGarageStore((s) => s.sightings);
  const favouriteIds = useGarageStore((s) => s.favouriteIds);
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("All");
  const favourites = useMemo(() => {
    const set = new Set(favouriteIds ?? []);
    return sightings.filter((s) => set.has(s.id));
  }, [sightings, favouriteIds]);
  const makes = useMemo(
    () => ["All", ...[...new Set(favourites.map((s) => s.make))].sort()],
    [favourites],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return favourites.filter((s) => {
      if (make !== "All" && s.make !== make) return false;
      if (q && !s.model.toLowerCase().includes(q) && !s.make.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [favourites, make, query]);

  return (
    <main className="px-5 pt-6">
      <p className="font-display text-xs tracking-[0.32em] text-silver">FAVOURITES</p>
      <h1 className="mt-1 font-display text-4xl tracking-wide">Favourite Finds</h1>
      <div className="mt-4 flex gap-2">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by model"
            aria-label="Search by model"
            className="h-12 w-full rounded-md border border-border bg-navy-2 pl-10 pr-3 text-fg placeholder:text-muted"
          />
        </label>
        <select
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="h-12 max-w-[42%] rounded-md border border-border bg-navy-2 px-3 text-fg"
          aria-label="Filter by make"
        >
          {makes.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      {favourites.length === 0 ? (
        <p className="mt-16 px-4 text-center text-lg text-muted">
          No favourite finds yet. Bookmark a car after you scan it.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {filtered.map((s) => (
            <li key={s.id}>
              <SightingRow sighting={s} />
            </li>
          ))}
        </ul>
      )}
      {favourites.length > 0 && filtered.length === 0 ? (
        <p className="mt-10 text-center text-muted">No favourites match.</p>
      ) : null}
    </main>
  );
}
