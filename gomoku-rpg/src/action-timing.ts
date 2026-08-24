import { heroes, type HeroId } from './heroes';
import type { SkillId } from './skills';

export type AbilityActionTiming='primary'|'follow-up';

/**
 * Resolves when a skill may be used inside the actor turn.
 * Skills are primary actions by default; heroes may reinterpret an equipped skill
 * as a follow-up technique without changing the skill's board effect.
 */
export function resolveAbilityActionTiming(heroId:HeroId,skillId:SkillId):AbilityActionTiming{
  return heroes[heroId].abilityActionTimingOverrides[skillId]??'primary';
}
