import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  PART_SLOTS,
  SLOT_LABEL,
  type GaragePart,
  type PartRank,
} from "@/lib/parts";
import { SLOT_PACK_COST, modelKey, useGarageStore } from "@/lib/store";

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

function GaragePage() {
  const parts = useGarageStore((s) => s.parts ?? []);
  const cogs = useGarageStore((s) => s.cogs ?? 0);
  const addCogs = useGarageStore((s) => s.addCogs);
  const partCap = useGarageStore((s) => s.partCap);
  const [tab, setTab] = useState<"builds" | "parts">("builds");
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
      .map(([key, rows]) => ({
        key,
        make: rows[0]!.make,
        model: rows[0]!.model,
        rows,
        unlocked: new Set(rows.map((p) => p.slot)).size,
        cap: partCap(rows[0]!.make, rows[0]!.model),
      }))
      .sort((a, b) => b.unlocked - a.unlocked || a.make.localeCompare(b.make));
  }, [parts, partCap]);

  const openCar = cars.find((car) => car.key === openKey) ?? null;

  return (
    <main className="px-5 pt-6 pb-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-xs tracking-[0.32em] text-silver">WORKSHOP</p>
          <h1 className="mt-1 font-display text-4xl tracking-wide">My Garage</h1>
        </div>
        <p className="font-display text-lg text-[#f0d48a]">{cogs} Cogs</p>
      </div>

      <button
        type="button"
        onClick={() => addCogs(20)}
        className="mt-3 min-h-10 rounded-md border border-border px-3 text-sm text-silver"
      >
        Test: add 20 Cogs
      </button>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setTab("builds");
            setOpenKey(null);
          }}
          className={`min-h-12 rounded-md font-display text-lg ${
            tab === "builds" ? "bg-primary text-primary-fg" : "border border-border"
          }`}
        >
          Cars
        </button>
        <button
          type="button"
          onClick={() => setTab("parts")}
          className={`min-h-12 rounded-md font-display text-lg ${
            tab === "parts" ? "bg-primary text-primary-fg" : "border border-border"
          }`}
        >
          Parts {parts.length}
        </button>
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
        <CarBuild car={openCar} onBack={() => setOpenKey(null)} />
      ) : (
        <CarList cars={cars} onOpen={setOpenKey} />
      )}
    </main>
  );
}

function CarList({
  cars,
  onOpen,
}: {
  cars: {
    key: string;
    make: string;
    model: string;
    rows: GaragePart[];
    unlocked: number;
    cap: number;
  }[];
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
          className="flex w-full items-center justify-between rounded-xl border border-border bg-navy-2 px-4 py-3 text-left"
        >
          <span>
            <span className="block font-display text-xl leading-tight">{car.make}</span>
            <span className="text-sm text-silver">{car.model}</span>
          </span>
          <span className="text-right">
            <span className="block font-display text-lg">{car.rows.length}/{car.cap}</span>
            <span className="text-xs text-silver">{car.unlocked}/6 slots</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function CarBuild({
  car,
  onBack,
}: {
  car: { make: string; model: string; rows: GaragePart[]; unlocked: number; cap: number };
  onBack: () => void;
}) {
  const cogs = useGarageStore((s) => s.cogs ?? 0);
  const buySlots = useGarageStore((s) => s.buySlots);
  const deletePart = useGarageStore((s) => s.deletePart);
  const full = car.rows.length >= car.cap;

  return (
    <div className="mt-6">
      <button type="button" onClick={onBack} className="text-sm tracking-[0.2em] text-silver">
        BACK
      </button>
      <h2 className="mt-2 font-display text-3xl leading-none">{car.make}</h2>
      <p className="text-silver">{car.model}</p>
      <p className="mt-1 text-sm text-muted">
        {car.rows.length}/{car.cap} parts · {car.unlocked} of 6 slots unlocked
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
        +10 slots · {SLOT_PACK_COST} Cogs
      </button>

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