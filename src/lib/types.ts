export type Sighting = {
  id: string;
  make: string;
  model: string;
  colour: string;
  year: number | null;
  confidence: number | null;
  photo: string;
  seenAt: string;
  lat: number | null;
  lng: number | null;
  locationName: string;
};

export type DemoPurchase = {
  at: string;
  note: string;
};

export type GpsPreference = "unknown" | "granted" | "denied";

export type IdentifyResult = {
  isVehicle: boolean;
  make: string | null;
  model: string | null;
  colour: string | null;
  year: number | null;
  confidence: number;
  plateBoxes: PlateBox[];
};

export type PlateBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const DAILY_SCAN_LIMIT = 12;
export const REFILL_PRICE = "£1.49";
export const SAVE_VERSION = 1;
