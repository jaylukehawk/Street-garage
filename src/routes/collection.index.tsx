import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { MakePlate } from "@/components/medal";
import { useGarageStore } from "@/lib/store";
import { slugify } from "@/lib/utils";

export const Route = createFileRoute("/collection/")({ component: CollectionPage });

function CollectionPage() {
  const sightings = useGarageStore((s) => s.sightings);
  const makes = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sightings) map.set(s.make, (map.get(s.make) ?? 0) + 1);
    return [...map.entries()]
      .map(([make, count]) => ({ make, count }))
      .sort((a, b) => b.count - a.count || a.make.localeCompare(b.make));
  }, [sightings]);

  return (
    <main className="px-5 pt-6">
      <p className="font-display text-xs tracking-[0.32em] text-silver">COLLECTION</p>
      <h1 className="mt-1 font-display text-4xl tracking-wide">Makes</h1>
      <p className="mt-1 text-sm text-muted">{makes.length} makes in the garage</p>
      <ul className="mt-5 space-y-3">
        {makes.map((row) => (
          <li key={row.make}>
            <Link
              to="/collection/$make"
              params={{ make: slugify(row.make) }}
              className="block min-h-12"
            >
              <MakePlate make={row.make} count={row.count} />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
