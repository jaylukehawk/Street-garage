import { RANKS, rankIndex, type Rank } from "./ranks";
import { matchesSpecial } from "./specials";
import type { Sighting } from "./types";

export const BUILD_CLASSES = [
  "suv",
  "van",
  "vintage",
  "electric",
  "fourbyfour",
  "supercar",
  "hatchback",
] as const;

export type BuildClassId = (typeof BUILD_CLASSES)[number];

export const BUILD_LABEL: Record<BuildClassId, string> = {
  suv: "SUV",
  van: "Van",
  vintage: "Vintage",
  electric: "Electric",
  fourbyfour: "4x4",
  supercar: "Supercar",
  hatchback: "Hatchback",
};

export const VINYLS = [
  { id: "none", label: "Plain" },
  { id: "stripe", label: "Stripe" },
  { id: "gold", label: "Gold" },
  { id: "ghost", label: "Ghost" },
] as const;

export type VinylId = (typeof VINYLS)[number]["id"];

export const DECALS = [
  { id: "none", label: "None", rankId: null as string | null },
  ...RANKS.map((rank) => ({
    id: rank.id,
    label: rank.label,
    rankId: rank.id as string | null,
  })),
];

export type DecalId = string;

export function decalUnlocked(rankId: string | null, current: Rank) {
  if (!rankId) return true;
  const need = RANKS.findIndex((row) => row.id === rankId);
  return need >= 0 && rankIndex(current) >= need;
}

export type SavedBuild = {
  design: string;
  vinyl: VinylId;
  decal: DecalId;
};

export function decalSrc(id: DecalId) {
  if (!id || id === "none") return null;
  return `/decals/${id}.png`;
}

export function designSrc(designId: string) {
  return `/builds/${designId}.jpg`;
}

export function designsFor(classId: BuildClassId) {
  return [1, 2, 3].map((n) => ({
    id: `${classId}-${n}`,
    src: designSrc(`${classId}-${n}`),
  }));
}

export function buildClassFor(make: string, model: string, year?: number | null): BuildClassId {
  const sighting = { make, model, year: year ?? undefined } as Sighting;
  if (matchesSpecial(sighting, "supercar")) return "supercar";
  if (matchesSpecial(sighting, "van")) return "van";
  if (matchesSpecial(sighting, "electric")) return "electric";
  if (typeof year === "number" && year > 1900 && year <= 1995) return "vintage";
  if (matchesSpecial(sighting, "fourbyfour")) return "fourbyfour";
  if (matchesSpecial(sighting, "suv")) return "suv";
  return "hatchback";
}
