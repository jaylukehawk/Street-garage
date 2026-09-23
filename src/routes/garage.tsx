import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PART_SLOTS, SLOT_LABEL, type GaragePart } from "@/lib/parts";
import { useGarageStore } from "@/lib/store";

export const Route = createFileRoute("/garage")({ component: GaragePage });

function GaragePage() {
  const parts = useGarageStore((s) => s.parts ?? []);
  const [tab, setTab] = useState<"builds" | "parts">("builds");

  return (
    <main className="px-5 pt-6 pb-8">
      <p className="font-display text-xs tracking-[0.32em] text-silver">WORKSHOP</p>
      <h1 className="mt-1 font-display text-4xl tracking-wide">My Garage</h1>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTab("builds")}
          className="min-h-12 rounded-md bg-primary font-display text-lg text-primary-fg"
        >
          Builds
        </button>
        <button
          type="button"
          onClick={() => setTab("parts")}
          className="min-h-12 rounded-md border border-border font-display text-lg"
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

      {tab === "builds" ? (
        <p className="mt-8 text-sm text-muted">
          Fill body, engine, wheels, brakes, chassis and suspension from Parts to
          lock a car. Vinyl and 2D races come after that.
        </p>
      ) : (
        <PartsList parts={parts} />
      )}
    </main>
  );
}

function PartsList({ parts }: { parts: GaragePart[] }) {
  if (parts.length === 0) {
    return <p className="mt-8 text-sm text-muted">Scan a car to drop the first part.</p>;
  }
  return (
    <div className="mt-6 space-y-5">
      {PART_SLOTS.map((slot) => {
        const rows = parts.filter((p) => p.slot === slot);
        return (
          <section key={slot}>
            <h2 className="font-display text-xl">
              {SLOT_LABEL[slot]} · {rows.length}
            </h2>
            <ul className="mt-2 space-y-2">
              {rows.length === 0 ? (
                <li className="text-sm text-muted">None yet</li>
              ) : (
                rows.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-navy-2 px-4 py-3"
                  >
                    <span className="font-display text-lg">
                      {p.rank} · {p.make} {p.model}
                    </span>
                    <span className="text-sm text-silver">{p.rank}</span>
                  </li>
                ))
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}