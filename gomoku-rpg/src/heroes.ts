import type { AbilityActivationRule, AbilityEconomyDefinition } from './ability-economy';
import type { AbilityActionTiming } from './action-timing';
import type { EffectTag, SkillId } from './skills';

export type HeroId='vanguard'|'arcanist'|'shade'|'architect'|'swordmaster';
export type PassiveId='fortified'|'flow'|'pressure'|'formation'|'momentum';
export type HeroRole='defense'|'control'|'disruption'|'offense';
export type HeroTier=1|2|3;
export type PlaystyleTag='defense'|'tempo'|'control'|'zone'|'disruption'|'pressure'|'setup'|'momentum'|'offense';

export type HeroDefinition={
  id:HeroId;nameKey:HeroId;role:HeroRole;baseClass:HeroId;tier:HeroTier;parentHeroId:HeroId|null;variants:readonly HeroId[];
  signaturePassive:PassiveId;
  abilityEconomy:AbilityEconomyDefinition;
  abilityActivationOverrides:Partial<Record<SkillId,AbilityActivationRule>>;
  abilityActionTimingOverrides:Partial<Record<SkillId,AbilityActionTiming>>;
  skillPool:readonly SkillId[];defaultLoadout:HeroLoadout;playstyleTags:readonly PlaystyleTag[];synergyTags:readonly EffectTag[];counterTags:readonly EffectTag[];
  innatePassive:PassiveId;passive:PassiveId;heroSkills:readonly SkillId[];activeSkills:readonly SkillId[];
};
export type HeroLoadout={heroId:HeroId;skillIds:readonly [SkillId,SkillId];passive:PassiveId;commonSkill:SkillId|null;heroSkills:readonly SkillId[];skills:readonly SkillId[];};
export type Loadout=HeroLoadout;
export const COMMON_SKILL:SkillId='blink';
const LEGACY_MANA_ECONOMY:AbilityEconomyDefinition={kind:'resource',resourceId:'mana',max:5};
const VANGUARD_COOLDOWN_ECONOMY:AbilityEconomyDefinition={kind:'cooldown'};
const SHADE_PRESSURE_ECONOMY:AbilityEconomyDefinition={kind:'resource',resourceId:'pressure',max:3};
const ARCHITECT_FORMATION_ECONOMY:AbilityEconomyDefinition={kind:'conditional'};
const SWORDMASTER_MOMENTUM_ECONOMY:AbilityEconomyDefinition={kind:'momentum',resourceId:'momentum',max:3};
const VANGUARD_ACTIVATIONS:Partial<Record<SkillId,AbilityActivationRule>>={blink:{kind:'cooldown',turns:3},guard:{kind:'cooldown',turns:3},charge:{kind:'cooldown',turns:4},bulwark:{kind:'cooldown',turns:5}};
const SHADE_ACTIVATIONS:Partial<Record<SkillId,AbilityActivationRule>>={blink:{kind:'resource',resourceId:'pressure',amount:2},corrupt:{kind:'resource',resourceId:'pressure',amount:3}};
const ARCHITECT_ACTIVATIONS:Partial<Record<SkillId,AbilityActivationRule>>={blink:{kind:'condition',conditionId:'formation-ready'},rally:{kind:'condition',conditionId:'rally-ready'},lattice:{kind:'condition',conditionId:'lattice-ready'}};
const SWORDMASTER_ACTIVATIONS:Partial<Record<SkillId,AbilityActivationRule>>={blink:{kind:'resource',resourceId:'momentum',amount:2},step:{kind:'resource',resourceId:'momentum',amount:1},sever:{kind:'resource',resourceId:'momentum',amount:3}};
const SWORDMASTER_TIMING:Partial<Record<SkillId,AbilityActionTiming>>={blink:'follow-up',step:'follow-up',sever:'follow-up'};
const passiveFallback:Record<HeroId,PassiveId>={vanguard:'fortified',arcanist:'flow',shade:'pressure',architect:'formation',swordmaster:'momentum'};
function compatibilityFields(heroId:HeroId,skillIds:readonly [SkillId,SkillId]){const passive=heroes[heroId]?.signaturePassive??passiveFallback[heroId];const commonSkill=skillIds.includes(COMMON_SKILL)?COMMON_SKILL:null;const heroSkills=skillIds.filter((skillId)=>skillId!==COMMON_SKILL);return {passive,commonSkill,heroSkills,skills:[...skillIds]};}
function initialLoadout(heroId:HeroId,passive:PassiveId,skillIds:readonly [SkillId,SkillId]):HeroLoadout{const commonSkill=skillIds.includes(COMMON_SKILL)?COMMON_SKILL:null;const heroSkills=skillIds.filter((skillId)=>skillId!==COMMON_SKILL);return {heroId,skillIds:[...skillIds] as [SkillId,SkillId],passive,commonSkill,heroSkills,skills:[...skillIds]};}
const vanguardLoadout=initialLoadout('vanguard','fortified',['blink','charge']);const arcanistLoadout=initialLoadout('arcanist','flow',['blink','phase']);const shadeLoadout=initialLoadout('shade','pressure',['blink','corrupt']);const architectLoadout=initialLoadout('architect','formation',['rally','lattice']);const swordmasterLoadout=initialLoadout('swordmaster','momentum',['step','sever']);
export const heroes:Record<HeroId,HeroDefinition>={
  vanguard:{id:'vanguard',nameKey:'vanguard',role:'defense',baseClass:'vanguard',tier:1,parentHeroId:null,variants:[],signaturePassive:'fortified',abilityEconomy:VANGUARD_COOLDOWN_ECONOMY,abilityActivationOverrides:VANGUARD_ACTIVATIONS,abilityActionTimingOverrides:{},skillPool:['blink','guard','bulwark','charge'],defaultLoadout:vanguardLoadout,playstyleTags:['defense','tempo'],synergyTags:['protection','setup'],counterTags:['disruption'],innatePassive:'fortified',passive:'fortified',heroSkills:['charge'],activeSkills:['blink','charge']},
  arcanist:{id:'arcanist',nameKey:'arcanist',role:'control',baseClass:'arcanist',tier:1,parentHeroId:null,variants:[],signaturePassive:'flow',abilityEconomy:LEGACY_MANA_ECONOMY,abilityActivationOverrides:{},abilityActionTimingOverrides:{},skillPool:['blink','seal','phase'],defaultLoadout:arcanistLoadout,playstyleTags:['control','zone'],synergyTags:['zone','resource'],counterTags:['reposition'],innatePassive:'flow',passive:'flow',heroSkills:['phase'],activeSkills:['blink','phase']},
  shade:{id:'shade',nameKey:'shade',role:'disruption',baseClass:'shade',tier:1,parentHeroId:null,variants:[],signaturePassive:'pressure',abilityEconomy:SHADE_PRESSURE_ECONOMY,abilityActivationOverrides:SHADE_ACTIVATIONS,abilityActionTimingOverrides:{},skillPool:['blink','corrupt'],defaultLoadout:shadeLoadout,playstyleTags:['disruption','pressure'],synergyTags:['remove','resource'],counterTags:['protection'],innatePassive:'pressure',passive:'pressure',heroSkills:['corrupt'],activeSkills:['blink','corrupt']},
  architect:{id:'architect',nameKey:'architect',role:'control',baseClass:'architect',tier:1,parentHeroId:null,variants:[],signaturePassive:'formation',abilityEconomy:ARCHITECT_FORMATION_ECONOMY,abilityActivationOverrides:ARCHITECT_ACTIVATIONS,abilityActionTimingOverrides:{},skillPool:['blink','rally','lattice'],defaultLoadout:architectLoadout,playstyleTags:['setup','control'],synergyTags:['pattern','setup','zone'],counterTags:['disruption','reposition'],innatePassive:'formation',passive:'formation',heroSkills:['rally','lattice'],activeSkills:['rally','lattice']},
  swordmaster:{id:'swordmaster',nameKey:'swordmaster',role:'offense',baseClass:'swordmaster',tier:1,parentHeroId:null,variants:[],signaturePassive:'momentum',abilityEconomy:SWORDMASTER_MOMENTUM_ECONOMY,abilityActivationOverrides:SWORDMASTER_ACTIVATIONS,abilityActionTimingOverrides:SWORDMASTER_TIMING,skillPool:['blink','step','sever'],defaultLoadout:swordmasterLoadout,playstyleTags:['offense','tempo','momentum'],synergyTags:['pattern','tempo','reposition'],counterTags:['disruption','protection'],innatePassive:'momentum',passive:'momentum',heroSkills:['step','sever'],activeSkills:['step','sever']},
};
export const heroIds=Object.keys(heroes) as HeroId[];
export function isSkillAccessible(heroId:HeroId,skillId:SkillId){return heroes[heroId].skillPool.includes(skillId);}
export function isLegalLoadout(heroId:HeroId,skillIds:readonly SkillId[]){return skillIds.length===2&&new Set(skillIds).size===2&&skillIds.every((skillId)=>isSkillAccessible(heroId,skillId));}
export function createLoadout(heroId:HeroId,skillIds:readonly SkillId[]=heroes[heroId].defaultLoadout.skillIds):HeroLoadout{if(!isLegalLoadout(heroId,skillIds))throw new Error(`[Gomoku RPG] Illegal loadout for ${heroId}: ${skillIds.join(',')}`);const canonical=[skillIds[0],skillIds[1]] as [SkillId,SkillId];return {heroId,skillIds:canonical,...compatibilityFields(heroId,canonical)};}
export function tryCreateLoadout(heroId:HeroId,skillIds:readonly SkillId[]):HeroLoadout|null{return isLegalLoadout(heroId,skillIds)?createLoadout(heroId,skillIds):null;}
export function isSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.skillIds.includes(skillId);}
export function isHeroSkillEquipped(loadout:Loadout,skillId:SkillId){return loadout.heroSkills.includes(skillId);}
