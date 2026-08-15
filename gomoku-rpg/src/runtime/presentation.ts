import { Player } from '../game';
import { CombatState, getMana } from '../combat';
import { Loadout } from '../heroes';
import { SkillId, skills } from '../skills';
import { SkillTargetingState, targetingSkill } from './targeting';
import { TurnState, isPlayerInput } from './turn-runtime';

/**
 * Presentation models: the runtime answers "can this be used / is it selected", so views
 * never re-derive rules such as `mana >= skill.cost`.
 */
export interface SkillBarItem{skillId:SkillId;cost:number;enabled:boolean;selected:boolean;descriptionKey:string}

export function describeSkillBar(state:CombatState,player:Player,loadout:Loadout,turn:TurnState,targeting:SkillTargetingState):SkillBarItem[]{
  const mana=getMana(state,player),active=targetingSkill(targeting);
  return loadout.skills.map((skillId)=>{
    const skill=skills[skillId];
    return {skillId,cost:skill.cost,enabled:isPlayerInput(turn)&&mana>=skill.cost,selected:active===skillId,descriptionKey:skill.descriptionKey};
  });
}

export type StatusKey='yourTurn'|'opponentTurn'|'selectDestination'|'victory'|'defeat'|'draw'|SkillId;

/** The single source of the status line: turn phase first, then what targeting is waiting for. */
export function statusKey(turn:TurnState,targeting:SkillTargetingState):StatusKey{
  if(turn.status!=='playing')return turn.status;
  if(turn.phase==='cpu')return 'opponentTurn';
  if(targeting.mode==='select-target'&&targeting.source)return 'selectDestination';
  return targetingSkill(targeting)??'yourTurn';
}
