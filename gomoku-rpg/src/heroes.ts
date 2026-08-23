import type { AbilityActivationRule, AbilityEconomyDefinition } from './ability-economy';
import type { EffectTag, SkillId } from './skills';

export type HeroId='vanguard'|'arcanist'|'shade'|'architect';
export type PassiveId='fortified'|'flow'|'pressure'|'formation';
export type HeroRole='defense'|'control'|'disruption';
export type HeroTier=1|2|3;
export type PlaystyleTag='defense'|'tempo'|'control'|'zone'|'disruption'|'pressure'|'setup';

export type HeroDefinition={
  id:HeroId;nameKey:HeroId;role:HeroRole;baseClass:HeroId;tier:HeroTier;parentHeroId:HeroId|null;variants:readonly HeroId[];
  signaturePassive:PassiveId;
  abilityEconomy:AbilityEconomyDefinition;
  abilityActivationOverrides:Partial<Record<SkillId,AbilityActivationRule>>;
  skillPool:readonly SkillId[];defaultLoadout:HeroLoadout;playstyleTags:readonly PlaystyleTag[];synergyTags:readonly EffectTag[];counterTags:readonly EffectTag[];
  innatePassive:PassiveId;passive:PassiveId;heroSkills:readonly SkillId[];activeSkills:readonly SkillId[];
};
export type HeroLoadout={heroId:HeroId;skillIds:readonly [SkillId,SkillId];passive:PassiveId;commonSkill:SkillId|null;heroSkills:readonly SkillId[];skills:readonly SkillId[];};
export type Loadout=HeroLoadout;
export const COMMON_SKILL:SkillId='blink';
const LEGACY_MANA_ECONOMY:AbilityEconomyDefinition={kind:'resource',resourceId:'mana',max:5};
const VANGUARD_COOLDOWN_ECONOMY:AbilityEconomyDefinition={kind:'cooldown'};
const VANGUARD_ACTIVATIONS:Partial<Record<SkillId,AbilityActivationRule>>={
  blink:{kind:'cooldown',turns:3},guard:{kind:'cooldown',turns:3},charge:{kind:'cooldown',turns:4},bulwark:{kind:'cooldown',turns:5},
};
const passiveFallback:Record<HeroId,PassiveId>={vanguard:'fortified',arcanist:'flow',shade:'pressure',architect:'formation'};
function compatibilityFields(heroId:HeroId,skillIds:readonly [SkillId,SkillId]){const passive=heroes[heroId]?.signaturePassive??passiveFallback[heroId];const commonSkill=skillIds.includes(COMMON_SKILL)?COMMON_SKILL:null;const heroSkills=skillIds.filter((skillId)=>skillId!==COMMON_SKILL);return {passive,commonSkill,heroSkills,skills:[...skillIds]};}
function initialLoadout(heroId:HeroId,passive:PassiveId,skillIds:readonly [SkillId,SkillId]):HeroLoadout{const commonSkill=skillIds.includes(COMMON_SKILL)?COMMON_SKILL:null;const heroSkills=skillIds.filter((skillId)=>skillId!==COMMON_SKILL);return {heroId,skillIds:[...skillIds] as [SkillId,SkillId],passive,commonSkill,heroSkills,skills:[...skillIds]};}
const vanguardLoadout=initialLoadout('vanguard','fortified',['blink','charge']);
const arcanistLoadout=initialLoadout('arcanist','flow',['blink','phase']);
const shadeLoadout=initialLoadout('shade','pressure',['blink','corrupt']);
const architectLoadout=initialLoadout('architect','formation',['rally','lattice']);
export const heroes:Record<HeroId,HeroDefinition>={
  vanguard:{id:'vanguard',nameKey:'vanguard',role:'defense',baseClass:'vanguard',tier:1,parentHeroId:null,variants:[],signaturePassive:'fortified',abilityEconomy:VANGUARD_COOLDOWN_ECONOMY,abilityActivationOverrides:VANGUARD_ACTIVATIONS,skillPool:['blink','guard','bulwark','charge'],defaultLoadout:vanguardLoadout,playstyleTags:['defense','tempo'],synergyTags:['protection','setup'],counterTags:['disruption'],innatePassive:'fortified',passive:'fortified',heroSkills:['charge'],activeSkills:['blink','charge']},
  arcanist:{id:'arcanist',nameKey:'arcanist',role:'control',baseClass:'arcanist',tier:1,parentHeroId:null,variants:[],signaturePassive:'flow',abilityEconomy:LEGACY_MANA_ECONOMY,abilityActivationOverrides:{},skillPool:['blink','seal','phase'],defaultLoadout:arcanistLoadout,playstyleTags:['control','zone'],synergyTags:['zone','resource'],counterTags:['reposition'],innatePassive:'flow',passive:'flow',heroSkills:['phase'],activeSkills:['blink','phase']},
  shade:{id:'shade',nameKey:'shade',role:'disruption',baseClass:'shade',tier:1,parentHeroId:null,variants:[],signaturePassive:'pressure',abilityEconomy:LEGACY_MANA_ECONOMY,abilityActivationOverrides:{},skillPool:['blink','corrupt'],defaultLoadout:shadeLoadout,playstyleTags:['disruption','pressure'],synergyTags:['remove','resource'],counterTags:['protection'],innatePassive:'pressure',passive:'pressure',heroSkills:['corrupt'],activeSkills:['blink','corrupt']},
  architect:{id:'architect',nameKey:'architect',role:'control',baseClass:'architect',tier:1,parentHeroId:null,variants:[],signaturePassive:'formation',abilityEconomy:LEGACY_MANA_ECONOMY,abilityActivationOverrides:{},skillPool:['blink','rally','lattice'],defaultLoadout:architectLoadout,playstyleTags:['setup','control'],synergyTags:['pattern','setup','zone'],counterTags:['disruption','reposition'],innatePassive:'formation',passive:'formation',heroSkills:['rally','lattice'],activeSkills:['rally','lattice']},
};
export const heroIds=Object.keys(heroes) as HeroId[];
export function isSkillAccessible(heroId:HeroId,skillId:SkillId){return heroes[heroId].skillPool.includes(skillId);}
export function isLegalLoadout(heroId:HeroId,skillIds:readonly SkillId[]){return skillIds.length===2&&new Set(skillIds).size===2&&skillIds.every((skillId)=>isSkillAccessible(heroId,skillId));}
export function createLoadout(heroId:HeroId,skillIds:readonly SkillId[]=heroes[heroId].defaultLoadout.skillIds):HeroLoadout{if(!isLegalLoadout(heroId,skillIds))throw new Error(`[Gomoku RPG] Illegal loadout for ${heroId}: ${skillIds.join(',')}`);const canonical=[skillIds[0],skillIds[1]] as [SkillId,SkillId];return {heroId,skillIds:canonical,...compatibilityFields(heroId,canonical)};}
export function tryCreateLoadout(heroId:HeroId,skillIds:readonly SkillId[]):HeroLoadout|null{return isLegalLoadout(heroId,skillIds)?createLoadout(heroId,skillIds):null;}
export function isSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.skillIds.includes(skillId);}
export function isHeroSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.heroSkills.includes(skillId);}
