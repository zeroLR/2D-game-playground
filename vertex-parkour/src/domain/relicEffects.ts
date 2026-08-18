import { FLOW_RUSH_THRESHOLD } from '../systems/FlowSystem';
import type { StormSurgeFrame } from '../world/StormSurge';
import { hasRelic, type RelicInventory } from './relics';

export const GLASS_ANCHOR_LANDING_FLOW_BONUS = 0.55;
export const GLASS_ANCHOR_JUMP_MULTIPLIER = 1.08;
export const ABYSS_HEART_RUSH_SPEED_MULTIPLIER = 0.35;
export const ABYSS_HEART_HIT_SURGE = 42;
export const STORM_LENS_FORCE_MULTIPLIER = 0.55;
export const STORM_LENS_TAILWIND_FLOW_BONUS = 0.3;

export function glassAnchorLandingBonus(relics: RelicInventory) {
  return hasRelic(relics, 'glass-anchor') ? GLASS_ANCHOR_LANDING_FLOW_BONUS : 0;
}

export function glassAnchorJumpMultiplier(relics: RelicInventory) {
  return hasRelic(relics, 'glass-anchor') ? GLASS_ANCHOR_JUMP_MULTIPLIER : 1;
}

export function abyssApproachSpeedMultiplier(relics: RelicInventory, flow: number) {
  return hasRelic(relics, 'abyss-heart') && flow >= FLOW_RUSH_THRESHOLD ? ABYSS_HEART_RUSH_SPEED_MULTIPLIER : 1;
}

export function abyssHitSurge(relics: RelicInventory) {
  return hasRelic(relics, 'abyss-heart') ? ABYSS_HEART_HIT_SURGE : 0;
}

export function applyStormLensForce(forceX: number, relics: RelicInventory) {
  return hasRelic(relics, 'storm-lens') ? forceX * STORM_LENS_FORCE_MULTIPLIER : forceX;
}

export function stormLensDashFlowBonus(relics: RelicInventory, frame: StormSurgeFrame, dashDirection: -1 | 1) {
  if (!hasRelic(relics, 'storm-lens') || frame.phase !== 'active' || frame.direction !== dashDirection) return 0;
  return STORM_LENS_TAILWIND_FLOW_BONUS * frame.intensity;
}
