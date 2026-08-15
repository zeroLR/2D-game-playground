import { Player, Pos } from '../game';
import { CombatState } from '../combat';
import { SkillId, isLegalPosition, skills } from '../skills';

/**
 * One targeting flow for every skill. Two-stage skills (Blink / Charge) open on
 * `select-source` and advance to `select-target`; single-target skills (Seal / Corrupt)
 * open directly on `select-target`. No call site needs to know which is which.
 */
export type SkillTargetingState=
 |{mode:'idle'}
 |{mode:'select-source';skillId:SkillId}
 |{mode:'select-target';skillId:SkillId;source?:Pos};

export const IDLE_TARGETING:SkillTargetingState={mode:'idle'};
export const targetingSkill=(targeting:SkillTargetingState):SkillId|null=>targeting.mode==='idle'?null:targeting.skillId;
export const targetingSource=(targeting:SkillTargetingState):Pos|undefined=>targeting.mode==='select-target'?targeting.source:undefined;

export function beginTargeting(skillId:SkillId):SkillTargetingState{
  return skills[skillId].legalSources?{mode:'select-source',skillId}:{mode:'select-target',skillId};
}

/** Tapping the active skill again clears targeting; tapping another skill switches to it. */
export function toggleTargeting(targeting:SkillTargetingState,skillId:SkillId):SkillTargetingState{
  return targetingSkill(targeting)===skillId?IDLE_TARGETING:beginTargeting(skillId);
}

export interface TargetingHighlights{sources:Pos[];targets:Pos[]}
export function targetingHighlights(state:CombatState,player:Player,targeting:SkillTargetingState):TargetingHighlights{
  if(targeting.mode==='idle')return {sources:[],targets:[]};
  const skill=skills[targeting.skillId],context={state,player};
  if(targeting.mode==='select-source')return {sources:skill.legalSources?.(context)??[],targets:[]};
  return {sources:[],targets:skill.legalTargets(context,targeting.source)};
}

/** What a board tap means while a skill is selected. */
export type TargetingIntent=
 |{kind:'source';targeting:SkillTargetingState}
 |{kind:'cast';skillId:SkillId;target:Pos;source?:Pos}
 |{kind:'invalid'};

export function selectTargetingCell(state:CombatState,player:Player,targeting:SkillTargetingState,pos:Pos):TargetingIntent{
  if(targeting.mode==='idle')return {kind:'invalid'};
  const skill=skills[targeting.skillId],context={state,player};
  if(targeting.mode==='select-source'){
    if(!isLegalPosition(pos,skill.legalSources?.(context)??[]))return {kind:'invalid'};
    return {kind:'source',targeting:{mode:'select-target',skillId:targeting.skillId,source:pos}};
  }
  if(!isLegalPosition(pos,skill.legalTargets(context,targeting.source)))return {kind:'invalid'};
  return {kind:'cast',skillId:targeting.skillId,target:pos,source:targeting.source};
}
