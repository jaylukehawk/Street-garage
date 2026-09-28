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
  { name: "Ford", models: ["Ka", "Ka+", "Fiesta", "Focus", "Fusion", "Mondeo", "Puma", "Kuga", "EcoSport", "Edge", "Explorer", "Mustang", "Mustang Mach-E", "Ranger", "Ranger Raptor", "Maverick", "Transit", "Transit Custom", "Transit Connect", "Tourneo", "Tourneo Custom", "Tourneo Connect", "S-Max", "Galaxy", "B-Max", "C-Max", "Grand C-Max", "StreetKa", "Puma ST", "Focus ST", "Focus RS", "Fiesta ST", "Capri", "GT", "Escort", "Sierra", "Cortina", "Granada", "Probe", "Cougar", "Thunderbird", "Bronco", "Everest"], bodies: { "Ka": "hatch", "Ka+": "hatch", "Fiesta": "hatch", "Focus": "hatch", "Fusion": "hatch", "Mondeo": "saloon", "Puma": "suv", "Kuga": "suv", "EcoSport": "suv", "Edge": "suv", "Explorer": "suv", "Mustang": "coupe", "Mustang Mach-E": "suv", "Ranger": "pickup", "Ranger Raptor": "pickup", "Maverick": "pickup", "Transit": "suv", "Transit Custom": "suv", "Transit Connect": "suv", "Tourneo": "suv", "Tourneo Custom": "suv", "Tourneo Connect": "suv", "S-Max": "suv", "Galaxy": "suv", "B-Max": "hatch", "C-Max": "hatch", "Grand C-Max": "hatch", "StreetKa": "coupe", "Puma ST": "suv", "Focus ST": "hatch", "Focus RS": "hatch", "Fiesta ST": "hatch", "Capri": "coupe", "GT": "coupe", "Escort": "hatch", "Sierra": "saloon", "Cortina": "saloon", "Granada": "saloon", "Probe": "coupe", "Cougar": "coupe", "Thunderbird": "coupe", "Bronco": "suv", "Everest": "suv" } },
  { name: "Vauxhall", models: ["Corsa", "Astra", "Insignia", "Vectra", "Signum", "Mokka", "Crossland", "Grandland", "Frontera", "Antara", "Adam", "Viva", "Karl", "Meriva", "Zafira", "Zafira Tourer", "Combo", "Combo Life", "Vivaro", "Movano", "Corsavan", "Astravan", "Tigra", "Calibra", "Omega", "Cavalier", "Nova", "Corsa-e", "Mokka-e", "Astra Sports Tourer"], bodies: { "Corsa": "hatch", "Astra": "hatch", "Insignia": "saloon", "Vectra": "saloon", "Signum": "saloon", "Mokka": "suv", "Crossland": "suv", "Grandland": "suv", "Frontera": "suv", "Antara": "suv", "Adam": "mini", "Viva": "hatch", "Karl": "hatch", "Meriva": "hatch", "Zafira": "suv", "Zafira Tourer": "suv", "Combo": "suv", "Combo Life": "suv", "Vivaro": "suv", "Movano": "suv", "Corsavan": "hatch", "Astravan": "hatch", "Tigra": "coupe", "Calibra": "coupe", "Omega": "saloon", "Cavalier": "saloon", "Nova": "hatch", "Corsa-e": "hatch", "Mokka-e": "suv", "Astra Sports Tourer": "saloon" } },
  { name: "Volkswagen", models: ["Up", "Polo", "Golf", "Golf GTI", "Golf R", "ID.3", "ID.4", "ID.5", "ID.7", "ID.Buzz", "T-Cross", "T-Roc", "Tiguan", "Tiguan Allspace", "Touareg", "Tayron", "Passat", "Arteon", "CC", "Jetta", "Touran", "Sharan", "Caddy", "Caddy Maxi", "Transporter", "Caravelle", "Multivan", "California", "Crafter", "Amarok", "Scirocco", "Beetle", "Eos", "Phaeton", "Lupo", "Fox", "Bora", "Corrado", "Tiguan eHybrid"], bodies: { "Up": "mini", "Polo": "hatch", "Golf": "hatch", "Golf GTI": "hatch", "Golf R": "hatch", "ID.3": "hatch", "ID.4": "suv", "ID.5": "suv", "ID.7": "saloon", "ID.Buzz": "suv", "T-Cross": "suv", "T-Roc": "suv", "Tiguan": "suv", "Tiguan Allspace": "suv", "Touareg": "suv", "Tayron": "suv", "Passat": "saloon", "Arteon": "saloon", "CC": "saloon", "Jetta": "saloon", "Touran": "suv", "Sharan": "suv", "Caddy": "suv", "Caddy Maxi": "suv", "Transporter": "suv", "Caravelle": "suv", "Multivan": "suv", "California": "suv", "Crafter": "suv", "Amarok": "pickup", "Scirocco": "coupe", "Beetle": "hatch", "Eos": "coupe", "Phaeton": "saloon", "Lupo": "mini", "Fox": "hatch", "Bora": "saloon", "Corrado": "coupe", "Tiguan eHybrid": "suv" } },
  { name: "BMW", models: ["1 Series", "2 Series", "2 Series Active Tourer", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "XM", "Z3", "Z4", "Z8", "i3", "i4", "i5", "i7", "iX", "iX1", "iX2", "iX3", "M2", "M3", "M4", "M5", "i8"], bodies: { "1 Series": "hatch", "2 Series": "coupe", "2 Series Active Tourer": "hatch", "3 Series": "saloon", "4 Series": "coupe", "5 Series": "saloon", "6 Series": "coupe", "7 Series": "saloon", "8 Series": "coupe", "X1": "suv", "X2": "suv", "X3": "suv", "X4": "suv", "X5": "suv", "X6": "suv", "X7": "suv", "XM": "suv", "Z3": "coupe", "Z4": "coupe", "Z8": "coupe", "i3": "hatch", "i4": "saloon", "i5": "saloon", "i7": "saloon", "iX": "suv", "iX1": "suv", "iX2": "suv", "iX3": "suv", "M2": "coupe", "M3": "saloon", "M4": "coupe", "M5": "saloon", "i8": "coupe" } },
  { name: "Mercedes-Benz", models: ["A-Class", "B-Class", "C-Class", "E-Class", "S-Class", "CLA", "CLS", "CLE", "CL", "CLK", "SL", "SLK", "SLC", "SLR", "SLS", "AMG GT", "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "EQA", "EQB", "EQC", "EQE", "EQS", "EQE SUV", "EQS SUV", "Sprinter", "Vito", "V-Class", "Citan", "eVito", "eSprinter", "X-Class", "M-Class", "GL", "R-Class", "Maybach S-Class", "CLE Coupe"], bodies: { "A-Class": "hatch", "B-Class": "hatch", "C-Class": "saloon", "E-Class": "saloon", "S-Class": "saloon", "CLA": "saloon", "CLS": "saloon", "CLE": "coupe", "CL": "coupe", "CLK": "coupe", "SL": "coupe", "SLK": "coupe", "SLC": "coupe", "SLR": "coupe", "SLS": "coupe", "AMG GT": "coupe", "GLA": "suv", "GLB": "suv", "GLC": "suv", "GLE": "suv", "GLS": "suv", "G-Class": "suv", "EQA": "suv", "EQB": "suv", "EQC": "suv", "EQE": "saloon", "EQS": "saloon", "EQE SUV": "suv", "EQS SUV": "suv", "Sprinter": "suv", "Vito": "suv", "V-Class": "suv", "Citan": "suv", "eVito": "suv", "eSprinter": "suv", "X-Class": "pickup", "M-Class": "suv", "GL": "suv", "R-Class": "suv", "Maybach S-Class": "saloon", "CLE Coupe": "coupe" } },
  { name: "Audi", models: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q6 e-tron", "Q7", "Q8", "Q8 e-tron", "TT", "R8", "e-tron", "e-tron GT", "RS3", "RS4", "RS5", "RS6", "RS7", "RS Q8", "SQ5", "S3", "S4"], bodies: { "A1": "hatch", "A2": "hatch", "A3": "hatch", "A4": "saloon", "A5": "coupe", "A6": "saloon", "A7": "saloon", "A8": "saloon", "Q2": "suv", "Q3": "suv", "Q4 e-tron": "suv", "Q5": "suv", "Q6 e-tron": "suv", "Q7": "suv", "Q8": "suv", "Q8 e-tron": "suv", "TT": "coupe", "R8": "coupe", "e-tron": "suv", "e-tron GT": "saloon", "RS3": "hatch", "RS4": "saloon", "RS5": "coupe", "RS6": "saloon", "RS7": "saloon", "RS Q8": "suv", "SQ5": "suv", "S3": "hatch", "S4": "saloon" } },
  { name: "Toyota", models: ["Aygo", "Aygo X", "Yaris", "Yaris Cross", "GR Yaris", "Corolla", "Corolla Cross", "Camry", "Prius", "Prius+", "C-HR", "RAV4", "bZ4X", "Highlander", "Land Cruiser", "Hilux", "Proace", "Proace City", "Proace Verso", "Supra", "GR86", "GT86", "Celica", "MR2", "Avensis", "Auris", "Verso", "Urban Cruiser", "IQ", "Picnic", "Previa", "Estima", "Alphard", "Crown", "Mirai"], bodies: { "Aygo": "hatch", "Aygo X": "hatch", "Yaris": "hatch", "Yaris Cross": "suv", "GR Yaris": "hatch", "Corolla": "saloon", "Corolla Cross": "suv", "Camry": "saloon", "Prius": "hatch", "Prius+": "hatch", "C-HR": "suv", "RAV4": "suv", "bZ4X": "suv", "Highlander": "suv", "Land Cruiser": "suv", "Hilux": "pickup", "Proace": "suv", "Proace City": "suv", "Proace Verso": "suv", "Supra": "coupe", "GR86": "coupe", "GT86": "coupe", "Celica": "coupe", "MR2": "coupe", "Avensis": "saloon", "Auris": "hatch", "Verso": "hatch", "Urban Cruiser": "suv", "IQ": "mini", "Picnic": "suv", "Previa": "suv", "Estima": "suv", "Alphard": "suv", "Crown": "saloon", "Mirai": "saloon" } },
  { name: "Nissan", models: ["Micra", "Note", "Pulsar", "Leaf", "Juke", "Qashqai", "X-Trail", "Ariya", "Pathfinder", "Murano", "Navara", "Townstar", "Primastar", "Interstar", "NV200", "e-NV200", "370Z", "350Z", "GT-R", "400Z", "Cube", "Almera", "Primera", "Maxima", "Terrano", "Patrol", "Figaro", "Silvia", "Skyline"], bodies: { "Micra": "hatch", "Note": "hatch", "Pulsar": "hatch", "Leaf": "hatch", "Juke": "suv", "Qashqai": "suv", "X-Trail": "suv", "Ariya": "suv", "Pathfinder": "suv", "Murano": "suv", "Navara": "pickup", "Townstar": "suv", "Primastar": "suv", "Interstar": "suv", "NV200": "suv", "e-NV200": "suv", "370Z": "coupe", "350Z": "coupe", "GT-R": "coupe", "400Z": "coupe", "Cube": "hatch", "Almera": "hatch", "Primera": "saloon", "Maxima": "saloon", "Terrano": "suv", "Patrol": "suv", "Figaro": "coupe", "Silvia": "coupe", "Skyline": "coupe" } },
  { name: "Hyundai", models: ["i10", "i20", "i30", "i40", "Bayon", "Kona", "Tucson", "Santa Fe", "Ioniq", "Ioniq 5", "Ioniq 6", "Ioniq 9", "i800", "Staria", "Coupe", "Veloster", "Genesis Coupe", "ix20", "ix35", "Santa Cruz", "Nexo", "Getz", "Accent", "Elantra", "Sonata"], bodies: { "i10": "hatch", "i20": "hatch", "i30": "hatch", "i40": "saloon", "Bayon": "suv", "Kona": "suv", "Tucson": "suv", "Santa Fe": "suv", "Ioniq": "hatch", "Ioniq 5": "suv", "Ioniq 6": "saloon", "Ioniq 9": "suv", "i800": "suv", "Staria": "suv", "Coupe": "coupe", "Veloster": "coupe", "Genesis Coupe": "coupe", "ix20": "hatch", "ix35": "suv", "Santa Cruz": "pickup", "Nexo": "suv", "Getz": "hatch", "Accent": "hatch", "Elantra": "saloon", "Sonata": "saloon" } },
  { name: "Kia", models: ["Picanto", "Rio", "Ceed", "Proceed", "XCeed", "Stonic", "Niro", "Sportage", "Sorento", "EV3", "EV6", "EV9", "Soul", "Venga", "Carens", "Sedona", "Carnival", "Stinger", "Optima", "Magentis", "Pride", "e-Niro", "EV4"], bodies: { "Picanto": "hatch", "Rio": "hatch", "Ceed": "hatch", "Proceed": "hatch", "XCeed": "suv", "Stonic": "suv", "Niro": "suv", "Sportage": "suv", "Sorento": "suv", "EV3": "suv", "EV6": "suv", "EV9": "suv", "Soul": "suv", "Venga": "hatch", "Carens": "suv", "Sedona": "suv", "Carnival": "suv", "Stinger": "saloon", "Optima": "saloon", "Magentis": "saloon", "Pride": "hatch", "e-Niro": "suv", "EV4": "saloon" } },
  { name: "Peugeot", models: ["107", "108", "206", "207", "208", "306", "307", "308", "407", "408", "508", "2008", "3008", "4008", "5008", "RCZ", "Partner", "Rifter", "Expert", "Traveller", "Boxer", "iOn", "e-208", "e-2008", "e-308", "e-3008"], bodies: { "107": "mini", "108": "mini", "206": "hatch", "207": "hatch", "208": "hatch", "306": "hatch", "307": "hatch", "308": "hatch", "407": "saloon", "408": "saloon", "508": "saloon", "2008": "suv", "3008": "suv", "4008": "suv", "5008": "suv", "RCZ": "coupe", "Partner": "suv", "Rifter": "suv", "Expert": "suv", "Traveller": "suv", "Boxer": "suv", "iOn": "mini", "e-208": "hatch", "e-2008": "suv", "e-308": "hatch", "e-3008": "suv" } },
  { name: "Renault", models: ["Twingo", "Clio", "Megane", "Megane E-Tech", "Scenic", "Scenic E-Tech", "Kadjar", "Captur", "Austral", "Arkana", "Rafale", "Zoe", "5 E-Tech", "4 E-Tech", "Trafic", "Master", "Kangoo", "Kangoo E-Tech", "Twizy", "Wind", "Laguna", "Latitude", "Talisman", "Espace", "Grand Scenic", "Modus", "Fluence"], bodies: { "Twingo": "mini", "Clio": "hatch", "Megane": "hatch", "Megane E-Tech": "hatch", "Scenic": "suv", "Scenic E-Tech": "suv", "Kadjar": "suv", "Captur": "suv", "Austral": "suv", "Arkana": "suv", "Rafale": "suv", "Zoe": "hatch", "5 E-Tech": "hatch", "4 E-Tech": "suv", "Trafic": "suv", "Master": "suv", "Kangoo": "suv", "Kangoo E-Tech": "suv", "Twizy": "mini", "Wind": "coupe", "Laguna": "saloon", "Latitude": "saloon", "Talisman": "saloon", "Espace": "suv", "Grand Scenic": "suv", "Modus": "hatch", "Fluence": "saloon" } },
  { name: "Skoda", models: ["Citigo", "Fabia", "Scala", "Rapid", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq", "Elroq", "Yeti", "Roomster", "Felicia", "Enyaq Coupe"], bodies: { "Citigo": "mini", "Fabia": "hatch", "Scala": "hatch", "Rapid": "saloon", "Octavia": "hatch", "Superb": "saloon", "Kamiq": "suv", "Karoq": "suv", "Kodiaq": "suv", "Enyaq": "suv", "Elroq": "suv", "Yeti": "suv", "Roomster": "hatch", "Felicia": "hatch", "Enyaq Coupe": "suv" } },
  { name: "Seat", models: ["Mii", "Ibiza", "Leon", "Toledo", "Exeo", "Arona", "Ateca", "Tarraco", "Alhambra", "Altea", "Cordoba", "Arosa"], bodies: { "Mii": "mini", "Ibiza": "hatch", "Leon": "hatch", "Toledo": "saloon", "Exeo": "saloon", "Arona": "suv", "Ateca": "suv", "Tarraco": "suv", "Alhambra": "suv", "Altea": "hatch", "Cordoba": "saloon", "Arosa": "mini" } },
  { name: "Cupra", models: ["Leon", "Formentor", "Ateca", "Born", "Tavascan", "Terramar", "Raval"], bodies: { "Leon": "hatch", "Formentor": "suv", "Ateca": "suv", "Born": "hatch", "Tavascan": "suv", "Terramar": "suv", "Raval": "hatch" } },
  { name: "Mini", models: ["Cooper", "Cooper S", "Cooper SE", "Convertible", "Clubman", "Countryman", "Paceman", "Aceman", "John Cooper Works", "Coupe", "Roadster"], bodies: { "Cooper": "mini", "Cooper S": "mini", "Cooper SE": "mini", "Convertible": "mini", "Clubman": "hatch", "Countryman": "suv", "Paceman": "suv", "Aceman": "suv", "John Cooper Works": "mini", "Coupe": "coupe", "Roadster": "coupe" } },
  { name: "Honda", models: ["Jazz", "Civic", "Civic Type R", "HR-V", "CR-V", "ZR-V", "e", "e:Ny1", "Accord", "Insight", "CR-Z", "S2000", "NSX", "Prelude", "Stream", "FR-V", "Legend", "Integra"], bodies: { "Jazz": "hatch", "Civic": "hatch", "Civic Type R": "hatch", "HR-V": "suv", "CR-V": "suv", "ZR-V": "suv", "e": "hatch", "e:Ny1": "suv", "Accord": "saloon", "Insight": "hatch", "CR-Z": "coupe", "S2000": "coupe", "NSX": "coupe", "Prelude": "coupe", "Stream": "suv", "FR-V": "suv", "Legend": "saloon", "Integra": "coupe" } },
  { name: "Mazda", models: ["2", "3", "6", "CX-3", "CX-30", "CX-5", "CX-60", "CX-80", "MX-5", "MX-30", "RX-8", "RX-7", "5", "CX-7", "Premacy", "MPV"], bodies: { "2": "hatch", "3": "hatch", "6": "saloon", "CX-3": "suv", "CX-30": "suv", "CX-5": "suv", "CX-60": "suv", "CX-80": "suv", "MX-5": "coupe", "MX-30": "suv", "RX-8": "coupe", "RX-7": "coupe", "5": "suv", "CX-7": "suv", "Premacy": "suv", "MPV": "suv" } },
  { name: "Volvo", models: ["C30", "C40", "V40", "V50", "V60", "V70", "V90", "S40", "S60", "S80", "S90", "XC40", "XC60", "XC70", "XC90", "EX30", "EX90", "C70", "850", "940", "960"], bodies: { "C30": "hatch", "C40": "suv", "V40": "hatch", "V50": "saloon", "V60": "saloon", "V70": "saloon", "V90": "saloon", "S40": "saloon", "S60": "saloon", "S80": "saloon", "S90": "saloon", "XC40": "suv", "XC60": "suv", "XC70": "suv", "XC90": "suv", "EX30": "suv", "EX90": "suv", "C70": "coupe", "850": "saloon", "940": "saloon", "960": "saloon" } },
  { name: "Land Rover", models: ["Defender", "Defender 90", "Defender 110", "Defender 130", "Discovery", "Discovery Sport", "Freelander", "Freelander 2", "Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque", "Series I", "Series II", "Series III"], bodies: { "Defender": "suv", "Defender 90": "suv", "Defender 110": "suv", "Defender 130": "suv", "Discovery": "suv", "Discovery Sport": "suv", "Freelander": "suv", "Freelander 2": "suv", "Range Rover": "suv", "Range Rover Sport": "suv", "Range Rover Velar": "suv", "Range Rover Evoque": "suv", "Series I": "suv", "Series II": "suv", "Series III": "suv" } },
  { name: "Jaguar", models: ["XE", "XF", "XJ", "X-Type", "S-Type", "F-Pace", "E-Pace", "I-Pace", "F-Type", "XK", "XK8", "XKR", "E-Type"], bodies: { "XE": "saloon", "XF": "saloon", "XJ": "saloon", "X-Type": "saloon", "S-Type": "saloon", "F-Pace": "suv", "E-Pace": "suv", "I-Pace": "suv", "F-Type": "coupe", "XK": "coupe", "XK8": "coupe", "XKR": "coupe", "E-Type": "coupe" } },
  { name: "Tesla", models: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck", "Roadster"], bodies: { "Model 3": "saloon", "Model Y": "suv", "Model S": "saloon", "Model X": "suv", "Cybertruck": "pickup", "Roadster": "coupe" } },
  { name: "Citroen", models: ["C1", "C2", "C3", "C3 Aircross", "C3 Picasso", "C4", "C4 Cactus", "C4 Picasso", "Grand C4 Picasso", "C4 X", "C5", "C5 Aircross", "C5 X", "C6", "Berlingo", "Dispatch", "SpaceTourer", "Relay", "Ami", "DS3", "Saxo", "Xsara", "Xsara Picasso", "e-C3", "e-C4"], bodies: { "C1": "mini", "C2": "hatch", "C3": "hatch", "C3 Aircross": "suv", "C3 Picasso": "hatch", "C4": "hatch", "C4 Cactus": "suv", "C4 Picasso": "suv", "Grand C4 Picasso": "suv", "C4 X": "saloon", "C5": "saloon", "C5 Aircross": "suv", "C5 X": "saloon", "C6": "saloon", "Berlingo": "suv", "Dispatch": "suv", "SpaceTourer": "suv", "Relay": "suv", "Ami": "mini", "DS3": "hatch", "Saxo": "hatch", "Xsara": "hatch", "Xsara Picasso": "hatch", "e-C3": "hatch", "e-C4": "hatch" } },
  { name: "Fiat", models: ["500", "500C", "500X", "500L", "500e", "Panda", "Punto", "Grande Punto", "Tipo", "Bravo", "Stilo", "Doblo", "Qubo", "Doblo Cargo", "Scudo", "Ducato", "Talento", "124 Spider", "Barchetta", "Coupe", "Multipla", "Sedici"], bodies: { "500": "mini", "500C": "mini", "500X": "suv", "500L": "suv", "500e": "mini", "Panda": "hatch", "Punto": "hatch", "Grande Punto": "hatch", "Tipo": "hatch", "Bravo": "hatch", "Stilo": "hatch", "Doblo": "suv", "Qubo": "suv", "Doblo Cargo": "suv", "Scudo": "suv", "Ducato": "suv", "Talento": "suv", "124 Spider": "coupe", "Barchetta": "coupe", "Coupe": "coupe", "Multipla": "suv", "Sedici": "suv" } },
  { name: "Abarth", models: ["595", "595 Competizione", "695", "500e", "124 Spider", "Punto"], bodies: { "595": "mini", "595 Competizione": "mini", "695": "mini", "500e": "mini", "124 Spider": "coupe", "Punto": "hatch" } },
  { name: "Suzuki", models: ["Alto", "Celerio", "Swift", "Swift Sport", "Ignis", "Vitara", "S-Cross", "Jimny", "Across", "SX4", "Baleno", "Splash", "Wagon R", "Grand Vitara", "Liana", "Carry"], bodies: { "Alto": "mini", "Celerio": "hatch", "Swift": "hatch", "Swift Sport": "hatch", "Ignis": "suv", "Vitara": "suv", "S-Cross": "suv", "Jimny": "suv", "Across": "suv", "SX4": "hatch", "Baleno": "hatch", "Splash": "hatch", "Wagon R": "hatch", "Grand Vitara": "suv", "Liana": "hatch", "Carry": "pickup" } },
  { name: "MG", models: ["MG3", "MG4", "MG5", "ZS", "HS", "Cyberster", "Marvel R", "TF", "F", "ZR", "ZS ICE", "MG6", "MG7"], bodies: { "MG3": "hatch", "MG4": "hatch", "MG5": "saloon", "ZS": "suv", "HS": "suv", "Cyberster": "coupe", "Marvel R": "suv", "TF": "coupe", "F": "coupe", "ZR": "hatch", "ZS ICE": "suv", "MG6": "saloon", "MG7": "saloon" } },
  { name: "Dacia", models: ["Sandero", "Sandero Stepway", "Logan", "Duster", "Jogger", "Spring", "Bigster", "Lodgy", "Dokker"], bodies: { "Sandero": "hatch", "Sandero Stepway": "hatch", "Logan": "saloon", "Duster": "suv", "Jogger": "suv", "Spring": "hatch", "Bigster": "suv", "Lodgy": "suv", "Dokker": "suv" } },
  { name: "Jeep", models: ["Avenger", "Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator", "Patriot", "Commander"], bodies: { "Avenger": "suv", "Renegade": "suv", "Compass": "suv", "Cherokee": "suv", "Grand Cherokee": "suv", "Wrangler": "suv", "Gladiator": "pickup", "Patriot": "suv", "Commander": "suv" } },
  { name: "Lexus", models: ["CT", "IS", "ES", "GS", "LS", "RC", "LC", "UX", "NX", "RX", "RZ", "LBX", "GX", "LX", "LM", "SC"], bodies: { "CT": "hatch", "IS": "saloon", "ES": "saloon", "GS": "saloon", "LS": "saloon", "RC": "coupe", "LC": "coupe", "UX": "suv", "NX": "suv", "RX": "suv", "RZ": "suv", "LBX": "suv", "GX": "suv", "LX": "suv", "LM": "suv", "SC": "coupe" } },
  { name: "Porsche", models: ["911", "911 GT3", "718 Cayman", "718 Boxster", "Cayman", "Boxster", "Panamera", "Taycan", "Macan", "Cayenne", "918 Spyder", "Carrera GT"], bodies: { "911": "coupe", "911 GT3": "coupe", "718 Cayman": "coupe", "718 Boxster": "coupe", "Cayman": "coupe", "Boxster": "coupe", "Panamera": "saloon", "Taycan": "saloon", "Macan": "suv", "Cayenne": "suv", "918 Spyder": "coupe", "Carrera GT": "coupe" } },
  { name: "Alfa Romeo", models: ["Giulia", "Stelvio", "Tonale", "Junior", "Giulietta", "MiTo", "159", "156", "147", "166", "Brera", "Spider", "4C", "GT", "GTV", "33", "75"], bodies: { "Giulia": "saloon", "Stelvio": "suv", "Tonale": "suv", "Junior": "suv", "Giulietta": "hatch", "MiTo": "hatch", "159": "saloon", "156": "saloon", "147": "hatch", "166": "saloon", "Brera": "coupe", "Spider": "coupe", "4C": "coupe", "GT": "coupe", "GTV": "coupe", "33": "hatch", "75": "saloon" } },
  { name: "DS", models: ["DS 3", "DS 3 Crossback", "DS 4", "DS 5", "DS 7", "DS 9", "DS 4 E-Tense"], bodies: { "DS 3": "suv", "DS 3 Crossback": "suv", "DS 4": "hatch", "DS 5": "hatch", "DS 7": "suv", "DS 9": "saloon", "DS 4 E-Tense": "hatch" } },
  { name: "Polestar", models: ["1", "2", "3", "4", "5"], bodies: { "1": "coupe", "2": "saloon", "3": "suv", "4": "suv", "5": "saloon" } },
  { name: "BYD", models: ["Atto 2", "Atto 3", "Dolphin", "Seal", "Seal U", "Sealion 7", "Tang", "Han"], bodies: { "Atto 2": "suv", "Atto 3": "suv", "Dolphin": "hatch", "Seal": "saloon", "Seal U": "suv", "Sealion 7": "suv", "Tang": "suv", "Han": "saloon" } },
  { name: "Genesis", models: ["G70", "G80", "G90", "GV60", "GV70", "GV80", "Electrified G80"], bodies: { "G70": "saloon", "G80": "saloon", "G90": "saloon", "GV60": "suv", "GV70": "suv", "GV80": "suv", "Electrified G80": "saloon" } },
  { name: "Subaru", models: ["Impreza", "WRX", "WRX STI", "XV", "Crosstrek", "Forester", "Outback", "Levorg", "Legacy", "BRZ", "Solterra", "Justy", "Tribeca"], bodies: { "Impreza": "hatch", "WRX": "saloon", "WRX STI": "saloon", "XV": "suv", "Crosstrek": "suv", "Forester": "suv", "Outback": "suv", "Levorg": "saloon", "Legacy": "saloon", "BRZ": "coupe", "Solterra": "suv", "Justy": "hatch", "Tribeca": "suv" } },
  { name: "Mitsubishi", models: ["Colt", "Mirage", "Lancer", "ASX", "Eclipse Cross", "Outlander", "Outlander PHEV", "Shogun", "Shogun Sport", "L200", "i-MiEV", "Grandis", "Carisma"], bodies: { "Colt": "hatch", "Mirage": "hatch", "Lancer": "saloon", "ASX": "suv", "Eclipse Cross": "suv", "Outlander": "suv", "Outlander PHEV": "suv", "Shogun": "suv", "Shogun Sport": "suv", "L200": "pickup", "i-MiEV": "mini", "Grandis": "suv", "Carisma": "hatch" } },
  { name: "Isuzu", models: ["D-Max", "Rodeo", "Trooper", "TF"], bodies: { "D-Max": "pickup", "Rodeo": "pickup", "Trooper": "suv", "TF": "pickup" } },
  { name: "SsangYong", models: ["Tivoli", "Korando", "Musso", "Rexton", "Actyon", "Kyron", "Rodius", "Turismo"], bodies: { "Tivoli": "suv", "Korando": "suv", "Musso": "pickup", "Rexton": "suv", "Actyon": "suv", "Kyron": "suv", "Rodius": "suv", "Turismo": "suv" } },
  { name: "KGM", models: ["Tivoli", "Korando", "Musso", "Rexton", "Torres", "Actyon"], bodies: { "Tivoli": "suv", "Korando": "suv", "Musso": "pickup", "Rexton": "suv", "Torres": "suv", "Actyon": "suv" } },
  { name: "Smart", models: ["Fortwo", "Forfour", "Roadster", "Hashtag 1", "Hashtag 3", "#1", "#3"], bodies: { "Fortwo": "mini", "Forfour": "mini", "Roadster": "coupe", "Hashtag 1": "suv", "Hashtag 3": "suv", "#1": "suv", "#3": "suv" } },
  { name: "Chevrolet", models: ["Spark", "Matiz", "Aveo", "Cruze", "Captiva", "Orlando", "Trax", "Camaro", "Corvette", "Tahoe", "Silverado", "Kalos", "Lacetti", "Epica"], bodies: { "Spark": "hatch", "Matiz": "mini", "Aveo": "hatch", "Cruze": "saloon", "Captiva": "suv", "Orlando": "suv", "Trax": "suv", "Camaro": "coupe", "Corvette": "coupe", "Tahoe": "suv", "Silverado": "pickup", "Kalos": "hatch", "Lacetti": "hatch", "Epica": "saloon" } },
  { name: "Chrysler", models: ["300C", "300", "Grand Voyager", "Voyager", "PT Cruiser", "Crossfire", "Neon", "Delta"], bodies: { "300C": "saloon", "300": "saloon", "Grand Voyager": "suv", "Voyager": "suv", "PT Cruiser": "hatch", "Crossfire": "coupe", "Neon": "saloon", "Delta": "hatch" } },
  { name: "Dodge", models: ["Caliber", "Journey", "Nitro", "Avenger", "Challenger", "Charger", "Ram", "Viper", "Durango"], bodies: { "Caliber": "hatch", "Journey": "suv", "Nitro": "suv", "Avenger": "saloon", "Challenger": "coupe", "Charger": "saloon", "Ram": "pickup", "Viper": "coupe", "Durango": "suv" } },
  { name: "Aston Martin", models: ["DB9", "DB11", "DB12", "DBS", "DBX", "Vantage", "V8 Vantage", "Vanquish", "Rapide", "Valkyrie", "Valhalla", "DB7", "Virage"], bodies: { "DB9": "coupe", "DB11": "coupe", "DB12": "coupe", "DBS": "coupe", "DBX": "suv", "Vantage": "coupe", "V8 Vantage": "coupe", "Vanquish": "coupe", "Rapide": "saloon", "Valkyrie": "coupe", "Valhalla": "coupe", "DB7": "coupe", "Virage": "coupe" } },
  { name: "Bentley", models: ["Continental", "Continental GT", "Flying Spur", "Bentayga", "Mulsanne", "Arnage", "Azure", "Brooklands"], bodies: { "Continental": "coupe", "Continental GT": "coupe", "Flying Spur": "saloon", "Bentayga": "suv", "Mulsanne": "saloon", "Arnage": "saloon", "Azure": "coupe", "Brooklands": "coupe" } },
  { name: "Rolls-Royce", models: ["Ghost", "Phantom", "Cullinan", "Wraith", "Dawn", "Spectre", "Silver Shadow", "Silver Spirit"], bodies: { "Ghost": "saloon", "Phantom": "saloon", "Cullinan": "suv", "Wraith": "coupe", "Dawn": "coupe", "Spectre": "coupe", "Silver Shadow": "saloon", "Silver Spirit": "saloon" } },
  { name: "Ferrari", models: ["296", "Roma", "Purosangue", "SF90", "F8", "488", "458", "430", "360", "355", "Portofino", "California", "812", "F12", "599", "612", "FF", "GTC4Lusso", "LaFerrari", "Enzo", "F40", "F50", "Testarossa", "308", "328", "348", "Dino", "12Cilindri"], bodies: { "296": "coupe", "Roma": "coupe", "Purosangue": "suv", "SF90": "coupe", "F8": "coupe", "488": "coupe", "458": "coupe", "430": "coupe", "360": "coupe", "355": "coupe", "Portofino": "coupe", "California": "coupe", "812": "coupe", "F12": "coupe", "599": "coupe", "612": "coupe", "FF": "coupe", "GTC4Lusso": "coupe", "LaFerrari": "coupe", "Enzo": "coupe", "F40": "coupe", "F50": "coupe", "Testarossa": "coupe", "308": "coupe", "328": "coupe", "348": "coupe", "Dino": "coupe", "12Cilindri": "coupe" } },
  { name: "Lamborghini", models: ["Huracan", "Revuelto", "Urus", "Aventador", "Gallardo", "Murcielago", "Diablo", "Countach", "Temerario", "Espada", "Jalpa"], bodies: { "Huracan": "coupe", "Revuelto": "coupe", "Urus": "suv", "Aventador": "coupe", "Gallardo": "coupe", "Murcielago": "coupe", "Diablo": "coupe", "Countach": "coupe", "Temerario": "coupe", "Espada": "coupe", "Jalpa": "coupe" } },
  { name: "McLaren", models: ["540C", "570S", "600LT", "620R", "650S", "675LT", "720S", "750S", "765LT", "Artura", "GT", "P1", "Senna", "Elva", "F1", "12C", "MP4-12C"], bodies: { "540C": "coupe", "570S": "coupe", "600LT": "coupe", "620R": "coupe", "650S": "coupe", "675LT": "coupe", "720S": "coupe", "750S": "coupe", "765LT": "coupe", "Artura": "coupe", "GT": "coupe", "P1": "coupe", "Senna": "coupe", "Elva": "coupe", "F1": "coupe", "12C": "coupe", "MP4-12C": "coupe" } },
  { name: "Maserati", models: ["Ghibli", "Quattroporte", "Levante", "Grecale", "GranTurismo", "GranCabrio", "MC20", "3200 GT", "Coupe", "Spyder", "Granturismo Folgore"], bodies: { "Ghibli": "saloon", "Quattroporte": "saloon", "Levante": "suv", "Grecale": "suv", "GranTurismo": "coupe", "GranCabrio": "coupe", "MC20": "coupe", "3200 GT": "coupe", "Coupe": "coupe", "Spyder": "coupe", "Granturismo Folgore": "coupe" } },
  { name: "Lotus", models: ["Elise", "Exige", "Evora", "Emira", "Eletre", "Emeya", "Europa", "Esprit", "Elan"], bodies: { "Elise": "coupe", "Exige": "coupe", "Evora": "coupe", "Emira": "coupe", "Eletre": "suv", "Emeya": "saloon", "Europa": "coupe", "Esprit": "coupe", "Elan": "coupe" } },
  { name: "Alpine", models: ["A110", "A290", "A390"], bodies: { "A110": "coupe", "A290": "hatch", "A390": "suv" } },
  { name: "Ineos", models: ["Grenadier", "Quartermaster", "Fusilier"], bodies: { "Grenadier": "suv", "Quartermaster": "pickup", "Fusilier": "suv" } },
  { name: "Saab", models: ["9-3", "9-5", "900", "9000", "9-4X", "9-7X", "96", "99"], bodies: { "9-3": "saloon", "9-5": "saloon", "900": "hatch", "9000": "hatch", "9-4X": "suv", "9-7X": "suv", "96": "saloon", "99": "saloon" } },
  { name: "Rover", models: ["25", "45", "75", "200", "400", "600", "800", "Streetwise", "Mini", "100", "Metro"], bodies: { "25": "hatch", "45": "hatch", "75": "saloon", "200": "hatch", "400": "hatch", "600": "saloon", "800": "saloon", "Streetwise": "hatch", "Mini": "mini", "100": "hatch", "Metro": "hatch" } },
  { name: "Infiniti", models: ["Q30", "Q50", "Q60", "Q70", "QX30", "QX50", "QX70", "G37", "FX", "EX", "M"], bodies: { "Q30": "hatch", "Q50": "saloon", "Q60": "coupe", "Q70": "saloon", "QX30": "suv", "QX50": "suv", "QX70": "suv", "G37": "coupe", "FX": "suv", "EX": "suv", "M": "saloon" } },
  { name: "Iveco", models: ["Daily", "Daily Tourus", "eDaily"], bodies: { "Daily": "suv", "Daily Tourus": "suv", "eDaily": "suv" } },
  { name: "Maxus", models: ["Deliver 3", "Deliver 7", "Deliver 9", "eDeliver 3", "eDeliver 7", "eDeliver 9", "T90", "Mifa 9", "G10"], bodies: { "Deliver 3": "suv", "Deliver 7": "suv", "Deliver 9": "suv", "eDeliver 3": "suv", "eDeliver 7": "suv", "eDeliver 9": "suv", "T90": "pickup", "Mifa 9": "suv", "G10": "suv" } },
  { name: "Morgan", models: ["Plus Four", "Plus Six", "Super 3", "3 Wheeler", "Aero 8", "4/4", "Roadster", "Plus 8"], bodies: { "Plus Four": "coupe", "Plus Six": "coupe", "Super 3": "coupe", "3 Wheeler": "coupe", "Aero 8": "coupe", "4/4": "coupe", "Roadster": "coupe", "Plus 8": "coupe" } },
  { name: "Caterham", models: ["Seven", "Seven 170", "Seven 360", "Seven 420", "Seven 620"], bodies: { "Seven": "coupe", "Seven 170": "coupe", "Seven 360": "coupe", "Seven 420": "coupe", "Seven 620": "coupe" } },
  { name: "TVR", models: ["Griffith", "Chimaera", "Cerbera", "Tamora", "Tuscan", "Sagaris", "T350", "S"], bodies: { "Griffith": "coupe", "Chimaera": "coupe", "Cerbera": "coupe", "Tamora": "coupe", "Tuscan": "coupe", "Sagaris": "coupe", "T350": "coupe", "S": "coupe" } },
  { name: "Omoda", models: ["5", "9", "E5", "7"], bodies: { "5": "suv", "9": "suv", "E5": "suv", "7": "suv" } },
  { name: "Jaecoo", models: ["7", "J7", "J8"], bodies: { "7": "suv", "J7": "suv", "J8": "suv" } },
  { name: "Leapmotor", models: ["T03", "C10", "B10"], bodies: { "T03": "mini", "C10": "suv", "B10": "suv" } },
  { name: "GWM", models: ["Ora 03", "Ora Funky Cat", "Ora 07", "Steed", "Cannon"], bodies: { "Ora 03": "hatch", "Ora Funky Cat": "hatch", "Ora 07": "saloon", "Steed": "pickup", "Cannon": "pickup" } },
  { name: "Ora", models: ["03", "Funky Cat", "07"], bodies: { "03": "hatch", "Funky Cat": "hatch", "07": "saloon" } },
  { name: "Proton", models: ["Saga", "Persona", "Satria", "Gen-2", "Savvy", "Wira"], bodies: { "Saga": "saloon", "Persona": "saloon", "Satria": "hatch", "Gen-2": "hatch", "Savvy": "hatch", "Wira": "saloon" } },
  { name: "Perodua", models: ["Myvi", "Axia", "Kelisa", "Kenari", "Nippa"], bodies: { "Myvi": "hatch", "Axia": "hatch", "Kelisa": "mini", "Kenari": "mini", "Nippa": "mini" } },
  { name: "Daihatsu", models: ["Terios", "Sirion", "Charade", "Copen", "Materia", "Fourtrak", "Sportrak", "YRV"], bodies: { "Terios": "suv", "Sirion": "hatch", "Charade": "hatch", "Copen": "coupe", "Materia": "hatch", "Fourtrak": "suv", "Sportrak": "suv", "YRV": "hatch" } },
  { name: "Lancia", models: ["Ypsilon", "Delta", "Musa", "Thesis", "Lybra"], bodies: { "Ypsilon": "hatch", "Delta": "hatch", "Musa": "hatch", "Thesis": "saloon", "Lybra": "saloon" } },
  { name: "Alpina", models: ["B3", "B4", "B5", "B8", "D3", "D4", "D5", "XB7", "XD3"], bodies: { "B3": "saloon", "B4": "coupe", "B5": "saloon", "B8": "coupe", "D3": "saloon", "D4": "coupe", "D5": "saloon", "XB7": "suv", "XD3": "suv" } },
  { name: "Cadillac", models: ["CT4", "CT5", "CT6", "Escalade", "XT4", "XT5", "Lyriq", "BLS", "STS", "CTS"], bodies: { "CT4": "saloon", "CT5": "saloon", "CT6": "saloon", "Escalade": "suv", "XT4": "suv", "XT5": "suv", "Lyriq": "suv", "BLS": "saloon", "STS": "saloon", "CTS": "saloon" } },
  { name: "Bugatti", models: ["Veyron", "Chiron", "Divo", "Tourbillon"], bodies: { "Veyron": "coupe", "Chiron": "coupe", "Divo": "coupe", "Tourbillon": "coupe" } },
  { name: "Pagani", models: ["Zonda", "Huayra", "Utopia"], bodies: { "Zonda": "coupe", "Huayra": "coupe", "Utopia": "coupe" } },
  { name: "Koenigsegg", models: ["Agera", "Regera", "Jesko", "CC8S", "Gemera"], bodies: { "Agera": "coupe", "Regera": "coupe", "Jesko": "coupe", "CC8S": "coupe", "Gemera": "coupe" } },
  { name: "Rimac", models: ["Nevera"], bodies: { "Nevera": "coupe" } },
  { name: "Ariel", models: ["Atom", "Nomad"], bodies: { "Atom": "coupe", "Nomad": "suv" } },
  { name: "BAC", models: ["Mono"], bodies: { "Mono": "coupe" } },
  { name: "Noble", models: ["M12", "M15", "M600"], bodies: { "M12": "coupe", "M15": "coupe", "M600": "coupe" } },
  { name: "Ginetta", models: ["G40", "G55", "Akula"], bodies: { "G40": "coupe", "G55": "coupe", "Akula": "coupe" } },
  { name: "Radical", models: ["SR1", "SR3", "RXC"], bodies: { "SR1": "coupe", "SR3": "coupe", "RXC": "coupe" } },
  { name: "Westfield", models: ["SE", "Sport"], bodies: { "SE": "coupe", "Sport": "coupe" } },
  { name: "AC", models: ["Cobra", "Ace"], bodies: { "Cobra": "coupe", "Ace": "coupe" } },
  { name: "Bristol", models: ["Fighter", "Blenheim"], bodies: { "Fighter": "coupe", "Blenheim": "coupe" } }
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
  const entry = getMake(make);
  if (!entry) return "hatch";
  return entry.bodies[model] ?? entry.bodies[Object.keys(entry.bodies).find((row) => row.toLowerCase() === model.toLowerCase()) ?? ""] ?? "hatch";
}

export function nearestMake(name: string | null | undefined) {
  if (!name) return MAKE_NAMES[0];
  const exact = getMake(name);
  if (exact) return exact.name;
  const lower = name.toLowerCase();
  if (lower === "vw" || lower === "volkswagon") return "Volkswagen";
  if (lower === "mercedes" || lower === "merc" || lower === "mercedes benz") return "Mercedes-Benz";
  if (lower === "landrover" || lower === "land rover") return "Land Rover";
  if (lower === "chevy") return "Chevrolet";
  if (lower === "ssangyong" || lower === "kgm ssangyong") return "SsangYong";
  if (lower === "great wall" || lower === "gwm ora") return "GWM";
  if (lower === "alfa") return "Alfa Romeo";
  if (lower === "rolls" || lower === "rolls royce") return "Rolls-Royce";
  if (lower === "aston") return "Aston Martin";
  if (lower === "lambo") return "Lamborghini";
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
