

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
