import { bodyFor, getMake } from "./catalog";
import type { Sighting } from "./types";

export type SpecialId = "suv" | "electric" | "vintage" | "supercar" | "fourbyfour" | "van" | "hatchback";

export const SPECIALS: { id: SpecialId; label: string }[] = [
  { id: "suv", label: "SUV" },
  { id: "electric", label: "Electric" },
  { id: "vintage", label: "Vintage" },
  { id: "supercar", label: "Supercar" },
  { id: "fourbyfour", label: "4x4" },
  { id: "van", label: "Van" },
  { id: "hatchback", label: "Hatchback" },
];

const EV = [
  "leaf", "tesla", "model 3", "model y", "model s", "model x",
  "id.3", "id.4", "id.5", "id.7", "id.buzz", "enyaq", "elroq", "ioniq",
  "ev3", "ev4", "ev6", "ev9", "niro", "e-niro", "mg4", "bz4x", "polestar",
  "atto 2", "atto 3", "dolphin", "seal", "sealion", "ariya", "ex30", "ex90",
  "born", "tavascan", "500e", "taycan", "e-tron", "q4 e-tron", "q6 e-tron",
  "i3", "i4", "i5", "i7", "ix", "ix1", "ix2", "ix3", "eqa", "eqb", "eqc",
  "eqe", "eqs", "zoe", "megane e-tech", "scenic e-tech", "5 e-tech",
  "mach-e", "e-208", "e-2008", "e-308", "e-c3", "e-c4", "ami",
  "e-ny1", "eny1", "mx-30", "solterra", "ora", "funky cat", "leapmotor",
  "omoda e5", "cyberster", "marvel r", "i-pace", "rz", "lyriq",
  "spectre", "nevera", "e-nv200", "edaily", "edeliver", "spring",
];

const VANS = [
  "transit", "tourneo", "transporter", "caravelle", "multivan", "california",
  "sprinter", "vito", "v-class", "citan", "vivaro", "movano", "combo",
  "partner", "rifter", "expert", "traveller", "boxer", "berlingo",
  "dispatch", "spacetourer", "relay", "trafic", "master", "kangoo",
  "caddy", "crafter", "proace", "primastar", "townstar", "interstar",
  "nv200", "daily", "deliver 3", "deliver 7", "deliver 9", "ducato",
  "scudo", "talento", "doblo",
];

const FOURBY = [
  "defender", "discovery", "range rover", "freelander", "wrangler",
  "grenadier", "quartermaster", "jimny", "hilux", "ranger", "d-max",
  "l200", "land cruiser", "shogun", "trooper", "fourtrak", "g-class",
  "gladiator", "amarok", "musso", "navara", "patrol",
];

const SUPER = [
  "ferrari", "lamborghini", "mclaren", "aston martin", "porsche",
  "911", "huracan", "urus", "revuelto", "aventador", "gallardo",
  "296", "roma", "sf90", "f8", "488", "458", "812", "portofino",
  "720s", "750s", "765lt", "570s", "artura", "senna", "p1",
  "db12", "db11", "db9", "vantage", "vanquish", "valkyrie",
  "emira", "elise", "exige", "evora", "a110", "r8", "nsx",
  "gt-r", "continental gt", "chiron", "veyron", "huayra", "jesko",
  "nevera", "mc20", "atom", "seven", "griffith", "sagaris",
];

function hay(s: Sighting) {
  return `${s.make} ${s.model}`.toLowerCase();
}

function knownBody(s: Sighting) {
  const entry = getMake(s.make);
  if (!entry) return null;
  return entry.bodies[s.model] ?? null;
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
  if (id === "hatchback") {
    const body = knownBody(s);
    return body === "hatch" || body === "mini";
  }
  return false;
}

export function specialCounts(sightings: Sighting[]) {
  return SPECIALS.map((row) => ({
    ...row,
    count: sightings.filter((s) => matchesSpecial(s, row.id)).length,
  }));
}