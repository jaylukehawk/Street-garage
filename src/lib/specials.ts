import { bodyFor } from "./catalog";
import type { Sighting } from "./types";

export type SpecialId = "suv" | "electric" | "vintage" | "supercar" | "fourbyfour" | "van";

export const SPECIALS: { id: SpecialId; label: string }[] = [
  { id: "suv", label: "SUV" },
  { id: "electric", label: "Electric" },
  { id: "vintage", label: "Vintage" },
  { id: "supercar", label: "Supercar" },
  { id: "fourbyfour", label: "4x4" },
  { id: "van", label: "Van" },
];

const EV = [
  "leaf", "tesla", "model 3", "model y", "model s", "model x",
  "id.3", "id.4", "id.buzz", "enyaq", "ioniq", "ev6", "niro",
  "mg4", "bz4x", "polestar", "atto 3", "dolphin", "seal",
  "ariya", "ex30", "born", "500e", "taycan", "e-tron", "i4", "ix",
];

const VANS = [
  "transit", "tourneo", "transporter", "sprinter", "vito",
  "vivaro", "combo", "partner", "berlingo", "trafic",
];

const FOURBY = [
  "defender", "discovery", "range rover", "wrangler", "grenadier",
  "jimny", "hilux", "ranger", "d-max", "l200", "land cruiser",
];

const SUPER = [
  "ferrari", "lamborghini", "mclaren", "aston martin", "porsche",
  "911", "huracan", "urus", "revuelto", "296", "roma", "sf90",
  "720s", "750s", "artura", "db12", "vantage", "emira",
];

function hay(s: Sighting) {
  return `${s.make} ${s.model}`.toLowerCase();
}

export function matchesSpecial(s: Sighting, id: SpecialId) {
  const text = hay(s);
  const body = bodyFor(s.make, s.model);
  if (id === "suv") return body === "suv";
  if (id === "electric") return EV.some((n) => text.includes(n));
  if (id === "vintage") return typeof s.year === "number" && s.year > 1900 && s.year <= 1995;
  if (id === "supercar") return SUPER.some((n) => text.includes(n));
  if (id === "fourbyfour") return body === "pickup" || FOURBY.some((n) => text.includes(n));
  if (id === "van") return VANS.some((n) => text.includes(n));
  return false;
}

export function specialCounts(sightings: Sighting[]) {
  return SPECIALS.map((row) => ({
    ...row,
    count: sightings.filter((s) => matchesSpecial(s, row.id)).length,
  }));
}