export const MATCH_SIZE = 3;

export type ColorPiece = { id: number; color: number };

export function countColors(pieces: ColorPiece[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const piece of pieces) counts.set(piece.color, (counts.get(piece.color) ?? 0) + 1);
  return counts;
}

export function hasImpossibleColorRemainder(pieces: ColorPiece[]): boolean {
  return [...countColors(pieces).values()].some(count => count % MATCH_SIZE !== 0);
}

/**
 * Resolve only a multiple of MATCH_SIZE from a connected group.
 * Example: a connected group of 4 or 5 removes 3, leaving the inventory
 * divisible by 3 when the board started from the constrained generator.
 */
export function selectSolvableMatch<T extends ColorPiece>(group: T[]): T[] {
  const removable = Math.floor(group.length / MATCH_SIZE) * MATCH_SIZE;
  return group.slice(0, removable);
}
