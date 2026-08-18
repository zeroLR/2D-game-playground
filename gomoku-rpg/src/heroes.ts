import { SkillId } from './skills';

export type HeroId='vanguard'|'arcanist'|'shade';
export type PassiveId='fortified'|'flow'|'pressure';
export type HeroRole='defense'|'control'|'disruption';
export type HeroTier=1|2|3;

/** Static hero identity/catalog data. Keep this independent from the equipped loadout. */
export type HeroDefinition={
  id:HeroId;
  nameKey:HeroId;
  role:HeroRole;
  baseClass:HeroId;
  tier:HeroTier;
  parentHeroId:HeroId|null;
  variants:readonly HeroId[];
  innatePassive:PassiveId;
  skillPool:readonly SkillId[];
  defaultLoadout:HeroLoadout;
  /** Compatibility aliases while runtime consumers migrate to the catalog/loadout split. */
  passive:PassiveId;
  heroSkills:readonly SkillId[];
  activeSkills:readonly SkillId[];
};

export type HeroLoadout={heroId:HeroId;passive:PassiveId;commonSkill:SkillId|null;heroSkills:readonly SkillId[];skills:readonly SkillId[]};
export type Loadout=HeroLoadout;

export const COMMON_SKILL:SkillId='blink';
const loadout=(heroId:HeroId,passive:PassiveId,heroSkill:SkillId):HeroLoadout=>({heroId,passive,commonSkill:COMMON_SKILL,heroSkills:[heroSkill],skills:[COMMON_SKILL,heroSkill]});

const vanguardLoadout=loadout('vanguard','fortified','charge');
const arcanistLoadout=loadout('arcanist','flow','phase');
const shadeLoadout=loadout('shade','pressure','corrupt');

export const heroes:Record<HeroId,HeroDefinition>={
  vanguard:{id:'vanguard',nameKey:'vanguard',role:'defense',baseClass:'vanguard',tier:1,parentHeroId:null,variants:[],innatePassive:'fortified',skillPool:['blink','charge'],defaultLoadout:vanguardLoadout,passive:'fortified',heroSkills:['charge'],activeSkills:['blink','charge']},
  arcanist:{id:'arcanist',nameKey:'arcanist',role:'control',baseClass:'arcanist',tier:1,parentHeroId:null,variants:[],innatePassive:'flow',skillPool:['blink','phase'],defaultLoadout:arcanistLoadout,passive:'flow',heroSkills:['phase'],activeSkills:['blink','phase']},
  shade:{id:'shade',nameKey:'shade',role:'disruption',baseClass:'shade',tier:1,parentHeroId:null,variants:[],innatePassive:'pressure',skillPool:['blink','corrupt'],defaultLoadout:shadeLoadout,passive:'pressure',heroSkills:['corrupt'],activeSkills:['blink','corrupt']},
};

export const heroIds=Object.keys(heroes) as HeroId[];
export function createLoadout(heroId:HeroId):HeroLoadout{const source=heroes[heroId].defaultLoadout;return{...source,heroSkills:[...source.heroSkills],skills:[...source.skills]};}
export function isSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.skills.includes(skillId);}
export function isHeroSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.heroSkills.includes(skillId);}
