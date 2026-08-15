import { describe, expect, it } from 'vitest';
import { hasImpossibleColorRemainder, selectSolvableMatch } from './SolvabilitySystem';

const group = (size: number) => Array.from({ length: size }, (_, i) => ({ id: i + 1, color: 1 }));

describe('SolvabilitySystem', () => {
  it.each([[3,3],[4,3],[5,3],[6,6],[7,6],[8,6],[9,9]])('resolves %i connected pieces as %i', (size, expected) => {
    expect(selectSolvableMatch(group(size))).toHaveLength(expected);
  });

  it('detects impossible color inventories', () => {
    expect(hasImpossibleColorRemainder([...group(6), ...group(3).map(p => ({ ...p, id: p.id + 10, color: 2 }))])).toBe(false);
    expect(hasImpossibleColorRemainder(group(5))).toBe(true);
  });

  it('preserves a matchable remainder when a 4-piece group exists inside a 6-piece color inventory', () => {
    const all = group(6);
    const removed = new Set(selectSolvableMatch(all.slice(0, 4)).map(p => p.id));
    expect(hasImpossibleColorRemainder(all.filter(p => !removed.has(p.id)))).toBe(false);
    expect(all.filter(p => !removed.has(p.id))).toHaveLength(3);
  });
});
