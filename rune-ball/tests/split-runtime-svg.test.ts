import { describe, expect, it } from 'vitest';
import { getSplitRuntimeGlyphSpec, getSplitRuntimeSvgSource } from '../src/presentation/SplitRuntimeSvg';

describe('Split runtime SVG alignment', () => {
  it('maps base and authored stages to the matching shared SVG glyphs', () => {
    expect(getSplitRuntimeGlyphSpec('prism', 0).key).toBe('split-base');
    expect(getSplitRuntimeGlyphSpec('prism', 1).key).toBe('prism-t1');
    expect(getSplitRuntimeGlyphSpec('prism', 2).key).toBe('prism-t2');
    expect(getSplitRuntimeGlyphSpec('lance', 1).key).toBe('lance-t1');
    expect(getSplitRuntimeGlyphSpec('lance', 2).key).toBe('lance-t2');
  });

  it('anchors Lance on its core while Prism remains centered', () => {
    expect(getSplitRuntimeGlyphSpec('prism', 2)).toMatchObject({ pivotX: 32, pivotY: 32 });
    expect(getSplitRuntimeGlyphSpec('lance', 1)).toMatchObject({ pivotX: 32, pivotY: 45 });
    expect(getSplitRuntimeGlyphSpec('lance', 2)).toMatchObject({ pivotX: 32, pivotY: 46 });
  });

  it('uses real SVG sources instead of presentation-specific polygon recipes', () => {
    for (const key of ['split-base', 'prism-t1', 'prism-t2', 'lance-t1', 'lance-t2'] as const) {
      const source = getSplitRuntimeSvgSource(key);
      expect(source).toContain('<svg');
      expect(source).toContain('viewBox="0 0 64 64"');
    }
  });
});
