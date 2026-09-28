export const STREET_DECALS = [
  { id: "flame", label: "Flame" },
  { id: "bolt", label: "Bolt" },
  { id: "skull", label: "Skull" },
  { id: "wing", label: "Wing" },
  { id: "dice", label: "Dice" },
  { id: "eightball", label: "8 Ball" },
  { id: "rose", label: "Rose" },
  { id: "dagger", label: "Dagger" },
  { id: "shark", label: "Shark" },
  { id: "cobra", label: "Cobra" },
  { id: "flag", label: "Flag" },
  { id: "piston", label: "Piston" },
  { id: "tire", label: "Tire" },
  { id: "bat", label: "Bat" },
  { id: "wolf", label: "Wolf" },
  { id: "bull", label: "Bull" },
  { id: "scorpion", label: "Scorpion" },
  { id: "spider", label: "Spider" },
  { id: "heart", label: "Heart" },
  { id: "flake", label: "Flake" },
  { id: "sun", label: "Sun" },
  { id: "moon", label: "Moon" },
  { id: "burst", label: "Burst" },
  { id: "seven", label: "Seven" },
  { id: "thirteen", label: "13" },
  { id: "ace", label: "Ace" },
  { id: "joker", label: "Joker" },
  { id: "crown", label: "Crown" },
  { id: "bomb", label: "Bomb" },
  { id: "rocket", label: "Rocket" },
  { id: "jet", label: "Jet" },
  { id: "compass", label: "Compass" },
  { id: "anchor", label: "Anchor" },
  { id: "wave", label: "Wave" },
  { id: "peak", label: "Peak" },
  { id: "cactus", label: "Cactus" },
  { id: "chili", label: "Chili" },
  { id: "mug", label: "Mug" },
  { id: "plug", label: "Plug" },
  { id: "oil", label: "Oil" },
  { id: "nitro", label: "Nitro" },
  { id: "ghost", label: "Ghost" },
  { id: "cat", label: "Cat" },
  { id: "fox", label: "Fox" },
  { id: "bee", label: "Bee" },
  { id: "shroom", label: "Shroom" },
  { id: "eye", label: "Eye" },
  { id: "horn", label: "Horn" },
  { id: "mask", label: "Mask" },
  { id: "spark", label: "Spark" },
] as const;

export type StreetDecalId = (typeof STREET_DECALS)[number]["id"];

export const DECAL_DROP_CHANCE = 0.03;

export function rollStreetDecal(owned: string[]): StreetDecalId | null {
  const locked = STREET_DECALS.map((row) => row.id).filter((id) => !owned.includes(id));
  if (locked.length === 0) return null;
  if (Math.random() > DECAL_DROP_CHANCE) return null;
  return locked[Math.floor(Math.random() * locked.length)]!;
}
