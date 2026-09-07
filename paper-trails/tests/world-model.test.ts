import { describe, expect, it } from 'vitest';
import type { LevelDefinition, PageDefinition } from '../src/domain/model';
import { rotateDirection, rotateExits } from '../src/domain/model';
import {
  buildAdjacencyGraph,
  createDefinitionRegistry,
  reachablePages,
  resetLevel,
  rotatePage,
  shortestPath,
  swapPages,
} from '../src/domain/world';

const DEFINITIONS: readonly PageDefinition[] = [
  { id: 'straight', baseExits: ['N', 'S'] },
  { id: 'corner', baseExits: ['N', 'E'] },
  { id: 'end', baseExits: ['N'] },
  { id: 'locked', baseExits: ['N', 'S'], canRotate: false, canSwap: false },
];

const REGISTRY = createDefinitionRegistry(DEFINITIONS);

const LEVEL: LevelDefinition = {
  id: 'test-level',
  width: 3,
  height: 2,
  travelerStartPageId: 'a',
  pages: [
    { id: 'a', definitionId: 'corner', position: { row: 0, column: 0 }, rotation: 90, state: { discovered: true } },
    { id: 'b', definitionId: 'straight', position: { row: 0, column: 1 }, rotation: 90 },
    { id: 'c', definitionId: 'corner', position: { row: 0, column: 2 }, rotation: 180 },
    { id: 'd', definitionId: 'end', position: { row: 1, column: 0 }, rotation: 180 },
    { id: 'e', definitionId: 'straight', position: { row: 1, column: 1 }, rotation: 90 },
    { id: 'f', definitionId: 'end', position: { row: 1, column: 2 } },
  ],
};

describe('direction rotation', () => {
  it('rotates cardinal directions clockwise', () => {
    expect(rotateDirection('N', 90)).toBe('E');
    expect(rotateDirection('W', 90)).toBe('N');
    expect(rotateExits(['N', 'E'], 180)).toEqual(['S', 'W']);
  });
});

describe('level reset', () => {
  it('creates deterministic fresh world state without sharing mutable page state', () => {
    const first = resetLevel(LEVEL, REGISTRY);
    const second = resetLevel(LEVEL, REGISTRY);

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
    expect(first.pages[0]).not.toBe(second.pages[0]);
    expect(first.pages[0].state).not.toBe(second.pages[0].state);
    expect(first.revision).toBe(0);
  });

  it('rejects duplicate positions and out-of-bounds authored pages', () => {
    const duplicate: LevelDefinition = {
      ...LEVEL,
      pages: [...LEVEL.pages, { id: 'x', definitionId: 'end', position: { row: 0, column: 0 } }],
    };
    expect(() => resetLevel(duplicate, REGISTRY)).toThrow('Duplicate page position');

    const outOfBounds: LevelDefinition = {
      ...LEVEL,
      pages: [{ id: 'x', definitionId: 'end', position: { row: 9, column: 9 } }],
      travelerStartPageId: 'x',
    };
    expect(() => resetLevel(outOfBounds, REGISTRY)).toThrow('out of bounds');
  });
});

describe('world commands', () => {
  it('rotates a page immutably and increments revision', () => {
    const initial = resetLevel(LEVEL, REGISTRY);
    const next = rotatePage(initial, REGISTRY, 'a');

    expect(initial.pages.find((page) => page.id === 'a')?.rotation).toBe(90);
    expect(next.pages.find((page) => page.id === 'a')?.rotation).toBe(180);
    expect(next.revision).toBe(1);
  });

  it('swaps page positions without changing identities', () => {
    const initial = resetLevel(LEVEL, REGISTRY);
    const next = swapPages(initial, REGISTRY, 'a', 'f');

    expect(next.pages.find((page) => page.id === 'a')?.position).toEqual({ row: 1, column: 2 });
    expect(next.pages.find((page) => page.id === 'f')?.position).toEqual({ row: 0, column: 0 });
    expect(initial.pages.find((page) => page.id === 'a')?.position).toEqual({ row: 0, column: 0 });
  });

  it('rejects rotate and swap commands for locked definitions', () => {
    const lockedLevel: LevelDefinition = {
      id: 'locked-level',
      width: 2,
      height: 1,
      travelerStartPageId: 'locked-page',
      pages: [
        { id: 'locked-page', definitionId: 'locked', position: { row: 0, column: 0 } },
        { id: 'other', definitionId: 'end', position: { row: 0, column: 1 } },
      ],
    };
    const world = resetLevel(lockedLevel, REGISTRY);
    expect(() => rotatePage(world, REGISTRY, 'locked-page')).toThrow('cannot rotate');
    expect(() => swapPages(world, REGISTRY, 'locked-page', 'other')).toThrow('cannot swap');
  });
});

describe('connectivity graph', () => {
  it('connects only adjacent pages with reciprocal rotated exits', () => {
    const graph = buildAdjacencyGraph(resetLevel(LEVEL, REGISTRY), REGISTRY);

    expect(graph.get('a')).toEqual(['b', 'd']);
    expect(graph.get('b')).toEqual(['c', 'a']);
    expect(graph.get('c')).toEqual(['b']);
    expect(graph.get('d')).toEqual(['a']);
    expect(graph.get('e')).toEqual([]);
    expect(graph.get('f')).toEqual([]);
  });

  it('rebuilds connectivity after a page rotation', () => {
    const initial = resetLevel(LEVEL, REGISTRY);
    const before = buildAdjacencyGraph(initial, REGISTRY);
    const after = buildAdjacencyGraph(rotatePage(initial, REGISTRY, 'b'), REGISTRY);

    expect(before.get('a')).toContain('b');
    expect(after.get('a')).not.toContain('b');
  });
});

describe('graph traversal', () => {
  it('finds all reachable pages with BFS', () => {
    const graph = buildAdjacencyGraph(resetLevel(LEVEL, REGISTRY), REGISTRY);
    expect([...reachablePages(graph, 'a')]).toEqual(['a', 'b', 'd', 'c']);
  });

  it('returns deterministic shortest paths and null for disconnected destinations', () => {
    const graph = buildAdjacencyGraph(resetLevel(LEVEL, REGISTRY), REGISTRY);
    expect(shortestPath(graph, 'd', 'c')).toEqual(['d', 'a', 'b', 'c']);
    expect(shortestPath(graph, 'a', 'e')).toBeNull();
    expect(shortestPath(graph, 'a', 'a')).toEqual(['a']);
  });
});
