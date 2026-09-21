import { photoFor } from "./catalog";
import type { Sighting } from "./types";

function atHoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function atDaysAgo(days: number, hour: number, minute: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

type SeedRow = {
  make: string;
  model: string;
  colour: string;
  year: number;
  hoursAgo?: number;
  daysAgo?: number;
  hour?: number;
  minute?: number;
  lat: number;
  lng: number;
  locationName: string;
  confidence: number;
};

const ROWS: SeedRow[] = [
  { make: "Ford", model: "Fiesta", colour: "Blue", year: 2019, hoursAgo: 1.2, lat: 53.8014, lng: -1.5482, locationName: "King Edward Street", confidence: 0.91 },
  { make: "BMW", model: "3 Series", colour: "Black", year: 2021, hoursAgo: 2.4, lat: 53.4799, lng: -2.2411, locationName: "Canal Side", confidence: 0.88 },
  { make: "Volkswagen", model: "Golf", colour: "White", year: 2020, hoursAgo: 3.1, lat: 52.4869, lng: -1.8892, locationName: "Victoria Road", confidence: 0.93 },
  { make: "Ford", model: "Focus", colour: "Grey", year: 2018, hoursAgo: 4.6, lat: 51.4551, lng: -2.5868, locationName: "Queen's Crescent", confidence: 0.84 },
  { make: "Mini", model: "Cooper", colour: "Green", year: 2022, hoursAgo: 5.5, lat: 53.3818, lng: -1.4694, locationName: "Mill Lane", confidence: 0.9 },
  { make: "Ford", model: "Fiesta", colour: "Red", year: 2017, hoursAgo: 6.8, lat: 52.9556, lng: -1.1574, locationName: "Station Approach", confidence: 0.86 },
  { make: "Toyota", model: "Corolla", colour: "Silver", year: 2021, hoursAgo: 8.1, lat: 53.4091, lng: -2.9904, locationName: "Chapel Street", confidence: 0.89 },
  { make: "Ford", model: "Puma", colour: "White", year: 2023, hoursAgo: 9.4, lat: 54.9776, lng: -1.6169, locationName: "Riverside Walk", confidence: 0.92 },
  { make: "BMW", model: "X5", colour: "Silver", year: 2019, hoursAgo: 10.7, lat: 52.6377, lng: -1.1386, locationName: "Oakfield Road", confidence: 0.87 },
  { make: "Ford", model: "Mustang", colour: "Red", year: 2020, hoursAgo: 11.5, lat: 53.9592, lng: -1.0864, locationName: "The Cut", confidence: 0.94 },
  { make: "Volkswagen", model: "Polo", colour: "Red", year: 2018, hoursAgo: 12.6, lat: 53.8001, lng: -1.5518, locationName: "Grove Terrace", confidence: 0.85 },
  { make: "Ford", model: "Focus", colour: "Blue", year: 2016, hoursAgo: 13.4, lat: 53.4822, lng: -2.2451, locationName: "Whitworth Street", confidence: 0.8 },
  { make: "Ford", model: "Fiesta", colour: "Grey", year: 2015, daysAgo: 1, hour: 18, minute: 12, lat: 52.4851, lng: -1.8933, locationName: "Bath Row", confidence: 0.83 },
  { make: "Ford", model: "Ranger", colour: "Orange", year: 2022, daysAgo: 2, hour: 9, minute: 40, lat: 51.4532, lng: -2.591, locationName: "Harbour Lane", confidence: 0.9 },
  { make: "Toyota", model: "Yaris", colour: "White", year: 2019, daysAgo: 2, hour: 16, minute: 5, lat: 53.3799, lng: -1.4732, locationName: "Porter Brook", confidence: 0.86 },
  { make: "Ford", model: "Puma", colour: "Grey", year: 2021, daysAgo: 3, hour: 11, minute: 22, lat: 52.9539, lng: -1.1612, locationName: "Lace Market", confidence: 0.88 },
  { make: "Mini", model: "Cooper", colour: "White", year: 2018, daysAgo: 3, hour: 19, minute: 48, lat: 53.4072, lng: -2.9948, locationName: "Baltic Triangle", confidence: 0.91 },
  { make: "Ford", model: "Mustang", colour: "Blue", year: 2019, daysAgo: 4, hour: 14, minute: 7, lat: 54.9794, lng: -1.6132, locationName: "Quayside", confidence: 0.87 },
  { make: "Volkswagen", model: "Golf", colour: "Black", year: 2017, daysAgo: 4, hour: 8, minute: 33, lat: 52.6354, lng: -1.1424, locationName: "New Walk", confidence: 0.82 },
  { make: "BMW", model: "3 Series", colour: "Silver", year: 2016, daysAgo: 5, hour: 17, minute: 19, lat: 53.9614, lng: -1.0906, locationName: "Coppergate", confidence: 0.84 },
  { make: "Ford", model: "Fiesta", colour: "White", year: 2014, daysAgo: 6, hour: 12, minute: 51, lat: 53.7988, lng: -1.5466, locationName: "Call Lane", confidence: 0.79 },
  { make: "Ford", model: "Focus", colour: "Red", year: 2015, daysAgo: 6, hour: 20, minute: 4, lat: 53.4784, lng: -2.2488, locationName: "Deansgate", confidence: 0.81 },
];

export function buildSeedSightings(): Sighting[] {
  return ROWS.map((row, index) => {
    const seenAt =
      row.hoursAgo != null
        ? atHoursAgo(row.hoursAgo)
        : atDaysAgo(row.daysAgo ?? 1, row.hour ?? 12, row.minute ?? 0);
    return {
      id: `seed_${index + 1}`,
      make: row.make,
      model: row.model,
      colour: row.colour,
      year: row.year,
      confidence: row.confidence,
      photo: photoFor(row.make, row.model) ?? "",
      seenAt,
      lat: row.lat,
      lng: row.lng,
      locationName: row.locationName,
    };
  });
}

export function countUsedToday(sightings: Sighting[], dayKey: string) {
  return sightings.filter((s) => {
    const d = new Date(s.seenAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return key === dayKey;
  }).length;
}
