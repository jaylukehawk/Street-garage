export const COLOURS = [
  "Black",
  "White",
  "Silver",
  "Grey",
  "Blue",
  "Red",
  "Green",
  "Yellow",
  "Orange",
  "Brown",
  "Beige",
  "Purple",
] as const;

export type ColourName = (typeof COLOURS)[number];

export const COLOUR_SWATCH: Record<string, string> = {
  Black: "#1a1d22",
  White: "#e8ecf0",
  Silver: "#c5ccd4",
  Grey: "#7a818c",
  Blue: "#2a5db0",
  Red: "#b3262a",
  Green: "#1f5c3a",
  Yellow: "#c9a227",
  Orange: "#c45a1a",
  Brown: "#6b3f2a",
  Beige: "#cbb79a",
  Purple: "#5c3d7a",
};

export type BodyStyle = "hatch" | "saloon" | "suv" | "coupe" | "pickup" | "mini";

export type MakeEntry = {
  name: string;
  models: string[];
  bodies: Record<string, BodyStyle>;
};

export const CATALOG: MakeEntry[] = [
  {
    name: "Ford",
    models: ["Fiesta", "Focus", "Puma", "Kuga", "Mustang", "Ranger", "Mondeo", "Transit", "Explorer"],
    bodies: {
      Fiesta: "hatch",
      Focus: "hatch",
      Puma: "suv",
      Kuga: "suv",
      Mustang: "coupe",
      Ranger: "pickup",
      Mondeo: "saloon",
      Transit: "suv",
      Explorer: "suv",
    },
  },
  {
    name: "BMW",
    models: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "X1", "X3", "X5", "iX"],
    bodies: {
      "1 Series": "hatch",
      "2 Series": "coupe",
      "3 Series": "saloon",
      "4 Series": "coupe",
      "5 Series": "saloon",
      X1: "suv",
      X3: "suv",
      X5: "suv",
      iX: "suv",
    },
  },
  {
    name: "Volkswagen",
    models: ["Polo", "Golf", "T-Roc", "Tiguan", "Passat", "ID.3", "ID.4", "Transporter"],
    bodies: {
      Polo: "hatch",
      Golf: "hatch",
      "T-Roc": "suv",
      Tiguan: "suv",
      Passat: "saloon",
      "ID.3": "hatch",
      "ID.4": "suv",
      Transporter: "suv",
    },
  },
  {
    name: "Toyota",
    models: ["Yaris", "Corolla", "C-HR", "RAV4", "Aygo", "Prius", "Land Cruiser", "Hilux"],
    bodies: {
      Yaris: "hatch",
      Corolla: "saloon",
      "C-HR": "suv",
      RAV4: "suv",
      Aygo: "hatch",
      Prius: "hatch",
      "Land Cruiser": "suv",
      Hilux: "pickup",
    },
  },
  {
    name: "Mini",
    models: ["Cooper", "Clubman", "Countryman", "Convertible"],
    bodies: {
      Cooper: "mini",
      Clubman: "hatch",
      Countryman: "suv",
      Convertible: "mini",
    },
  },
  {
    name: "Audi",
    models: ["A1", "A3", "A4", "A6", "Q2", "Q3", "Q5", "TT"],
    bodies: { A1: "hatch", A3: "hatch", A4: "saloon", A6: "saloon", Q2: "suv", Q3: "suv", Q5: "suv", TT: "coupe" },
  },
  {
    name: "Mercedes-Benz",
    models: ["A-Class", "C-Class", "E-Class", "GLA", "GLC", "GLE", "CLA"],
    bodies: {
      "A-Class": "hatch",
      "C-Class": "saloon",
      "E-Class": "saloon",
      GLA: "suv",
      GLC: "suv",
      GLE: "suv",
      CLA: "saloon",
    },
  },
  {
    name: "Vauxhall",
    models: ["Corsa", "Astra", "Mokka", "Grandland", "Combo"],
    bodies: { Corsa: "hatch", Astra: "hatch", Mokka: "suv", Grandland: "suv", Combo: "suv" },
  },
  {
    name: "Nissan",
    models: ["Micra", "Juke", "Qashqai", "Leaf", "Navara", "X-Trail"],
    bodies: { Micra: "hatch", Juke: "suv", Qashqai: "suv", Leaf: "hatch", Navara: "pickup", "X-Trail": "suv" },
  },
  {
    name: "Honda",
    models: ["Civic", "Jazz", "CR-V", "HR-V", "e:Ny1"],
    bodies: { Civic: "hatch", Jazz: "hatch", "CR-V": "suv", "HR-V": "suv", "e:Ny1": "suv" },
  },
  {
    name: "Hyundai",
    models: ["i10", "i20", "i30", "Kona", "Tucson", "Ioniq 5"],
    bodies: { i10: "hatch", i20: "hatch", i30: "hatch", Kona: "suv", Tucson: "suv", "Ioniq 5": "suv" },
  },
  {
    name: "Kia",
    models: ["Picanto", "Rio", "Ceed", "Sportage", "Niro", "EV6"],
    bodies: { Picanto: "hatch", Rio: "hatch", Ceed: "hatch", Sportage: "suv", Niro: "suv", EV6: "suv" },
  },
  {
    name: "Peugeot",
    models: ["208", "308", "2008", "3008", "5008"],
    bodies: { "208": "hatch", "308": "hatch", "2008": "suv", "3008": "suv", "5008": "suv" },
  },
  {
    name: "Renault",
    models: ["Clio", "Captur", "Megane", "Austral", "Zoe"],
    bodies: { Clio: "hatch", Captur: "suv", Megane: "hatch", Austral: "suv", Zoe: "hatch" },
  },
  {
    name: "Skoda",
    models: ["Fabia", "Octavia", "Superb", "Kamiq", "Kodiaq"],
    bodies: { Fabia: "hatch", Octavia: "saloon", Superb: "saloon", Kamiq: "suv", Kodiaq: "suv" },
  },
  {
    name: "Tesla",
    models: ["Model 3", "Model Y", "Model S", "Model X"],
    bodies: { "Model 3": "saloon", "Model Y": "suv", "Model S": "saloon", "Model X": "suv" },
  },
  {
    name: "Land Rover",
    models: ["Defender", "Discovery", "Range Rover", "Range Rover Evoque", "Range Rover Sport"],
    bodies: {
      Defender: "suv",
      Discovery: "suv",
      "Range Rover": "suv",
      "Range Rover Evoque": "suv",
      "Range Rover Sport": "suv",
    },
  },
  {
    name: "Jaguar",
    models: ["XE", "XF", "F-Pace", "E-Pace", "I-Pace"],
    bodies: { XE: "saloon", XF: "saloon", "F-Pace": "suv", "E-Pace": "suv", "I-Pace": "suv" },
  },
  {
    name: "Volvo",
    models: ["XC40", "XC60", "XC90", "V60", "S90"],
    bodies: { XC40: "suv", XC60: "suv", XC90: "suv", V60: "saloon", S90: "saloon" },
  },
  {
    name: "Mazda",
    models: ["Mazda2", "Mazda3", "CX-5", "MX-5", "CX-30"],
    bodies: { Mazda2: "hatch", Mazda3: "hatch", "CX-5": "suv", "MX-5": "coupe", "CX-30": "suv" },
  },
  {
    name: "Porsche",
    models: ["911", "Cayenne", "Macan", "Taycan", "Boxster"],
    bodies: { "911": "coupe", Cayenne: "suv", Macan: "suv", Taycan: "saloon", Boxster: "coupe" },
  },
  {
    name: "Fiat",
    models: ["500", "Panda", "Tipo", "500X"],
    bodies: { "500": "mini", Panda: "hatch", Tipo: "hatch", "500X": "suv" },
  },
  {
    name: "Citroen",
    models: ["C3", "C4", "C5 Aircross", "Berlingo"],
    bodies: { C3: "hatch", C4: "hatch", "C5 Aircross": "suv", Berlingo: "suv" },
  },
  {
    name: "Suzuki",
    models: ["Swift", "Ignis", "Vitara", "Jimny"],
    bodies: { Swift: "hatch", Ignis: "suv", Vitara: "suv", Jimny: "suv" },
  },
  {
    name: "MG",
    models: ["MG3", "MG4", "MG5", "ZS", "HS"],
    bodies: { MG3: "hatch", MG4: "hatch", MG5: "saloon", ZS: "suv", HS: "suv" },
  },
  {
    name: "Lexus",
    models: ["UX", "NX", "RX", "IS"],
    bodies: { UX: "suv", NX: "suv", RX: "suv", IS: "saloon" },
  },
  {
    name: "Cupra",
    models: ["Formentor", "Leon", "Born", "Ateca"],
    bodies: { Formentor: "suv", Leon: "hatch", Born: "hatch", Ateca: "suv" },
  },
  {
    name: "Dacia",
    models: ["Sandero", "Duster", "Jogger", "Spring"],
    bodies: { Sandero: "hatch", Duster: "suv", Jogger: "suv", Spring: "hatch" },
  },
  {
    name: "Jeep",
    models: ["Avenger", "Renegade", "Compass", "Wrangler"],
    bodies: { Avenger: "suv", Renegade: "suv", Compass: "suv", Wrangler: "suv" },
  },
  {
    name: "Seat",
    models: ["Ibiza", "Leon", "Arona", "Ateca"],
    bodies: { Ibiza: "hatch", Leon: "hatch", Arona: "suv", Ateca: "suv" },
  },
];

export const MAKE_NAMES = CATALOG.map((entry) => entry.name);
export const DEFAULT_MAKE = "Ford";

export function getMake(name: string) {
  const lower = name.toLowerCase();
  return CATALOG.find((entry) => entry.name.toLowerCase() === lower) ?? null;
}

export function modelsFor(make: string, extra?: string | null) {
  const found = getMake(make);
  const list = found ? [...found.models] : [];
  if (extra && !list.some((model) => model.toLowerCase() === extra.toLowerCase())) {
    list.unshift(extra);
  }
  return list;
}

export function bodyFor(make: string, model: string): BodyStyle {
  return getMake(make)?.bodies[model] ?? "hatch";
}

export function nearestMake(name: string | null | undefined) {
  if (!name) return MAKE_NAMES[0];
  const exact = getMake(name);
  if (exact) return exact.name;
  const lower = name.toLowerCase();
  if (lower === "vw" || lower === "volkswagon") return "Volkswagen";
  if (lower === "mercedes" || lower === "merc") return "Mercedes-Benz";
  if (lower === "landrover") return "Land Rover";
  return (
    MAKE_NAMES.find((make) => make.toLowerCase().includes(lower) || lower.includes(make.toLowerCase())) ??
    name
  );
}

export const SEED_PHOTO: Record<string, string> = {
  "Ford|Fiesta": "/cars/ford-fiesta.jpg",
  "Ford|Focus": "/cars/ford-focus.jpg",
  "Ford|Puma": "/cars/ford-puma.jpg",
  "Ford|Mustang": "/cars/ford-mustang.jpg",
  "Ford|Ranger": "/cars/ford-ranger.jpg",
  "BMW|3 Series": "/cars/bmw-3-series.jpg",
  "BMW|X5": "/cars/bmw-x5.jpg",
  "Volkswagen|Golf": "/cars/vw-golf.jpg",
  "Volkswagen|Polo": "/cars/vw-polo.jpg",
  "Toyota|Corolla": "/cars/toyota-corolla.jpg",
  "Toyota|Yaris": "/cars/toyota-yaris.jpg",
  "Mini|Cooper": "/cars/mini-cooper.jpg",
};

export function photoFor(make: string, model: string) {
  return SEED_PHOTO[`${make}|${model}`] ?? null;
}
