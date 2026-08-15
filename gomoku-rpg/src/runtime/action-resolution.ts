import { Player, Pos } from '../game';
import { CombatState, executePlace, getMana } from '../combat';
import { SkillId, isLegalPosition, skills } from '../skills';
import { HeroId } from '../heroes';
import { applyAfterPlacePassive, applyAfterSkillPassive } from '../passives';

export type ActionError='occupied'|'sealed'|'corrupted'|'invalid-skill'|'insufficient-mana'|'invalid-target';

/**
 * The single result shape every player action produces. Pure data: this layer never touches
 * PixiJS, timers or telemetry counters, it only reports what the rules decided.
 */
export interface ActionResolution {
  ok:boolean;
  state:CombatState;
  /** false keeps the turn with the caster (free action); true hands the turn over. */
  consumedTurn:boolean;
  won:boolean;
  /** Pattern Mana granted by a placement. */
  manaGained:number;
  passiveTriggered:boolean;
  /** Mana the hero passive granted or refunded on top of the action itself. */
  passiveMana:number;
  /** Intersection the action resolved on, used for board feedback. */
  at:Pos;
  skillId?:SkillId;
  skillCost:number;
  error?:ActionError;
}

function rejected(state:CombatState,at:Pos,error:ActionError,skillId?:SkillId):ActionResolution{
  return {ok:false,state,consumedTurn:false,won:false,manaGained:0,passiveTriggered:false,passiveMana:0,at,skillId,skillCost:0,error};
}

export function resolvePlaceAction(state:CombatState,heroId:HeroId,player:Player,at:Pos):ActionResolution{
  const result=executePlace(state,{kind:'place',at});
  if(!result.ok)return rejected(state,at,result.error??'invalid-target');
  const passive=applyAfterPlacePassive(result.state,heroId,player,at,result.manaGained);
  return {ok:true,state:passive.state,consumedTurn:true,won:result.won,manaGained:result.manaGained,passiveTriggered:passive.triggered,passiveMana:passive.manaGained??0,at,skillCost:0};
}

export function resolveSkillAction(state:CombatState,heroId:HeroId,player:Player,skillId:SkillId,target:Pos,source?:Pos):ActionResolution{
  const skill=skills[skillId];
  if(!skill)return rejected(state,target,'invalid-skill',skillId);
  if(getMana(state,player)<skill.cost)return rejected(state,target,'insufficient-mana',skillId);
  const context={state,player};
  if(skill.legalSources&&(!source||!isLegalPosition(source,skill.legalSources(context))))return rejected(state,target,'invalid-target',skillId);
  if(!isLegalPosition(target,skill.legalTargets(context,source)))return rejected(state,target,'invalid-target',skillId);
  const executed=skill.execute(context,target,source);
  const passive=applyAfterSkillPassive(executed,heroId,player);
  return {ok:true,state:passive.state,consumedTurn:skill.consumesTurn,won:false,manaGained:0,passiveTriggered:passive.triggered,passiveMana:passive.manaRefunded??0,at:target,skillId,skillCost:skill.cost};
}
