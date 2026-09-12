import { describe, expect, it } from 'vitest';
import { getSplitRuntimeGlyphSpec, getSplitRuntimeSvgSource } from '../src/presentation/SplitRuntimeSvgSpec';

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

  it('keeps Base Split restrained while evolved forms gain authored glow material', () => {
    expect(getSplitRuntimeGlyphSpec('prism', 0).material.glowEnabled).toBe(false);
    expect(getSplitRuntimeGlyphSpec('prism', 1).material.glowEnabled).toBe(true);
    expect(getSplitRuntimeGlyphSpec('lance', 1).material.glowEnabled).toBe(true);
  });

  it('escalates T2 material without flattening Prism and Lance into the same glow', () => {
    const prismT1 = getSplitRuntimeGlyphSpec('prism', 1).material;
    const prismT2 = getSplitRuntimeGlyphSpec('prism', 2).material;
    const lanceT1 = getSplitRuntimeGlyphSpec('lance', 1).material;
    const lanceT2 = getSplitRuntimeGlyphSpec('lance', 2).material;

    expect(prismT2.backGlowBlur).toBeGreaterThan(prismT1.backGlowBlur);
    expect(prismT2.backGlowAlpha).toBeGreaterThan(prismT1.backGlowAlpha);
    expect(lanceT2.hotAlpha).toBeGreaterThan(lanceT1.hotAlpha);
    expect(lanceT2.backGlowBlur).toBeGreaterThan(lanceT1.backGlowBlur);

    expect(prismT1.backGlowBlur).toBeGreaterThan(lanceT1.backGlowBlur);
    expect(lanceT1.hotAlpha).toBeGreaterThan(prismT1.hotAlpha);
  });

  it('gives Prism outward motion and Lance forward motion while Base remains static', () => {
    expect(getSplitRuntimeGlyphSpec('prism', 0).motion.kind).toBe('none');
    expect(getSplitRuntimeGlyphSpec('prism', 1).motion.kind).toBe('prism-outward');
    expect(getSplitRuntimeGlyphSpec('prism', 2).motion.kind).toBe('prism-outward');
    expect(getSplitRuntimeGlyphSpec('lance', 1).motion.kind).toBe('lance-forward');
    expect(getSplitRuntimeGlyphSpec('lance', 2).motion.kind).toBe('lance-forward');
  });

  it('escalates T2 cadence with a second phase without turning motion into particles', () => {
    const prismT1 = getSplitRuntimeGlyphSpec('prism', 1).motion;
    const prismT2 = getSplitRuntimeGlyphSpec('prism', 2).motion;
    const lanceT1 = getSplitRuntimeGlyphSpec('lance', 1).motion;
    const lanceT2 = getSplitRuntimeGlyphSpec('lance', 2).motion;

    expect(prismT2.cycleSeconds).toBeLessThan(prismT1.cycleSeconds);
    expect(prismT2.secondaryAlpha).toBeGreaterThan(0);
    expect(prismT2.travelEnd).toBeGreaterThan(prismT1.travelEnd);

    expect(lanceT2.cycleSeconds).toBeLessThan(lanceT1.cycleSeconds);
    expect(lanceT2.secondaryAlpha).toBeGreaterThan(0);
    expect(lanceT2.travelEnd).toBeLessThan(lanceT1.travelEnd);
  });
});
