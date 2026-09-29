import fs from "fs";

const UA = { "User-Agent": "Mozilla/5.0", Accept: "application/json" };

async function getJson(url) {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

const COLORS = {
  108: ["#BA0021", "#003263"],
  109: ["#A71930", "#E3D4AD"],
  110: ["#DF4601", "#000000"],
  111: ["#BD3039", "#0C2340"],
  112: ["#0E3386", "#CC3433"],
  113: ["#C6011F", "#000000"],
  114: ["#00385D", "#E31937"],
  115: ["#33006F", "#C4CED4"],
  116: ["#0C2340", "#FA4616"],
  117: ["#002D62", "#EB6E1F"],
  118: ["#004687", "#BD9B60"],
  119: ["#005A9C", "#EF3E42"],
  120: ["#AB0003", "#14225A"],
  121: ["#002D72", "#FF5910"],
  133: ["#003831", "#EFB21E"],
  134: ["#27251F", "#FDB827"],
  135: ["#2F241D", "#FFC425"],
  136: ["#0C2C56", "#005C5C"],
  137: ["#FD5A1E", "#27251F"],
  138: ["#C41E3A", "#0C2340"],
  139: ["#092C5C", "#8FBCE6"],
  140: ["#003278", "#C0111F"],
  141: ["#134A8E", "#1D2D5C"],
  142: ["#002B5C", "#D31145"],
  143: ["#E81828", "#002D72"],
  144: ["#CE1141", "#13274F"],
  145: ["#27251F", "#C4CED4"],
  146: ["#00A3E0", "#EF3340"],
  147: ["#003087", "#E4002B"],
  158: ["#12284B", "#FFC52F"],
};

function num(value) {
  if (value == null || value === "") return null;
  const n = Number(String(value).replace("%", ""));
  return Number.isFinite(n) ? n : null;
}

function ipToInnings(value) {
  const text = String(value ?? "0");
  const [whole, frac] = text.split(".");
  return Number(whole) + (Number(frac || 0) / 3);
}

function rankMap(items, get, lowerIsBetter) {
  const sorted = [...items].sort((a, b) => {
    const d = get(a) - get(b);
    return lowerIsBetter ? d : -d;
  });
  const ranks = new Map();
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && get(sorted[j + 1]) === get(sorted[i])) j += 1;
    const rank = i + 1;
    for (let k = i; k <= j; k += 1) ranks.set(sorted[k].id, rank);
    i = j + 1;
  }
  return ranks;
}

function tableRows(html, tableId) {
  const re = new RegExp(`<table[^>]*id="${tableId}"[\\s\\S]*?</table>`);
  const match = html.match(re);
  if (!match) return [];
  const block = match[0].replace(/<!--/g, "").replace(/-->/g, "");
  return [...block.matchAll(/<tr[\s\S]*?<\/tr>/g)].map((row) => {
    const obj = {};
    for (const cell of row[0].matchAll(/<(?:td|th)[^>]*data-stat="([^"]+)"[^>]*>([\s\S]*?)<\/(?:td|th)>/g)) {
      obj[cell[1]] = cell[2].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
    }
    return obj;
  });
}

const html = fs.readFileSync("C:/Users/3mayb/AppData/Local/Temp/br-field.html", "utf8");
const teamField = tableRows(html, "teams_standard_fielding").filter(
  (row) => row.team_name && row.team_name !== "Tm" && !/average|league/i.test(row.team_name),
);
const playerField = tableRows(html, "players_standard_fielding").filter(
  (row) => row.name_display && row.name_display !== "Player" && row.team_name_abbr && !/^(TOT|\dTM)$/.test(row.team_name_abbr),
);

const [hitting, pitching, standings, teamsMeta] = await Promise.all([
  getJson("https://statsapi.mlb.com/api/v1/teams/stats?season=2026&sportIds=1&group=hitting&stats=season&gameType=R"),
  getJson("https://statsapi.mlb.com/api/v1/teams/stats?season=2026&sportIds=1&group=pitching&stats=season&gameType=R"),
  getJson("https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=2026&standingsTypes=regularSeason"),
  getJson("https://statsapi.mlb.com/api/v1/teams?sportId=1&season=2026"),
]);

const hitters = await getJson(
  "https://statsapi.mlb.com/api/v1/stats?stats=season&group=hitting&season=2026&sportId=1&gameType=R&limit=200&playerPool=qualified&sortStat=ops&order=desc",
);
const pitchers = await getJson(
  "https://statsapi.mlb.com/api/v1/stats?stats=season&group=pitching&season=2026&sportId=1&gameType=R&limit=200&playerPool=qualified&sortStat=era&order=asc",
);

const metaById = new Map(
  teamsMeta.teams
    .filter((team) => COLORS[team.id])
    .map((team) => [team.id, team]),
);

const recordById = new Map();
for (const record of standings.records) {
  const league = record.league.id === 103 ? "AL" : "NL";
  for (const row of record.teamRecords) {
    recordById.set(row.team.id, {
      league,
      division: record.division.id,
      w: row.wins,
      l: row.losses,
      pct: Number(row.winningPercentage),
      rd: row.runDifferential,
      rs: row.runsScored,
      ra: row.runsAllowed,
      divisionRank: Number(row.divisionRank),
      leagueRank: Number(row.leagueRank),
      wildCardRank: row.wildCardRank ? Number(row.wildCardRank) : null,
      divisionChamp: row.divisionRank === "1",
    });
  }
}

const hitById = new Map(hitting.stats[0].splits.map((split) => [split.team.id, split.stat]));
const pitById = new Map(pitching.stats[0].splits.map((split) => [split.team.id, split.stat]));

const brNameToId = new Map();
for (const team of metaById.values()) {
  brNameToId.set(`${team.locationName} ${team.teamName}`.toLowerCase(), team.id);
  brNameToId.set(team.name.toLowerCase(), team.id);
  brNameToId.set(team.franchiseName?.toLowerCase?.() || "", team.id);
}
brNameToId.set("arizona diamondbacks", 109);
brNameToId.set("oakland athletics", 133);
brNameToId.set("athletics", 133);
brNameToId.set("cleveland guardians", 114);
brNameToId.set("tampa bay rays", 139);

const brAbbrToId = {
  ARI: 109, ATH: 133, OAK: 133, ATL: 144, BAL: 110, BOS: 111, CHC: 112, CHW: 145, CWS: 145,
  CIN: 113, CLE: 114, COL: 115, DET: 116, HOU: 117, KCR: 118, KC: 118, LAA: 108, LAD: 119,
  MIA: 146, MIL: 158, MIN: 142, NYM: 121, NYY: 147, PHI: 143, PIT: 134, SDP: 135, SD: 135,
  SEA: 136, SFG: 137, SF: 137, STL: 138, TBR: 139, TB: 139, TEX: 140, TOR: 141, WSN: 120, WSH: 120,
};

const teamDrs = new Map();
for (const row of teamField) {
  const id = brNameToId.get(row.team_name.toLowerCase());
  if (!id) {
    console.log("unmatched BR team", row.team_name);
    continue;
  }
  teamDrs.set(id, num(row.bis_runs_total_team) ?? 0);
}

const infDrs = new Map();
const ofDrs = new Map();
for (const id of metaById.keys()) {
  infDrs.set(id, 0);
  ofDrs.set(id, 0);
}
for (const row of playerField) {
  const id = brAbbrToId[row.team_name_abbr];
  if (!id) continue;
  const pos = (row.pos || "").replace(/\*/g, "");
  const digit = pos.match(/[1-9]/)?.[0];
  const drs = num(row.f_drs_total);
  if (!digit || drs == null) continue;
  if ("3456".includes(digit)) infDrs.set(id, (infDrs.get(id) || 0) + drs);
  if ("789".includes(digit)) ofDrs.set(id, (ofDrs.get(id) || 0) + drs);
}

function hitterLine(stat) {
  const avg = Number(stat.avg).toFixed(3).replace(/^0/, "");
  return `${avg}, ${stat.homeRuns} HR, ${Number(stat.ops).toFixed(3).replace(/^0/, "")} OPS`;
}

function pitcherLine(stat) {
  return `${Number(stat.era).toFixed(2)} ERA, ${stat.strikeOuts} K, ${stat.inningsPitched} IP`;
}

const hitterByTeam = new Map();
for (const split of hitters.stats[0].splits) {
  const id = split.team?.id;
  if (!id || hitterByTeam.has(id)) continue;
  hitterByTeam.set(id, { name: split.player.fullName, line: hitterLine(split.stat) });
}

const pitcherByTeam = new Map();
for (const split of pitchers.stats[0].splits) {
  const id = split.team?.id;
  if (!id || pitcherByTeam.has(id)) continue;
  if (ipToInnings(split.stat.inningsPitched) < 80) continue;
  pitcherByTeam.set(id, { name: split.player.fullName, line: pitcherLine(split.stat) });
}

const divisionNames = {
  200: "AL West",
  201: "AL East",
  202: "AL Central",
  203: "NL West",
  204: "NL East",
  205: "NL Central",
};

const teams = [...metaById.values()].map((team) => {
  const rec = recordById.get(team.id);
  const hit = hitById.get(team.id);
  const pit = pitById.get(team.id);
  return {
    id: team.id,
    abbr: team.abbreviation,
    name: team.teamName,
    city: team.locationName,
    full: team.name,
    league: rec.league,
    division: divisionNames[rec.division] || "",
    w: rec.w,
    l: rec.l,
    pct: rec.pct,
    rd: rec.rd,
    rs: rec.rs,
    ra: rec.ra,
    divisionChamp: rec.divisionChamp,
    leagueRank: rec.leagueRank,
    wildCardRank: rec.wildCardRank,
    primary: COLORS[team.id][0],
    accent: COLORS[team.id][1],
    ba: num(hit.avg),
    hr: hit.homeRuns,
    sb: hit.stolenBases,
    bb: hit.baseOnBalls,
    ops: num(hit.ops),
    so: pit.strikeOuts,
    era: num(pit.era),
    whip: num(pit.whip),
    sv: pit.saves,
    teamWar: Math.round(((teamDrs.get(team.id) ?? 0) / 10) * 10) / 10,
    infWar: Math.round(((infDrs.get(team.id) ?? 0) / 10) * 10) / 10,
    ofWar: Math.round(((ofDrs.get(team.id) ?? 0) / 10) * 10) / 10,
    teamDrs: teamDrs.get(team.id) ?? 0,
    infDrs: infDrs.get(team.id) ?? 0,
    ofDrs: ofDrs.get(team.id) ?? 0,
    starHitter: hitterByTeam.get(team.id) || null,
    starPitcher: pitcherByTeam.get(team.id) || null,
  };
});

async function fillStars(team) {
  if (!team.starHitter) {
    const data = await getJson(
      `https://statsapi.mlb.com/api/v1/stats?stats=season&group=hitting&season=2026&sportId=1&gameType=R&teamId=${team.id}&playerPool=all&limit=20&sortStat=ops&order=desc`,
    );
    const splits = data.stats?.[0]?.splits || [];
    const pick = splits.find((split) => (split.stat.plateAppearances || 0) >= 150) || splits[0];
    if (pick) team.starHitter = { name: pick.player.fullName, line: hitterLine(pick.stat) };
  }
  if (!team.starPitcher) {
    const data = await getJson(
      `https://statsapi.mlb.com/api/v1/stats?stats=season&group=pitching&season=2026&sportId=1&gameType=R&teamId=${team.id}&playerPool=all&limit=30&sortStat=strikeOuts&order=desc`,
    );
    const splits = data.stats?.[0]?.splits || [];
    const qualified = splits
      .filter((split) => ipToInnings(split.stat.inningsPitched) >= 40)
      .sort((a, b) => num(a.stat.era) - num(b.stat.era));
    const pick = qualified[0] || splits[0];
    if (pick) team.starPitcher = { name: pick.player.fullName, line: pitcherLine(pick.stat) };
  }
}

const playoffSeeds = [];
for (const league of ["AL", "NL"]) {
  const clubs = teams.filter((team) => team.league === league);
  const champs = clubs
    .filter((team) => team.divisionChamp)
    .sort((a, b) => a.leagueRank - b.leagueRank);
  const wild = clubs
    .filter((team) => !team.divisionChamp && team.wildCardRank)
    .sort((a, b) => a.wildCardRank - b.wildCardRank)
    .slice(0, 3);
  champs.forEach((team, index) => playoffSeeds.push({ id: team.id, seed: index + 1 }));
  wild.forEach((team, index) => playoffSeeds.push({ id: team.id, seed: index + 4 }));
}
const seedById = new Map(playoffSeeds.map((row) => [row.id, row.seed]));
for (const team of teams) {
  if (seedById.has(team.id)) {
    team.seed = seedById.get(team.id);
    team.playoff = true;
    await fillStars(team);
  } else {
    team.playoff = false;
  }
}

const baRank = rankMap(teams, (team) => team.ba, false);
const hrRank = rankMap(teams, (team) => team.hr, false);
const sbRank = rankMap(teams, (team) => team.sb, false);
const bbRank = rankMap(teams, (team) => team.bb, false);
const soRank = rankMap(teams, (team) => team.so, false);
const eraRank = rankMap(teams, (team) => team.era, true);
const whipRank = rankMap(teams, (team) => team.whip, true);
const svRank = rankMap(teams, (team) => team.sv, false);
const teamWarRank = rankMap(teams, (team) => team.teamDrs, false);
const infWarRank = rankMap(teams, (team) => team.infDrs, false);
const ofWarRank = rankMap(teams, (team) => team.ofDrs, false);
const winRank = rankMap(teams, (team) => team.pct, false);
const rdRank = rankMap(teams, (team) => team.rd, false);

const out = teams
  .map((team) => ({
    id: team.id,
    abbr: team.abbr,
    name: team.name,
    city: team.city,
    full: team.full,
    league: team.league,
    division: team.division,
    w: team.w,
    l: team.l,
    pct: team.pct,
    rd: team.rd,
    rs: team.rs,
    ra: team.ra,
    primary: team.primary,
    accent: team.accent,
    seed: team.seed ?? null,
    playoff: team.playoff,
    winRank: winRank.get(team.id),
    rdRank: rdRank.get(team.id),
    batting: {
      avg: team.ba,
      hr: team.hr,
      sb: team.sb,
      bb: team.bb,
      ops: team.ops,
      ranks: {
        avg: baRank.get(team.id),
        hr: hrRank.get(team.id),
        sb: sbRank.get(team.id),
        bb: bbRank.get(team.id),
      },
    },
    pitching: {
      so: team.so,
      era: team.era,
      whip: team.whip,
      sv: team.sv,
      ranks: {
        so: soRank.get(team.id),
        era: eraRank.get(team.id),
        whip: whipRank.get(team.id),
        sv: svRank.get(team.id),
      },
    },
    defense: {
      team: team.teamWar,
      inf: team.infWar,
      of: team.ofWar,
      ranks: {
        team: teamWarRank.get(team.id),
        inf: infWarRank.get(team.id),
        of: ofWarRank.get(team.id),
      },
    },
    starHitter: team.starHitter,
    starPitcher: team.starPitcher,
  }))
  .sort((a, b) => a.league.localeCompare(b.league) || (a.seed ?? 99) - (b.seed ?? 99) || a.full.localeCompare(b.full));

const missing = out.filter((team) => team.playoff && (!team.starHitter || !team.starPitcher));
console.log(
  "PLAYOFF",
  out
    .filter((team) => team.playoff)
    .map((team) => `${team.league}${team.seed} ${team.abbr} ${team.w}-${team.l} BA#${team.batting.ranks.avg} ERA#${team.pitching.ranks.era} dWAR ${team.defense.team} IF ${team.defense.inf} OF ${team.defense.of} | ${team.starHitter?.name} | ${team.starPitcher?.name}`)
    .join("\n"),
);
console.log("missing stars", missing.map((team) => team.abbr));
console.log("teams", out.length, "field rows", teamField.length);

const file = `/* Generated from MLB Stats API (mlb.com) and Baseball-Reference defensive runs saved. Do not edit by hand. */
import type { Team } from "../lib/types";

export const STATS_NOTE =
  "Batting, pitching, win-loss records, and live scores come from MLB.com through the 2026 regular season. Defensive WAR is Baseball-Reference Defensive Runs Saved divided by 10, because MLB.com does not publish defensive WAR. Infield is first base, second base, third base, and shortstop. Outfield is left, center, and right.";

export const TEAMS: Team[] = ${JSON.stringify(out, null, 2)};
`;

fs.mkdirSync("C:/Users/3mayb/Projects/maybee-matchup-maker/src/data", { recursive: true });
fs.mkdirSync("C:/Users/3mayb/Projects/maybee-matchup-maker/src/lib", { recursive: true });
fs.writeFileSync("C:/Users/3mayb/Projects/maybee-matchup-maker/src/data/season.ts", file);
console.log("wrote season.ts");
