export type Direction = -1 | 1;

export type PlayerCommand =
  | { type: 'air-nudge'; direction: Direction; strength: number }
  | { type: 'dash'; direction: Direction; strength: number }
  | { type: 'wall-jump'; direction: Direction }
  | { type: 'restart' };
