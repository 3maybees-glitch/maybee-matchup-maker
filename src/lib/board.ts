import { SERIES_IDS } from "./bracket";
import type { Board, BoardMeta, Entry, Picks, SeriesId, WsGames } from "./types";

const BOARD_KEY = "mmmm-board-v1";
const ME_KEY = "mmmm-me-v1";
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function emptyMeta(): BoardMeta {
  return { rev: 1, locked: false, allowLate: false, notes: {} };
}

export function emptyBoard(): Board {
  return { entries: [], meta: emptyMeta() };
}

function asWs(value: number): WsGames | undefined {
  if (value === 4 || value === 5 || value === 6 || value === 7) return value;
  return undefined;
}

function normalizeEntry(value: unknown): Entry | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Partial<Entry>;
  if (!row.id || !row.name || !row.picks) return null;
  return {
    id: String(row.id).slice(0, 8),
    name: String(row.name).slice(0, 32),
    email: String(row.email || ""),
    emailOptIn: Boolean(row.emailOptIn),
    createdAt: String(row.createdAt || new Date().toISOString()),
    updatedAt: String(row.updatedAt || row.createdAt || new Date().toISOString()),
    picks: row.picks,
  };
}

export function normalizeBoard(value: unknown): Board {
  const raw = (value || {}) as Partial<Board>;
  const metaIn = (raw.meta || {}) as Partial<BoardMeta>;
  const entries = Array.isArray(raw.entries) ? raw.entries.map(normalizeEntry).filter((entry): entry is Entry => entry != null) : [];
  return {
    entries,
    meta: {
      rev: Number(metaIn.rev) || 1,
      locked: Boolean(metaIn.locked),
      allowLate: Boolean(metaIn.allowLate),
      notes: metaIn.notes && typeof metaIn.notes === "object" ? metaIn.notes : {},
    },
  };
}

export function loadBoard(): Board {
  try {
    const raw = localStorage.getItem(BOARD_KEY);
    if (!raw) return emptyBoard();
    return normalizeBoard(JSON.parse(raw));
  } catch {
    return emptyBoard();
  }
}

export function saveBoard(board: Board) {
  localStorage.setItem(BOARD_KEY, JSON.stringify(board));
}

export function loadMe() {
  try {
    return localStorage.getItem(ME_KEY) || "";
  } catch {
    return "";
  }
}

export function saveMe(id: string) {
  try {
    if (id) localStorage.setItem(ME_KEY, id);
    else localStorage.removeItem(ME_KEY);
  } catch {
    /* A copied card link still carries the entry. */
  }
}

export function makeId() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return [...bytes].map((byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

export function mergeBoards(left: Board, right: Board): Board {
  const map = new Map<string, Entry>();
  for (const entry of [...left.entries, ...right.entries]) {
    const previous = map.get(entry.id);
    if (!previous || previous.updatedAt <= entry.updatedAt) map.set(entry.id, entry);
  }
  const meta = (left.meta.rev || 0) > (right.meta.rev || 0) ? left.meta : right.meta;
  const notes = (left.meta.rev || 0) === (right.meta.rev || 0) ? { ...left.meta.notes, ...right.meta.notes } : meta.notes;
  return {
    entries: [...map.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    meta: { ...meta, notes },
  };
}

export function upsertEntry(board: Board, entry: Entry): Board {
  const entries = board.entries.filter((item) => item.id !== entry.id);
  entries.push(entry);
  return { ...board, entries };
}

type Packed = {
  e: [string, string, string, number, string, string, number[], number][];
  m: [number, number, number, Record<string, string>];
};

function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(text: string) {
  const padded = text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function packBoard(board: Board) {
  const packed: Packed = {
    e: board.entries.map((entry) => [
      entry.id,
      entry.name,
      entry.emailOptIn ? entry.email : "",
      entry.emailOptIn ? 1 : 0,
      entry.createdAt,
      entry.updatedAt,
      SERIES_IDS.map((id) => entry.picks[id] ?? 0),
      entry.picks.wsGames ?? 0,
    ]),
    m: [board.meta.rev, board.meta.locked ? 1 : 0, board.meta.allowLate ? 1 : 0, board.meta.notes],
  };
  return toBase64Url(JSON.stringify(packed));
}

export function unpackBoard(text: string): Board | null {
  try {
    const packed = JSON.parse(fromBase64Url(text)) as Packed;
    const entries: Entry[] = (packed.e || []).map((row) => {
      const picks: Picks = {};
      SERIES_IDS.forEach((id, index) => {
        const teamId = row[6]?.[index];
        if (teamId) picks[id as SeriesId] = teamId;
      });
      const wsGames = asWs(row[7]);
      if (wsGames) picks.wsGames = wsGames;
      return {
        id: row[0],
        name: row[1],
        email: row[2] || "",
        emailOptIn: row[3] === 1,
        createdAt: row[4],
        updatedAt: row[5],
        picks,
      };
    });
    const meta = packed.m || [1, 0, 0, {}];
    return normalizeBoard({
      entries,
      meta: { rev: meta[0], locked: meta[1] === 1, allowLate: meta[2] === 1, notes: meta[3] || {} },
    });
  } catch {
    return null;
  }
}

export function familyUrl(board: Board) {
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  url.searchParams.set("b", packBoard(board));
  return url.toString();
}

export function bumpMeta(meta: BoardMeta, patch: Partial<BoardMeta>): BoardMeta {
  return { ...meta, ...patch, rev: (meta.rev || 1) + 1 };
}
