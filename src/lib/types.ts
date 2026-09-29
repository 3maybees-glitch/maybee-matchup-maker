export type League = "AL" | "NL";

export type Team = {
  id: number;
  abbr: string;
  name: string;
  city: string;
  full: string;
  league: League;
  division: string;
  w: number;
  l: number;
  pct: number;
  rd: number;
  rs: number;
  ra: number;
  primary: string;
  accent: string;
  seed: number | null;
  playoff: boolean;
  winRank: number;
  rdRank: number;
  batting: {
    avg: number;
    hr: number;
    sb: number;
    bb: number;
    ops: number;
    ranks: { avg: number; hr: number; sb: number; bb: number };
  };
  pitching: {
    so: number;
    era: number;
    whip: number;
    sv: number;
    ranks: { so: number; era: number; whip: number; sv: number };
  };
  defense: {
    team: number;
    inf: number;
    of: number;
    ranks: { team: number; inf: number; of: number };
  };
  starHitter: { name: string; line: string } | null;
  starPitcher: { name: string; line: string } | null;
};

export type SeriesId =
  | "ALWC45"
  | "ALWC36"
  | "NLWC45"
  | "NLWC36"
  | "ALDS1"
  | "ALDS2"
  | "NLDS1"
  | "NLDS2"
  | "ALCS"
  | "NLCS"
  | "WS";

export type RoundName = "WC" | "DS" | "LCS" | "WS";

export type Slot =
  | { kind: "seed"; league: League; seed: number }
  | { kind: "winner"; of: SeriesId };

export type SeriesDef = {
  id: SeriesId;
  league: League | "MLB";
  round: RoundName;
  name: string;
  short: string;
  bestOf: 3 | 5 | 7;
  a: Slot;
  b: Slot;
};

export type WsGames = 4 | 5 | 6 | 7;

export type Picks = Partial<Record<SeriesId, number>> & {
  wsGames?: WsGames;
};

export type Entry = {
  id: string;
  name: string;
  email: string;
  emailOptIn: boolean;
  createdAt: string;
  updatedAt: string;
  picks: Picks;
};

export type BoardMeta = {
  rev: number;
  locked: boolean;
  allowLate: boolean;
  notes: Record<string, string>;
};

export type Board = {
  entries: Entry[];
  meta: BoardMeta;
};

export type LiveGame = {
  gamePk: number;
  gameType: string;
  officialDate: string;
  gameDate: string;
  state: "Preview" | "Live" | "Final" | "Other";
  detail: string;
  awayId: number;
  homeId: number;
  awayScore: number | null;
  homeScore: number | null;
  awayWinner: boolean;
  homeWinner: boolean;
  inning: number | null;
  inningState: string;
  innings: { num: number; away: number | null; home: number | null }[];
  winnerName: string;
  loserName: string;
  saveName: string;
  venue: string;
};

export type MaybeePct = {
  a: number;
  b: number;
  aHomeEdge: string;
};
