import { setAbilityCondition, type AbilityActivationRule } from './ability-economy';
import type { CombatState } from './combat';
import type { Player, Pos } from './game';
import { heroes, type HeroId } from './heroes';
import { skills, type SkillId } from './skills';

/**
 * Resolves the activation rule in hero context.
 * Skill definitions own their default activation. A hero may override that rule
 * when its signature economy changes how the same tactical ability is paid for.
 */
export function resolveAbilityActivation(heroId:HeroId,skillId:SkillId):AbilityActivationRule{
  return heroes[heroId].abilityActivationOverrides[skillId]??skills[skillId].activation;
}

export function heroUsesMana(heroId:HeroId){
  const economy=heroes[heroId].abilityEconomy;
  return economy.kind==='resource'&&economy.resourceId==='mana';
}

function adjacent(a:Pos,b:Pos){return Math.max(Math.abs(a.row-b.row),Math.abs(a.col-b.col))===1;}
function hasFormationAnchor(state:CombatState,player:Player){
  return state.board.some((row,r)=>row.some((cell,c)=>{
    if(cell!==player)return false;
    const at={row:r,col:c};let neighbors=0;
    state.board.forEach((otherRow,rr)=>otherRow.forEach((other,cc)=>{if(other===player&&adjacent(at,{row:rr,col:cc}))neighbors++;}));
    return neighbors>=2;
  }));
}

/**
 * Conditional economies are derived from the live board before readiness checks.
 * This keeps Architect counterplay board-driven: breaking a formation immediately
 * closes the corresponding activation window instead of leaving a stale unlock flag.
 */
export function prepareHeroAbilityState(state:CombatState,heroId:HeroId,player:Player,skillId:SkillId):CombatState{
  if(heroId!=='architect')return state;
  const activation=resolveAbilityActivation(heroId,skillId);
  if(activation.kind!=='condition')return state;
  const context={state,player};
  let ready=false;
  if(skillId==='rally')ready=(skills.rally.legalSources?.(context).length??0)>0;
  else if(skillId==='lattice')ready=skills.lattice.legalTargets(context).length>0;
  else ready=hasFormationAnchor(state,player);
  return setAbilityCondition(state,player,activation.conditionId,ready);
}
