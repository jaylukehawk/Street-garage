import { cn } from "@/lib/utils";
import { tierForCount, type TierId } from "@/lib/badges";

const RIMS: Record<TierId | "locked", { rim: string; rimDark: string; field: string; text: string; sub: string }> = {
  locked: { rim: "#7a8492", rimDark: "#4a5563", field: "#4a5563", text: "#c5cdd6", sub: "#9aa5b4" },
  bronze: { rim: "#d9c4a0", rimDark: "#8a6230", field: "#0b1f3a", text: "#f4f7fb", sub: "#c4a06a" },
  silver: { rim: "#f4f7fb", rimDark: "#8b97a8", field: "#0b1f3a", text: "#f4f7fb", sub: "#c9d3e0" },
  gold: { rim: "#f6e6b8", rimDark: "#b8892c", field: "#0b1f3a", text: "#f4f7fb", sub: "#f0d48a" },
  platinum: { rim: "#ffffff", rimDark: "#9aa7b6", field: "#0b1f3a", text: "#f4f7fb", sub: "#e8eef5" },
  diamond: { rim: "#f2fbff", rimDark: "#7eb8d4", field: "#0b1f3a", text: "#f4f7fb", sub: "#d5f0ff" },
};

export function MakePlate({
  make,
  count,
  className,
}: {
  make: string;
  count: number;
  className?: string;
}) {
  const tier = tierForCount(count);
  const id = tier?.id ?? "locked";
  const fill = RIMS[id];
  const uid = `${make.replace(/\s+/g, "")}-${id}`;
  const locked = !tier;
  const nameSize = make.length > 12 ? 22 : make.length > 9 ? 26 : 30;

  return (
    <svg
      viewBox="0 0 360 96"
      width="360"
      height="96"
      preserveAspectRatio="xMidYMid meet"
      className={cn("make-plate", className)}
      role="img"
      aria-label={
        locked
          ? `${make} locked, ${count} sightings`
          : `${make} ${count} ${tier.label}`
      }
    >
      <defs>
        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={fill.rim} />
          <stop offset="45%" stopColor={fill.rimDark} />
          <stop offset="100%" stopColor={fill.rim} />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="358" height="94" rx="12" fill={`url(#${uid}-rim)`} />
      <rect x="7" y="7" width="346" height="82" rx="8" fill={fill.field} />
      {locked ? (
        <g opacity="0.18" fill={fill.sub}>
          <path d="M70 62h18l14-16h52l18 16h28v18H70z" />
          <path d="M108 48h44l12 14H98z" />
          <circle cx="104" cy="80" r="7" />
          <circle cx="168" cy="80" r="7" />
        </g>
      ) : null}
      <text
        x="24"
        y="58"
        fill={fill.text}
        fontFamily="Barlow Condensed, sans-serif"
        fontSize={nameSize}
        fontWeight="700"
        letterSpacing="1.4"
      >
        {make.toUpperCase()}
      </text>
      <text
        x="336"
        y="44"
        textAnchor="end"
        fill={fill.text}
        fontFamily="Barlow Condensed, sans-serif"
        fontSize="28"
        fontWeight="700"
      >
        {count}
      </text>
      <text
        x="336"
        y="68"
        textAnchor="end"
        fill={fill.sub}
        fontFamily="Barlow Condensed, sans-serif"
        fontSize="13"
        fontWeight="600"
        letterSpacing="1.8"
      >
        {locked ? "LOCKED" : tier.label.toUpperCase()}
      </text>
    </svg>
  );
}

export const Medal = MakePlate;
