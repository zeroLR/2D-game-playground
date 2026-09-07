import type { LevelDefinition, PageDefinition } from './model';
import { createDefinitionRegistry } from './world';

export const DEMO_PAGE_DEFINITIONS: readonly PageDefinition[] = [
  { id: 'straight', baseExits: ['N', 'S'] },
  { id: 'corner', baseExits: ['N', 'E'] },
  { id: 'junction', baseExits: ['N', 'E', 'S'] },
  { id: 'end', baseExits: ['N'] },
  { id: 'cross', baseExits: ['N', 'E', 'S', 'W'], canRotate: false, canSwap: false, tags: ['fixed'] },
];

export const DEMO_DEFINITION_REGISTRY = createDefinitionRegistry(DEMO_PAGE_DEFINITIONS);

export const DEMO_LEVEL: LevelDefinition = {
  id: 'p3-traveler-objective-smoke',
  width: 3,
  height: 3,
  travelerStartPageId: 'p7',
  pages: [
    { id: 'p1', definitionId: 'corner', position: { row: 0, column: 0 }, rotation: 90 },
    { id: 'p2', definitionId: 'straight', position: { row: 0, column: 1 }, rotation: 90 },
    { id: 'p3', definitionId: 'corner', position: { row: 0, column: 2 }, rotation: 180, state: { objective: 'goal' } },
    { id: 'p4', definitionId: 'straight', position: { row: 1, column: 0 } },
    { id: 'p5', definitionId: 'cross', position: { row: 1, column: 1 } },
    { id: 'p6', definitionId: 'straight', position: { row: 1, column: 2 } },
    { id: 'p7', definitionId: 'end', position: { row: 2, column: 0 }, rotation: 270 },
    { id: 'p8', definitionId: 'straight', position: { row: 2, column: 1 }, rotation: 90 },
    { id: 'p9', definitionId: 'junction', position: { row: 2, column: 2 }, rotation: 180, state: { objective: 'treasure' } },
  ],
};
