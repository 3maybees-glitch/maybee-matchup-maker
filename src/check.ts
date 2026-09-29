import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { TEAMS } from "./data/season";
import { emptyBoard, packBoard, unpackBoard, upsertEntry } from "./lib/board";
import { matchupTeams, seriesById, teamById, withPick } from "./lib/bracket";
import { seriesOutlook, strength } from "./lib/predict";
import { maxPoints, scoreEntry, sortEntries } from "./lib/score";
import type { Entry, Picks, SeriesId } from "./lib/types";

function byAbbr(abbr: string) {
  const team = TEAMS.find((item) => item.abbr === abbr);
  if (!team) throw new Error(abbr);
  return team;
}

function entry(picks: Picks, id = "TEST01"): Entry {
  return {
    id,
    name: "Test",
    email: "",
    emailOptIn: false,
    createdAt: "2026-09-29T00:00:00.000Z",
    updatedAt: "2026-09-29T00:00:00.000Z",
    picks,
  };
}

export function run() {
  const problems: string[] = [];
  const bad = (ok: boolean, message: string) => {
    if (!ok) problems.push(message);
  };

  bad(TEAMS.length === 30, `expected 30 teams, saw ${TEAMS.length}`);
  const playoff = TEAMS.filter((team) => team.playoff);
  bad(playoff.length === 12, `expected 12 playoff teams, saw ${playoff.length}`);
  for (const league of ["AL", "NL"] as const) {
    const seeds = playoff.filter((team) => team.league === league).map((team) => team.seed);
    bad(new Set(seeds).size === 6, `${league} seeds are not unique`);
    bad(seeds.every((seed) => seed != null && seed >= 1 && seed <= 6), `${league} seed range`);
  }
  bad(byAbbr("HOU").seed === 3, "Astros should be the AL 3 seed");
  bad(byAbbr("MIL").seed === 1, "Brewers should be the NL 1 seed");
  bad(byAbbr("TB").batting.ranks.avg === 1 && byAbbr("MIL").batting.ranks.avg === 1, "Rays and Brewers share the batting-average lead");
  bad(byAbbr("CHC").defense.ranks.team === 1, "Cubs should lead team defense");
  bad(byAbbr("NYY").id === 147, "Yankees id should be 147");

  const mil = byAbbr("MIL");
  const phi = byAbbr("PHI");
  const milStrength = strength(mil);
  bad(milStrength >= 8 && milStrength <= 100, `Brewers strength ${milStrength} left the 8-100 scale`);
  const outlook = seriesOutlook(mil, phi, seriesById("NLDS1"));
  bad(outlook.aPct + outlook.bPct === 100, "Maybee percents should add to 100");
  bad(outlook.aPct > 50 && outlook.aPct < 90, `Brewers series percent vs a weaker club was ${outlook.aPct}`);

  const ids: SeriesId[] = ["ALWC45", "ALWC36", "NLWC45", "NLWC36", "ALDS1", "ALDS2", "NLDS1", "NLDS2", "ALCS", "NLCS", "WS"];
  const winners: Picks = {
    ALWC45: byAbbr("NYY").id,
    ALWC36: byAbbr("HOU").id,
    NLWC45: byAbbr("SD").id,
    NLWC36: byAbbr("ATL").id,
    ALDS1: byAbbr("TB").id,
    ALDS2: byAbbr("CLE").id,
    NLDS1: mil.id,
    NLDS2: byAbbr("LAD").id,
    ALCS: byAbbr("TB").id,
    NLCS: mil.id,
    WS: mil.id,
    wsGames: 6,
  };
  const perfect = entry({ ...winners, wsGames: 6 });
  const perfectScore = scoreEntry(perfect, winners, 6);
  bad(perfectScore.points === 13 && maxPoints() === 13, `perfect card scored ${perfectScore.points}`);
  bad(perfectScore.wsLengthHit, "perfect card should hit the World Series length");

  const missed: Picks = {};
  for (const id of ids) missed[id] = 1;
  bad(scoreEntry(entry({ ...missed, ALWC45: byAbbr("NYY").id }), winners, 6).points === 1, "one Wild Card should be 1 point");
  bad(scoreEntry(entry({ ...missed, WS: mil.id }), winners, null).points === 3, "World Series alone should be 3 points");
  bad(scoreEntry(entry({ ...missed, wsGames: 4 }), winners, 6).points === 0, "a miss should be 0");

  const shared = upsertEntry(emptyBoard(), { ...perfect, email: "fan@example.com", emailOptIn: true });
  const back = unpackBoard(packBoard(shared));
  bad(back?.entries[0]?.picks.WS === mil.id, "pack round-trip lost the champion");
  bad(back?.entries[0]?.picks.wsGames === 6, "pack round-trip lost the series length");
  bad(back?.entries[0]?.email === "fan@example.com", "opted-in email should travel with the card");
  const hidden = unpackBoard(packBoard(upsertEntry(emptyBoard(), { ...perfect, email: "fan@example.com", emailOptIn: false })));
  bad(hidden?.entries[0]?.email === "", "email should stay off the link without opt-in");

  let picks = withPick({}, "ALWC45", 147);
  const alds = matchupTeams(seriesById("ALDS1"), picks);
  bad(alds.b?.id === 147 && alds.a?.abbr === "TB", "ALDS side B should become the Yankees");
  bad(teamById(147)?.abbr === "NYY", "147 should be the Yankees");
  picks = withPick(picks, "NLWC45", byAbbr("CHC").id);
  picks = withPick(picks, "ALDS1", byAbbr("TB").id);
  picks = withPick(picks, "ALCS", byAbbr("TB").id);
  picks = withPick(picks, "WS", byAbbr("TB").id);
  picks = withPick(picks, "ALWC45", byAbbr("BOS").id);
  bad(picks.ALWC45 === byAbbr("BOS").id, "Wild Card pick should update");
  bad(picks.ALDS1 == null && picks.ALCS == null && picks.WS == null, "later rounds should clear");
  bad(picks.NLWC45 === byAbbr("CHC").id, "the other league should stay");

  const early = entry({ ...winners, wsGames: 4 }, "EARLY1");
  early.createdAt = "2026-09-01T00:00:00.000Z";
  const later = entry({ ...winners, wsGames: 7 }, "LATER1");
  later.createdAt = "2026-09-02T00:00:00.000Z";
  const order = sortEntries([later, early], winners, 6).map((item) => item.id);
  bad(order[0] === "EARLY1", "earlier card should win a tie when neither hits the length");

  try {
    const html = renderToString(createElement(App));
    bad(html.includes("Maybee Matchup Maker"), "home screen missed the title");
    bad(html.includes("Deal me a card"), "home screen missed the deal button");
  } catch (error) {
    problems.push(`render ${error instanceof Error ? error.message : String(error)}`);
  }

  return problems;
}
