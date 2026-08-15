import { SkillId } from './skills';

export type HeroId='vanguard'|'arcanist'|'shade';
export type PassiveId='fortified'|'flow'|'pressure';
export type HeroDefinition={
  id:HeroId;
  nameKey:HeroId;
  role:'defense'|'control'|'disruption';
  passive:PassiveId;
  /** Hero-owned abilities. The common slot is composed into the runtime loadout separately. */
  heroSkills:readonly SkillId[];
};

/**
 * M2.4 skill architecture:
 * - one common skill slot shared by every hero
 * - hero-owned skill slots define the character's tactical identity
 *
 * During migration, Guard / Seal remain legacy hero skills so gameplay stays intact.
 * Hero-specific replacements are introduced one vertical slice at a time.
 */
export const COMMON_SKILL:SkillId='blink';
export const heroes:Record<HeroId,HeroDefinition>={
  vanguard:{id:'vanguard',nameKey:'vanguard',role:'defense',passive:'fortified',heroSkills:['guard','seal']},
  arcanist:{id:'arcanist',nameKey:'arcanist',role:'control',passive:'flow',heroSkills:['seal']},
  shade:{id:'shade',nameKey:'shade',role:'disruption',passive:'pressure',heroSkills:['guard']},
};

export type Loadout={heroId:HeroId;commonSkill:SkillId;heroSkills:readonly SkillId[];skills:readonly SkillId[]};
export function createLoadout(heroId:HeroId):Loadout{const hero=heroes[heroId];const skills=[COMMON_SKILL,...hero.heroSkills];return{heroId,commonSkill:COMMON_SKILL,heroSkills:hero.heroSkills,skills};}
export function isSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.skills.includes(skillId);}
export function isHeroSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.heroSkills.includes(skillId);}
