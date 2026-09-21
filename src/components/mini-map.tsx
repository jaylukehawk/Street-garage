import { MapPin } from "lucide-react";

function hash(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function MiniMap({
  lat,
  lng,
  locationName,
}: {
  lat: number | null;
  lng: number | null;
  locationName: string;
}) {
  if (lat == null || lng == null) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-border bg-navy-3 text-sm text-muted">
        Location was off
      </div>
    );
  }

  const roads = Array.from({ length: 7 }, (_, i) => {
    const h = hash(lat * 10 + lng + i);
    return {
      x1: h * 100,
      y1: 0,
      x2: ((h * 1.7) % 1) * 100,
      y2: 100,
      width: i % 3 === 0 ? 2.2 : 1.1,
    };
  });
  const horiz = Array.from({ length: 5 }, (_, i) => {
    const h = hash(lng * 8 + lat + i + 3);
    return { y: 12 + h * 76, width: i === 2 ? 2.4 : 1 };
  });

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="relative h-40 bg-navy-3">
        <svg viewBox="0 0 100 64" className="h-full w-full" aria-hidden="true">
          <rect width="100" height="64" fill="#102848" />
          {horiz.map((r, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              x2="100"
              y1={r.y * 0.64}
              y2={r.y * 0.64}
              stroke="#2a4060"
              strokeWidth={r.width}
            />
          ))}
          {roads.map((r, i) => (
            <line
              key={`v-${i}`}
              x1={r.x1}
              y1={r.y1 * 0.64}
              x2={r.x2}
              y2={r.y2 * 0.64}
              stroke="#2a4060"
              strokeWidth={r.width}
            />
          ))}
          <circle cx="50" cy="32" r="9" fill="#2f6bff" fillOpacity="0.22" />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <MapPin className="size-7 text-primary" strokeWidth={2.4} />
        </div>
      </div>
      <div className="flex items-center justify-between bg-navy-2 px-3 py-2 text-xs text-muted">
        <span className="text-silver">{locationName}</span>
        <span className="tabular-nums">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </span>
      </div>
    </div>
  );
}
