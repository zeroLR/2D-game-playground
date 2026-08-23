import type { AbilityActivationRule } from './ability-economy';
import { heroes, type HeroId } from './heroes';
import { skills, type SkillId } from './skills';

/**
 * Resolves the activation rule in hero context.
 * Skill definitions own their default activation. A hero may override that rule
 * when its signature economy changes how the same tactical ability is paid for.
 */
export function resolveAbilityActivation(heroId:HeroId,skillId:SkillId):AbilityActivationRule{
  return heroes[heroId].abilityActivationOverrides[skillId]??skills[skillId].activation;
}

export function heroUsesMana(heroId:HeroId){
  const economy=heroes[heroId].abilityEconomy;
  return economy.kind==='resource'&&economy.resourceId==='mana';
}
