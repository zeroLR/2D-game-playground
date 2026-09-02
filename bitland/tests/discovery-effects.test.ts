import { describe, expect, it } from 'vitest';
import { activeEffectSummary, locomotionConfigForEffects, resolveDiscoveryEffects } from '../src/simulation/synthesis/effects';
import type { Discovery } from '../src/simulation/synthesis/synthesis';

const discovery = (traits: Discovery['traits']): Discovery => ({
  id: 'test',
  pairKey: 'MATTER::ENERGY',
  discoveryIndex: 0,
  displayName: 'Test Core',
  traits,
});

describe('discovery effects', () => {
  it('keeps unknown/non-gameplay traits neutral', () => {
    const effects = resolveDiscoveryEffects(discovery(['REFLECTIVE', 'ORGANIC']));
    expect(effects.runSpeedMultiplier).toBe(1);
    expect(effects.attackDamageBonus).toBe(0);
  });

  it('maps HEAVY to slower movement, lower jump and stronger push', () => {
    const effects = resolveDiscoveryEffects(discovery(['HEAVY']));
    const config = locomotionConfigForEffects(effects);
    expect(effects.runSpeedMultiplier).toBeLessThan(1);
    expect(effects.jumpMultiplier).toBeLessThan(1);
    expect(effects.pushMultiplier).toBeGreaterThan(1);
    expect(config.runSpeed).toBeLessThan(220);
  });

  it('maps LIGHTWEIGHT to faster traversal and longer dodge', () => {
    const effects = resolveDiscoveryEffects(discovery(['LIGHTWEIGHT']));
    expect(effects.runSpeedMultiplier).toBeGreaterThan(1);
    expect(effects.jumpMultiplier).toBeGreaterThan(1);
    expect(effects.dodgeDistanceMultiplier).toBeGreaterThan(1);
  });

  it('maps HOT and CONDUCTIVE to combat modifiers', () => {
    const effects = resolveDiscoveryEffects(discovery(['HOT', 'CONDUCTIVE']));
    expect(effects.attackDamageBonus).toBe(1);
    expect(effects.attackRangeBonus).toBe(16);
    expect(activeEffectSummary(discovery(['HOT']))).toContain('ATK +1');
  });
});
