import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { CarPortrait } from "@/components/car-portrait";
import { MiniMap } from "@/components/mini-map";
import { useGarageStore } from "@/lib/store";
import { formatClock } from "@/lib/utils";

export const Route = createFileRoute("/history/$id")({ component: SightingDetail });

function SightingDetail() {
  const { id } = Route.useParams();
  const sighting = useGarageStore((s) => s.sightings.find((row) => row.id === id));

  if (!sighting) {
    return (
      <main className="px-5 pt-10">
        <p className="text-muted">Sighting not found.</p>
        <Link to="/history" className="mt-4 inline-block text-primary">
          Back to history
        </Link>
      </main>
    );
  }

  return (
    <main className="pb-6">
      <div className="relative h-56 bg-navy-3">
        <CarPortrait
          photo={sighting.photo}
          make={sighting.make}
          model={sighting.model}
          colour={sighting.colour}
          className="h-full"
        />
        <Link
          to="/history"
          className="absolute left-3 top-3 flex size-11 items-center justify-center rounded-md bg-navy/70 text-fg"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </Link>
      </div>
      <div className="px-5 pt-5">
        <h1 className="font-display text-4xl tracking-wide">
          {sighting.make} {sighting.model}
        </h1>
        <p className="mt-1 text-silver">
          {sighting.colour}
          {sighting.year ? ` · ${sighting.year}` : ""}
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border border-border bg-navy-2 p-3">
            <dt className="text-muted">Seen</dt>
            <dd className="mt-1 text-fg">{formatClock(new Date(sighting.seenAt))}</dd>
          </div>
          <div className="rounded-md border border-border bg-navy-2 p-3">
            <dt className="text-muted">Place</dt>
            <dd className="mt-1 text-fg">{sighting.locationName}</dd>
          </div>
          <div className="rounded-md border border-border bg-navy-2 p-3">
            <dt className="text-muted">Confidence</dt>
            <dd className="mt-1 text-fg">
              {sighting.confidence != null ? `${Math.round(sighting.confidence * 100)}%` : "Manual"}
            </dd>
          </div>
          <div className="rounded-md border border-border bg-navy-2 p-3">
            <dt className="text-muted">Colour</dt>
            <dd className="mt-1 text-fg">{sighting.colour}</dd>
          </div>
        </dl>
        <h2 className="mt-6 font-display text-xl tracking-wide">Where</h2>
        <div className="mt-3">
          <MiniMap lat={sighting.lat} lng={sighting.lng} locationName={sighting.locationName} />
        </div>
      </div>
    </main>
  );
}
