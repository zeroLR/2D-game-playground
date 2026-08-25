import { heroes, type HeroId } from './heroes';
import type { SkillId } from './skills';

export type AbilityActionTiming='primary'|'precommit-follow-up'|'triggered-follow-up';

/**
 * Resolves when a skill may be used inside the actor turn.
 * Primary skills replace placement. Precommit follow-ups are armed before placement
 * and resolved after it. Triggered follow-ups only surface after placement when legal.
 */
export function resolveAbilityActionTiming(heroId:HeroId,skillId:SkillId):AbilityActionTiming{
  return heroes[heroId].abilityActionTimingOverrides[skillId]??'primary';
}
