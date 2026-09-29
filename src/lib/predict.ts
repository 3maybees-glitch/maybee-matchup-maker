import type { SeriesDef, Team } from "./types";

export function rankScore(rank: number) {
  return (30 - rank) / 29;
}

export function strength(team: Team) {
  const batKeys = ["avg", "hr", "sb", "bb"] as const;
  const pitKeys = ["so", "era", "whip", "sv"] as const;
  const defKeys = ["team", "inf", "of"] as const;
  const bat = batKeys.reduce((sum, key) => sum + rankScore(team.batting.ranks[key]), 0) / batKeys.length;
  const pit = pitKeys.reduce((sum, key) => sum + rankScore(team.pitching.ranks[key]), 0) / pitKeys.length;
  const def = defKeys.reduce((sum, key) => sum + rankScore(team.defense.ranks[key]), 0) / defKeys.length;
  return 8 + 92 * (0.36 * rankScore(team.winRank) + 0.18 * rankScore(team.rdRank) + 0.16 * bat + 0.2 * pit + 0.1 * def);
}

function betterSide(a: Team, b: Team) {
  if (a.pct !== b.pct) return a.pct > b.pct ? "a" : "b";
  if (a.rd !== b.rd) return a.rd > b.rd ? "a" : "b";
  return a.w >= b.w ? "a" : "b";
}

function gameWinProb(a: Team, b: Team, aIsHome: boolean) {
  const base = strength(a) / (strength(a) + strength(b));
  const nudged = aIsHome ? base + 0.035 : base - 0.035;
  return Math.min(0.92, Math.max(0.08, nudged));
}

function aHosts(series: SeriesDef, a: Team, b: Team, gameIndex: number) {
  if (series.round === "WC" || series.round === "DS") {
    if (series.round === "WC") return true;
    return gameIndex === 0 || gameIndex === 1 || gameIndex === 4;
  }
  const betterHome = gameIndex === 0 || gameIndex === 1 || gameIndex === 5 || gameIndex === 6;
  return betterSide(a, b) === "a" ? betterHome : !betterHome;
}

export function seriesOutlook(a: Team, b: Team, series: SeriesDef) {
  const need = (series.bestOf + 1) / 2;
  const dp: number[][] = Array.from({ length: need + 1 }, () => Array(need + 1).fill(0));
  dp[0][0] = 1;
  for (let winsA = 0; winsA < need; winsA += 1) {
    for (let winsB = 0; winsB < need; winsB += 1) {
      const weight = dp[winsA][winsB];
      if (!weight) continue;
      const pA = gameWinProb(a, b, aHosts(series, a, b, winsA + winsB));
      dp[winsA + 1][winsB] += weight * pA;
      dp[winsA][winsB + 1] += weight * (1 - pA);
    }
  }
  let probA = 0;
  for (let winsB = 0; winsB < need; winsB += 1) probA += dp[need][winsB];
  let aPct = Math.round(probA * 100);
  aPct = Math.min(99, Math.max(1, aPct));
  const home = betterSide(a, b) === "a" ? a : b;
  let note = `${a.name} ${aPct}%, ${b.name} ${100 - aPct}%. `;
  if (series.round === "WC") note += `${a.name} host all three games.`;
  else if (series.round === "DS") note += `${a.name} host games 1, 2, and 5.`;
  else note += `${home.name} host games 1, 2, 6, and 7 on the better regular-season record.`;
  return { aPct, bPct: 100 - aPct, note, strengthA: Math.round(strength(a)), strengthB: Math.round(strength(b)) };
}

export const FORMULA =
  "Maybee % is this family's own number, not a betting line. Each club gets a strength score from the 2026 regular season: 36% winning-percentage rank, 18% run-differential rank, 16% batting (average, home runs, steals, walks), 20% pitching (strikeouts, ERA, WHIP, saves), and 10% defense. A home game is worth an extra 3.5 points of win probability. The series odds then play out the real bracket: higher seed hosts the whole Wild Card, hosts games 1, 2, and 5 of a Division Series, and the better record hosts games 1, 2, 6, and 7 after that.";
