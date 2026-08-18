import { describe, expect, it } from 'vitest';
import { applyRelic, createInitialState } from '../src/domain/gameState';
import { ABYSS_HEART_HIT_SURGE, ABYSS_HEART_RUSH_SPEED_MULTIPLIER, GLASS_ANCHOR_JUMP_MULTIPLIER, GLASS_ANCHOR_LANDING_FLOW_BONUS, STORM_LENS_FORCE_MULTIPLIER, abyssApproachSpeedMultiplier, abyssHitSurge, applyStormLensForce, glassAnchorJumpMultiplier, glassAnchorLandingBonus, stormLensDashFlowBonus } from '../src/domain/relicEffects';
import { AbyssPressureSystem, ABYSS_APPROACH_SPEED } from '../src/systems/AbyssPressureSystem';
import type { StormSurgeFrame } from '../src/world/StormSurge';

describe('M8.2 relic vertical slice', () => {
  it('Glass Anchor changes the landing/rebound rule', () => {
    const base = createInitialState();
    const relic = applyRelic(base, 'glass-anchor');
    expect(glassAnchorLandingBonus(base.relics)).toBe(0);
    expect(glassAnchorLandingBonus(relic.relics)).toBe(GLASS_ANCHOR_LANDING_FLOW_BONUS);
    expect(glassAnchorJumpMultiplier(relic.relics)).toBe(GLASS_ANCHOR_JUMP_MULTIPLIER);
  });

  it('Abyss Heart suppresses approach at Rush+ and makes hits surge the Abyss', () => {
    const relic = applyRelic(createInitialState(), 'abyss-heart');
    expect(abyssApproachSpeedMultiplier(relic.relics, 5.9)).toBe(1);
    expect(abyssApproachSpeedMultiplier(relic.relics, 6)).toBe(ABYSS_HEART_RUSH_SPEED_MULTIPLIER);
    expect(abyssHitSurge(relic.relics)).toBe(ABYSS_HEART_HIT_SURGE);
    const abyss = new AbyssPressureSystem();
    expect(abyss.update(1, ABYSS_HEART_RUSH_SPEED_MULTIPLIER)).toBeCloseTo(650 - ABYSS_APPROACH_SPEED * ABYSS_HEART_RUSH_SPEED_MULTIPLIER);
    expect(abyss.surge(ABYSS_HEART_HIT_SURGE)).toBeCloseTo(650 - ABYSS_APPROACH_SPEED * ABYSS_HEART_RUSH_SPEED_MULTIPLIER - ABYSS_HEART_HIT_SURGE);
  });

  it('Storm Lens reduces storm force and rewards a tailwind dash', () => {
    const relic = applyRelic(createInitialState(), 'storm-lens');
    const frame: StormSurgeFrame = { phase: 'active', direction: 1, intensity: 0.8, forceX: 2880 };
    expect(applyStormLensForce(frame.forceX, relic.relics)).toBe(frame.forceX * STORM_LENS_FORCE_MULTIPLIER);
    expect(stormLensDashFlowBonus(relic.relics, frame, 1)).toBeGreaterThan(0);
    expect(stormLensDashFlowBonus(relic.relics, frame, -1)).toBe(0);
  });
});
