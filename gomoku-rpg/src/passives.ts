import { getAbilityResource,setAbilityResource } from './ability-economy';
import { Player, Pos } from './game';
import { CombatState, addGuard, getMana, setMana } from './combat';
import { HeroId, heroes } from './heroes';

export type PassiveTrigger = 'after-place'|'after-skill';
export type PassiveResult = { state: CombatState; triggered: boolean; guarded?: Pos; manaRefunded?: number; manaGained?: number; resourceGained?:{resourceId:'pressure';amount:number} };

function hasAdjacentEnemy(state:CombatState,placed:Pos,player:Player){
  const enemy:Player=player===1?2:1;
  for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
    if(dr===0&&dc===0)continue;
    if(state.board[placed.row+dr]?.[placed.col+dc]===enemy)return true;
  }
  return false;
}
function adjacentFriendlyCount(state:CombatState,placed:Pos,player:Player){
  let count=0;
  for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
    if(dr===0&&dc===0)continue;
    if(state.board[placed.row+dr]?.[placed.col+dc]===player)count++;
  }
  return count;
}
function gainOneMana(state:CombatState,player:Player):PassiveResult{
  const before=getMana(state,player),after=Math.min(5,before+1);
  if(after===before)return {state,triggered:false};
  return {state:setMana(state,player,after),triggered:true,manaGained:after-before};
}
function gainOnePressure(state:CombatState,player:Player):PassiveResult{
  const before=getAbilityResource(state,player,'pressure'),after=Math.min(3,before+1);
  if(after===before)return {state,triggered:false};
  return {state:setAbilityResource(state,player,'pressure',after),triggered:true,resourceGained:{resourceId:'pressure',amount:after-before}};
}

export function applyAfterPlacePassive(state:CombatState,heroId:HeroId,player:Player,placed:Pos,manaGained:number):PassiveResult {
  const passive=heroes[heroId].passive;
  if(passive==='fortified'){
    if(manaGained<=0)return {state,triggered:false};
    return {state:addGuard(state,placed,player),triggered:true,guarded:placed};
  }
  /** Pressure: Shade earns its own resource by contesting enemy-adjacent space. */
  if(passive==='pressure'&&hasAdjacentEnemy(state,placed,player))return gainOnePressure(state,player);
  /** Formation: Architect remains on Mana until its conditional-economy migration. */
  if(passive==='formation'&&adjacentFriendlyCount(state,placed,player)>=2)return gainOneMana(state,player);
  return {state,triggered:false};
}

/** Flow: Arcanist recovers 1 Mana after resolving an active skill. */
export function applyAfterSkillPassive(state:CombatState,heroId:HeroId,player:Player):PassiveResult {
  if (heroes[heroId].passive !== 'flow') return { state, triggered:false };
  const before=getMana(state,player);const after=Math.min(5,before+1);
  if(after===before)return { state, triggered:false };
  return { state:setMana(state,player,after), triggered:true, manaRefunded:after-before };
}
