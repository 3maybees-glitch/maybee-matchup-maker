import { TEAMS } from "../data/season";
import type { Entry, League, Picks, SeriesDef, SeriesId, Slot, Team, WsGames } from "./types";

export const SERIES: SeriesDef[] = [
  { id: "ALWC45", league: "AL", round: "WC", name: "AL Wild Card", short: "Yankees / Red Sox", bestOf: 3, a: { kind: "seed", league: "AL", seed: 4 }, b: { kind: "seed", league: "AL", seed: 5 } },
  { id: "ALWC36", league: "AL", round: "WC", name: "AL Wild Card", short: "Astros / White Sox", bestOf: 3, a: { kind: "seed", league: "AL", seed: 3 }, b: { kind: "seed", league: "AL", seed: 6 } },
  { id: "NLWC45", league: "NL", round: "WC", name: "NL Wild Card", short: "Padres / Cubs", bestOf: 3, a: { kind: "seed", league: "NL", seed: 4 }, b: { kind: "seed", league: "NL", seed: 5 } },
  { id: "NLWC36", league: "NL", round: "WC", name: "NL Wild Card", short: "Braves / Phillies", bestOf: 3, a: { kind: "seed", league: "NL", seed: 3 }, b: { kind: "seed", league: "NL", seed: 6 } },
  { id: "ALDS1", league: "AL", round: "DS", name: "AL Division Series", short: "Rays side", bestOf: 5, a: { kind: "seed", league: "AL", seed: 1 }, b: { kind: "winner", of: "ALWC45" } },
  { id: "ALDS2", league: "AL", round: "DS", name: "AL Division Series", short: "Guardians side", bestOf: 5, a: { kind: "seed", league: "AL", seed: 2 }, b: { kind: "winner", of: "ALWC36" } },
  { id: "NLDS1", league: "NL", round: "DS", name: "NL Division Series", short: "Brewers side", bestOf: 5, a: { kind: "seed", league: "NL", seed: 1 }, b: { kind: "winner", of: "NLWC45" } },
  { id: "NLDS2", league: "NL", round: "DS", name: "NL Division Series", short: "Dodgers side", bestOf: 5, a: { kind: "seed", league: "NL", seed: 2 }, b: { kind: "winner", of: "NLWC36" } },
  { id: "ALCS", league: "AL", round: "LCS", name: "AL Championship", short: "American League", bestOf: 7, a: { kind: "winner", of: "ALDS1" }, b: { kind: "winner", of: "ALDS2" } },
  { id: "NLCS", league: "NL", round: "LCS", name: "NL Championship", short: "National League", bestOf: 7, a: { kind: "winner", of: "NLDS1" }, b: { kind: "winner", of: "NLDS2" } },
  { id: "WS", league: "MLB", round: "WS", name: "World Series", short: "World Series", bestOf: 7, a: { kind: "winner", of: "ALCS" }, b: { kind: "winner", of: "NLCS" } },
];

const NEXT: Record<SeriesId, SeriesId[]> = {
  ALWC45: ["ALDS1"],
  ALWC36: ["ALDS2"],
  NLWC45: ["NLDS1"],
  NLWC36: ["NLDS2"],
  ALDS1: ["ALCS"],
  ALDS2: ["ALCS"],
  NLDS1: ["NLCS"],
  NLDS2: ["NLCS"],
  ALCS: ["WS"],
  NLCS: ["WS"],
  WS: [],
};

export const SERIES_IDS = SERIES.map((series) => series.id);

export function seriesById(id: SeriesId) {
  const series = SERIES.find((item) => item.id === id);
  if (!series) throw new Error(id);
  return series;
}

export function teamById(id: number | null | undefined) {
  if (id == null) return undefined;
  return TEAMS.find((team) => team.id === id);
}

export function teamBySeed(league: League, seed: number) {
  const team = TEAMS.find((item) => item.playoff && item.league === league && item.seed === seed);
  if (!team) throw new Error(`${league} seed ${seed}`);
  return team;
}

export function playoffTeams() {
  return TEAMS.filter((team) => team.playoff).sort((a, b) => a.league.localeCompare(b.league) || (a.seed ?? 0) - (b.seed ?? 0));
}

export function resolveSlot(slot: Slot, picks: Picks): Team | undefined {
  if (slot.kind === "seed") return teamBySeed(slot.league, slot.seed);
  const id = picks[slot.of];
  return teamById(id);
}

export function matchupTeams(series: SeriesDef, picks: Picks) {
  return { a: resolveSlot(series.a, picks), b: resolveSlot(series.b, picks) };
}

export function withPick(picks: Picks, id: SeriesId, teamId: number): Picks {
  const next: Picks = { ...picks, [id]: teamId };
  const stack = [...NEXT[id]];
  const wipe = new Set<SeriesId>();
  while (stack.length) {
    const seriesId = stack.pop()!;
    if (wipe.has(seriesId)) continue;
    wipe.add(seriesId);
    stack.push(...NEXT[seriesId]);
  }
  for (const seriesId of wipe) delete next[seriesId];
  return next;
}

export function cardComplete(picks: Picks) {
  return SERIES.every((series) => picks[series.id] != null) && (picks.wsGames === 4 || picks.wsGames === 5 || picks.wsGames === 6 || picks.wsGames === 7);
}

export function winsNeeded(bestOf: number) {
  return (bestOf + 1) / 2;
}

export function slotHint(slot: Slot) {
  if (slot.kind === "seed") {
    const team = teamBySeed(slot.league, slot.seed);
    return team.seed && team.seed <= 2 ? `${team.name} bye` : team.name;
  }
  const series = seriesById(slot.of);
  return `Winner of ${series.short}`;
}

export function championId(picks: Picks) {
  return picks.WS;
}

export function wsGamesChoices(): WsGames[] {
  return [4, 5, 6, 7];
}

export function entryChampion(entry: Entry) {
  return teamById(entry.picks.WS);
}
