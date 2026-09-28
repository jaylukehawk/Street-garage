import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SAVE_VERSION, type DemoPurchase, type GpsPreference, type Sighting } from "./types";
import { rollPart, type GaragePart } from "./parts";
import type { DecalId, SavedBuild, VinylId } from "./builds";
import { rollStreetDecal, type StreetDecalId } from "./street-decals";
import { buildSeedSightings, countUsedToday } from "./seed";
import { isDuplicateSighting } from "./geo";
import { duplicateWindowMs, rankIndex, rankProgress, scanCap, xpFromSightings, type RankProgress } from "./ranks";
import { localDayKey } from "./utils";
import { COG_PACKS, SCAN_RESET_COST, type CogPackId } from "./shop";

export type PipFillEvent = {
  from: RankProgress;
  to: RankProgress;
};

type AddResult =
  | {
      ok: true;
      sighting: Sighting;
      xpGained: number;
      promotedTo: string | null;
      partDropped: boolean;
      part: GaragePart | null;
      decalDropped: StreetDecalId | null;
    }
  | { ok: false; reason: "limit" | "duplicate" };

export const BASE_PART_CAP = 10;
export const SLOT_PACK = 10;
export const SLOT_PACK_COST = 20;
export const BASE_BUILD_CAP = 5;
export const BUILD_SLOT_COST = 50;

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
  resetScans: () => { ok: true } | { ok: false; reason: "cogs" | "full" };
  buyCogPack: (id: CogPackId) => void;
  setGpsPreference: (value: GpsPreference) => void;
  clearPromotion: () => void;
  garagePlus: boolean;
  parts: GaragePart[];
  cogs: number;
  slotBoosts: Record<string, number>;
  builds: Record<string, SavedBuild>;
  extraBuildSlots: number;
  ownedDecals: string[];
  setGaragePlus: (on: boolean) => void;
  setBuild: (
    make: string,
    model: string,
    design: string,
    vinyl?: VinylId,
  ) => { ok: true } | { ok: false; reason: "slots" };
  setDecal: (make: string, model: string, decal: DecalId) => void;
  clearBuild: (make: string, model: string) => void;
  deletePart: (id: string) => void;
  partCap: (make: string, model: string) => number;
  buildCap: () => number;
  builtCount: () => number;
  canBuild: (make: string, model: string) => boolean;
  buySlots: (make: string, model: string) => { ok: true } | { ok: false; reason: "cogs" };
  buyBuildSlot: () => { ok: true } | { ok: false; reason: "cogs" };
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
      builds: {},
      extraBuildSlots: 0,
      ownedDecals: [],
      setGaragePlus: (on) => set({ garagePlus: on }),
      buildCap: () => BASE_BUILD_CAP + (get().extraBuildSlots ?? 0),
      builtCount: () => Object.keys(get().builds ?? {}).length,
      canBuild: (make, model) => {
        const key = modelKey(make, model);
        if ((get().builds ?? {})[key]) return true;
        return Object.keys(get().builds ?? {}).length < get().buildCap();
      },
      setBuild: (make, model, design, vinyl) => {
        const key = modelKey(make, model);
        const builds = get().builds ?? {};
        const current = builds[key];
        if (!current && Object.keys(builds).length >= get().buildCap()) {
          return { ok: false, reason: "slots" };
        }
        set({
          builds: {
            ...builds,
            [key]: {
              design,
              vinyl: vinyl ?? current?.vinyl ?? "none",
              decal: current?.decal ?? "none",
            },
          },
        });
        return { ok: true };
      },
      setDecal: (make, model, decal) => {
        const key = modelKey(make, model);
        const current = (get().builds ?? {})[key];
        if (!current) return;
        set({
          builds: {
            ...(get().builds ?? {}),
            [key]: { ...current, decal },
          },
        });
      },
      clearBuild: (make, model) => {
        const key = modelKey(make, model);
        const builds = { ...(get().builds ?? {}) };
        delete builds[key];
        set({ builds });
      },
      buyBuildSlot: () => {
        if ((get().cogs ?? 0) < BUILD_SLOT_COST) return { ok: false, reason: "cogs" };
        set({
          cogs: (get().cogs ?? 0) - BUILD_SLOT_COST,
          extraBuildSlots: (get().extraBuildSlots ?? 0) + 1,
        });
        return { ok: true };
      },
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
        const part = partDropped
          ? rollPart(sighting.make, sighting.model, sighting.id)
          : null;
        const ownedDecals = state.ownedDecals ?? [];
        const decalDropped = rollStreetDecal(ownedDecals);
        set({
          sightings: nextSightings,
          parts: part ? [...(state.parts ?? []), part] : (state.parts ?? []),
          ownedDecals: decalDropped ? [...ownedDecals, decalDropped] : ownedDecals,
          scansUsedToday: state.scansUsedToday + 1,
          pendingPromotion: promotedTo,
          pendingPipFill: pipFilled || promotedTo ? { from: beforeRank, to: afterRank } : null,
          favouriteIds: input.favourite
            ? [sighting.id, ...(state.favouriteIds ?? []).filter((id) => id !== sighting.id)]
            : (state.favouriteIds ?? []),
        });
        return { ok: true, sighting, xpGained, promotedTo, partDropped, part, decalDropped };
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
      resetScans: () => {
        const state = get();
        state.ensureDay();
        if (state.remainingScans() > 0) return { ok: false, reason: "full" };
        if ((state.cogs ?? 0) < SCAN_RESET_COST) return { ok: false, reason: "cogs" };
        set({
          cogs: (state.cogs ?? 0) - SCAN_RESET_COST,
          scanDay: localDayKey(),
          scansUsedToday: 0,
          demoPurchases: [
            { at: new Date().toISOString(), note: `Reset scans · ${SCAN_RESET_COST}` },
            ...state.demoPurchases,
          ],
        });
        return { ok: true };
      },
      buyCogPack: (id) => {
        const pack = COG_PACKS.find((row) => row.id === id);
        if (!pack) return;
        set({
          cogs: (get().cogs ?? 0) + pack.amount,
          demoPurchases: [
            { at: new Date().toISOString(), note: `${pack.amount} pack · ${pack.price}` },
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
        builds: state.builds ?? {},
        extraBuildSlots: state.extraBuildSlots ?? 0,
        ownedDecals: state.ownedDecals ?? [],
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
          builds: Object.fromEntries(
            Object.entries(saved.builds ?? {}).map(([key, row]) => [
              key,
              {
                design: row.design,
                vinyl: row.vinyl ?? "none",
                decal: row.decal ?? "none",
              },
            ]),
          ),
          extraBuildSlots: typeof saved.extraBuildSlots === "number" ? saved.extraBuildSlots : 0,
          ownedDecals: Array.isArray(saved.ownedDecals) ? saved.ownedDecals : [],
        };
      },
    },
  ),
);