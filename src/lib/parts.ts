export const PART_SLOTS = [
  "body",
  "engine",
  "wheels",
  "brakes",
  "chassis",
  "suspension",
] as const;

export type PartSlot = (typeof PART_SLOTS)[number];
export type PartRank = "E" | "D" | "C" | "B" | "A" | "S";

export type GaragePart = {
  id: string;
  slot: PartSlot;
  rank: PartRank;
  make: string;
  model: string;
  fromSightingId: string;
  at: string;
};

const WEIGHTS: { rank: PartRank; w: number }[] = [
  { rank: "E", w: 40 },
  { rank: "D", w: 28 },
  { rank: "C", w: 18 },
  { rank: "B", w: 9 },
  { rank: "A", w: 4 },
  { rank: "S", w: 1 },
];

function pick<T>(rows: T[]): T {
  return rows[Math.floor(Math.random() * rows.length)]!;
}

export function rollPart(make: string, model: string, fromSightingId: string): GaragePart {
  const total = WEIGHTS.reduce((n, row) => n + row.w, 0);
  let n = Math.random() * total;
  let rank: PartRank = "E";
  for (const row of WEIGHTS) {
    n -= row.w;
    if (n <= 0) {
      rank = row.rank;
      break;
    }
  }
  return {
    id: `pt_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    slot: pick([...PART_SLOTS]),
    rank,
    make,
    model,
    fromSightingId,
    at: new Date().toISOString(),
  };
}

export const SLOT_LABEL: Record<PartSlot, string> = {
  body: "Body",
  engine: "Engine",
  wheels: "Wheels",
  brakes: "Brakes",
  chassis: "Chassis",
  suspension: "Suspension",
};