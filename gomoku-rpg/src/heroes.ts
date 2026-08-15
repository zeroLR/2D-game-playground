import { SkillId } from './skills';

export type HeroId='vanguard'|'arcanist'|'shade';
export type PassiveId='fortified'|'flow'|'pressure';
export type HeroDefinition={
  id:HeroId;
  nameKey:HeroId;
  role:'defense'|'control'|'disruption';
  passive:PassiveId;
  /** Current hero-owned abilities. Replaced by new tactical skills one vertical slice at a time. */
  heroSkills:readonly SkillId[];
  /** Compatibility/display view of the current runtime loadout. Remove after every hero migrates. */
  activeSkills:readonly SkillId[];
};

export const COMMON_SKILL:SkillId='blink';
export const heroes:Record<HeroId,HeroDefinition>={
  vanguard:{id:'vanguard',nameKey:'vanguard',role:'defense',passive:'fortified',heroSkills:['guard','seal'],activeSkills:['guard','seal']},
  arcanist:{id:'arcanist',nameKey:'arcanist',role:'control',passive:'flow',heroSkills:['seal'],activeSkills:['blink','seal']},
  shade:{id:'shade',nameKey:'shade',role:'disruption',passive:'pressure',heroSkills:['corrupt'],activeSkills:['blink','corrupt']},
};

export type Loadout={heroId:HeroId;commonSkill:SkillId|null;heroSkills:readonly SkillId[];skills:readonly SkillId[]};
export function createLoadout(heroId:HeroId):Loadout{
 const hero=heroes[heroId];
 const commonSkill=heroId==='vanguard'?null:COMMON_SKILL;
 return{heroId,commonSkill,heroSkills:hero.heroSkills,skills:hero.activeSkills};
}
export function isSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.skills.includes(skillId);}
export function isHeroSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.heroSkills.includes(skillId);}
