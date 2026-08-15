import { describe, expect, it } from 'vitest';
import { createColorBag, PALETTE } from './BoardGenerator';

describe('BoardGenerator', () => {
  it('generates 30 pieces with six of every color', () => {
    const bag = createColorBag();
    expect(bag).toHaveLength(30);
    for (const color of PALETTE) expect(bag.filter(value => value === color)).toHaveLength(6);
  });
});
