import type { LiveGame } from "./types";

const SCHEDULE =
  "https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=2026&gameType=F,D,L,W&hydrate=linescore,decisions,team,venue";

type RawGame = {
  gamePk: number;
  gameType?: string;
  officialDate?: string;
  gameDate?: string;
  status?: { abstractGameState?: string; detailedState?: string };
  teams?: {
    away?: { team?: { id?: number }; score?: number; isWinner?: boolean };
    home?: { team?: { id?: number }; score?: number; isWinner?: boolean };
  };
  linescore?: {
    currentInning?: number;
    inningState?: string;
    innings?: { num: number; away?: { runs?: number }; home?: { runs?: number } }[];
  };
  decisions?: {
    winner?: { fullName?: string };
    loser?: { fullName?: string };
    save?: { fullName?: string };
  };
  venue?: { name?: string };
};

function stateOf(value: string | undefined): LiveGame["state"] {
  if (value === "Final" || value === "Live" || value === "Preview") return value;
  return "Other";
}

function mapGame(game: RawGame): LiveGame | null {
  const awayId = game.teams?.away?.team?.id;
  const homeId = game.teams?.home?.team?.id;
  if (!awayId || !homeId) return null;
  return {
    gamePk: game.gamePk,
    gameType: game.gameType || "",
    officialDate: game.officialDate || "",
    gameDate: game.gameDate || "",
    state: stateOf(game.status?.abstractGameState),
    detail: game.status?.detailedState || "",
    awayId,
    homeId,
    awayScore: game.teams?.away?.score ?? null,
    homeScore: game.teams?.home?.score ?? null,
    awayWinner: Boolean(game.teams?.away?.isWinner),
    homeWinner: Boolean(game.teams?.home?.isWinner),
    inning: game.linescore?.currentInning ?? null,
    inningState: game.linescore?.inningState || "",
    innings: (game.linescore?.innings || []).map((inning) => ({
      num: inning.num,
      away: inning.away?.runs ?? null,
      home: inning.home?.runs ?? null,
    })),
    winnerName: game.decisions?.winner?.fullName || "",
    loserName: game.decisions?.loser?.fullName || "",
    saveName: game.decisions?.save?.fullName || "",
    venue: game.venue?.name || "",
  };
}

export async function fetchLiveGames() {
  const response = await fetch(SCHEDULE);
  if (!response.ok) throw new Error(`MLB schedule ${response.status}`);
  const data = (await response.json()) as { dates?: { games?: RawGame[] }[] };
  return (data.dates || [])
    .flatMap((date) => date.games || [])
    .map(mapGame)
    .filter((game): game is LiveGame => game != null);
}

export function firstPitchStarted(games: LiveGame[]) {
  return games.some((game) => game.state === "Live" || game.state === "Final");
}

export function nextGame(games: LiveGame[]) {
  return [...games]
    .filter((game) => game.state === "Preview" && game.gameDate)
    .sort((a, b) => a.gameDate.localeCompare(b.gameDate))[0];
}
