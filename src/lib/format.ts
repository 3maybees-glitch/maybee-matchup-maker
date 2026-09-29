export function ink(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return (red * 299 + green * 587 + blue * 114) / 1000 > 155 ? "#1a1208" : "#ffffff";
}

export function ordinal(rank: number) {
  const tail = rank % 100;
  if (tail >= 11 && tail <= 13) return `${rank}th`;
  if (rank % 10 === 1) return `${rank}st`;
  if (rank % 10 === 2) return `${rank}nd`;
  if (rank % 10 === 3) return `${rank}rd`;
  return `${rank}th`;
}

export function avg(value: number) {
  return value.toFixed(3).replace(/^0/, "");
}

export function era(value: number) {
  return value.toFixed(2);
}

export function whip(value: number) {
  return value.toFixed(2);
}

export function signedWar(value: number) {
  const text = value.toFixed(1);
  return value > 0 ? `+${text}` : text;
}

export function record(team: { w: number; l: number }) {
  return `${team.w}-${team.l}`;
}
