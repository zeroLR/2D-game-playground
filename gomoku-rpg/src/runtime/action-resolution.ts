import { canActivate, consumeActivation, legacyManaCost } from '../ability-economy';
import { Player, Pos, isWin } from '../game';
import { CombatState, executePlace, getMana, setMana } from '../combat';
import { SkillId, isLegalPosition, skills } from '../skills';
import { HeroId } from '../heroes';
import { heroUsesMana, resolveAbilityActivation } from '../hero-ability-activation';
import { applyAfterPlacePassive, applyAfterSkillPassive } from '../passives';

export type ActionError='occupied'|'sealed'|'corrupted'|'forced-placement'|'invalid-skill'|'insufficient-mana'|'insufficient-resource'|'ability-unavailable'|'invalid-target';
export interface ActionResolution {ok:boolean;state:CombatState;consumedTurn:boolean;won:boolean;manaGained:number;passiveTriggered:boolean;passiveMana:number;at:Pos;source?:Pos;skillId?:SkillId;skillCost:number;error?:ActionError;}
function rejected(state:CombatState,at:Pos,error:ActionError,skillId?:SkillId):ActionResolution{return {ok:false,state,consumedTurn:false,won:false,manaGained:0,passiveTriggered:false,passiveMana:0,at,skillId,skillCost:0,error};}
export function resolvePlaceAction(state:CombatState,heroId:HeroId,player:Player,at:Pos):ActionResolution{
  const manaBefore=getMana(state,player);
  const result=executePlace({...state,activePlayer:player},{kind:'place',at});if(!result.ok)return rejected(state,at,result.error??'invalid-target');
  const usesMana=heroUsesMana(heroId);
  const economyState=usesMana?result.state:setMana(result.state,player,manaBefore);
  const passive=applyAfterPlacePassive(economyState,heroId,player,at,result.manaGained);
  return {ok:true,state:passive.state,consumedTurn:true,won:result.won,manaGained:usesMana?result.manaGained:0,passiveTriggered:passive.triggered,passiveMana:passive.manaGained??0,at,skillCost:0};
}
export function resolveSkillAction(state:CombatState,heroId:HeroId,player:Player,skillId:SkillId,target:Pos,source?:Pos):ActionResolution{
  const skill=skills[skillId];if(!skill)return rejected(state,target,'invalid-skill',skillId);
  const activation=resolveAbilityActivation(heroId,skillId);
  const readiness=canActivate(state,player,activation,skillId);
  if(!readiness.ready){
    const error=readiness.reason==='insufficient-resource'
      ?(activation.kind==='resource'&&activation.resourceId==='mana'?'insufficient-mana':'insufficient-resource')
      :'ability-unavailable';
    return rejected(state,target,error,skillId);
  }
  const context={state,player};if(skill.legalSources&&(!source||!isLegalPosition(source,skill.legalSources(context))))return rejected(state,target,'invalid-target',skillId);if(!isLegalPosition(target,skill.legalTargets(context,source)))return rejected(state,target,'invalid-target',skillId);
  const activated=consumeActivation(state,player,activation,skillId);
  const executed=skill.execute({state:activated,player},target,source);const passive=applyAfterSkillPassive(executed,heroId,player);const won=passive.state.board[target.row]?.[target.col]===player&&isWin(passive.state.board,target,player);
  return {ok:true,state:passive.state,consumedTurn:skill.consumesTurn,won,manaGained:0,passiveTriggered:passive.triggered,passiveMana:passive.manaRefunded??0,at:target,source,skillId,skillCost:legacyManaCost(activation)};
}
