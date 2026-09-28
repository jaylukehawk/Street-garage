import { bodyFor } from "./catalog";
import type { BuildClassId } from "./builds";
import { PART_SLOTS, type GaragePart, type PartRank, type PartSlot } from "./parts";

export const STAT_KEYS = ["speed", "accel", "grip", "brake", "power"] as const;
export type StatKey = (typeof STAT_KEYS)[number];
export type StatBlock = Record<StatKey, number>;

export const STAT_LABEL: Record<StatKey, string> = {
  speed: "Speed",
  accel: "Accel",
  grip: "Grip",
  brake: "Brake",
  power: "Power",
};

export const RANK_POINTS: Record<PartRank, number> = {
  E: 0,
  D: 2,
  C: 4,
  B: 7,
  A: 11,
  S: 16,
};

const RANK_ORDER: PartRank[] = ["E", "D", "C", "B", "A", "S"];

/** How much each fitted slot feeds each stat. All-S bonus stays under ~20 so chassis wins. */
const SLOT_FEED: Record<PartSlot, Partial<StatBlock>> = {
  engine: { speed: 1, accel: 0.75, power: 1 },
  wheels: { grip: 0.7, accel: 0.35, speed: 0.12 },
  brakes: { brake: 1 },
  chassis: { grip: 0.45, power: 0.2, brake: 0.12 },
  suspension: { grip: 0.35, brake: 0.3 },
  body: { speed: 0.18, power: 0.12, grip: 0.1 },
};

type Chassis = StatBlock & { band: string };

const CLASS_BASE: Record<BuildClassId, Chassis> = {
  supercar: { speed: 86, accel: 88, grip: 82, brake: 80, power: 90, band: "Super" },
  electric: { speed: 68, accel: 82, grip: 66, brake: 70, power: 76, band: "Electric" },
  hatchback: { speed: 50, accel: 54, grip: 58, brake: 56, power: 48, band: "Street" },
  suv: { speed: 52, accel: 48, grip: 60, brake: 58, power: 56, band: "Crossover" },
  fourbyfour: { speed: 46, accel: 44, grip: 64, brake: 54, power: 62, band: "Off-road" },
  van: { speed: 36, accel: 34, grip: 46, brake: 48, power: 42, band: "Van" },
  vintage: { speed: 42, accel: 38, grip: 44, brake: 40, power: 46, band: "Classic" },
};

function jitter(make: string, model: string, key: StatKey) {
  const raw = `${make}|${model}|${key}`;
  let h = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 7 - 3;
}

function add(block: StatBlock, delta: Partial<StatBlock>): StatBlock {
  return {
    speed: block.speed + (delta.speed ?? 0),
    accel: block.accel + (delta.accel ?? 0),
    grip: block.grip + (delta.grip ?? 0),
    brake: block.brake + (delta.brake ?? 0),
    power: block.power + (delta.power ?? 0),
  };
}

function hay(make: string, model: string) {
  return `${make} ${model}`.toLowerCase();
}

/** Model / make identity on top of class. This is the ceiling, not the parts. */
export function chassisFor(make: string, model: string, classId: BuildClassId): Chassis {
  const text = hay(make, model);
  const body = bodyFor(make, model);
  let chassis: Chassis = { ...CLASS_BASE[classId] };

  if (body === "coupe" && classId !== "supercar") {
    chassis = add(chassis, { speed: 16, accel: 14, grip: 8, brake: 8, power: 16 }) as Chassis;
    chassis.band = "Sport";
  }
  if (body === "saloon" && classId === "hatchback") {
    chassis = add(chassis, { speed: 8, accel: 4, grip: 2, brake: 4, power: 8 }) as Chassis;
    chassis.band = "Saloon";
  }
  if (body === "mini") {
    chassis = add(chassis, { speed: -4, accel: 6, grip: 6, brake: -2, power: -6 }) as Chassis;
    chassis.band = "City";
  }
  if (body === "pickup") {
    chassis = add(chassis, { speed: -4, accel: -6, grip: 4, brake: -2, power: 8 }) as Chassis;
    chassis.band = "Pickup";
  }

  if (/ferrari|lamborghini|mclaren/.test(text)) {
    chassis = add(chassis, { speed: 4, accel: 3, grip: 2, brake: 2, power: 5 }) as Chassis;
    chassis.band = "Hyper";
  } else if (/porsche|aston martin|lotus|alpine/.test(text)) {
    chassis = add(chassis, { speed: 2, accel: 2, grip: 3, brake: 2, power: 2 }) as Chassis;
  } else if (/rolls-royce|bentley/.test(text)) {
    chassis = add(chassis, { speed: -8, accel: -10, grip: 2, brake: 4, power: 8 }) as Chassis;
    chassis.band = "Grand";
  } else if (/bmw|audi|mercedes|jaguar|lexus|genesis|maserati|alfa/.test(text)) {
    chassis = add(chassis, { speed: 6, accel: 4, grip: 4, brake: 5, power: 6 }) as Chassis;
    if (chassis.band === "Street") chassis.band = "Premium";
  } else if (/dacia|ssangyong|smart/.test(text)) {
    chassis = add(chassis, { speed: -6, accel: -4, grip: -2, brake: -2, power: -6 }) as Chassis;
  }

  // Named outliers so a Focus can never live in Huracán air.
  const named: [RegExp, Partial<StatBlock>, string?][] = [
    [/huracan|revuelto|sf90|296|720s|750s/, { speed: 4, accel: 3, power: 4 }, "Hyper"],
    [/urus|purosangue|dbx|cayenne|bentayga/, { speed: -8, accel: -10, grip: 4, power: -2 }, "Super SUV"],
    [/911|emira|a110|f-type|vantage|db12|artura|roma/, { speed: 1, accel: 1, grip: 2 }, "Super"],
    [/mustang|camaro/, { speed: 18, accel: 14, grip: 4, brake: 4, power: 18 }, "Muscle"],
    [/mx-5/, { speed: 10, accel: 12, grip: 10, brake: 6, power: 6 }, "Roadster"],
    [/model s|taycan|model x/, { speed: 10, accel: 6, power: 8 }, "GT EV"],
    [/civic|golf|leon|focus/, { speed: 2, accel: 3, grip: 2 }, "Hot hatch"],
    [/fiesta|corsa|polo|ibiza|yaris|micra|picanto|aygo|i10/, { speed: -4, accel: 2, grip: 2, power: -6 }, "Supermini"],
    [/transit|sprinter|vivaro|transporter|trafic/, { speed: -2, power: 2 }, "Van"],
    [/defender|wrangler|grenadier|jimny|land cruiser/, { speed: -4, grip: 6, power: 6 }, "Trail"],
    [/phantom|ghost|cullinan/, { speed: -6, accel: -8, power: 4 }, "Grand"],
  ];
  for (const [re, delta, band] of named) {
    if (re.test(text)) {
      chassis = add(chassis, delta) as Chassis;
      if (band) chassis.band = band;
    }
  }

  for (const key of STAT_KEYS) {
    chassis[key] = clamp(chassis[key] + jitter(make, model, key), 18, 94);
  }
  return chassis;
}

export function bestBySlot(parts: GaragePart[]) {
  const fitted: Partial<Record<PartSlot, GaragePart>> = {};
  for (const part of parts) {
    const current = fitted[part.slot];
    if (!current || RANK_ORDER.indexOf(part.rank) > RANK_ORDER.indexOf(current.rank)) {
      fitted[part.slot] = part;
    }
  }
  return fitted;
}

export function partBonus(parts: GaragePart[]): StatBlock {
  const fitted = bestBySlot(parts);
  const bonus: StatBlock = { speed: 0, accel: 0, grip: 0, brake: 0, power: 0 };
  for (const slot of PART_SLOTS) {
    const part = fitted[slot];
    const pts = part ? RANK_POINTS[part.rank] : 0;
    const feed = SLOT_FEED[slot];
    for (const key of STAT_KEYS) {
      bonus[key] += pts * (feed[key] ?? 0);
    }
  }
  for (const key of STAT_KEYS) bonus[key] = Math.round(Math.min(20, bonus[key]));
  return bonus;
}

export function rankFromParts(parts: GaragePart[]): PartRank {
  const fitted = bestBySlot(parts);
  const sum = PART_SLOTS.reduce((n, slot) => {
    const part = fitted[slot];
    return n + RANK_ORDER.indexOf(part?.rank ?? "E");
  }, 0);
  const avg = sum / PART_SLOTS.length;
  if (avg >= 4.6) return "S";
  if (avg >= 3.6) return "A";
  if (avg >= 2.6) return "B";
  if (avg >= 1.6) return "C";
  if (avg >= 0.6) return "D";
  return "E";
}

export type BuildStats = {
  chassis: Chassis;
  bonus: StatBlock;
  stats: StatBlock;
  rating: number;
  rank: PartRank;
  slotsFilled: number;
};

export function computeBuildStats(
  make: string,
  model: string,
  classId: BuildClassId,
  parts: GaragePart[],
): BuildStats {
  const chassis = chassisFor(make, model, classId);
  const bonus = partBonus(parts);
  const stats: StatBlock = {
    speed: clamp(chassis.speed + bonus.speed, 1, 99),
    accel: clamp(chassis.accel + bonus.accel, 1, 99),
    grip: clamp(chassis.grip + bonus.grip, 1, 99),
    brake: clamp(chassis.brake + bonus.brake, 1, 99),
    power: clamp(chassis.power + bonus.power, 1, 99),
  };
  const rating = Math.round(STAT_KEYS.reduce((n, key) => n + stats[key], 0) / STAT_KEYS.length);
  const slotsFilled = new Set(parts.map((p) => p.slot)).size;
  return {
    chassis,
    bonus,
    stats,
    rating,
    rank: rankFromParts(parts),
    slotsFilled,
  };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}
