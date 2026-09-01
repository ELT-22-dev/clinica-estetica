const PALETTES = [
  { bg: "#F3EAF0", fg: "#8A5A73" },
  { bg: "#EDF0F5", fg: "#5A6A82" },
  { bg: "#F5EDE8", fg: "#8A6752" },
  { bg: "#EFF2EC", fg: "#61735A" },
  { bg: "#F6EEDD", fg: "#8A6529" },
  { bg: "#F5F1EA", fg: "#8A7F72" },
];

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function avatarPalette(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTES[hash % PALETTES.length];
}
