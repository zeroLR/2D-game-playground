import { describe, expect, it } from 'vitest';
import { resolveNovaAnimationState } from '../src/presentation/NovaAnimationState';

describe('Nova animation state', () => {
  it('gives an active dash visual priority over vertical movement', () => {
    expect(resolveNovaAnimationState({ velocityY: -500, dashDirection: 1, dashVisualTime: 0.1 })).toBe('dash-right');
    expect(resolveNovaAnimationState({ velocityY: 500, dashDirection: -1, dashVisualTime: 0.1 })).toBe('dash-left');
  });

  it('uses jump while rising and fall while descending', () => {
    expect(resolveNovaAnimationState({ velocityY: -120, dashDirection: 0, dashVisualTime: 0 })).toBe('jump');
    expect(resolveNovaAnimationState({ velocityY: 120, dashDirection: 0, dashVisualTime: 0 })).toBe('fall');
  });

  it('uses an idle dead-zone near the apex to avoid animation flicker', () => {
    expect(resolveNovaAnimationState({ velocityY: -20, dashDirection: 0, dashVisualTime: 0 })).toBe('idle');
    expect(resolveNovaAnimationState({ velocityY: 20, dashDirection: 0, dashVisualTime: 0 })).toBe('idle');
  });

  it('ignores stale dash direction after dashVisualTime expires', () => {
    expect(resolveNovaAnimationState({ velocityY: 90, dashDirection: 1, dashVisualTime: 0 })).toBe('fall');
  });
});
