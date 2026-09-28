import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  PART_SLOTS,
  SLOT_LABEL,
  type GaragePart,
  type PartRank,
} from "@/lib/parts";
import { useGarageStore } from "@/lib/store";

export const Route = createFileRoute("/garage")({ component: GaragePage });

const RANK_ORDER: PartRank[] = ["E", "D", "C", "B", "A", "S"];

function bestPart(rows: GaragePart[]) {
  return rows.reduce((best, row) =>
    RANK_ORDER.indexOf(row.rank) > RANK_ORDER.indexOf(best.rank) ? row : best,
  );
}

function GaragePage() {
  const parts = useGarageStore((s) => s.parts ?? []);
  const [tab, setTab] = useState<"builds" | "parts">("builds");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const cars = useMemo(() => {
    const map = new Map<string, GaragePart[]>();
    for (const part of parts) {
      const key = `${part.make}|||${part.model}`;
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
      }))
      .sort((a, b) => b.unlocked - a.unlocked || a.make.localeCompare(b.make));
  }, [parts]);

  const openCar = cars.find((car) => car.key === openKey) ?? null;

  return (
    <main className="px-5 pt-6 pb-8">
      <p className="font-display text-xs tracking-[0.32em] text-silver">WORKSHOP</p>
      <h1 className="mt-1 font-display text-4xl tracking-wide">My Garage</h1>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setTab("builds");
            setOpenKey(null);
          }}
          className={`min-h-12 rounded-md font-display text-lg ${
            tab === "builds"
              ? "bg-primary text-primary-fg"
              : "border border-border"
          }`}
        >
          Cars
        </button>
        <button
          type="button"
          onClick={() => setTab("parts")}
          className={`min-h-12 rounded-md font-display text-lg ${
            tab === "parts"
              ? "bg-primary text-primary-fg"
              : "border border-border"
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
    unlocked: number;
  }[];
  onOpen: (key: string) => void;
}) {
  if (cars.length === 0) {
    return (
      <p className="mt-8 text-sm text-muted">
        Scan a car to start collecting parts for it.
      </p>
    );
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
          <span className="font-display text-lg text-silver">{car.unlocked}/6</span>
        </button>
      ))}
    </div>
  );
}

function CarBuild({
  car,
  onBack,
}: {
  car: { make: string; model: string; rows: GaragePart[]; unlocked: number };
  onBack: () => void;
}) {
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={onBack}
        className="text-sm tracking-[0.2em] text-silver"
      >
        BACK
      </button>
      <h2 className="mt-2 font-display text-3xl leading-none">{car.make}</h2>
      <p className="text-silver">{car.model}</p>
      <p className="mt-1 text-sm text-muted">{car.unlocked} of 6 parts unlocked</p>

      <div className="mt-4 space-y-3">
        {PART_SLOTS.map((slot) => {
          const owned = car.rows.filter((p) => p.slot === slot);
          const part = owned.length ? bestPart(owned) : null;
          return (
            <article
              key={slot}
              className={`flex items-center gap-3 rounded-xl border bg-navy-2 p-3 ${
                part ? rankTone(part.rank) : "border-border opacity-60"
              }`}
            >
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
    <img
      src={`/parts/${slot}.jpg`}
      alt=""
      className="size-14 rounded-full object-cover"
    />
  );
}

function PartsList({ parts }: { parts: GaragePart[] }) {
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
                    <p className="mt-3 text-xs tracking-[0.2em] text-muted">
                      {SLOT_LABEL[p.slot].toUpperCase()}
                    </p>
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