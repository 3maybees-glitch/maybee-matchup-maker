import { teamById } from "./bracket";
import type { LiveGame } from "./types";

export function clock(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function teamName(id: number) {
  return teamById(id)?.name || "That club";
}

export function gameStory(game: LiveGame, seriesName: string, gameNo: number, aWins: number, bWins: number, aId: number, bId: number, clinched: boolean, yourPickId?: number) {
  const away = teamName(game.awayId);
  const home = teamName(game.homeId);
  const title = `${seriesName} · Game ${gameNo}`;
  if (game.state === "Preview") {
    return {
      title,
      body: `${away} at ${home}${game.venue ? `, ${game.venue}` : ""}. First pitch ${clock(game.gameDate)} ET. Nothing to score yet. The Maybee % on the series is the number to argue about until then.`,
    };
  }
  if (game.state === "Live") {
    const inning = game.inning ? `${game.inningState || ""} ${game.inning}`.trim() : "in progress";
    return {
      title,
      body: `${away} ${game.awayScore ?? 0}, ${home} ${game.homeScore ?? 0}, ${inning}${game.venue ? ` at ${game.venue}` : ""}. Still going, so this one is not on the card yet.`,
    };
  }
  const winnerId = game.awayWinner ? game.awayId : game.homeWinner ? game.homeId : 0;
  const loserId = winnerId === game.awayId ? game.homeId : game.awayId;
  const winner = teamName(winnerId);
  const loser = teamName(loserId);
  const winScore = winnerId === game.awayId ? game.awayScore : game.homeScore;
  const loseScore = winnerId === game.awayId ? game.homeScore : game.awayScore;
  const margin = (winScore ?? 0) - (loseScore ?? 0);
  const extras = (game.inning ?? 9) > 9;
  let body = `${winner} beat the ${loser} ${winScore}-${loseScore}`;
  if (extras) body += ` in ${game.inning} innings`;
  body += game.venue ? ` at ${game.venue}.` : ".";
  if (game.winnerName) body += ` ${game.winnerName} got the win`;
  if (game.saveName) body += `, and ${game.saveName} closed it`;
  if (game.winnerName) body += ".";
  if (game.loserName) body += ` ${game.loserName} took the loss.`;
  if (extras) body += " Extra innings, because October does not own a clock.";
  else if (margin >= 6) body += " That one got away early.";
  else if (margin === 1) body += " One run. The whole month fits in a margin like that.";
  else body += " A full night of baseball, and then the lights.";
  const leader = aWins === bWins ? "even" : aWins > bWins ? `${teamName(aId)} lead ${aWins}-${bWins}` : `${teamName(bId)} lead ${bWins}-${aWins}`;
  body += aWins === bWins ? ` The series is tied ${aWins}-${bWins}.` : ` ${leader} in the series.`;
  if (clinched) body += ` ${winner} take it and move on.`;
  if (yourPickId) {
    const yours = teamName(yourPickId);
    if (clinched && yourPickId === winnerId) body += ` Your card had ${yours}. That series point is yours.`;
    else if (clinched && yourPickId === loserId) body += ` Your card had ${yours}. This series goes the other way.`;
    else if (!clinched && yourPickId === winnerId) body += ` Your ${yours} took the game, and the series is still open.`;
    else if (!clinched && (yourPickId === aId || yourPickId === bId)) body += ` Not the game your ${yours} card wanted. The series is still open.`;
  }
  return { title, body };
}

export function nightlyRecap(lines: string[], leaderLines: string[]) {
  const when = new Date().toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return [`Maybee Matchup Maker Machine`, when, "", "TONIGHT", ...lines, "", "LEADERBOARD", ...leaderLines, "", "Open the family link on your phone to see your card against the live bracket."].join("\n");
}
