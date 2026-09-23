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
                      <p className="font-display text-3xl tracking-wide">{p.rank}</p>
                    </div>
                    <p className="mt-2 font-display text-lg leading-tight">
                      {p.make}
                    </p>
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