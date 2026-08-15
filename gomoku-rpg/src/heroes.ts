import { SkillId } from './skills';

export type HeroId='vanguard'|'arcanist'|'shade';
export type PassiveId='fortified'|'flow'|'pressure';
export type HeroDefinition={
  id:HeroId;
  nameKey:HeroId;
  role:'defense'|'control'|'disruption';
  passive:PassiveId;
  activeSkills:readonly [SkillId,SkillId];
};

/** M2 starts data-first: passives are identity hooks and become executable one at a time. */
export const heroes:Record<HeroId,HeroDefinition>={
  vanguard:{id:'vanguard',nameKey:'vanguard',role:'defense',passive:'fortified',activeSkills:['guard','seal']},
  arcanist:{id:'arcanist',nameKey:'arcanist',role:'control',passive:'flow',activeSkills:['blink','seal']},
  shade:{id:'shade',nameKey:'shade',role:'disruption',passive:'pressure',activeSkills:['blink','guard']},
};

export type Loadout={heroId:HeroId;skills:readonly [SkillId,SkillId]};
export function createLoadout(heroId:HeroId):Loadout{const hero=heroes[heroId];return{heroId,skills:hero.activeSkills};}
export function isSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.skills.includes(skillId);}
