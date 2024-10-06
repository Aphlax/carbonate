

export const COLORS = new Map([
  ["W", "#FFFFFF"], // White
  ["P", "#D44063"], // Purple
  ["R", "#E15950"], // Red
  ["O", "#ED7743"], // Orange
  ["A", "#F1A14B"], // Apricot
  ["Y", "#F7CF54"], // Yellow
  ["L", "#90C462"], // Lime
  ["G", "#57BD7B"], // Green
  ["T", "#4C9F9C"], // Turquoise
  ["U", "#4880C0"], // U Blue
  ["D", "#5C6BB3"], // Denim
  ["V", "#7857A6"], // Violet
]);

export function getRandomColor(used: string[]): string {
  const options = [];
  for (let color of COLORS.keys()) {
    if (!used.includes(color)) {
      options.push(color);
    }
  }
  return options[Math.floor(Math.random() * options.length)];
}

export const ICONS = [
  "H"
];

export class Counter {
  icon!: string;
  value!: number;
}

export class Player {
  counters!: Counter[];
  color!: string;
}

export const HASH_SEPARATOR = ":";
const allColors = [...COLORS.keys()].join();
const allIcons = ICONS.join();
export const HASH_PARSE_REGEX =
  new RegExp(`^([${allColors}${allIcons}0-9-]+?)(?:[${HASH_SEPARATOR}](\\d+))?$`);
export const PLAYER_PARSE_REGEX =
  new RegExp(`([${allColors}])([-]?\\d+)([${allIcons}0-9-]*)`, "g");
export const ICONS_PARSE_REGEX =
  new RegExp(`([${allIcons}])([-]?\\d+)`, "g");

export function createHash(players: Player[], startingLifeTotal: number): string {
  return players.map(pl =>
    pl.color + pl.counters[0].value + pl.counters.slice(1).map(c => c.icon + c.value).join())
    .join() + HASH_SEPARATOR + startingLifeTotal;
}

export function parseHash(hash: string): { players: Player[], startingLifeTotal: number } {
  const match = hash.match(HASH_PARSE_REGEX);
  if (!match) return {players: [], startingLifeTotal: 0};
  const [_, playersHash, startingLifeTotalHash] = match;
  const startingLifeTotal = startingLifeTotalHash ? parseInt(startingLifeTotalHash) : 0;

  const players = [];
  for (let [_, color, value, icons] of playersHash.matchAll(PLAYER_PARSE_REGEX)) {
    const counters = [];
    for (let [_, icon, value] of icons.matchAll(ICONS_PARSE_REGEX)) {
      counters.push({icon, value: parseInt(value)});
    }
    players.push({color, counters: [{icon: "", value: parseInt(value)}, ...counters]});
  }

  return {players, startingLifeTotal};
}

export const PLAYER_POSITIONS = [
  [{x: 0.5, y: 0.5}],
  [{x: 0.5, y: 0.25}, {x: 0.5, y: 0.75}],
  [{x: 0.25, y: 0.31}, {x: 0.75, y: 0.31}, {x: 0.5, y: 0.81}],
  [{x: 0.25, y: 0.25}, {x: 0.75, y: 0.25}, {x: 0.25, y: 0.75}, {x: 0.75, y: 0.75}],
  [{x: 0.25, y: 0.2}, {x: 0.75, y: 0.2}, {x: 0.25, y: 0.6}, {x: 0.75, y: 0.6}, {x: 0.5, y: 0.87}],
  [{x: 0.25, y: 0.2}, {x: 0.75, y: 0.2}, {x: 0.25, y: 0.5}, {x: 0.75, y: 0.5}, {
    x: 0.25,
    y: 0.8
  }, {x: 0.75, y: 0.8}],
]
