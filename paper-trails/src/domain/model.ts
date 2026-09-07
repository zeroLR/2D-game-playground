export const CARDINAL_DIRECTIONS = ['N', 'E', 'S', 'W'] as const;

export type Direction = (typeof CARDINAL_DIRECTIONS)[number];
export type Rotation = 0 | 90 | 180 | 270;
export type PageScalar = string | number | boolean | null;

export interface GridPosition {
  readonly row: number;
  readonly column: number;
}

export interface PageDefinition {
  readonly id: string;
  readonly baseExits: readonly Direction[];
  readonly canRotate?: boolean;
  readonly canSwap?: boolean;
  readonly tags?: readonly string[];
}

export interface PageState {
  readonly id: string;
  readonly definitionId: string;
  readonly position: GridPosition;
  readonly rotation: Rotation;
  readonly state: Readonly<Record<string, PageScalar>>;
}

export interface PageSeed {
  readonly id: string;
  readonly definitionId: string;
  readonly position: GridPosition;
  readonly rotation?: Rotation;
  readonly state?: Readonly<Record<string, PageScalar>>;
}

export interface LevelDefinition {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly pages: readonly PageSeed[];
  readonly travelerStartPageId: string;
}

export interface WorldState {
  readonly levelId: string;
  readonly width: number;
  readonly height: number;
  readonly pages: readonly PageState[];
  readonly travelerPageId: string;
  readonly revision: number;
}

export type DefinitionRegistry = ReadonlyMap<string, PageDefinition>;
export type AdjacencyGraph = ReadonlyMap<string, readonly string[]>;

const DIRECTION_INDEX: Readonly<Record<Direction, number>> = {
  N: 0,
  E: 1,
  S: 2,
  W: 3,
};

const ROTATIONS: readonly Rotation[] = [0, 90, 180, 270];

export function oppositeDirection(direction: Direction): Direction {
  return CARDINAL_DIRECTIONS[(DIRECTION_INDEX[direction] + 2) % 4];
}

export function rotateDirection(direction: Direction, rotation: Rotation): Direction {
  const quarterTurns = rotation / 90;
  return CARDINAL_DIRECTIONS[(DIRECTION_INDEX[direction] + quarterTurns) % 4];
}

export function rotateExits(exits: readonly Direction[], rotation: Rotation): readonly Direction[] {
  return exits.map((direction) => rotateDirection(direction, rotation));
}

export function rotateRotation(rotation: Rotation, clockwiseQuarterTurns = 1): Rotation {
  const normalizedTurns = ((clockwiseQuarterTurns % 4) + 4) % 4;
  const currentIndex = ROTATIONS.indexOf(rotation);
  return ROTATIONS[(currentIndex + normalizedTurns) % ROTATIONS.length];
}

export function directionOffset(direction: Direction): GridPosition {
  switch (direction) {
    case 'N':
      return { row: -1, column: 0 };
    case 'E':
      return { row: 0, column: 1 };
    case 'S':
      return { row: 1, column: 0 };
    case 'W':
      return { row: 0, column: -1 };
  }
}

export function positionKey(position: GridPosition): string {
  return `${position.row}:${position.column}`;
}
