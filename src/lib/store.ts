import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SAVE_VERSION, type DemoPurchase, type GpsPreference, type Sighting } from "./types";
import { rollPart, type GaragePart } from "./parts";
import { buildSeedSightings, countUsedToday } from "./seed";
import { isDuplicateSighting } from "./geo";
import { duplicateWindowMs, rankIndex, rankProgress, scanCap, xpFromSightings, type RankProgress } from "./ranks";
import { localDayKey } from "./utils";

export type PipFillEvent = {
  from: RankProgress;
  to: RankProgress;
};

type AddResult =
  | { ok: true; sighting: Sighting; xpGained: number; promotedTo: string | null; partDropped: boolean }
  | { ok: false; reason: "limit" | "duplicate" };

export const BASE_PART_CAP = 10;
export const SLOT_PACK = 10;
export const SLOT_PACK_COST = 20;

export function modelKey(make: string, model: string) {
  return `${make}|||${model}`;
}

type GarageState = {
  version: number;
  hydrated: boolean;
  seeded: boolean;
  onboarded: boolean;
  sightings: Sighting[];
  scanDay: string;
  scansUsedToday: number;
  demoPurchases: DemoPurchase[];
  gpsPreference: GpsPreference;
  pendingPromotion: string | null;
  pendingPipFill: PipFillEvent | null;
  favouriteIds: string[];
  setHydrated: () => void;
  applySeed: () => void;
  ensureDay: () => void;
  completeOnboarding: () => void;
  remainingScans: () => number;
  addSighting: (input: Omit<Sighting, "id"> & { id?: string; favourite?: boolean }) => AddResult;
  toggleFavourite: (id: string) => void;
  refillScans: () => void;
  setGpsPreference: (value: GpsPreference) => void;
  clearPromotion: () => void;
  garagePlus: boolean;
  parts: GaragePart[];
  cogs: number;
  slotBoosts: Record<string, number>;
  setGaragePlus: (on: boolean) => void;
  deletePart: (id: string) => void;
  partCap: (make: string, model: string) => number;
  buySlots: (make: string, model: string) => { ok: true } | { ok: false; reason: "cogs" };
  addCogs: (amount: number) => void;
};

export const useGarageStore = create<GarageState>()(
  persist(
    (set, get) => ({
      version: SAVE_VERSION,
      hydrated: false,
      seeded: false,
      onboarded: false,
      sightings: [],
      scanDay: localDayKey(),
      scansUsedToday: 0,
      garagePlus: false,
      parts: [],
      cogs: 0,
      slotBoosts: {},
      setGaragePlus: (on) => set({ garagePlus: on }),
      demoPurchases: [],
      gpsPreference: "unknown",
      pendingPromotion: null,
      pendingPipFill: null,
      favouriteIds: [],
      setHydrated: () => set({ hydrated: true }),
      applySeed: () => {
        if (get().seeded) return;
        const sightings = buildSeedSightings();
        const scanDay = localDayKey();
        set({
          seeded: true,
          onboarded: true,
          sightings,
          scanDay,
          scansUsedToday: countUsedToday(sightings, scanDay),
        });
      },
      ensureDay: () => {
        const today = localDayKey();
        if (get().scanDay === today) return;
        set({ scanDay: today, scansUsedToday: 0 });
      },
      completeOnboarding: () => set({ onboarded: true }),
      remainingScans: () =>
        Math.max(0, scanCap(get().sightings, get().garagePlus) - get().scansUsedToday),
      partCap: (make, model) =>
        BASE_PART_CAP + (get().slotBoosts?.[modelKey(make, model)] ?? 0),
      deletePart: (id) =>
        set({ parts: (get().parts ?? []).filter((part) => part.id !== id) }),
      addCogs: (amount) => set({ cogs: Math.max(0, (get().cogs ?? 0) + amount) }),
      buySlots: (make, model) => {
        if ((get().cogs ?? 0) < SLOT_PACK_COST) return { ok: false, reason: "cogs" };
        const key = modelKey(make, model);
        const boosts = get().slotBoosts ?? {};
        set({
          cogs: (get().cogs ?? 0) - SLOT_PACK_COST,
          slotBoosts: { ...boosts, [key]: (boosts[key] ?? 0) + SLOT_PACK },
        });
        return { ok: true };
      },
      addSighting: (input) => {
        const state = get();
        state.ensureDay();
        if (state.remainingScans() <= 0) return { ok: false, reason: "limit" };
        const sighting: Sighting = {
          id: input.id ?? `sg_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
          make: input.make,
          model: input.model,
          colour: input.colour,
          year: input.year,
          confidence: input.confidence,
          photo: input.photo,
          seenAt: input.seenAt,
          lat: input.lat,
          lng: input.lng,
          locationName: input.locationName,
        };
        const windowMs = duplicateWindowMs(rankIndex(rankProgress(xpFromSightings(state.sightings)).rank));
        const dup = state.sightings.some((existing) =>
          isDuplicateSighting(sighting, existing, Date.now(), windowMs),
        );
        if (dup) return { ok: false, reason: "duplicate" };
        const nextSightings = [sighting, ...state.sightings];
        const xpBefore = xpFromSightings(state.sightings);
        const xpAfter = xpFromSightings(nextSightings);
        const xpGained = xpAfter - xpBefore;
        const beforeRank = rankProgress(xpBefore);
        const afterRank = rankProgress(xpAfter);
        const promotedTo = afterRank.title !== beforeRank.title ? afterRank.title : null;
        const pipFilled =
          afterRank.pips > beforeRank.pips || afterRank.rank.id !== beforeRank.rank.id;
        const key = modelKey(sighting.make, sighting.model);
        const owned = (state.parts ?? []).filter(
          (part) => modelKey(part.make, part.model) === key,
        ).length;
        const cap = BASE_PART_CAP + (state.slotBoosts?.[key] ?? 0);
        const partDropped = owned < cap;
        set({
          sightings: nextSightings,
          parts: partDropped
            ? [...(state.parts ?? []), rollPart(sighting.make, sighting.model, sighting.id)]
            : (state.parts ?? []),
          scansUsedToday: state.scansUsedToday + 1,
          pendingPromotion: promotedTo,
          pendingPipFill: pipFilled || promotedTo ? { from: beforeRank, to: afterRank } : null,
          favouriteIds: input.favourite
            ? [sighting.id, ...(state.favouriteIds ?? []).filter((id) => id !== sighting.id)]
            : (state.favouriteIds ?? []),
        });
        return { ok: true, sighting, xpGained, promotedTo, partDropped };
      },
      toggleFavourite: (id) => {
        const state = get();
        const ids = state.favouriteIds ?? [];
        if (!state.sightings.some((s) => s.id === id)) return;
        const nextIds = ids.includes(id) ? ids.filter((row) => row !== id) : [id, ...ids];
        set({
          favouriteIds: nextIds,
          sightings: state.sightings,
        });
      },
      refillScans: () => {
        const today = localDayKey();
        set({
          scanDay: today,
          scansUsedToday: 0,
          demoPurchases: [
            { at: new Date().toISOString(), note: "Demo purchase" },
            ...get().demoPurchases,
          ],
        });
      },
      setGpsPreference: (gpsPreference) => set({ gpsPreference }),
      clearPromotion: () => set({ pendingPromotion: null, pendingPipFill: null }),
    }),
    {
      name: "street-garage-v1",
      skipHydration: true,
      partialize: (state) => ({
        version: state.version,
        seeded: state.seeded,
        onboarded: state.onboarded,
        sightings: state.sightings,
        scanDay: state.scanDay,
        scansUsedToday: state.scansUsedToday,
        demoPurchases: state.demoPurchases,
        gpsPreference: state.gpsPreference,
        favouriteIds: state.favouriteIds ?? [],
        parts: state.parts ?? [],
        cogs: state.cogs ?? 0,
        slotBoosts: state.slotBoosts ?? {},
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<GarageState>;
        return {
          ...current,
          ...saved,
          favouriteIds: Array.isArray(saved.favouriteIds) ? saved.favouriteIds : [],
          parts: Array.isArray(saved.parts) ? saved.parts : [],
          cogs: typeof saved.cogs === "number" ? saved.cogs : 0,
          slotBoosts: saved.slotBoosts ?? {},
        };
      },
    },
  ),
);