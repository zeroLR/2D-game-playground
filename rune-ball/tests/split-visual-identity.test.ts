import { describe, expect, it } from 'vitest';
import { getSplitVisualProfile } from '../src/presentation/SplitVisualIdentity';

describe('SplitVisualIdentity', () => {
  it('keeps Base Split as a simple echo silhouette before evolution', () => {
    expect(getSplitVisualProfile('prism', 0).style).toBe('echoes');
    expect(getSplitVisualProfile('lance', 0).style).toBe('echoes');
  });

  it('turns Prism evolution into progressively larger wing silhouettes', () => {
    const tierOne = getSplitVisualProfile('prism', 1);
    const tierTwo = getSplitVisualProfile('prism', 2);

    expect(tierOne.style).toBe('prism-wings');
    expect(tierTwo.style).toBe('prism-wings');
    expect(tierTwo.wingSpan).toBeGreaterThan(tierOne.wingSpan);
    expect(tierTwo.wingLayers).toBeGreaterThan(tierOne.wingLayers);
  });

  it('turns Lance evolution into a longer, heavier spear silhouette', () => {
    const tierOne = getSplitVisualProfile('lance', 1);
    const tierTwo = getSplitVisualProfile('lance', 2);

    expect(tierOne.style).toBe('lance');
    expect(tierTwo.style).toBe('lance');
    expect(tierTwo.lanceExtraLength).toBeGreaterThan(tierOne.lanceExtraLength);
    expect(tierTwo.lanceHalfWidth).toBeGreaterThan(tierOne.lanceHalfWidth);
  });
});
