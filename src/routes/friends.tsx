import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useGarageStore } from "@/lib/store";
import { xpFromSightings } from "@/lib/ranks";

export const Route = createFileRoute("/friends")({ component: FriendsPage });

function FriendsPage() {
  const sightings = useGarageStore((s) => s.sightings);
  const xp = xpFromSightings(sightings);
  const [name, setName] = useState(() => localStorage.getItem("sg-name") || "You");
  const code = useMemo(() => {
    let saved = localStorage.getItem("sg-code");
    if (!saved) {
      saved = "SG-" + Math.random().toString(36).slice(2, 6).toUpperCase();
      localStorage.setItem("sg-code", saved);
    }
    return saved;
  }, []);
  const [friendCode, setFriendCode] = useState("");
  const [friends, setFriends] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("sg-friends") || "[]");
    } catch {
      return [];
    }
  });

  function saveName(value: string) {
    setName(value);
    localStorage.setItem("sg-name", value);
  }

  function addFriend() {
    const next = friendCode.trim().toUpperCase();
    if (!next || next === code || friends.includes(next)) return;
    const list = [...friends, next];
    setFriends(list);
    localStorage.setItem("sg-friends", JSON.stringify(list));
    setFriendCode("");
  }

  return (
    <main className="px-5 pt-6 pb-8">
      <p className="font-display text-xs tracking-[0.32em] text-silver">CREW</p>
      <h1 className="mt-1 font-display text-4xl tracking-wide">Friends</h1>
      <p className="mt-2 text-sm text-muted">
        Scores stay on this phone until we connect the online garage. Add codes now so you are ready.
      </p>

      <section className="mt-6 rounded-xl border border-border bg-navy-2 p-4">
        <h2 className="font-display text-xl tracking-wide">Your garage</h2>
        <label className="mt-3 block text-xs uppercase tracking-wider text-muted">Display name</label>
        <input
          className="mt-1 h-12 w-full rounded-md border border-border bg-navy px-3 text-fg"
          value={name}
          onChange={(e) => saveName(e.target.value.slice(0, 18))}
        />
        <p className="mt-3 text-xs uppercase tracking-wider text-muted">Friend code</p>
        <p className="mt-1 font-display text-2xl tracking-wide">{code}</p>
        <p className="mt-1 text-sm text-silver">{xp} XP on this phone</p>
      </section>

      <section className="mt-4 rounded-xl border border-border bg-navy-2 p-4">
        <h2 className="font-display text-xl tracking-wide">Add friend</h2>
        <input
          className="mt-3 h-12 w-full rounded-md border border-border bg-navy px-3 text-fg"
          placeholder="SG-XXXX"
          value={friendCode}
          onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
        />
        <button
          type="button"
          onClick={addFriend}
          className="mt-3 min-h-12 w-full rounded-md bg-primary font-display text-lg tracking-wide text-primary-fg"
        >
          Save code
        </button>
        {friends.length ? (
          <ul className="mt-3 space-y-1 text-sm text-silver">
            {friends.map((row) => (
              <li key={row}>{row}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">No friend codes saved yet.</p>
        )}
      </section>

      <section className="mt-4 rounded-xl border border-border bg-navy-2 p-4">
        <h2 className="font-display text-xl tracking-wide">Leaderboard</h2>
        <div className="mt-3 flex items-center justify-between">
          <span>{name}</span>
          <span className="font-display tabular-nums">{xp} XP</span>
        </div>
        <p className="mt-3 text-sm text-muted">
          Friends will appear here after the online garage is connected.
        </p>
      </section>
    </main>
  );
}