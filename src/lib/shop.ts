export const SCAN_RESET_COST = 100;

export const COG_PACKS = [
  { id: "pack50", amount: 50, price: "£1.99" },
  { id: "pack200", amount: 200, price: "£4.99" },
  { id: "pack500", amount: 500, price: "£9.99" },
] as const;

export type CogPackId = (typeof COG_PACKS)[number]["id"];
