export const TIERS = [
  { id: "bronze", label: "Bronze", min: 10 },
  { id: "silver", label: "Silver", min: 100 },
  { id: "gold", label: "Gold", min: 500 },
  { id: "platinum", label: "Platinum", min: 2500 },
  { id: "diamond", label: "Diamond", min: 10000 },
] as const;

export type TierId = (typeof TIERS)[number]["id"];

export function tierForCount(count: number) {
  let current: (typeof TIERS)[number] | null = null;
  for (const tier of TIERS) {
    if (count >= tier.min) current = tier;
  }
  return current;
}

export function nextTier(count: number) {
  return TIERS.find((tier) => count < tier.min) ?? null;
}

export function progressToNext(count: number) {
  const next = nextTier(count);
  if (!next) return { next: null, current: count, target: TIERS[TIERS.length - 1].min, ratio: 1 };
  const prev = [...TIERS].reverse().find((tier) => tier.min <= count);
  const floor = prev?.min ?? 0;
  const span = next.min - floor;
  return {
    next,
    current: count,
    target: next.min,
    ratio: span <= 0 ? 1 : Math.min(1, (count - floor) / span),
  };
}

export function medalCopy(make: string, count: number) {
  const next = nextTier(count);
  const current = tierForCount(count);
  if (!next) return `${make} Diamond`;
  if (!current) return `${make} ${count} / ${next.min} ${next.label}`;
  return `${make} ${count} / ${next.min} ${next.label}`;
}
