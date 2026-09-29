import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { STATS_NOTE, TEAMS } from "./data/season";
import {
  bumpMeta,
  familyUrl,
  loadBoard,
  loadMe,
  makeId,
  mergeBoards,
  saveBoard,
  saveMe,
  unpackBoard,
  upsertEntry,
} from "./lib/board";
import {
  SERIES,
  cardComplete,
  entryChampion,
  matchupTeams,
  playoffTeams,
  seriesById,
  slotHint,
  teamById,
  winsNeeded,
  withPick,
  wsGamesChoices,
} from "./lib/bracket";
import { avg, era, ink, ordinal, record, signedWar, whip } from "./lib/format";
import { fetchLiveGames, firstPitchStarted, nextGame } from "./lib/live";
import { FORMULA, seriesOutlook, strength } from "./lib/predict";
import { actualWsGames, maxPoints, officialWinners, scoreEntry, seriesWins, sortEntries } from "./lib/score";
import { clock, gameStory, nightlyRecap } from "./lib/story";
import type { Board, Entry, LiveGame, Picks, RoundName, SeriesId, Team } from "./lib/types";

type View = "home" | "make" | "live" | "board" | "teams" | "host";
type Sheet =
  | { kind: "team"; teamId: number }
  | { kind: "game"; gamePk: number; seriesId: SeriesId; gameNo: number };

const PIN = "maybee";
const ROUNDS: { round: RoundName; title: string; blurb: string }[] = [
  { round: "WC", title: "Wild Card", blurb: "Best of three. Every game is at the higher seed." },
  { round: "DS", title: "Division Series", blurb: "Best of five. The bye club hosts games 1, 2, and 5." },
  { round: "LCS", title: "Championship Series", blurb: "Best of seven. The better regular-season record hosts games 1, 2, 6, and 7." },
  { round: "WS", title: "World Series", blurb: "The champion is worth 3 points. The length, from 4 to 7 games, breaks a tie." },
];

function cardsAreLocked(games: LiveGame[], meta: Board["meta"]) {
  if (meta.locked) return true;
  if (meta.allowLate) return false;
  return firstPitchStarted(games);
}

function lockReason(games: LiveGame[], meta: Board["meta"]) {
  if (!cardsAreLocked(games, meta)) return "";
  if (meta.locked) return "The host locked the cards.";
  return "Cards locked when the first postseason pitch was thrown.";
}

function todayEt() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

function winsThrough(played: LiveGame[], gamePk: number, aId: number, bId: number) {
  let aWins = 0;
  let bWins = 0;
  for (const game of played) {
    if (game.state === "Final") {
      if ((game.awayWinner && game.awayId === aId) || (game.homeWinner && game.homeId === aId)) aWins += 1;
      if ((game.awayWinner && game.awayId === bId) || (game.homeWinner && game.homeId === bId)) bWins += 1;
    }
    if (game.gamePk === gamePk) break;
  }
  return { aWins, bWins };
}

function sameCard(entry: Entry | undefined, draft: Picks, name: string, email: string, optIn: boolean) {
  if (!entry) return false;
  if (entry.name !== name.trim() || entry.email !== email.trim() || entry.emailOptIn !== optIn) return false;
  if (entry.picks.wsGames !== draft.wsGames) return false;
  return SERIES.every((series) => entry.picks[series.id] === draft[series.id]);
}

function runDiff(team: Team) {
  return team.rd > 0 ? `+${team.rd}` : String(team.rd);
}

function ClubFace({
  team,
  tag,
  selected,
  disabled,
  onPick,
  onStats,
}: {
  team: Team;
  tag?: string;
  selected?: boolean;
  disabled?: boolean;
  onPick?: () => void;
  onStats: () => void;
}) {
  const color = ink(team.primary);
  const style = { background: team.primary, color, borderColor: team.accent };
  const body = (
    <>
      <span className="seed">{team.seed ? `#${team.seed}` : team.league}</span>
      <span className="abbr">{team.abbr}</span>
      <span className="club-name">{team.name}</span>
      <span className="rec">{record(team)}</span>
      {tag && <span className="picked">{tag}</span>}
    </>
  );
  return (
    <div className="club-wrap">
      {onPick ? (
        <button
          type="button"
          className={selected ? "club selected" : "club"}
          style={style}
          onClick={onPick}
          disabled={disabled}
          aria-pressed={selected}
        >
          {body}
        </button>
      ) : (
        <div className="club" style={style}>
          {body}
        </div>
      )}
      <button
        type="button"
        className="stats"
        style={{ background: team.accent, color: ink(team.accent) }}
        onClick={onStats}
        aria-label={`Stats for the ${team.full}`}
      >
        Stats
      </button>
    </div>
  );
}

function MaybeeBar({ a, b, seriesId }: { a: Team; b: Team; seriesId: SeriesId }) {
  const outlook = seriesOutlook(a, b, seriesById(seriesId));
  return (
    <div className="maybee">
      <div className="maybee-top">
        <span>
          {a.abbr} {outlook.aPct}%
        </span>
        <span>
          {b.abbr} {outlook.bPct}%
        </span>
      </div>
      <div className="bar" aria-hidden="true">
        <span style={{ width: `${outlook.aPct}%`, background: a.primary }} />
        <span style={{ width: `${outlook.bPct}%`, background: b.primary }} />
      </div>
      <p>
        {outlook.note} Strength {outlook.strengthA} to {outlook.strengthB}.
      </p>
    </div>
  );
}

function RankLine({ label, value, rank }: { label: string; value: string; rank: number }) {
  return (
    <div className="rank">
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{ordinal(rank)} of 30</em>
    </div>
  );
}

function TeamSheet({ team, onClose }: { team: Team; onClose: () => void }) {
  const power = Math.round(strength(team));
  return (
    <div className="sheet-card">
      <button type="button" className="close" onClick={onClose} autoFocus>
        Close
      </button>
      <div className="flag" style={{ background: `linear-gradient(90deg, ${team.primary}, ${team.accent})` }} />
      <p className="eyebrow">
        {team.league} · {team.division}
        {team.seed ? ` · ${ordinal(team.seed)} seed` : ""}
      </p>
      <h2>{team.full}</h2>
      <p>
        {record(team)} · {runDiff(team)} run differential · Maybee strength {power}
      </p>
      <h3>Batting</h3>
      <RankLine label="Average" value={avg(team.batting.avg)} rank={team.batting.ranks.avg} />
      <RankLine label="Home runs" value={String(team.batting.hr)} rank={team.batting.ranks.hr} />
      <RankLine label="Stolen bases" value={String(team.batting.sb)} rank={team.batting.ranks.sb} />
      <RankLine label="Walks" value={String(team.batting.bb)} rank={team.batting.ranks.bb} />
      <h3>Pitching</h3>
      <RankLine label="Strikeouts" value={String(team.pitching.so)} rank={team.pitching.ranks.so} />
      <RankLine label="ERA" value={era(team.pitching.era)} rank={team.pitching.ranks.era} />
      <RankLine label="WHIP" value={whip(team.pitching.whip)} rank={team.pitching.ranks.whip} />
      <RankLine label="Saves" value={String(team.pitching.sv)} rank={team.pitching.ranks.sv} />
      <h3>Defense</h3>
      <RankLine label="Team defense" value={`${signedWar(team.defense.team)} WAR`} rank={team.defense.ranks.team} />
      <RankLine label="Infield" value={`${signedWar(team.defense.inf)} WAR`} rank={team.defense.ranks.inf} />
      <RankLine label="Outfield" value={`${signedWar(team.defense.of)} WAR`} rank={team.defense.ranks.of} />
      <h3>For fun</h3>
      {team.starHitter ? (
        <p>
          <strong>{team.starHitter.name}</strong> · {team.starHitter.line}
        </p>
      ) : (
        <p>A qualified hitter is still settling.</p>
      )}
      <p className="fine">Highest OPS among hitters who qualified.</p>
      {team.starPitcher ? (
        <p>
          <strong>{team.starPitcher.name}</strong> · {team.starPitcher.line}
        </p>
      ) : (
        <p>A pitcher with 40 innings is still settling.</p>
      )}
      <p className="fine">Lowest ERA with at least 40 innings.</p>
      <p className="fine">{STATS_NOTE}</p>
    </div>
  );
}

function GameSheet({
  game,
  seriesId,
  gameNo,
  games,
  winners,
  pickId,
  note,
  onClose,
}: {
  game: LiveGame;
  seriesId: SeriesId;
  gameNo: number;
  games: LiveGame[];
  winners: Picks;
  pickId?: number;
  note?: string;
  onClose: () => void;
}) {
  const series = seriesById(seriesId);
  const { a, b } = matchupTeams(series, winners);
  if (!a || !b) {
    return (
      <div className="sheet-card">
        <button type="button" className="close" onClick={onClose} autoFocus>
          Close
        </button>
        <p>This series is still waiting on an earlier round.</p>
      </div>
    );
  }
  const played = seriesWins(games, a.id, b.id).played;
  const through = winsThrough(played, game.gamePk, a.id, b.id);
  const need = winsNeeded(series.bestOf);
  const clinched = game.state === "Final" && (through.aWins >= need || through.bWins >= need);
  const story = gameStory(game, series.name, gameNo, through.aWins, through.bWins, a.id, b.id, clinched, pickId);
  const away = teamById(game.awayId);
  const home = teamById(game.homeId);
  return (
    <div className="sheet-card">
      <button type="button" className="close" onClick={onClose} autoFocus>
        Close
      </button>
      <p className="eyebrow">{game.state}</p>
      <h2>{story.title}</h2>
      <p>{story.body}</p>
      {note && (
        <p className="family-note">
          <strong>Family note.</strong> {note}
        </p>
      )}
      {game.innings.length > 0 && (
        <ol className="innings">
          {game.innings.map((inning) => (
            <li key={inning.num}>
              <b>{inning.num}</b> {away?.abbr} {inning.away ?? "·"} · {home?.abbr} {inning.home ?? "·"}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function LiveSeries({
  seriesId,
  winners,
  games,
  pickId,
  onTeam,
  onGame,
}: {
  seriesId: SeriesId;
  winners: Picks;
  games: LiveGame[];
  pickId?: number;
  onTeam: (teamId: number) => void;
  onGame: (gamePk: number, gameNo: number) => void;
}) {
  const series = seriesById(seriesId);
  const { a, b } = matchupTeams(series, winners);
  if (!a || !b) {
    return (
      <section className="series waiting" data-league={series.league}>
        <p className="eyebrow">{series.name}</p>
        <h3>{series.short}</h3>
        <p className="fine">
          {slotHint(series.a)} meets {slotHint(series.b)} once those clubs are decided.
        </p>
      </section>
    );
  }
  const { aWins, bWins, played } = seriesWins(games, a.id, b.id);
  const need = winsNeeded(series.bestOf);
  const official = winners[series.id];
  const yours = teamById(pickId);
  let status = "Waiting on the first pitch";
  if (official === a.id) status = `${a.name} take the series`;
  else if (official === b.id) status = `${b.name} take the series`;
  else if (played.some((game) => game.state === "Live")) status = "Underway";
  else if (aWins === bWins && aWins > 0) status = `Tied ${aWins}-${bWins}`;
  else if (aWins > bWins) status = `${a.name} lead ${aWins}-${bWins}`;
  else if (bWins > aWins) status = `${b.name} lead ${bWins}-${aWins}`;
  else if (played.length > 0) status = "First pitch is set";
  let stamp = "";
  let stampKind = "wait";
  if (pickId && official) {
    stamp = pickId === official ? (series.id === "WS" ? "Right · 3 pts" : "Right · 1 pt") : `Official: ${teamById(official)?.name}`;
    stampKind = pickId === official ? "good" : "miss";
  } else if (yours && yours.id !== a.id && yours.id !== b.id) {
    stamp = `Your card has the ${yours.name}`;
    stampKind = "miss";
  } else if (yours) {
    stamp = "Your pick is in";
    stampKind = "wait";
  }
  const tagFor = (team: Team) => {
    const tags = [];
    if (official === team.id) tags.push("Advances");
    if (pickId === team.id) tags.push("You");
    return tags.join(" · ");
  };
  return (
    <section className="series" data-league={series.league}>
      <p className="eyebrow">
        {series.name} · best of {series.bestOf}
      </p>
      <h3>
        {a.name} vs {b.name}
      </h3>
      <p className="tally">
        <b>{aWins}</b> <span>{a.abbr}</span>
        <b>{bWins}</b> <span>{b.abbr}</span>
      </p>
      <p>
        {status}
        {aWins + bWins > 0 && !official ? ` · first to ${need}` : ""}
      </p>
      {stamp && <p className={`stamp ${stampKind}`}>{stamp}</p>}
      <div className="clubs">
        <ClubFace team={a} tag={tagFor(a)} onStats={() => onTeam(a.id)} />
        <ClubFace team={b} tag={tagFor(b)} onStats={() => onTeam(b.id)} />
      </div>
      <MaybeeBar a={a} b={b} seriesId={series.id} />
      <div className="games">
        {played.length === 0 && <p className="fine">MLB has not posted a game for this series yet.</p>}
        {played.map((game, index) => {
          const away = teamById(game.awayId);
          const home = teamById(game.homeId);
          const score =
            game.awayScore == null ? game.detail || "Scheduled" : `${game.awayScore}–${game.homeScore ?? 0}`;
          return (
            <button key={game.gamePk} type="button" className="game" onClick={() => onGame(game.gamePk, index + 1)}>
              <span className="g-state">{game.state}</span>
              <span>
                Game {index + 1} · {away?.abbr} {score} at {home?.abbr}
              </span>
              <span>Story</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Picker({
  seriesId,
  picks,
  locked,
  onPick,
  onTeam,
}: {
  seriesId: SeriesId;
  picks: Picks;
  locked: boolean;
  onPick: (teamId: number) => void;
  onTeam: (teamId: number) => void;
}) {
  const series = seriesById(seriesId);
  const { a, b } = matchupTeams(series, picks);
  const chosen = picks[series.id];
  return (
    <section className="series" data-league={series.league}>
      <p className="eyebrow">
        {series.name} · best of {series.bestOf}
      </p>
      <h3>{a && b ? `${a.name} vs ${b.name}` : series.short}</h3>
      <div className="clubs">
        {a ? (
          <ClubFace
            team={a}
            selected={chosen === a.id}
            tag={chosen === a.id ? "Your pick" : undefined}
            disabled={locked}
            onPick={() => onPick(a.id)}
            onStats={() => onTeam(a.id)}
          />
        ) : (
          <div className="ghost">{slotHint(series.a)}</div>
        )}
        {b ? (
          <ClubFace
            team={b}
            selected={chosen === b.id}
            tag={chosen === b.id ? "Your pick" : undefined}
            disabled={locked}
            onPick={() => onPick(b.id)}
            onStats={() => onTeam(b.id)}
          />
        ) : (
          <div className="ghost">{slotHint(series.b)}</div>
        )}
      </div>
      {a && b && <MaybeeBar a={a} b={b} seriesId={series.id} />}
    </section>
  );
}

function ClubRow({ team, onOpen }: { team: Team; onOpen: () => void }) {
  return (
    <button
      type="button"
      className="club-row"
      style={{ background: team.primary, color: ink(team.primary), borderColor: team.accent }}
      onClick={onOpen}
    >
      <b>{team.abbr}</b>
      <span>{team.full}</span>
      <span>{record(team)}</span>
      <span>BA {ordinal(team.batting.ranks.avg)}</span>
      <span>ERA {ordinal(team.pitching.ranks.era)}</span>
      <span>DEF {signedWar(team.defense.team)}</span>
    </button>
  );
}

export function App() {
  const [view, setView] = useState<View>("home");
  const [board, setBoard] = useState<Board>(() => loadBoard());
  const [meId, setMeId] = useState(() => loadMe());
  const [games, setGames] = useState<LiveGame[]>([]);
  const [gamesError, setGamesError] = useState("");
  const [updated, setUpdated] = useState<Date | null>(null);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [notice, setNotice] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [formError, setFormError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [draftId, setDraftId] = useState("");
  const [draft, setDraft] = useState<Picks>({});
  const [ticket, setTicket] = useState<string | null>(null);
  const [expanded, setExpanded] = useState("");
  const [hostOpen, setHostOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  const winners = useMemo(() => officialWinners(games), [games]);
  const wsLength = useMemo(() => actualWsGames(games, winners), [games, winners]);
  const ranked = useMemo(() => sortEntries(board.entries, winners, wsLength), [board.entries, winners, wsLength]);
  const locked = cardsAreLocked(games, board.meta);
  const reason = lockReason(games, board.meta);
  const mine = board.entries.find((entry) => entry.id === meId);
  const liveNow = games.some((game) => game.state === "Live");
  const upcoming = nextGame(games);

  const pullScores = useCallback(async () => {
    try {
      const next = await fetchLiveGames();
      setGames(next);
      setUpdated(new Date());
      setGamesError("");
    } catch {
      setGamesError("MLB.com did not answer. Scores will try again shortly.");
    }
  }, []);

  useEffect(() => {
    void pullScores();
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "hidden") void pullScores();
    }, 60000);
    const onVis = () => {
      if (document.visibilityState === "visible") void pullScores();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [pullScores]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const packed = params.get("b");
    if (!packed) return;
    const incoming = unpackBoard(packed);
    if (incoming) {
      setBoard((current) => {
        const merged = mergeBoards(current, incoming);
        try {
          saveBoard(merged);
        } catch {
          setNotice("This phone blocked saving. The cards are on screen for now.");
        }
        return merged;
      });
      setNotice("Family link added to the board on this phone.");
    } else {
      setNotice("That family link did not open. The cards already on this phone are still here.");
    }
    params.delete("b");
    const query = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  }, []);

  useEffect(() => {
    const titles: Record<View, string> = {
      home: "Maybee Matchup Maker Machine",
      make: "Your card",
      live: "Live bracket",
      board: "Leaderboard",
      teams: "Clubs",
      host: "Host desk",
    };
    document.title = view === "home" ? titles.home : `${titles[view]} · Maybee Matchup Maker`;
  }, [view]);

  useEffect(() => {
    if (!sheet) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSheet(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheet]);

  function go(next: View) {
    setView(next);
    window.scrollTo(0, 0);
  }

  function openCardNav() {
    if (draftId) {
      go("make");
      return;
    }
    if (mine) {
      openEntry(mine);
      return;
    }
    go("home");
  }

  function commit(next: Board, message?: string) {
    try {
      saveBoard(next);
    } catch {
      setBoard(next);
      setNotice("This phone blocked saving. Copy a card link before you leave.");
      return;
    }
    setBoard(next);
    if (message) setNotice(message);
  }

  function openEntry(entry: Entry) {
    setDraftId(entry.id);
    setDraft(entry.picks);
    setName(entry.name);
    setEmail(entry.email);
    setOptIn(entry.emailOptIn);
    setTicket(entry.id);
    setFormError("");
    setView("make");
    window.scrollTo(0, 0);
  }

  function deal(event: FormEvent) {
    event.preventDefault();
    const clean = name.trim();
    if (clean.length < 2 || clean.length > 30) {
      setFormError("Use a name between 2 and 30 letters.");
      return;
    }
    if (optIn && !email.includes("@")) {
      setFormError("Add an email with an @ so the host can send the night's results.");
      return;
    }
    setFormError("");
    setDraftId(makeId());
    setDraft({});
    setTicket(null);
    go("make");
  }

  function saveCard() {
    const cleanName = name.trim();
    if (cleanName.length < 2 || cleanName.length > 30) {
      setFormError("Use a name between 2 and 30 letters.");
      return;
    }
    if (optIn && !email.includes("@")) {
      setFormError("Add an email with an @ so the host can send the night's results.");
      return;
    }
    if (!cardComplete(draft) || locked) {
      setFormError("Pick every series and a World Series length before saving.");
      return;
    }
    const now = new Date().toISOString();
    const previous = board.entries.find((entry) => entry.id === draftId);
    const entry: Entry = {
      id: draftId || makeId(),
      name: cleanName,
      email: email.trim(),
      emailOptIn: optIn,
      createdAt: previous?.createdAt || now,
      updatedAt: now,
      picks: draft,
    };
    commit(upsertEntry(board, entry), `Saved card ${entry.id} on this phone.`);
    saveMe(entry.id);
    setMeId(entry.id);
    setDraftId(entry.id);
    setTicket(entry.id);
    setFormError("");
  }

  async function copyText(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
      setNotice(message);
    } catch {
      setNotice(text);
    }
  }

  function saveNote(gamePk: number, text: string) {
    const clean = text.trim();
    const key = String(gamePk);
    if ((board.meta.notes[key] || "") === clean) return;
    const notes = { ...board.meta.notes };
    if (clean) notes[key] = clean;
    else delete notes[key];
    commit(
      { ...board, meta: bumpMeta(board.meta, { notes }) },
      "Note saved. Copy a fresh family link so other phones pick it up.",
    );
  }

  function nightBody() {
    const lines = games
      .filter((game) => game.officialDate === todayEt())
      .map((game) => {
        const away = teamById(game.awayId)?.abbr || "Away";
        const home = teamById(game.homeId)?.abbr || "Home";
        if (game.state === "Final" || game.state === "Live") return `${away} ${game.awayScore ?? 0}, ${home} ${game.homeScore ?? 0} · ${game.state}`;
        return `${away} at ${home} · ${game.detail || "scheduled"}`;
      });
    if (!lines.length) lines.push("No postseason games posted for today.");
    const leaders = ranked.length
      ? ranked.map((entry, index) => {
          const score = scoreEntry(entry, winners, wsLength);
          const champ = entryChampion(entry)?.name || "no champion yet";
          return `${index + 1}. ${entry.name} — ${score.points} pts — ${champ}`;
        })
      : ["No cards yet."];
    return nightlyRecap(lines, leaders);
  }

  function mailNight() {
    const opted = board.entries.filter((entry) => entry.emailOptIn && entry.email.includes("@"));
    const href = `mailto:?bcc=${encodeURIComponent(opted.map((entry) => entry.email).join(","))}&subject=${encodeURIComponent("Maybee Matchup Maker Machine")}&body=${encodeURIComponent(nightBody())}`;
    window.location.href = href;
  }

  const savedDraft = board.entries.find((entry) => entry.id === draftId);
  const savedClean = sameCard(savedDraft, draft, name, email, optIn);
  const steps = SERIES.filter((series) => draft[series.id] != null).length + (draft.wsGames ? 1 : 0);
  const sheetTeam = sheet?.kind === "team" ? teamById(sheet.teamId) : undefined;
  const sheetGame = sheet?.kind === "game" ? games.find((game) => game.gamePk === sheet.gamePk) : undefined;
  const optedIn = board.entries.filter((entry) => entry.emailOptIn && entry.email.includes("@"));

  return (
    <div className="program">
      <div className="stitches" aria-hidden="true" />
      <header className="top">
        <p className="eyebrow">Family postseason · 2026</p>
        <h1>
          Maybee Matchup Maker <em>Machine</em>
        </h1>
      </header>
      <nav className="dock" aria-label="Sections">
        <button type="button" aria-current={view === "home" || view === "make" ? "page" : undefined} onClick={openCardNav}>
          Card
        </button>
        <button type="button" aria-current={view === "live" ? "page" : undefined} onClick={() => go("live")}>
          Live{liveNow && <span className="dot" aria-label="Games underway" />}
        </button>
        <button type="button" aria-current={view === "board" ? "page" : undefined} onClick={() => go("board")}>
          Board
        </button>
        <button type="button" aria-current={view === "teams" ? "page" : undefined} onClick={() => go("teams")}>
          Clubs
        </button>
      </nav>
      {notice && (
        <p className="live-region" aria-live="polite">
          {notice}
        </p>
      )}

      {view === "home" && (
        <section>
          <p className="lede">
            Pick every series from the Wild Card to the World Series. One point for each series you get right, and three for the champion. A perfect card is {maxPoints()}.
          </p>
          <ul className="ribbon">
            {playoffTeams().map((team) => (
              <li key={team.id}>
                <button
                  type="button"
                  className="chip"
                  style={{ background: team.primary, color: ink(team.primary), borderColor: team.accent }}
                  onClick={() => setSheet({ kind: "team", teamId: team.id })}
                  aria-label={`${team.full} stats`}
                >
                  {team.abbr}
                </button>
              </li>
            ))}
          </ul>
          {reason && <p className="banner">{reason} The live bracket and the leaderboard stay open.</p>}
          {mine && !showNew && (
            <div className="panel welcome">
              <h2>Welcome back, {mine.name}</h2>
              <p>
                Card {mine.id} is on this phone
                {entryChampion(mine) ? `, with the ${entryChampion(mine)?.full} as champion` : ""}.
              </p>
              <div className="actions">
                <button type="button" className="primary" onClick={() => openEntry(mine)}>
                  Open my card
                </button>
                <button type="button" className="ghost-btn" onClick={() => go("live")}>
                  Live bracket
                </button>
                <button type="button" className="ghost-btn" onClick={() => go("board")}>
                  Leaderboard
                </button>
                {!locked && (
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => {
                      setShowNew(true);
                      setName("");
                      setEmail("");
                      setOptIn(false);
                      setFormError("");
                    }}
                  >
                    Deal another card
                  </button>
                )}
              </div>
            </div>
          )}
          {(!mine || showNew) && !locked && (
            <form className="panel" onSubmit={deal}>
              <h2>Deal a card</h2>
              <label>
                Your name
                <input value={name} onChange={(event) => setName(event.target.value)} maxLength={30} autoComplete="name" required />
              </label>
              <label>
                Email, if you want the night's results
                <input value={email} onChange={(event) => setEmail(event.target.value)} maxLength={80} autoComplete="email" inputMode="email" />
              </label>
              <label className="check">
                <input type="checkbox" checked={optIn} onChange={(event) => setOptIn(event.target.checked)} />
                <span>Email me the night's results. The host sends one family note. Your address rides along in the card link.</span>
              </label>
              {formError && <p className="error">{formError}</p>}
              <button type="submit" className="primary">
                Deal me a card
              </button>
              <p className="fine">The card stays on this phone after you close the browser. On the next screen, copy the link and send it to the host.</p>
            </form>
          )}
          {(!mine || showNew) && locked && <p className="panel">New cards are closed. You can still follow the live bracket and the leaderboard.</p>}
          <p className="fine">{STATS_NOTE}</p>
        </section>
      )}

      {view === "make" && (
        <section>
          {ticket && savedDraft && (
            <div className="ticket">
              <p>
                Card <strong>{ticket}</strong> {savedClean ? "is saved on this phone." : "has new picks. Save again so the link stays current."}
              </p>
              <div className="actions">
                <button
                  type="button"
                  className="primary"
                  onClick={() => copyText(familyUrl({ entries: [savedDraft], meta: board.meta }), "Copied your card link. Send it to the host.")}
                >
                  Copy my card link
                </button>
                <button type="button" className="ghost-btn" onClick={() => go("live")}>
                  Live bracket
                </button>
                <button type="button" className="ghost-btn" onClick={() => go("board")}>
                  Leaderboard
                </button>
              </div>
            </div>
          )}
          {reason && <p className="banner">{reason}</p>}
          <div className="progress">
            <p>
              {steps} of 12 calls in
              {draft.wsGames ? ` · World Series at ${draft.wsGames}` : " · World Series length still open"}
            </p>
            <div className="meter" aria-hidden="true">
              <span style={{ width: `${(steps / 12) * 100}%` }} />
            </div>
          </div>
          <label>
            Name on the card
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={30} disabled={locked} autoComplete="name" />
          </label>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} maxLength={80} disabled={locked} autoComplete="email" inputMode="email" />
          </label>
          <label className="check">
            <input type="checkbox" checked={optIn} onChange={(event) => setOptIn(event.target.checked)} disabled={locked} />
            <span>Email me the night's results.</span>
          </label>
          <p className="fine">Change an earlier pick and the rounds after it clear, so the bracket stays possible.</p>
          {ROUNDS.map((group) => (
            <section className="round" key={group.round}>
              <h2>{group.title}</h2>
              <p className="fine">{group.blurb}</p>
              <div className={SERIES.filter((series) => series.round === group.round).length > 1 ? "round-grid multi" : "round-grid"}>
                {SERIES.filter((series) => series.round === group.round).map((series) => (
                  <Picker
                    key={series.id}
                    seriesId={series.id}
                    picks={draft}
                    locked={locked}
                    onPick={(teamId) => {
                      if (locked) return;
                      setDraft((current) => (current[series.id] === teamId ? current : withPick(current, series.id, teamId)));
                    }}
                    onTeam={(teamId) => setSheet({ kind: "team", teamId })}
                  />
                ))}
              </div>
              {group.round === "WS" && (
                <fieldset className="length-pick" disabled={locked}>
                  <legend>How many World Series games?</legend>
                  <div className="lengths">
                    {wsGamesChoices().map((count) => (
                      <button
                        type="button"
                        key={count}
                        className={draft.wsGames === count ? "on" : ""}
                        aria-pressed={draft.wsGames === count}
                        onClick={() => setDraft((current) => ({ ...current, wsGames: count }))}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}
            </section>
          ))}
          <details className="formula">
            <summary>How Maybee % works</summary>
            <p>{FORMULA}</p>
          </details>
          {formError && <p className="error">{formError}</p>}
          {!locked && (
            <button type="button" className="primary" disabled={!cardComplete(draft) || name.trim().length < 2 || savedClean} onClick={saveCard}>
              {savedClean ? "Card saved" : "Save this card"}
            </button>
          )}
        </section>
      )}

      {view === "live" && (
        <section>
          <p className="status-line">
            {updated
              ? `Scores from MLB.com · updated ${updated.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" })} ET`
              : "Bringing in the live bracket from MLB.com."}
          </p>
          <div className="actions">
            <button type="button" className="ghost-btn" onClick={() => void pullScores()}>
              Check MLB.com
            </button>
          </div>
          {gamesError && <p className="error">{gamesError}</p>}
          {upcoming && (
            <p>
              Next pitch: {teamById(upcoming.awayId)?.full} at {teamById(upcoming.homeId)?.full}, {clock(upcoming.gameDate)} ET.
            </p>
          )}
          {mine && (
            <p>
              {mine.name} has {scoreEntry(mine, winners, wsLength).points} points
              {entryChampion(mine) ? `. Champion on the card: the ${entryChampion(mine)?.full}` : ""}
              {mine.picks.wsGames ? `, in ${mine.picks.wsGames} games` : ""}.
            </p>
          )}
          <div className="round-grid">
            {SERIES.map((series) => (
              <LiveSeries
                key={series.id}
                seriesId={series.id}
                winners={winners}
                games={games}
                pickId={mine?.picks[series.id]}
                onTeam={(teamId) => setSheet({ kind: "team", teamId })}
                onGame={(gamePk, gameNo) => setSheet({ kind: "game", gamePk, seriesId: series.id, gameNo })}
              />
            ))}
          </div>
          <details className="formula">
            <summary>How Maybee % works</summary>
            <p>{FORMULA}</p>
          </details>
        </section>
      )}

      {view === "board" && (
        <section>
          <h2>Leaderboard</h2>
          <p className="fine">
            One point for each correct series. Three points for the World Series champion. The number of World Series games breaks a tie. A perfect card is {maxPoints()}. This board is the one saved on this phone. Open the latest family link to pick up new cards.
          </p>
          {ranked.length === 0 && <p className="panel">No cards yet. Deal one from the home page, then send the host your card link.</p>}
          <ol className="board">
            {ranked.map((entry, index) => {
              const score = scoreEntry(entry, winners, wsLength);
              const open = expanded === entry.id;
              const champ = entryChampion(entry);
              return (
                <li key={entry.id}>
                  <button type="button" className="row" aria-expanded={open} onClick={() => setExpanded(open ? "" : entry.id)}>
                    <span className="rank-no">{index + 1}</span>
                    <span className="who">
                      <strong>{entry.name}</strong>
                      <small>
                        {champ?.name ?? "No champion yet"}
                        {entry.picks.wsGames ? ` · ${entry.picks.wsGames} games` : ""}
                        {score.wsLengthHit ? " · length hit" : ""}
                      </small>
                    </span>
                    <span className="pts">
                      {score.points}
                      <small> pts</small>
                    </span>
                  </button>
                  {open && (
                    <div className="review">
                      <ul>
                        {SERIES.map((series) => {
                          const row = score.bySeries.find((item) => item.id === series.id);
                          const pick = teamById(entry.picks[series.id]);
                          const actual = teamById(winners[series.id]);
                          let mark = "Waiting on MLB";
                          if (row?.correct === true) mark = series.id === "WS" ? "Right · 3 pts" : "Right · 1 pt";
                          if (row?.correct === false) mark = actual ? `Official: ${actual.name}` : "Missed";
                          return (
                            <li key={series.id}>
                              <span>{series.name}</span>
                              <b>{pick?.name ?? "Open"}</b>
                              <em className={row?.correct === true ? "good-text" : row?.correct === false ? "miss-text" : ""}>{mark}</em>
                            </li>
                          );
                        })}
                      </ul>
                      {wsLength != null && (
                        <p>
                          {score.wsLengthHit
                            ? `Called the length at ${entry.picks.wsGames}.`
                            : `The World Series went ${wsLength}. This card says ${entry.picks.wsGames ?? "nothing yet"}.`}
                        </p>
                      )}
                      {entry.id === meId ? (
                        <p className="fine">This card is saved on this phone.</p>
                      ) : (
                        <button
                          type="button"
                          className="ghost-btn"
                          onClick={() => {
                            saveMe(entry.id);
                            setMeId(entry.id);
                            openEntry(entry);
                          }}
                        >
                          Keep this card on this phone
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {view === "teams" && (
        <section>
          <h2>October clubs</h2>
          <div className="stack">
            {playoffTeams().map((team) => (
              <ClubRow key={team.id} team={team} onOpen={() => setSheet({ kind: "team", teamId: team.id })} />
            ))}
          </div>
          <h2>The rest of the league</h2>
          <div className="stack">
            {TEAMS.filter((team) => !team.playoff)
              .sort((a, b) => a.league.localeCompare(b.league) || a.division.localeCompare(b.division) || a.name.localeCompare(b.name))
              .map((team) => (
                <ClubRow key={team.id} team={team} onOpen={() => setSheet({ kind: "team", teamId: team.id })} />
              ))}
          </div>
          <p className="fine">{STATS_NOTE}</p>
        </section>
      )}

      {view === "host" && (
        <section>
          <h2>Host desk</h2>
          {!hostOpen && (
            <form
              className="panel"
              onSubmit={(event) => {
                event.preventDefault();
                if (pin.trim().toLowerCase() === PIN) {
                  setHostOpen(true);
                  setPinError("");
                } else {
                  setPinError("That pin does not open the desk.");
                }
              }}
            >
              <p>Lock the cards, write a note on a game, and send the night's email from here.</p>
              <label>
                Family pin
                <input value={pin} onChange={(event) => setPin(event.target.value)} autoComplete="off" />
              </label>
              {pinError && <p className="error">{pinError}</p>}
              <button type="submit" className="primary">
                Open the desk
              </button>
            </form>
          )}
          {hostOpen && (
            <div className="host-grid">
              <p>{board.entries.length} cards on this phone. {reason || "Cards are open."}</p>
              <div className="actions">
                <button
                  type="button"
                  className="ghost-btn"
                  aria-pressed={board.meta.locked}
                  onClick={() => commit({ ...board, meta: bumpMeta(board.meta, { locked: !board.meta.locked }) }, board.meta.locked ? "Cards unlocked." : "Cards locked.")}
                >
                  {board.meta.locked ? "Unlock the cards" : "Lock the cards"}
                </button>
                <button
                  type="button"
                  className="ghost-btn"
                  aria-pressed={board.meta.allowLate}
                  onClick={() =>
                    commit(
                      { ...board, meta: bumpMeta(board.meta, { allowLate: !board.meta.allowLate }) },
                      board.meta.allowLate ? "Late cards are closed after first pitch." : "Late cards can still come in after first pitch.",
                    )
                  }
                >
                  {board.meta.allowLate ? "Close late cards" : "Allow late cards"}
                </button>
              </div>
              <p className="fine">A host lock holds even if late cards are allowed. After a change, copy a fresh family link. Other phones pick it up the next time they open that link.</p>
              <label>
                Family link
                <textarea readOnly rows={3} value={familyUrl(board)} />
              </label>
              <button type="button" className="primary" onClick={() => copyText(familyUrl(board), "Copied the family link.")}>
                Copy family link
              </button>
              <h3>Tonight's email</h3>
              {optedIn.length === 0 && <p>Nobody has asked for email yet. They can add one when they deal a card.</p>}
              {optedIn.length > 0 && (
                <ul className="mail-list">
                  {optedIn.map((entry) => (
                    <li key={entry.id}>
                      {entry.name} · {entry.email}
                    </li>
                  ))}
                </ul>
              )}
              <div className="actions">
                <button type="button" className="ghost-btn" onClick={() => copyText(nightBody(), "Copied the night's note.")}>
                  Copy the night's note
                </button>
                <button type="button" className="primary" disabled={optedIn.length === 0} onClick={mailNight}>
                  Open the email
                </button>
              </div>
              <h3>Notes on the games</h3>
              <p className="fine">A note shows up when someone taps that game's story. It saves when you leave the box. Open a date to write one.</p>
              {Object.entries(
                [...games]
                  .sort((a, b) => a.gameDate.localeCompare(b.gameDate))
                  .reduce<Record<string, LiveGame[]>>((groups, game) => {
                    const key = game.officialDate || "Date to be set";
                    groups[key] = groups[key] || [];
                    groups[key].push(game);
                    return groups;
                  }, {}),
              ).map(([date, list]) => (
                <details key={date} className="formula" open={date === todayEt()}>
                  <summary>
                    {date} · {list.length} {list.length === 1 ? "game" : "games"}
                  </summary>
                  {list.map((game) => (
                    <label key={game.gamePk} className="note">
                      {teamById(game.awayId)?.name} at {teamById(game.homeId)?.name} · {game.state}
                      <textarea
                        maxLength={280}
                        defaultValue={board.meta.notes[String(game.gamePk)] || ""}
                        onBlur={(event) => saveNote(game.gamePk, event.target.value)}
                      />
                    </label>
                  ))}
                </details>
              ))}
            </div>
          )}
        </section>
      )}

      <footer className="foot">
        <p>{STATS_NOTE}</p>
        <p>
          <button type="button" onClick={() => go("host")}>
            Host desk
          </button>
        </p>
      </footer>

      {sheet && (
        <div
          className="overlay"
          role="dialog"
          aria-modal="true"
          aria-label={sheet.kind === "team" ? "Team stats" : "Game story"}
          onClick={(event) => {
            if (event.target === event.currentTarget) setSheet(null);
          }}
        >
          {sheet.kind === "team" && sheetTeam && <TeamSheet team={sheetTeam} onClose={() => setSheet(null)} />}
          {sheet.kind === "game" && sheetGame && (
            <GameSheet
              game={sheetGame}
              seriesId={sheet.seriesId}
              gameNo={sheet.gameNo}
              games={games}
              winners={winners}
              pickId={mine?.picks[sheet.seriesId]}
              note={board.meta.notes[String(sheetGame.gamePk)]}
              onClose={() => setSheet(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
