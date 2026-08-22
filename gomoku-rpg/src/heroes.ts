import type { EffectTag, SkillId } from './skills';

export type HeroId='vanguard'|'arcanist'|'shade';
export type PassiveId='fortified'|'flow'|'pressure';
export type HeroRole='defense'|'control'|'disruption';
export type HeroTier=1|2|3;
export type PlaystyleTag='defense'|'tempo'|'control'|'zone'|'disruption'|'pressure';

/**
 * Static hero identity/catalog data. The signature passive is authoritative;
 * loadout state contains active skills only in the target contract.
 */
export type HeroDefinition={
  id:HeroId;
  nameKey:HeroId;
  role:HeroRole;
  baseClass:HeroId;
  tier:HeroTier;
  parentHeroId:HeroId|null;
  variants:readonly HeroId[];
  signaturePassive:PassiveId;
  skillPool:readonly SkillId[];
  defaultLoadout:HeroLoadout;
  playstyleTags:readonly PlaystyleTag[];
  synergyTags:readonly EffectTag[];
  counterTags:readonly EffectTag[];
  /** @deprecated compatibility alias; use signaturePassive. */
  innatePassive:PassiveId;
  /** @deprecated compatibility alias; use signaturePassive. */
  passive:PassiveId;
  /** @deprecated compatibility alias for the old identity-owned skill model. */
  heroSkills:readonly SkillId[];
  /** @deprecated compatibility alias; use defaultLoadout.skillIds. */
  activeSkills:readonly SkillId[];
};

/**
 * Canonical v1 loadout shape is heroId + exactly two active skills.
 * Legacy aliases remain during staged runtime/UI migration.
 */
export type HeroLoadout={
  heroId:HeroId;
  skillIds:readonly [SkillId,SkillId];
  /** @deprecated compatibility alias; passives resolve from HeroDefinition. */
  passive:PassiveId;
  /** @deprecated compatibility alias for the old mandatory-common slot. */
  commonSkill:SkillId|null;
  /** @deprecated compatibility alias for the old hero-owned slot. */
  heroSkills:readonly SkillId[];
  /** @deprecated compatibility alias; use skillIds. */
  skills:readonly SkillId[];
};
export type Loadout=HeroLoadout;

/** @deprecated Blink is retained as the current default common skill, not a permanent mandatory slot. */
export const COMMON_SKILL:SkillId='blink';
const loadout=(heroId:HeroId,passive:PassiveId,heroSkill:SkillId):HeroLoadout=>({
  heroId,
  skillIds:[COMMON_SKILL,heroSkill],
  passive,
  commonSkill:COMMON_SKILL,
  heroSkills:[heroSkill],
  skills:[COMMON_SKILL,heroSkill],
});

const vanguardLoadout=loadout('vanguard','fortified','charge');
const arcanistLoadout=loadout('arcanist','flow','phase');
const shadeLoadout=loadout('shade','pressure','corrupt');

export const heroes:Record<HeroId,HeroDefinition>={
  vanguard:{
    id:'vanguard',nameKey:'vanguard',role:'defense',baseClass:'vanguard',tier:1,parentHeroId:null,variants:[],
    signaturePassive:'fortified',skillPool:['blink','guard','bulwark','charge'],defaultLoadout:vanguardLoadout,
    playstyleTags:['defense','tempo'],synergyTags:['protection','setup'],counterTags:['disruption'],
    innatePassive:'fortified',passive:'fortified',heroSkills:['charge'],activeSkills:['blink','charge'],
  },
  arcanist:{
    id:'arcanist',nameKey:'arcanist',role:'control',baseClass:'arcanist',tier:1,parentHeroId:null,variants:[],
    signaturePassive:'flow',skillPool:['blink','seal','phase'],defaultLoadout:arcanistLoadout,
    playstyleTags:['control','zone'],synergyTags:['zone','resource'],counterTags:['reposition'],
    innatePassive:'flow',passive:'flow',heroSkills:['phase'],activeSkills:['blink','phase'],
  },
  shade:{
    id:'shade',nameKey:'shade',role:'disruption',baseClass:'shade',tier:1,parentHeroId:null,variants:[],
    signaturePassive:'pressure',skillPool:['blink','corrupt'],defaultLoadout:shadeLoadout,
    playstyleTags:['disruption','pressure'],synergyTags:['remove','resource'],counterTags:['protection'],
    innatePassive:'pressure',passive:'pressure',heroSkills:['corrupt'],activeSkills:['blink','corrupt'],
  },
};

export const heroIds=Object.keys(heroes) as HeroId[];

export function isSkillAccessible(heroId:HeroId,skillId:SkillId){
  return heroes[heroId].skillPool.includes(skillId);
}

/** Domain-level legality only; runtime wiring of configurable loadouts is Slice 2. */
export function isLegalLoadout(heroId:HeroId,skillIds:readonly SkillId[]){
  return skillIds.length===2&&new Set(skillIds).size===2&&skillIds.every((skillId)=>isSkillAccessible(heroId,skillId));
}

export function createLoadout(heroId:HeroId):HeroLoadout{
  const source=heroes[heroId].defaultLoadout;
  return {...source,skillIds:[...source.skillIds] as [SkillId,SkillId],heroSkills:[...source.heroSkills],skills:[...source.skills]};
}
export function isSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.skillIds.includes(skillId);}
export function isHeroSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.heroSkills.includes(skillId);}
