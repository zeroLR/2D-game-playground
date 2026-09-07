import type { LevelDefinition, PageDefinition } from './model';
import { createDefinitionRegistry } from './world';

export const DEMO_PAGE_DEFINITIONS: readonly PageDefinition[] = [
  { id: 'forest-path', baseExits: ['N', 'S'], tags: ['forest', 'path'] },
  { id: 'ruined-gate', baseExits: ['N', 'E'], tags: ['ruin', 'gate'] },
  { id: 'stone-bridge', baseExits: ['N', 'S'], tags: ['stone', 'bridge'] },
  { id: 'crossroads', baseExits: ['N', 'E', 'S', 'W'], canRotate: false, canSwap: false, tags: ['fixed', 'crossroads'] },
  { id: 'shrine-seal', baseExits: ['N'], tags: ['shrine', 'seal'] },
  { id: 'hidden-grove', baseExits: ['N', 'E', 'S'], tags: ['grove', 'relic'] },
];

export const DEMO_DEFINITION_REGISTRY = createDefinitionRegistry(DEMO_PAGE_DEFINITIONS);

export const DEMO_LEVEL: LevelDefinition = {
  id: 'p4-pixel-art-page-identity',
  width: 3,
  height: 3,
  travelerStartPageId: 'p7',
  pages: [
    { id: 'p1', definitionId: 'ruined-gate', position: { row: 0, column: 0 }, rotation: 90 },
    { id: 'p2', definitionId: 'forest-path', position: { row: 0, column: 1 }, rotation: 90 },
    { id: 'p3', definitionId: 'ruined-gate', position: { row: 0, column: 2 }, rotation: 180, state: { objective: 'goal' } },
    { id: 'p4', definitionId: 'stone-bridge', position: { row: 1, column: 0 } },
    { id: 'p5', definitionId: 'crossroads', position: { row: 1, column: 1 } },
    { id: 'p6', definitionId: 'forest-path', position: { row: 1, column: 2 } },
    { id: 'p7', definitionId: 'shrine-seal', position: { row: 2, column: 0 }, rotation: 270 },
    { id: 'p8', definitionId: 'stone-bridge', position: { row: 2, column: 1 }, rotation: 90 },
    { id: 'p9', definitionId: 'hidden-grove', position: { row: 2, column: 2 }, rotation: 180, state: { objective: 'treasure' } },
  ],
};
