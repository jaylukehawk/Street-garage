import { cn } from "@/lib/utils";
import type { Rank } from "@/lib/ranks";

const GOLD = new Set([
  "major-general",
  "lieutenant-general",
  "general",
  "field-marshal",
]);

function Chevron({ cx, cy, fill }: { cx: number; cy: number; fill: string }) {
  return (
    <polyline
      points={`${cx - 22},${cy + 9} ${cx},${cy - 9} ${cx + 22},${cy + 9}`}
      fill="none"
      stroke={fill}
      strokeWidth={7.5}
      strokeLinejoin="miter"
      strokeMiterlimit={3}
      strokeLinecap="butt"
    />
  );
}

function Chevrons({ n, fill, cx = 0, cy = 0 }: { n: 1 | 2 | 3; fill: string; cx?: number; cy?: number }) {
  const gap = 13;
  const start = cy - ((n - 1) * gap) / 2;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <Chevron key={i} cx={cx} cy={start + i * gap} fill={fill} />
      ))}
    </g>
  );
}

function Star({ cx, cy, r = 12, fill }: { cx: number; cy: number; r?: number; fill: string }) {
  const inner = r * 0.42;
  const pts = Array.from({ length: 10 }, (_, i) => {
    const rad = i % 2 === 0 ? r : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${cx + Math.cos(a) * rad},${cy + Math.sin(a) * rad}`;
  }).join(" ");
  return <polygon points={pts} fill={fill} />;
}

function Crown({ cx, cy, fill, scale = 1 }: { cx: number; cy: number; fill: string; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`} fill={fill}>
      <path d="M-16 6 L-16 -2 L-8 4 L0 -8 L8 4 L16 -2 L16 6 Z" />
      <rect x="-16" y="6" width="32" height="5" rx="1" />
      <rect x="-2.2" y="-10" width="4.4" height="4.4" />
    </g>
  );
}

function Sword() {
  return (
    <g>
      <path d="M-2 10 L-2 -16 L0 -26 L2 -16 L2 10 Z" />
      <rect x="-9" y="10" width="18" height="3.5" rx="0.5" />
      <rect x="-2.2" y="13.5" width="4.4" height="10" rx="1" />
    </g>
  );
}

function Baton() {
  return (
    <g>
      <rect x="-3.5" y="-22" width="7" height="44" rx="2" />
      <rect x="-5" y="-26" width="10" height="8" rx="1" />
      <rect x="-5" y="18" width="10" height="8" rx="1" />
    </g>
  );
}

function Crest({ cx, cy, fill }: { cx: number; cy: number; fill: string }) {
  return (
    <g transform={`translate(${cx} ${cy})`} fill={fill}>
      <path d="M0 -18 L14 -12 L12 6 L0 16 L-12 6 L-14 -12 Z" />
      <path d="M-18 4 Q-20 -10 -8 -20" fill="none" stroke={fill} strokeWidth="2.2" />
      <path d="M18 4 Q20 -10 8 -20" fill="none" stroke={fill} strokeWidth="2.2" />
      <rect x="-5" y="-6" width="10" height="8" rx="1" />
    </g>
  );
}

function Wreath({ fill }: { fill: string }) {
  return (
    <g fill="none" stroke={fill} strokeWidth="2.4">
      <path d="M-26 12 Q-30 -8 -10 -26" />
      <path d="M26 12 Q30 -8 10 -26" />
    </g>
  );
}

function RankInsignia({ id, fill }: { id: string; fill: string }) {
  const cx = 0;
  const cy = 0;
  switch (id) {
    case "recruit":
      return null;
    case "private":
      return <rect x={cx - 22} y={cy - 5} width={44} height={10} rx={1} fill={fill} />;
    case "lance-corporal":
      return <Chevrons n={1} fill={fill} />;
    case "corporal":
      return <Chevrons n={2} fill={fill} />;
    case "sergeant":
      return <Chevrons n={3} fill={fill} />;
    case "staff-sergeant":
      return (
        <g>
          <Crown cx={cx} cy={cy - 24} fill={fill} scale={0.7} />
          <Chevrons n={3} fill={fill} cy={6} />
        </g>
      );
    case "warrant-officer":
      return <Crest cx={cx} cy={cy} fill={fill} />;
    case "second-lieutenant":
      return <Star cx={cx} cy={cy} r={14} fill={fill} />;
    case "lieutenant":
      return (
        <g>
          <Star cx={cx - 15} cy={cy} r={12} fill={fill} />
          <Star cx={cx + 15} cy={cy} r={12} fill={fill} />
        </g>
      );
    case "captain":
      return (
        <g>
          <Star cx={cx} cy={cy - 13} r={11} fill={fill} />
          <Star cx={cx - 14} cy={cy + 10} r={11} fill={fill} />
          <Star cx={cx + 14} cy={cy + 10} r={11} fill={fill} />
        </g>
      );
    case "major":
      return <Crown cx={cx} cy={cy} fill={fill} />;
    case "lieutenant-colonel":
      return (
        <g>
          <Crown cx={cx} cy={cy - 12} fill={fill} scale={0.85} />
          <Star cx={cx} cy={cy + 14} r={10} fill={fill} />
        </g>
      );
    case "colonel":
      return (
        <g>
          <Crown cx={cx} cy={cy - 12} fill={fill} scale={0.85} />
          <Star cx={cx - 13} cy={cy + 14} r={9} fill={fill} />
          <Star cx={cx + 13} cy={cy + 14} r={9} fill={fill} />
        </g>
      );
    case "brigadier":
      return (
        <g>
          <Crown cx={cx} cy={cy - 14} fill={fill} scale={0.8} />
          <Star cx={cx - 16} cy={cy + 13} r={8} fill={fill} />
          <Star cx={cx} cy={cy + 13} r={8} fill={fill} />
          <Star cx={cx + 16} cy={cy + 13} r={8} fill={fill} />
        </g>
      );
    case "major-general":
      return (
        <g fill={fill}>
          <g transform="rotate(-40)">
            <Sword />
          </g>
          <g transform="rotate(40)">
            <Baton />
          </g>
          <Star cx={cx} cy={cy - 26} r={9} fill={fill} />
        </g>
      );
    case "lieutenant-general":
      return (
        <g fill={fill}>
          <g transform="rotate(-40)">
            <Sword />
          </g>
          <g transform="rotate(40)">
            <Baton />
          </g>
          <Crown cx={cx} cy={cy - 26} fill={fill} scale={0.7} />
        </g>
      );
    case "general":
      return (
        <g fill={fill}>
          <g transform="rotate(-40)">
            <Sword />
          </g>
          <g transform="rotate(40)">
            <Baton />
          </g>
          <Crown cx={cx} cy={cy - 28} fill={fill} scale={0.62} />
          <Star cx={cx} cy={cy + 26} r={8} fill={fill} />
        </g>
      );
    case "field-marshal":
      return (
        <g fill={fill}>
          <Wreath fill={fill} />
          <g transform="rotate(-38) scale(0.82)">
            <Baton />
          </g>
          <g transform="rotate(38) scale(0.82)">
            <Baton />
          </g>
          <Crown cx={cx} cy={cy - 8} fill={fill} scale={0.58} />
        </g>
      );
    default:
      return null;
  }
}

export function RankPlate({
  rank,
  locked = false,
  current = false,
  roman,
  pips = 0,
  className,
}: {
  rank: Rank;
  locked?: boolean;
  current?: boolean;
  hero?: boolean;
  roman?: string;
  pips?: number;
  className?: string;
}) {
  const gold = GOLD.has(rank.id) && !locked;
  const uid = `${rank.id}-${locked ? "l" : "o"}-${current ? "c" : "n"}-${roman ?? "x"}`;
  const rim = locked ? "#6a7686" : gold ? "#f0d48a" : current ? "#e8eef5" : "#c9d3e0";
  const rimDark = locked ? "#3d4d63" : gold ? "#b8892c" : current ? "#2f6bff" : "#8b97a8";
  const field = locked ? "#3d4d63" : "#0b1f3a";
  const text = locked ? "#9aa5b4" : "#f4f7fb";
  const pipOn = current ? "#2f6bff" : gold ? "#f0d48a" : "#c9d3e0";
  const icon = locked ? "#8b97a8" : current ? "#c9d3e0" : "#c9d3e0";
  const name = `${rank.label.toUpperCase()}${roman ? ` ${roman}` : ""}`;
  const nameSize = name.length > 22 ? 15 : name.length > 18 ? 17 : name.length > 14 ? 20 : 24;
  const filled = locked ? 0 : pips;

  return (
    <svg
      viewBox="0 0 360 96"
      width="360"
      height="96"
      preserveAspectRatio="xMidYMid meet"
      className={cn("rank-plate", className)}
      role="img"
      aria-label={locked ? `${rank.label} locked` : name}
    >
      <defs>
        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={rim} />
          <stop offset="45%" stopColor={rimDark} />
          <stop offset="100%" stopColor={rim} />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="358" height="94" rx="12" fill={`url(#${uid}-rim)`} />
      <rect x="7" y="7" width="346" height="82" rx="8" fill={field} />
      {current && !locked ? (
        <rect x="9" y="9" width="342" height="78" rx="7" fill="none" stroke="#2f6bff" strokeWidth="1.5" />
      ) : null}
      {gold ? (
        <rect x="9" y="9" width="342" height="78" rx="7" fill="none" stroke="#f0d48a" strokeWidth="1.2" />
      ) : null}
      <g transform="translate(62 48)" opacity={locked ? 0.28 : 1}>
        <RankInsignia id={rank.id} fill={icon} />
      </g>
      <line x1="118" y1="18" x2="118" y2="78" stroke={locked ? "#5a6573" : "#2a4060"} strokeWidth="1" />
      <text
        x="132"
        y="46"
        fill={text}
        fontFamily="Barlow Condensed, sans-serif"
        fontSize={nameSize}
        fontWeight="700"
        letterSpacing="1.6"
      >
        {name}
      </text>
      {Array.from({ length: 5 }, (_, i) => {
        const on = i < filled;
        return (
          <rect
            key={i}
            x={132 + i * 30}
            y="62"
            width="24"
            height="8"
            rx="1"
            fill={on ? pipOn : locked ? "#5a6573" : "#17345a"}
            stroke={on ? (current ? "#6d94ff" : "#e8eef5") : "#2a4060"}
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}
