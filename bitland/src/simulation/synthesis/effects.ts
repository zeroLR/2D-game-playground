import { DEFAULT_LOCOMOTION, type LocomotionConfig } from '../player/locomotion';
import type { Discovery, Trait } from './synthesis';

export type DiscoveryEffects = {
  runSpeedMultiplier: number;
  jumpMultiplier: number;
  pushMultiplier: number;
  dodgeDistanceMultiplier: number;
  attackDamageBonus: number;
  attackRangeBonus: number;
};

export const BASE_DISCOVERY_EFFECTS: DiscoveryEffects = {
  runSpeedMultiplier: 1,
  jumpMultiplier: 1,
  pushMultiplier: 1,
  dodgeDistanceMultiplier: 1,
  attackDamageBonus: 0,
  attackRangeBonus: 0,
};

const TRAIT_EFFECTS: Partial<Record<Trait, Partial<DiscoveryEffects>>> = {
  HEAVY: { runSpeedMultiplier: 0.84, jumpMultiplier: 0.88, pushMultiplier: 1.5 },
  LIGHTWEIGHT: { runSpeedMultiplier: 1.16, jumpMultiplier: 1.14, dodgeDistanceMultiplier: 1.18 },
  HOT: { attackDamageBonus: 1 },
  CONDUCTIVE: { attackRangeBonus: 16 },
};

export function resolveDiscoveryEffects(discovery: Discovery | null): DiscoveryEffects {
  if (!discovery) return { ...BASE_DISCOVERY_EFFECTS };
  return discovery.traits.reduce<DiscoveryEffects>((effects, trait) => {
    const modifier = TRAIT_EFFECTS[trait];
    if (!modifier) return effects;
    return {
      runSpeedMultiplier: effects.runSpeedMultiplier * (modifier.runSpeedMultiplier ?? 1),
      jumpMultiplier: effects.jumpMultiplier * (modifier.jumpMultiplier ?? 1),
      pushMultiplier: effects.pushMultiplier * (modifier.pushMultiplier ?? 1),
      dodgeDistanceMultiplier: effects.dodgeDistanceMultiplier * (modifier.dodgeDistanceMultiplier ?? 1),
      attackDamageBonus: effects.attackDamageBonus + (modifier.attackDamageBonus ?? 0),
      attackRangeBonus: effects.attackRangeBonus + (modifier.attackRangeBonus ?? 0),
    };
  }, { ...BASE_DISCOVERY_EFFECTS });
}

export function locomotionConfigForEffects(effects: DiscoveryEffects): LocomotionConfig {
  return {
    ...DEFAULT_LOCOMOTION,
    runSpeed: DEFAULT_LOCOMOTION.runSpeed * effects.runSpeedMultiplier,
    jumpVelocity: DEFAULT_LOCOMOTION.jumpVelocity * effects.jumpMultiplier,
  };
}

export function activeEffectSummary(discovery: Discovery | null): string {
  if (!discovery) return 'ACTIVE // none';
  const effects = resolveDiscoveryEffects(discovery);
  const parts: string[] = [];
  if (effects.runSpeedMultiplier !== 1) parts.push(`MOVE ×${effects.runSpeedMultiplier.toFixed(2)}`);
  if (effects.jumpMultiplier !== 1) parts.push(`JUMP ×${effects.jumpMultiplier.toFixed(2)}`);
  if (effects.pushMultiplier !== 1) parts.push(`PUSH ×${effects.pushMultiplier.toFixed(2)}`);
  if (effects.dodgeDistanceMultiplier !== 1) parts.push(`DODGE ×${effects.dodgeDistanceMultiplier.toFixed(2)}`);
  if (effects.attackDamageBonus) parts.push(`ATK +${effects.attackDamageBonus}`);
  if (effects.attackRangeBonus) parts.push(`RANGE +${effects.attackRangeBonus}`);
  return `ACTIVE // ${discovery.displayName}${parts.length ? `  ${parts.join(' · ')}` : '  neutral'}`;
}
