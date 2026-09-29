import { SERIES, matchupTeams, winsNeeded } from "./bracket";
import type { Entry, LiveGame, Picks, SeriesId } from "./types";

export function officialWinners(games: LiveGame[]) {
  const winners: Picks = {};
  const finals = games.filter((game) => game.state === "Final" && (game.awayWinner || game.homeWinner));
  for (const series of SERIES) {
    const { a, b } = matchupTeams(series, winners);
    if (!a || !b) continue;
    let aWins = 0;
    let bWins = 0;
    for (const game of finals) {
      const ids = [game.awayId, game.homeId];
      if (!ids.includes(a.id) || !ids.includes(b.id)) continue;
      const winnerId = game.awayWinner ? game.awayId : game.homeId;
      if (winnerId === a.id) aWins += 1;
      if (winnerId === b.id) bWins += 1;
    }
    const need = winsNeeded(series.bestOf);
    if (aWins >= need) winners[series.id] = a.id;
    else if (bWins >= need) winners[series.id] = b.id;
  }
  return winners;
}

export function seriesWins(games: LiveGame[], aId: number, bId: number) {
  let aWins = 0;
  let bWins = 0;
  const played = games
    .filter((game) => {
      const ids = [game.awayId, game.homeId];
      return ids.includes(aId) && ids.includes(bId);
    })
    .sort((a, b) => a.gameDate.localeCompare(b.gameDate));
  for (const game of played) {
    if (game.state !== "Final") continue;
    if (game.awayWinner && game.awayId === aId) aWins += 1;
    if (game.homeWinner && game.homeId === aId) aWins += 1;
    if (game.awayWinner && game.awayId === bId) bWins += 1;
    if (game.homeWinner && game.homeId === bId) bWins += 1;
  }
  return { aWins, bWins, played };
}

export function actualWsGames(games: LiveGame[], winners: Picks) {
  if (winners.WS == null) return null;
  const al = winners.ALCS;
  const nl = winners.NLCS;
  if (al == null || nl == null) return null;
  const { aWins, bWins } = seriesWins(games, al, nl);
  const total = aWins + bWins;
  return total >= 4 ? total : null;
}

export type Score = {
  points: number;
  correct: number;
  decided: number;
  wsLengthHit: boolean;
  bySeries: { id: SeriesId; correct: boolean | null; worth: number }[];
};

export function scoreEntry(entry: Entry, winners: Picks, wsLength: number | null): Score {
  let points = 0;
  let correct = 0;
  let decided = 0;
  const bySeries = SERIES.map((series) => {
    const actual = winners[series.id];
    if (actual == null) return { id: series.id, correct: null, worth: series.id === "WS" ? 3 : 1 };
    decided += 1;
    const hit = entry.picks[series.id] === actual;
    const worth = series.id === "WS" ? 3 : 1;
    if (hit) {
      correct += 1;
      points += worth;
    }
    return { id: series.id, correct: hit, worth };
  });
  return {
    points,
    correct,
    decided,
    wsLengthHit: wsLength != null && entry.picks.wsGames === wsLength,
    bySeries,
  };
}

export function maxPoints() {
  return 10 + 3;
}

export function sortEntries(entries: Entry[], winners: Picks, wsLength: number | null) {
  return [...entries].sort((a, b) => {
    const sa = scoreEntry(a, winners, wsLength);
    const sb = scoreEntry(b, winners, wsLength);
    if (sb.points !== sa.points) return sb.points - sa.points;
    if (sb.wsLengthHit !== sa.wsLengthHit) return sb.wsLengthHit ? 1 : -1;
    if (sb.correct !== sa.correct) return sb.correct - sa.correct;
    return a.createdAt.localeCompare(b.createdAt);
  });
}
