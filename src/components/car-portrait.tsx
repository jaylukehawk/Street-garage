import { useState } from "react";
import { bodyFor, COLOUR_SWATCH, type BodyStyle } from "@/lib/catalog";
import { cn } from "@/lib/utils";

function CarShape({ body, paint }: { body: BodyStyle; paint: string }) {
  const glass = "#9eb4c9";
  const dark = "#141820";
  if (body === "pickup") {
    return (
      <>
        <path d="M8 46h18l8-14h22l10 14h26v18H8z" fill={paint} />
        <path d="M36 34h16l6 12H32z" fill={glass} />
        <circle cx="26" cy="64" r="7" fill={dark} />
        <circle cx="74" cy="64" r="7" fill={dark} />
      </>
    );
  }
  if (body === "suv") {
    return (
      <>
        <path d="M10 50h8l10-16h44l16 16h4v16H10z" fill={paint} />
        <path d="M30 36h38l10 14H22z" fill={glass} />
        <circle cx="28" cy="66" r="7" fill={dark} />
        <circle cx="74" cy="66" r="7" fill={dark} />
      </>
    );
  }
  if (body === "coupe") {
    return (
      <>
        <path d="M8 52h14l16-16h28l24 16v14H8z" fill={paint} />
        <path d="M36 38h24l16 14H24z" fill={glass} />
        <circle cx="28" cy="66" r="7" fill={dark} />
        <circle cx="74" cy="66" r="7" fill={dark} />
      </>
    );
  }
  if (body === "mini") {
    return (
      <>
        <path d="M18 48c0-12 12-18 32-18s32 6 32 18v16H18z" fill={paint} />
        <path d="M28 40h44v10H28z" fill={glass} />
        <circle cx="32" cy="66" r="7" fill={dark} />
        <circle cx="70" cy="66" r="7" fill={dark} />
      </>
    );
  }
  if (body === "saloon") {
    return (
      <>
        <path d="M6 52h16l14-16h32l16 16h12v14H6z" fill={paint} />
        <path d="M34 38h28l12 14H24z" fill={glass} />
        <circle cx="26" cy="66" r="7" fill={dark} />
        <circle cx="76" cy="66" r="7" fill={dark} />
      </>
    );
  }
  return (
    <>
      <path d="M10 50h12l12-14h36l16 14h6v16H10z" fill={paint} />
      <path d="M32 38h32l12 12H22z" fill={glass} />
      <circle cx="28" cy="66" r="7" fill={dark} />
      <circle cx="74" cy="66" r="7" fill={dark} />
    </>
  );
}

export function CarPortrait({
  photo,
  make,
  model,
  colour,
  className,
  alt,
}: {
  photo: string;
  make: string;
  model: string;
  colour: string;
  className?: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(!photo);
  const paint = COLOUR_SWATCH[colour] ?? "#7a818c";
  const body = bodyFor(make, model);

  if (!failed && photo) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden bg-navy-3", className)}>
        <img
          src={photo}
          alt={alt ?? `${make} ${model}`}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
        <span className="plate-cover" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={cn("relative flex h-full w-full items-end justify-center overflow-hidden bg-navy-3", className)}>
      <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 30% 20%, ${paint}55, transparent 55%)` }} />
      <svg viewBox="0 0 100 80" className="relative mb-1 w-[88%]" aria-hidden="true">
        <CarShape body={body} paint={paint} />
      </svg>
    </div>
  );
}
