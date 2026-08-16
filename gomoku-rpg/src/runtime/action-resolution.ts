import { Player, Pos, isWin } from '../game';
import { CombatState, executePlace, getMana } from '../combat';
import { SkillId, isLegalPosition, skills } from '../skills';
import { HeroId } from '../heroes';
import { applyAfterPlacePassive, applyAfterSkillPassive } from '../passives';

export type ActionError='occupied'|'sealed'|'corrupted'|'forced-placement'|'invalid-skill'|'insufficient-mana'|'invalid-target';
export interface ActionResolution {
  ok:boolean;state:CombatState;consumedTurn:boolean;won:boolean;manaGained:number;passiveTriggered:boolean;passiveMana:number;at:Pos;source?:Pos;skillId?:SkillId;skillCost:number;error?:ActionError;
}
function rejected(state:CombatState,at:Pos,error:ActionError,skillId?:SkillId):ActionResolution{return {ok:false,state,consumedTurn:false,won:false,manaGained:0,passiveTriggered:false,passiveMana:0,at,skillId,skillCost:0,error};}
export function resolvePlaceAction(state:CombatState,heroId:HeroId,player:Player,at:Pos):ActionResolution{
  const result=executePlace({...state,activePlayer:player},{kind:'place',at});if(!result.ok)return rejected(state,at,result.error??'invalid-target');
  const passive=applyAfterPlacePassive(result.state,heroId,player,at,result.manaGained);
  return {ok:true,state:passive.state,consumedTurn:true,won:result.won,manaGained:result.manaGained,passiveTriggered:passive.triggered,passiveMana:passive.manaGained??0,at,skillCost:0};
}
export function resolveSkillAction(state:CombatState,heroId:HeroId,player:Player,skillId:SkillId,target:Pos,source?:Pos):ActionResolution{
  const skill=skills[skillId];if(!skill)return rejected(state,target,'invalid-skill',skillId);if(getMana(state,player)<skill.cost)return rejected(state,target,'insufficient-mana',skillId);
  const context={state,player};if(skill.legalSources&&(!source||!isLegalPosition(source,skill.legalSources(context))))return rejected(state,target,'invalid-target',skillId);if(!isLegalPosition(target,skill.legalTargets(context,source)))return rejected(state,target,'invalid-target',skillId);
  const executed=skill.execute(context,target,source);const passive=applyAfterSkillPassive(executed,heroId,player);const won=passive.state.board[target.row]?.[target.col]===player&&isWin(passive.state.board,target,player);
  return {ok:true,state:passive.state,consumedTurn:skill.consumesTurn,won,manaGained:0,passiveTriggered:passive.triggered,passiveMana:passive.manaRefunded??0,at:target,source,skillId,skillCost:skill.cost};
}
