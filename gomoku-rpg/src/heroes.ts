import type { EffectTag, SkillId } from './skills';

export type HeroId='vanguard'|'arcanist'|'shade'|'architect';
export type PassiveId='fortified'|'flow'|'pressure'|'formation';
export type HeroRole='defense'|'control'|'disruption';
export type HeroTier=1|2|3;
export type PlaystyleTag='defense'|'tempo'|'control'|'zone'|'disruption'|'pressure'|'setup';

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

/** Canonical v1 loadout shape is heroId + exactly two active skills. */
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

/** @deprecated Blink is retained as a default skill, not a mandatory slot. */
export const COMMON_SKILL:SkillId='blink';

const passiveFallback:Record<HeroId,PassiveId>={vanguard:'fortified',arcanist:'flow',shade:'pressure',architect:'formation'};
function compatibilityFields(heroId:HeroId,skillIds:readonly [SkillId,SkillId]){
  const passive=heroes[heroId]?.signaturePassive??passiveFallback[heroId];
  const commonSkill=skillIds.includes(COMMON_SKILL)?COMMON_SKILL:null;
  const heroSkills=skillIds.filter((skillId)=>skillId!==COMMON_SKILL);
  return {passive,commonSkill,heroSkills,skills:[...skillIds]};
}

function initialLoadout(heroId:HeroId,passive:PassiveId,skillIds:readonly [SkillId,SkillId]):HeroLoadout{
  const commonSkill=skillIds.includes(COMMON_SKILL)?COMMON_SKILL:null;
  const heroSkills=skillIds.filter((skillId)=>skillId!==COMMON_SKILL);
  return {heroId,skillIds:[...skillIds] as [SkillId,SkillId],passive,commonSkill,heroSkills,skills:[...skillIds]};
}

const vanguardLoadout=initialLoadout('vanguard','fortified',['blink','charge']);
const arcanistLoadout=initialLoadout('arcanist','flow',['blink','phase']);
const shadeLoadout=initialLoadout('shade','pressure',['blink','corrupt']);
const architectLoadout=initialLoadout('architect','formation',['rally','lattice']);

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
  architect:{
    id:'architect',nameKey:'architect',role:'control',baseClass:'architect',tier:1,parentHeroId:null,variants:[],
    signaturePassive:'formation',skillPool:['blink','rally','lattice'],defaultLoadout:architectLoadout,
    playstyleTags:['setup','control'],synergyTags:['pattern','setup','zone'],counterTags:['disruption','reposition'],
    innatePassive:'formation',passive:'formation',heroSkills:['rally','lattice'],activeSkills:['rally','lattice'],
  },
};

export const heroIds=Object.keys(heroes) as HeroId[];

export function isSkillAccessible(heroId:HeroId,skillId:SkillId){
  return heroes[heroId].skillPool.includes(skillId);
}

export function isLegalLoadout(heroId:HeroId,skillIds:readonly SkillId[]){
  return skillIds.length===2&&new Set(skillIds).size===2&&skillIds.every((skillId)=>isSkillAccessible(heroId,skillId));
}

export function createLoadout(heroId:HeroId,skillIds:readonly SkillId[]=heroes[heroId].defaultLoadout.skillIds):HeroLoadout{
  if(!isLegalLoadout(heroId,skillIds))throw new Error(`[Gomoku RPG] Illegal loadout for ${heroId}: ${skillIds.join(',')}`);
  const canonical=[skillIds[0],skillIds[1]] as [SkillId,SkillId];
  return {heroId,skillIds:canonical,...compatibilityFields(heroId,canonical)};
}

export function tryCreateLoadout(heroId:HeroId,skillIds:readonly SkillId[]):HeroLoadout|null{
  return isLegalLoadout(heroId,skillIds)?createLoadout(heroId,skillIds):null;
}

export function isSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.skillIds.includes(skillId);}
export function isHeroSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.heroSkills.includes(skillId);}
