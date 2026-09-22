import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SAVE_VERSION, type DemoPurchase, type GpsPreference, type Sighting } from "./types";
import { buildSeedSightings, countUsedToday } from "./seed";
import { isDuplicateSighting } from "./geo";
import { duplicateWindowMs, rankIndex, rankProgress, scanCap, xpFromSightings, type RankProgress } from "./ranks";
import { localDayKey } from "./utils";

export type PipFillEvent = {
  from: RankProgress;
  to: RankProgress;
};

type AddResult =
  | { ok: true; sighting: Sighting; xpGained: number; promotedTo: string | null }
  | { ok: false; reason: "limit" | "duplicate" };

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
  setGaragePlus: (on: boolean) => void;
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
      scansUsedToday: 0,       garagePlus: false,
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
      remainingScans: () => Math.max(0, scanCap(get().sightings) - get().scansUsedToday),
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
        set({
          sightings: nextSightings,
          scansUsedToday: state.scansUsedToday + 1,
          pendingPromotion: promotedTo,
          pendingPipFill: pipFilled || promotedTo ? { from: beforeRank, to: afterRank } : null,
          favouriteIds: input.favourite
            ? [sighting.id, ...(state.favouriteIds ?? []).filter((id) => id !== sighting.id)]
            : (state.favouriteIds ?? []),
        });
        return { ok: true, sighting, xpGained, promotedTo };
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
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<GarageState>;
        return {
          ...current,
          ...saved,
          favouriteIds: Array.isArray(saved.favouriteIds) ? saved.favouriteIds : [],
        };
      },
    },
  ),
);
