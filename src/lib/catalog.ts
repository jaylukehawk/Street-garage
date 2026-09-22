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
  { name: "Ford", models: ["Fiesta", "Focus", "Puma", "Kuga", "Mustang", "Ranger", "Mondeo", "Transit", "Explorer", "Tourneo"], bodies: { Fiesta: "hatch", Focus: "hatch", Puma: "suv", Kuga: "suv", Mustang: "coupe", Ranger: "pickup", Mondeo: "saloon", Transit: "suv", Explorer: "suv", Tourneo: "suv" } },
  { name: "Vauxhall", models: ["Corsa", "Astra", "Mokka", "Grandland", "Combo", "Vivaro", "Insignia"], bodies: { Corsa: "hatch", Astra: "hatch", Mokka: "suv", Grandland: "suv", Combo: "suv", Vivaro: "suv", Insignia: "saloon" } },
  { name: "Volkswagen", models: ["Polo", "Golf", "T-Roc", "Tiguan", "Passat", "ID.3", "ID.4", "ID.Buzz", "Transporter", "Touareg", "Arteon"], bodies: { Polo: "hatch", Golf: "hatch", "T-Roc": "suv", Tiguan: "suv", Passat: "saloon", "ID.3": "hatch", "ID.4": "suv", "ID.Buzz": "suv", Transporter: "suv", Touareg: "suv", Arteon: "saloon" } },
  { name: "BMW", models: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "X1", "X3", "X5", "X7", "iX", "i4"], bodies: { "1 Series": "hatch", "2 Series": "coupe", "3 Series": "saloon", "4 Series": "coupe", "5 Series": "saloon", X1: "suv", X3: "suv", X5: "suv", X7: "suv", iX: "suv", i4: "saloon" } },
  { name: "Mercedes-Benz", models: ["A-Class", "C-Class", "E-Class", "CLA", "GLA", "GLC", "GLE", "Sprinter", "Vito"], bodies: { "A-Class": "hatch", "C-Class": "saloon", "E-Class": "saloon", CLA: "saloon", GLA: "suv", GLC: "suv", GLE: "suv", Sprinter: "suv", Vito: "suv" } },
  { name: "Audi", models: ["A1", "A3", "A4", "A6", "Q2", "Q3", "Q5", "Q7", "TT", "e-tron"], bodies: { A1: "hatch", A3: "hatch", A4: "saloon", A6: "saloon", Q2: "suv", Q3: "suv", Q5: "suv", Q7: "suv", TT: "coupe", "e-tron": "suv" } },
  { name: "Toyota", models: ["Yaris", "Corolla", "C-HR", "RAV4", "Aygo", "Prius", "Land Cruiser", "Hilux", "bZ4X"], bodies: { Yaris: "hatch", Corolla: "saloon", "C-HR": "suv", RAV4: "suv", Aygo: "hatch", Prius: "hatch", "Land Cruiser": "suv", Hilux: "pickup", bZ4X: "suv" } },
  { name: "Nissan", models: ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf", "Navara", "Ariya"], bodies: { Micra: "hatch", Juke: "suv", Qashqai: "suv", "X-Trail": "suv", Leaf: "hatch", Navara: "pickup", Ariya: "suv" } },
  { name: "Hyundai", models: ["i10", "i20", "i30", "Tucson", "Kona", "Santa Fe", "Ioniq 5"], bodies: { i10: "hatch", i20: "hatch", i30: "hatch", Tucson: "suv", Kona: "suv", "Santa Fe": "suv", "Ioniq 5": "suv" } },
  { name: "Kia", models: ["Picanto", "Rio", "Ceed", "Sportage", "Niro", "Sorento", "EV6"], bodies: { Picanto: "hatch", Rio: "hatch", Ceed: "hatch", Sportage: "suv", Niro: "suv", Sorento: "suv", EV6: "suv" } },
  { name: "Peugeot", models: ["208", "308", "2008", "3008", "5008", "Partner"], bodies: { "208": "hatch", "308": "hatch", "2008": "suv", "3008": "suv", "5008": "suv", Partner: "suv" } },
  { name: "Renault", models: ["Clio", "Captur", "Megane", "Kadjar", "Austral", "Trafic"], bodies: { Clio: "hatch", Captur: "suv", Megane: "hatch", Kadjar: "suv", Austral: "suv", Trafic: "suv" } },
  { name: "Skoda", models: ["Fabia", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq"], bodies: { Fabia: "hatch", Octavia: "hatch", Superb: "saloon", Kamiq: "suv", Karoq: "suv", Kodiaq: "suv", Enyaq: "suv" } },
  { name: "Seat", models: ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"], bodies: { Ibiza: "hatch", Leon: "hatch", Arona: "suv", Ateca: "suv", Tarraco: "suv" } },
  { name: "Cupra", models: ["Formentor", "Leon", "Born", "Ateca"], bodies: { Formentor: "suv", Leon: "hatch", Born: "hatch", Ateca: "suv" } },
  { name: "Mini", models: ["Cooper", "Clubman", "Countryman", "Convertible", "Aceman"], bodies: { Cooper: "mini", Clubman: "hatch", Countryman: "suv", Convertible: "mini", Aceman: "suv" } },
  { name: "Honda", models: ["Jazz", "Civic", "HR-V", "CR-V", "e"], bodies: { Jazz: "hatch", Civic: "hatch", "HR-V": "suv", "CR-V": "suv", e: "hatch" } },
  { name: "Mazda", models: ["2", "3", "CX-30", "CX-5", "MX-5"], bodies: { "2": "hatch", "3": "hatch", "CX-30": "suv", "CX-5": "suv", "MX-5": "coupe" } },
  { name: "Volvo", models: ["XC40", "XC60", "XC90", "V60", "EX30"], bodies: { XC40: "suv", XC60: "suv", XC90: "suv", V60: "saloon", EX30: "suv" } },
  { name: "Land Rover", models: ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Evoque"], bodies: { Defender: "suv", Discovery: "suv", "Discovery Sport": "suv", "Range Rover": "suv", "Range Rover Sport": "suv", "Range Rover Evoque": "suv" } },
  { name: "Jaguar", models: ["XE", "XF", "F-Pace", "E-Pace", "I-Pace", "F-Type"], bodies: { XE: "saloon", XF: "saloon", "F-Pace": "suv", "E-Pace": "suv", "I-Pace": "suv", "F-Type": "coupe" } },
  { name: "Tesla", models: ["Model 3", "Model Y", "Model S", "Model X"], bodies: { "Model 3": "saloon", "Model Y": "suv", "Model S": "saloon", "Model X": "suv" } },
  { name: "Citroen", models: ["C3", "C4", "C5 Aircross", "Berlingo"], bodies: { C3: "hatch", C4: "hatch", "C5 Aircross": "suv", Berlingo: "suv" } },
  { name: "Fiat", models: ["500", "Panda", "Tipo", "500X"], bodies: { "500": "mini", Panda: "hatch", Tipo: "hatch", "500X": "suv" } },
  { name: "Abarth", models: ["595", "695", "500e"], bodies: { "595": "mini", "695": "mini", "500e": "mini" } },
  { name: "Suzuki", models: ["Swift", "Ignis", "Vitara", "S-Cross", "Jimny"], bodies: { Swift: "hatch", Ignis: "suv", Vitara: "suv", "S-Cross": "suv", Jimny: "suv" } },
  { name: "MG", models: ["MG3", "MG4", "MG5", "ZS", "HS"], bodies: { MG3: "hatch", MG4: "hatch", MG5: "saloon", ZS: "suv", HS: "suv" } },
  { name: "Dacia", models: ["Sandero", "Duster", "Jogger", "Spring", "Bigster"], bodies: { Sandero: "hatch", Duster: "suv", Jogger: "suv", Spring: "hatch", Bigster: "suv" } },
  { name: "Jeep", models: ["Avenger", "Renegade", "Compass", "Wrangler"], bodies: { Avenger: "suv", Renegade: "suv", Compass: "suv", Wrangler: "suv" } },
  { name: "Lexus", models: ["UX", "NX", "RX", "IS", "LBX"], bodies: { UX: "suv", NX: "suv", RX: "suv", IS: "saloon", LBX: "suv" } },
  { name: "Porsche", models: ["911", "Cayenne", "Macan", "Panamera", "Taycan"], bodies: { "911": "coupe", Cayenne: "suv", Macan: "suv", Panamera: "saloon", Taycan: "saloon" } },
  { name: "Alfa Romeo", models: ["Giulia", "Stelvio", "Tonale", "Junior"], bodies: { Giulia: "saloon", Stelvio: "suv", Tonale: "suv", Junior: "suv" } },
  { name: "DS", models: ["DS 3", "DS 4", "DS 7"], bodies: { "DS 3": "suv", "DS 4": "hatch", "DS 7": "suv" } },
  { name: "Polestar", models: ["2", "3", "4"], bodies: { "2": "saloon", "3": "suv", "4": "suv" } },
  { name: "BYD", models: ["Atto 3", "Dolphin", "Seal", "Seal U"], bodies: { "Atto 3": "suv", Dolphin: "hatch", Seal: "saloon", "Seal U": "suv" } },
  { name: "Genesis", models: ["GV60", "GV70", "G70"], bodies: { GV60: "suv", GV70: "suv", G70: "saloon" } },
  { name: "Subaru", models: ["Impreza", "XV", "Forester", "Outback", "Solterra"], bodies: { Impreza: "hatch", XV: "suv", Forester: "suv", Outback: "suv", Solterra: "suv" } },
  { name: "Mitsubishi", models: ["ASX", "Outlander", "L200", "Colt"], bodies: { ASX: "suv", Outlander: "suv", L200: "pickup", Colt: "hatch" } },
  { name: "Isuzu", models: ["D-Max"], bodies: { "D-Max": "pickup" } },
  { name: "SsangYong", models: ["Tivoli", "Korando", "Musso", "Rexton"], bodies: { Tivoli: "suv", Korando: "suv", Musso: "pickup", Rexton: "suv" } },
  { name: "Smart", models: ["Fortwo", "Hashtag 1", "Hashtag 3"], bodies: { Fortwo: "mini", "Hashtag 1": "suv", "Hashtag 3": "suv" } },
  { name: "Chevrolet", models: ["Spark", "Aveo", "Captiva", "Camaro"], bodies: { Spark: "hatch", Aveo: "hatch", Captiva: "suv", Camaro: "coupe" } },
  { name: "Chrysler", models: ["300C", "Grand Voyager"], bodies: { "300C": "saloon", "Grand Voyager": "suv" } },
  { name: "Aston Martin", models: ["DB12", "Vantage", "DBX"], bodies: { DB12: "coupe", Vantage: "coupe", DBX: "suv" } },
  { name: "Bentley", models: ["Continental", "Bentayga", "Flying Spur"], bodies: { Continental: "coupe", Bentayga: "suv", "Flying Spur": "saloon" } },
  { name: "Rolls-Royce", models: ["Ghost", "Phantom", "Cullinan"], bodies: { Ghost: "saloon", Phantom: "saloon", Cullinan: "suv" } },
  { name: "Ferrari", models: ["296", "Roma", "Purosangue", "SF90"], bodies: { "296": "coupe", Roma: "coupe", Purosangue: "suv", SF90: "coupe" } },
  { name: "Lamborghini", models: ["Huracan", "Urus", "Revuelto"], bodies: { Huracan: "coupe", Urus: "suv", Revuelto: "coupe" } },
  { name: "McLaren", models: ["720S", "Artura", "750S"], bodies: { "720S": "coupe", Artura: "coupe", "750S": "coupe" } },
  { name: "Maserati", models: ["Ghibli", "Levante", "Grecale", "GranTurismo"], bodies: { Ghibli: "saloon", Levante: "suv", Grecale: "suv", GranTurismo: "coupe" } },
  { name: "Lotus", models: ["Emira", "Eletre"], bodies: { Emira: "coupe", Eletre: "suv" } },
  { name: "Alpine", models: ["A110"], bodies: { A110: "coupe" } },
  { name: "Ineos", models: ["Grenadier"], bodies: { Grenadier: "suv" } },
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
