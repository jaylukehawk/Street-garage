import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Lock, Sticker } from "lucide-react";
import {
  BUILD_LABEL,
  DECALS,
  VINYLS,
  buildClassFor,
  decalSrc,
  decalUnlocked,
  designSrc,
  designsFor,
  type BuildClassId,
  type DecalId,
  type VinylId,
} from "@/lib/builds";
import {
  PART_SLOTS,
  SLOT_LABEL,
  type GaragePart,
  type PartRank,
} from "@/lib/parts";
import { CogAmount } from "@/components/cog-amount";
import { rankProgress, xpFromSightings } from "@/lib/ranks";
import { BUILD_SLOT_COST, SLOT_PACK_COST, modelKey, useGarageStore } from "@/lib/store";

export const Route = createFileRoute("/garage")({ component: GaragePage });

const RANK_ORDER: PartRank[] = ["E", "D", "C", "B", "A", "S"];

function bestPart(rows: GaragePart[]) {
  return rows.reduce((best, row) =>
    RANK_ORDER.indexOf(row.rank) > RANK_ORDER.indexOf(best.rank) ? row : best,
  );
}

function worstPart(rows: GaragePart[]) {
  return rows.reduce((worst, row) =>
    RANK_ORDER.indexOf(row.rank) < RANK_ORDER.indexOf(worst.rank) ? row : worst,
  );
}

type GarageCar = {
  key: string;
  make: string;
  model: string;
  rows: GaragePart[];
  unlocked: number;
  cap: number;
  year: number | null;
  classId: BuildClassId;
};

function GaragePage() {
  const parts = useGarageStore((s) => s.parts ?? []);
  const sightings = useGarageStore((s) => s.sightings);
  const cogs = useGarageStore((s) => s.cogs ?? 0);
  const partCap = useGarageStore((s) => s.partCap);
  const builds = useGarageStore((s) => s.builds ?? {});
  const builtCount = useGarageStore((s) => s.builtCount());
  const buildCap = useGarageStore((s) => s.buildCap());
  const buyBuildSlot = useGarageStore((s) => s.buyBuildSlot);
  const [tab, setTab] = useState<"cars" | "builds" | "parts">("cars");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const cars = useMemo(() => {
    const map = new Map<string, GaragePart[]>();
    for (const part of parts) {
      const key = modelKey(part.make, part.model);
      const rows = map.get(key) ?? [];
      rows.push(part);
      map.set(key, rows);
    }
    return [...map.entries()]
      .map(([key, rows]) => {
        const year = sightings.find((s) => modelKey(s.make, s.model) === key)?.year ?? null;
        return {
          key,
          make: rows[0]!.make,
          model: rows[0]!.model,
          rows,
          unlocked: new Set(rows.map((p) => p.slot)).size,
          cap: partCap(rows[0]!.make, rows[0]!.model),
          year,
          classId: buildClassFor(rows[0]!.make, rows[0]!.model, year),
        };
      })
      .sort((a, b) => b.unlocked - a.unlocked || a.make.localeCompare(b.make));
  }, [parts, partCap, sightings]);

  const openCar = cars.find((car) => car.key === openKey) ?? null;
  const ready = cars.filter((car) => car.unlocked === 6);

  return (
    <main className="px-5 pt-6 pb-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-xs tracking-[0.32em] text-silver">WORKSHOP</p>
          <h1 className="mt-1 font-display text-4xl tracking-wide">My Garage</h1>
        </div>
        <div className="text-right">
          <CogAmount amount={cogs} className="font-display text-lg text-[#f0d48a]" />
          <p className="text-xs text-silver">
            {builtCount}/{buildCap} built
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={cogs < BUILD_SLOT_COST}
        onClick={() => buyBuildSlot()}
        className="mt-3 min-h-12 w-full rounded-md border border-[#f0d48a] font-display text-lg text-[#f0d48a] disabled:opacity-40"
      >
        +1 car slot · <CogAmount amount={BUILD_SLOT_COST} />
      </button>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {(
          [
            ["cars", "Cars"],
            ["builds", `Builds ${ready.length}`],
            ["parts", `Parts ${parts.length}`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setOpenKey(null);
            }}
            className={`min-h-12 rounded-md font-display text-base ${
              tab === id ? "bg-primary text-primary-fg" : "border border-border"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <Link
        to="/friends"
        className="mt-3 flex min-h-12 items-center justify-center rounded-md border border-border font-display text-lg"
      >
        Friends
      </Link>

      {tab === "parts" ? (
        <PartsList parts={parts} />
      ) : openCar ? (
        <CarBuild car={openCar} build={builds[openCar.key]} onBack={() => setOpenKey(null)} />
      ) : tab === "builds" ? (
        <BuildList cars={ready} builds={builds} onOpen={setOpenKey} />
      ) : (
        <CarList cars={cars} builds={builds} onOpen={setOpenKey} />
      )}
    </main>
  );
}

function CarList({
  cars,
  builds,
  onOpen,
}: {
  cars: GarageCar[];
  builds: Record<string, { design: string; vinyl?: VinylId; decal?: DecalId }>;
  onOpen: (key: string) => void;
}) {
  if (cars.length === 0) {
    return <p className="mt-8 text-sm text-muted">Scan a car to start collecting parts for it.</p>;
  }

  return (
    <div className="mt-6 space-y-3">
      {cars.map((car) => (
        <button
          key={car.key}
          type="button"
          onClick={() => onOpen(car.key)}
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-navy-2 px-4 py-3 text-left"
        >
          {builds[car.key] ? (
            <span className="relative h-14 w-20 overflow-hidden rounded-md">
              <img
                src={designSrc(builds[car.key]!.design)}
                alt=""
                className="h-full w-full object-cover"
              />
              <DecalMark id={builds[car.key]!.decal ?? "none"} />
            </span>
          ) : (
            <img
              src={`/badges/${car.classId}.jpg`}
              alt=""
              className="size-12 rounded-full object-cover"
            />
          )}
          <span className="min-w-0 flex-1">
            <span className="block font-display text-xl leading-tight">{car.make}</span>
            <span className="text-sm text-silver">
              {car.model} · {BUILD_LABEL[car.classId]}
            </span>
          </span>
          <span className="text-right">
            <span className="block font-display text-lg">{car.rows.length}/{car.cap}</span>
            <span className="text-xs text-silver">
              {car.unlocked === 6 ? "Ready" : `${car.unlocked}/6 slots`}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

function BuildList({
  cars,
  builds,
  onOpen,
}: {
  cars: GarageCar[];
  builds: Record<string, { design: string; vinyl: VinylId; decal?: DecalId }>;
  onOpen: (key: string) => void;
}) {
  if (cars.length === 0) {
    return (
      <p className="mt-8 text-sm text-muted">
        Fill all 6 slots on a model to unlock a build. The shape is a workshop stand-in, not the real car.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {cars.map((car) => {
        const saved = builds[car.key];
        return (
          <button
            key={car.key}
            type="button"
            onClick={() => onOpen(car.key)}
            className="w-full overflow-hidden rounded-xl border border-border bg-navy-2 text-left"
          >
            {saved ? (
              <div className="relative">
                <img src={designSrc(saved.design)} alt="" className="h-40 w-full object-cover" />
                <Vinyl id={saved.vinyl} />
                <DecalMark id={saved.decal ?? "none"} />
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center text-sm text-silver">
                Ready to build · {BUILD_LABEL[car.classId]}
              </div>
            )}
            <span className="block px-4 py-3">
              <span className="block font-display text-xl leading-tight">{car.make}</span>
              <span className="text-sm text-silver">
                {car.model} · {saved ? "Built" : "Pick a shape"}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CarBuild({
  car,
  build,
  onBack,
}: {
  car: GarageCar;
  build?: { design: string; vinyl: VinylId; decal?: DecalId };
  onBack: () => void;
}) {
  const cogs = useGarageStore((s) => s.cogs ?? 0);
  const buySlots = useGarageStore((s) => s.buySlots);
  const deletePart = useGarageStore((s) => s.deletePart);
  const setBuild = useGarageStore((s) => s.setBuild);
  const setDecal = useGarageStore((s) => s.setDecal);
  const clearBuild = useGarageStore((s) => s.clearBuild);
  const [decalOpen, setDecalOpen] = useState(false);
  const sightings = useGarageStore((s) => s.sightings);
  const currentRank = rankProgress(xpFromSightings(sightings)).rank;
  const canBuild = useGarageStore((s) => s.canBuild);
  const buyBuildSlot = useGarageStore((s) => s.buyBuildSlot);
  const builtCount = useGarageStore((s) => s.builtCount());
  const buildCap = useGarageStore((s) => s.buildCap());
  const full = car.rows.length >= car.cap;
  const complete = car.unlocked === 6;
  const open = canBuild(car.make, car.model);
  const choices = designsFor(car.classId);

  return (
    <div className="mt-6">
      <button type="button" onClick={onBack} className="text-sm tracking-[0.2em] text-silver">
        BACK
      </button>
      <h2 className="mt-2 font-display text-3xl leading-none">{car.make}</h2>
      <p className="text-silver">{car.model}</p>
      <p className="mt-1 text-sm text-muted">
        {car.rows.length}/{car.cap} parts · {car.unlocked} of 6 slots unlocked · {BUILD_LABEL[car.classId]}
      </p>
      {full ? (
        <p className="mt-2 text-sm text-[#f0d48a]">Garage full. Delete a part or buy more slots.</p>
      ) : null}

      <button
        type="button"
        disabled={cogs < SLOT_PACK_COST}
        onClick={() => buySlots(car.make, car.model)}
        className="mt-3 min-h-12 w-full rounded-md border border-[#f0d48a] font-display text-lg text-[#f0d48a] disabled:opacity-40"
      >
        +10 slots · <CogAmount amount={SLOT_PACK_COST} />
      </button>

      <section className="mt-6">
        <h3 className="font-display text-xl">Build</h3>
        {complete ? (
          <>
            {build ? (
              <div className="relative mt-3 overflow-hidden rounded-xl border border-border">
                <img src={designSrc(build.design)} alt="" className="h-56 w-full object-cover" />
                <Vinyl id={build.vinyl} />
                <DecalMark id={build.decal ?? "none"} />
                <button
                  type="button"
                  onClick={() => setDecalOpen((on) => !on)}
                  className="absolute right-2 top-2 flex size-11 items-center justify-center rounded-full border border-[#f0d48a] bg-navy/80 text-[#f0d48a]"
                  aria-label="Decals"
                >
                  <Sticker className="size-5" />
                </button>
              </div>
            ) : open ? (
              <p className="mt-2 text-sm text-muted">
                All 6 slots are filled. Pick a workshop shape. These are not the real car.
              </p>
            ) : (
              <p className="mt-2 text-sm text-[#f0d48a]">
                Garage holds {buildCap} built cars ({builtCount}/{buildCap}). Buy another slot or scrap a build.
              </p>
            )}
            {open ? (
              <>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {choices.map((choice, index) => (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => setBuild(car.make, car.model, choice.id, build?.vinyl)}
                      className={`overflow-hidden rounded-lg border ${
                        build?.design === choice.id ? "border-[#f0d48a]" : "border-border"
                      }`}
                    >
                      <img src={choice.src} alt="" className="h-16 w-full object-cover" />
                      <span className="block py-1 text-center text-xs text-silver">{index + 1}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {VINYLS.map((vinyl) => (
                    <button
                      key={vinyl.id}
                      type="button"
                      disabled={!build}
                      onClick={() => build && setBuild(car.make, car.model, build.design, vinyl.id)}
                      className={`min-h-10 rounded-md border text-xs ${
                        build?.vinyl === vinyl.id ? "border-[#f0d48a] text-[#f0d48a]" : "border-border text-silver"
                      } disabled:opacity-40`}
                    >
                      {vinyl.label}
                    </button>
                  ))}
                </div>
                {decalOpen && build ? (
                  <div className="mt-3 rounded-xl border border-border bg-navy-2 p-3">
                    <p className="font-display text-lg">Decals</p>
                    <p className="mt-1 text-sm text-muted">
                      Promote a rank to unlock the next badge. Pips inside a rank do not count.
                    </p>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {DECALS.map((decal) => {
                        const free = decalUnlocked(decal.rankId, currentRank);
                        const src = decalSrc(decal.id);
                        return (
                          <button
                            key={decal.id}
                            type="button"
                            disabled={!free}
                            onClick={() => free && setDecal(car.make, car.model, decal.id)}
                            className={`overflow-hidden rounded-md border text-xs ${
                              (build.decal ?? "none") === decal.id
                                ? "border-[#f0d48a] text-[#f0d48a]"
                                : "border-border text-silver"
                            } disabled:opacity-40`}
                          >
                            {src ? (
                              <span className="relative block">
                                <img src={src} alt="" className="h-14 w-full object-contain bg-navy" />
                                {free ? null : (
                                  <Lock className="absolute right-1 top-1 size-3 text-silver" />
                                )}
                              </span>
                            ) : (
                              <span className="flex h-14 items-center justify-center">None</span>
                            )}
                            <span className="block truncate px-1 py-1">{decal.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
                {build ? (
                  <button
                    type="button"
                    onClick={() => {
                      const ok = window.confirm("Scrap this build and free the car slot?");
                      if (ok) clearBuild(car.make, car.model);
                    }}
                    className="mt-3 min-h-10 w-full rounded-md border border-border text-sm"
                  >
                    Scrap build
                  </button>
                ) : null}
              </>
            ) : (
              <button
                type="button"
                disabled={cogs < BUILD_SLOT_COST}
                onClick={() => buyBuildSlot()}
                className="mt-3 min-h-12 w-full rounded-md border border-[#f0d48a] font-display text-lg text-[#f0d48a] disabled:opacity-40"
              >
                +1 car slot · <CogAmount amount={BUILD_SLOT_COST} />
              </button>
            )}
          </>
        ) : (
          <p className="mt-2 text-sm text-muted">Unlock all 6 slots to build this model.</p>
        )}
      </section>

      <div className="mt-4 space-y-3">
        {PART_SLOTS.map((slot) => {
          const owned = car.rows.filter((p) => p.slot === slot);
          const part = owned.length ? bestPart(owned) : null;
          const junk = owned.length ? worstPart(owned) : null;
          return (
            <article
              key={slot}
              className={`rounded-xl border bg-navy-2 p-3 ${
                part ? rankTone(part.rank) : "border-border opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <PartIcon slot={slot} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg leading-tight">{SLOT_LABEL[slot]}</p>
                  <p className="text-sm text-silver">
                    {part ? `Best ${part.rank} · ${owned.length} owned` : "Locked"}
                  </p>
                </div>
                {part ? (
                  <img
                    src={`/ranks/${part.rank}.jpg`}
                    alt={part.rank}
                    className="h-16 w-12 rounded-sm object-cover"
                  />
                ) : (
                  <span className="font-display text-sm tracking-[0.2em] text-muted">LOCK</span>
                )}
              </div>
              {junk ? (
                <button
                  type="button"
                  onClick={() => {
                    const ok = window.confirm(
                      `Delete the ${junk.rank} ${SLOT_LABEL[slot]}?`,
                    );
                    if (ok) deletePart(junk.id);
                  }}
                  className="mt-3 min-h-10 w-full rounded-md border border-border text-sm"
                >
                  Delete {owned.length > 1 ? "lowest" : "part"}
                </button>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function DecalMark({ id }: { id: DecalId }) {
  const src = decalSrc(id);
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      className="pointer-events-none absolute right-10 bottom-6 h-12 w-12 object-contain drop-shadow"
    />
  );
}

function Vinyl({ id }: { id: VinylId }) {
  if (id === "stripe") {
    return <div className="pointer-events-none absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-white/40" />;
  }
  if (id === "gold") {
    return <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-[#f0d48a]/30 to-transparent" />;
  }
  if (id === "ghost") {
    return <div className="pointer-events-none absolute inset-x-4 bottom-4 h-8 rounded-full bg-white/25" />;
  }
  return null;
}

function rankTone(rank: GaragePart["rank"]) {
  if (rank === "S") return "border-[#f0d48a] text-[#f0d48a]";
  if (rank === "A") return "border-[#e8a87c] text-[#e8a87c]";
  if (rank === "B") return "border-[#b9a0ff] text-[#b9a0ff]";
  if (rank === "C") return "border-[#8cb4ff] text-[#8cb4ff]";
  if (rank === "D") return "border-[#8fd4a8] text-[#8fd4a8]";
  return "border-border text-silver";
}

function PartIcon({ slot }: { slot: GaragePart["slot"] }) {
  return (
    <img src={`/parts/${slot}.jpg`} alt="" className="size-14 rounded-full object-cover" />
  );
}

function PartsList({ parts }: { parts: GaragePart[] }) {
  const deletePart = useGarageStore((s) => s.deletePart);
  if (parts.length === 0) {
    return <p className="mt-8 text-sm text-muted">Scan a car to drop the first part.</p>;
  }
  return (
    <div className="mt-6 space-y-6">
      {PART_SLOTS.map((slot) => {
        const rows = parts.filter((p) => p.slot === slot);
        return (
          <section key={slot}>
            <h2 className="font-display text-xl">
              {SLOT_LABEL[slot]} · {rows.length}
            </h2>
            {rows.length === 0 ? (
              <p className="mt-2 text-sm text-muted">None yet</p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {rows.map((p) => (
                  <article
                    key={p.id}
                    className={`rounded-xl border bg-navy-2 p-3 ${rankTone(p.rank)}`}
                  >
                    <div className="flex items-start justify-between">
                      <PartIcon slot={p.slot} />
                      <img
                        src={`/ranks/${p.rank}.jpg`}
                        alt={p.rank}
                        className="h-20 w-14 rounded-sm object-cover"
                      />
                    </div>
                    <p className="mt-2 font-display text-lg leading-tight">{p.make}</p>
                    <p className="text-sm text-silver">{p.model}</p>
                    <button
                      type="button"
                      onClick={() => {
                        const ok = window.confirm(`Delete this ${p.rank} ${SLOT_LABEL[p.slot]}?`);
                        if (ok) deletePart(p.id);
                      }}
                      className="mt-3 min-h-10 w-full rounded-md border border-border text-sm"
                    >
                      Delete
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
