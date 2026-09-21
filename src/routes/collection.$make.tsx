import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useMemo } from "react";
import { CarPortrait } from "@/components/car-portrait";
import { MakePlate } from "@/components/medal";
import { medalCopy } from "@/lib/badges";
import { useGarageStore } from "@/lib/store";
import { formatDay, slugify } from "@/lib/utils";

export const Route = createFileRoute("/collection/$make")({ component: MakeModelsPage });

function MakeModelsPage() {
  const { make: slug } = Route.useParams();
  const sightings = useGarageStore((s) => s.sightings);
  const grouped = useMemo(() => {
    const forMake = sightings.filter((s) => slugify(s.make) === slug);
    const makeName = forMake[0]?.make ?? slug;
    const models = new Map<
      string,
      { model: string; count: number; lastSeen: string; photo: string; colour: string }
    >();
    for (const s of forMake) {
      const prev = models.get(s.model);
      if (!prev) {
        models.set(s.model, {
          model: s.model,
          count: 1,
          lastSeen: s.seenAt,
          photo: s.photo,
          colour: s.colour,
        });
      } else {
        prev.count += 1;
        if (s.seenAt > prev.lastSeen) {
          prev.lastSeen = s.seenAt;
          prev.photo = s.photo;
          prev.colour = s.colour;
        }
      }
    }
    return {
      makeName,
      count: forMake.length,
      models: [...models.values()].sort((a, b) => b.count - a.count),
    };
  }, [sightings, slug]);

  return (
    <main className="px-5 pt-6">
      <Link to="/collection" className="inline-flex min-h-11 items-center gap-1 text-sm text-silver">
        <ChevronLeft className="size-4" />
        Makes
      </Link>
      <div className="mt-3">
        <h1 className="font-display text-4xl tracking-wide">{grouped.makeName}</h1>
        <p className="mt-1 text-sm text-muted">{medalCopy(grouped.makeName, grouped.count)}</p>
        <div className="mt-4">
          <MakePlate make={grouped.makeName} count={grouped.count} />
        </div>
      </div>
      <ul className="mt-6 space-y-3">
        {grouped.models.map((row) => (
          <li key={row.model} className="flex items-center gap-3 rounded-lg border border-border bg-navy-2 p-2">
            <div className="size-16 overflow-hidden rounded-md bg-navy-3">
              <CarPortrait
                photo={row.photo}
                make={grouped.makeName}
                model={row.model}
                colour={row.colour}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl tracking-wide">{row.model}</p>
              <p className="text-sm text-muted">
                Seen {row.count}× · last {formatDay(new Date(row.lastSeen))}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
