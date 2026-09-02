import { describe, expect, it } from 'vitest';
import { activateAffordance, canActivateAffordance, createAffordanceState, isAffordanceActive } from '../src/simulation/world/affordances';
import type { Discovery } from '../src/simulation/synthesis/synthesis';

function discovery(traits: Discovery['traits']): Discovery {
  return { id: 'd', pairKey: 'A::B', discoveryIndex: 0, displayName: 'Test', traits };
}

describe('world affordances', () => {
  it('requires CONDUCTIVE for the signal relay', () => {
    expect(canActivateAffordance('SIGNAL_RELAY', discovery(['CONDUCTIVE']))).toBe(true);
    expect(canActivateAffordance('SIGNAL_RELAY', discovery(['HOT']))).toBe(false);
  });

  it('requires HOT for the thermal vent', () => {
    expect(canActivateAffordance('THERMAL_VENT', discovery(['HOT']))).toBe(true);
    expect(canActivateAffordance('THERMAL_VENT', discovery(['CONDUCTIVE']))).toBe(false);
  });

  it('persists one-way activation instead of following the current discovery', () => {
    const state = createAffordanceState();
    expect(activateAffordance(state, 'SIGNAL_RELAY', discovery(['CONDUCTIVE']))).toBe('ACTIVATED');
    expect(isAffordanceActive(state, 'SIGNAL_RELAY')).toBe(true);
    expect(activateAffordance(state, 'SIGNAL_RELAY', discovery(['HOT']))).toBe('ALREADY_ACTIVE');
  });
});
