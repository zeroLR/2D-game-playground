import { Cell, Player, Pos } from './game';

export type SkillTargetType = 'friendly-then-empty' | 'friendly' | 'empty';

export type SkillContext = {
  board: Cell[][];
  player: Player;
  mana: number;
};

export type SkillDefinition = {
  id: string;
  cost: number;
  targetType: SkillTargetType;
  descriptionKey: 'blinkHelp' | 'guardHelp' | 'sealHelp';
  legalSources?: (context: SkillContext) => Pos[];
  legalTargets: (context: SkillContext, source?: Pos) => Pos[];
  execute: (context: SkillContext, target: Pos, source?: Pos) => Cell[][];
};

function positions(board: Cell[][], predicate: (cell: Cell) => boolean): Pos[] {
  const result: Pos[] = [];
  board.forEach((row, r) => row.forEach((cell, c) => {
    if (predicate(cell)) result.push({ row: r, col: c });
  }));
  return result;
}

function samePos(a: Pos, b: Pos) { return a.row === b.row && a.col === b.col; }

export const blinkSkill: SkillDefinition = {
  id: 'blink',
  cost: 2,
  targetType: 'friendly-then-empty',
  descriptionKey: 'blinkHelp',
  legalSources: ({ board, player }) => positions(board, (cell) => cell === player),
  legalTargets: ({ board }, source) => source ? positions(board, (cell) => cell === 0) : [],
  execute: ({ board, player }, target, source) => {
    if (!source) return board;
    const next = board.map((row) => [...row]);
    next[source.row][source.col] = 0;
    next[target.row][target.col] = player;
    return next;
  },
};

/** M1 vocabulary placeholder: effect state lands in the next slice. */
export const guardSkill: SkillDefinition = {
  id: 'guard', cost: 2, targetType: 'friendly', descriptionKey: 'guardHelp',
  legalTargets: ({ board, player }) => positions(board, (cell) => cell === player),
  execute: ({ board }) => board,
};

/** M1 vocabulary placeholder: timed blocked-cell state lands in the next slice. */
export const sealSkill: SkillDefinition = {
  id: 'seal', cost: 2, targetType: 'empty', descriptionKey: 'sealHelp',
  legalTargets: ({ board }) => positions(board, (cell) => cell === 0),
  execute: ({ board }) => board,
};

export const skills = {
  blink: blinkSkill,
  guard: guardSkill,
  seal: sealSkill,
} as const;

export type SkillId = keyof typeof skills;

export function isLegalPosition(candidate: Pos, legal: Pos[]) {
  return legal.some((pos) => samePos(candidate, pos));
}
