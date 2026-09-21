import type { Sighting } from "./types";
import { DAILY_SCAN_LIMIT } from "./types";

export const ROMAN = ["I", "II", "III", "IV", "V"] as const;
export type Roman = (typeof ROMAN)[number];

export const RANKS = [
  { id: "recruit", label: "Recruit", xpPerLevel: 200 },
  { id: "private", label: "Private", xpPerLevel: 400 },
  { id: "lance-corporal", label: "Lance Corporal", xpPerLevel: 700 },
  { id: "corporal", label: "Corporal", xpPerLevel: 1100 },
  { id: "sergeant", label: "Sergeant", xpPerLevel: 1600 },
  { id: "staff-sergeant", label: "Staff Sergeant", xpPerLevel: 2300 },
  { id: "warrant-officer", label: "Warrant Officer", xpPerLevel: 3200 },
  { id: "second-lieutenant", label: "Second Lieutenant", xpPerLevel: 4300 },
  { id: "lieutenant", label: "Lieutenant", xpPerLevel: 5600 },
  { id: "captain", label: "Captain", xpPerLevel: 7200 },
  { id: "major", label: "Major", xpPerLevel: 9200 },
  { id: "lieutenant-colonel", label: "Lieutenant Colonel", xpPerLevel: 11600 },
  { id: "colonel", label: "Colonel", xpPerLevel: 14500 },
  { id: "brigadier", label: "Brigadier", xpPerLevel: 18000 },
  { id: "major-general", label: "Major General", xpPerLevel: 22000 },
  { id: "lieutenant-general", label: "Lieutenant General", xpPerLevel: 27000 },
  { id: "general", label: "General", xpPerLevel: 33000 },
  { id: "field-marshal", label: "Field Marshal", xpPerLevel: 40000 },
] as const;

export type Rank = (typeof RANKS)[number];

export const XP_TO_FIELD_MARSHAL_V = RANKS.reduce((n, rank) => n + rank.xpPerLevel * 5, 0);

export type RankProgress = {
  rank: Rank;
  level: 1 | 2 | 3 | 4 | 5;
  roman: Roman;
  pips: number;
  xpIntoLevel: number;
  xpPerLevel: number;
  nextTitle: string | null;
  prestige: number;
  maxed: boolean;
  title: string;
  ratio: number;
};

export function modelKey(make: string, model: string) {
  return `${make.trim().toLowerCase()}|${model.trim().toLowerCase()}`;
}

export function xpFromSightings(sightings: Sighting[]) {
  const seen = new Set<string>();
  const chronological = [...sightings].sort(
    (a, b) => new Date(a.seenAt).getTime() - new Date(b.seenAt).getTime(),
  );
  let xp = 0;
  for (const row of chronological) {
    const key = modelKey(row.make, row.model);
    if (seen.has(key)) xp += 5;
    else {
      seen.add(key);
      xp += 10;
    }
  }
  return xp;
}

export function titleFor(rank: Rank, level: number) {
  return `${rank.label} ${ROMAN[level - 1]}`;
}

export function parseRankTitle(title: string) {
  const match = [...RANKS]
    .sort((a, b) => b.label.length - a.label.length)
    .find((row) => title === row.label || title.startsWith(`${row.label} `));
  if (!match) return null;
  const roman = (title.slice(match.label.length).trim() || "I") as Roman;
  const index = ROMAN.indexOf(roman);
  const level = (index >= 0 ? index + 1 : 1) as 1 | 2 | 3 | 4 | 5;
  return { rank: match, level, roman: ROMAN[level - 1]! };
}

export function rankProgress(xp: number): RankProgress {
  let remaining = Math.max(0, xp);
  for (let i = 0; i < RANKS.length; i++) {
    const rank = RANKS[i]!;
    const last = i === RANKS.length - 1;
    const span = rank.xpPerLevel * 5;
    if (!last && remaining >= span) {
      remaining -= span;
      continue;
    }

    if (last) {
      const per = rank.xpPerLevel;
      const reachedV = remaining >= per * 4;
      const level = (reachedV ? 5 : Math.min(4, Math.floor(remaining / per)) + 1) as
        | 1
        | 2
        | 3
        | 4
        | 5;
      const extra = reachedV ? remaining - per * 4 : remaining % per;
      const prestige = reachedV ? Math.floor(extra / per) : 0;
      const xpIntoLevel = reachedV ? extra % per : remaining % per;
      return {
        rank,
        level,
        roman: ROMAN[level - 1]!,
        pips: level,
        xpIntoLevel,
        xpPerLevel: per,
        nextTitle: reachedV ? null : titleFor(rank, level + 1),
        prestige,
        maxed: reachedV,
        title: titleFor(rank, level),
        ratio: per <= 0 ? 1 : xpIntoLevel / per,
      };
    }

    const level = (Math.min(4, Math.floor(remaining / rank.xpPerLevel)) + 1) as 1 | 2 | 3 | 4 | 5;
    const into = remaining % rank.xpPerLevel;
    const next = level === 5 ? titleFor(RANKS[i + 1]!, 1) : titleFor(rank, level + 1);
    return {
      rank,
      level,
      roman: ROMAN[level - 1]!,
      pips: level,
      xpIntoLevel: into,
      xpPerLevel: rank.xpPerLevel,
      nextTitle: next,
      prestige: 0,
      maxed: false,
      title: titleFor(rank, level),
      ratio: into / rank.xpPerLevel,
    };
  }
  const rank = RANKS[0]!;
  return {
    rank,
    level: 1,
    roman: "I",
    pips: 1,
    xpIntoLevel: 0,
    xpPerLevel: rank.xpPerLevel,
    nextTitle: titleFor(rank, 2),
    prestige: 0,
    maxed: false,
    title: titleFor(rank, 1),
    ratio: 0,
  };
}

export function xpRequiredForRank(rank: Rank) {
  let total = 0;
  for (const row of RANKS) {
    if (row.id === rank.id) return total;
    total += row.xpPerLevel * 5;
  }
  return total;
}

export function xpNeededForRank(xp: number, rank: Rank) {
  return Math.max(0, xpRequiredForRank(rank) - xp);
}

export function pipsForRank(xp: number, rank: Rank) {
  const progress = rankProgress(xp);
  const index = RANKS.findIndex((row) => row.id === rank.id);
  const currentIndex = RANKS.findIndex((row) => row.id === progress.rank.id);
  if (index < currentIndex) return { filled: 5, locked: false, current: false };
  if (index > currentIndex) return { filled: 0, locked: true, current: false };
  return { filled: progress.pips, locked: false, current: true };
}

/** Extra daily scans at this rank (cumulative, prestige extra is separate). */
export const RANK_EXTRA_SCANS = [
  0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 22, 24, 28, 30, 32, 34, 38, 44,
] as const;

export const PRESTIGE_EXTRA_SCANS = 3;

export function rankIndex(rank: Rank) {
  return RANKS.findIndex((row) => row.id === rank.id);
}

export function duplicateWindowMins(index: number) {
  if (index >= 17) return 45;
  if (index >= 9) return 60;
  if (index >= 4) return 90;
  return 120;
}

export function duplicateWindowMs(index: number) {
  return duplicateWindowMins(index) * 60 * 1000;
}

export function dailyScanLimit(progress: RankProgress) {
  const extra = RANK_EXTRA_SCANS[rankIndex(progress.rank)] ?? 0;
  return DAILY_SCAN_LIMIT + extra + progress.prestige * PRESTIGE_EXTRA_SCANS;
}

export function scanCap(sightings: Sighting[]) {
  return dailyScanLimit(rankProgress(xpFromSightings(sightings)));
}

export function perkUnlockNote(rank: Rank) {
  const i = rankIndex(rank);
  const extra = RANK_EXTRA_SCANS[i] ?? 0;
  const prev = i <= 0 ? 0 : (RANK_EXTRA_SCANS[i - 1] ?? 0);
  const gain = extra - prev;
  const mins = duplicateWindowMins(i);
  const prevMins = i <= 0 ? 120 : duplicateWindowMins(i - 1);
  const parts: string[] = [];
  if (i === 0) parts.push(`${DAILY_SCAN_LIMIT} scans a day`);
  else if (gain > 0) parts.push(`+${gain} daily scans`);
  if (mins !== prevMins) parts.push(`${mins}-min re-log window`);
  return parts.join(" · ") || `${DAILY_SCAN_LIMIT} scans a day`;
}

export function activePerkLines(progress: RankProgress) {
  const extra =
    (RANK_EXTRA_SCANS[rankIndex(progress.rank)] ?? 0) + progress.prestige * PRESTIGE_EXTRA_SCANS;
  const limit = dailyScanLimit(progress);
  const mins = duplicateWindowMins(rankIndex(progress.rank));
  const lines = [
    extra > 0 ? `${limit} scans a day · +${extra} from rank` : `${limit} scans a day`,
    mins === 120 ? "2 hour re-log window" : `${mins}-minute re-log window`,
  ];
  if (progress.prestige > 0) {
    lines.push(`Prestige ${progress.prestige} · +${progress.prestige * PRESTIGE_EXTRA_SCANS} scans`);
  }
  return lines;
}

export function nextPerkNote(progress: RankProgress) {
  if (progress.maxed) {
    return `Prestige ${progress.prestige + 1} — +${PRESTIGE_EXTRA_SCANS} daily scans`;
  }
  const next = RANKS[rankIndex(progress.rank) + 1];
  if (!next) return `Prestige 1 — +${PRESTIGE_EXTRA_SCANS} daily scans`;
  return `${titleFor(next, 1)} — ${perkUnlockNote(next)}`;
}

