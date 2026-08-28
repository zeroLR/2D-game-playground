import { getAbilityCharge,getAbilityResource,setAbilityCharge,setAbilityResource,type ResourceId } from './ability-economy';
import { Player, Pos } from './game';
import { CombatState, addGuard, getMana, setMana } from './combat';
import { HeroId, heroes } from './heroes';

export type PassiveTrigger = 'after-place'|'after-skill';
export type PassiveResult = { state: CombatState; triggered: boolean; guarded?: Pos; manaRefunded?: number; manaGained?: number; resourceGained?:{resourceId:ResourceId;amount:number} };
export interface AfterPlacePassiveOptions{preserveMomentum?:boolean}

function hasAdjacentEnemy(state:CombatState,placed:Pos,player:Player){const enemy:Player=player===1?2:1;for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){if(dr===0&&dc===0)continue;if(state.board[placed.row+dr]?.[placed.col+dc]===enemy)return true;}return false;}
function adjacentFriendlyCount(state:CombatState,placed:Pos,player:Player){let count=0;for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){if(dr===0&&dc===0)continue;if(state.board[placed.row+dr]?.[placed.col+dc]===player)count++;}return count;}
function gainOnePressure(state:CombatState,player:Player):PassiveResult{const before=getAbilityResource(state,player,'pressure'),after=Math.min(3,before+1);if(after===before)return {state,triggered:false};return {state:setAbilityResource(state,player,'pressure',after),triggered:true,resourceGained:{resourceId:'pressure',amount:after-before}};}
function updateMomentum(state:CombatState,player:Player,patternReward:number,preserve=false):PassiveResult{
 const before=getAbilityResource(state,player,'momentum');
 if(patternReward>0){
  const after=Math.min(3,before+patternReward),charged=setAbilityCharge(state,player,'step',1);
  if(after===before)return {state:charged,triggered:false};
  return {state:setAbilityResource(charged,player,'momentum',after),triggered:true,resourceGained:{resourceId:'momentum',amount:after-before}};
 }
 if(preserve&&getAbilityCharge(state,player,'step')>0)return {state:setAbilityCharge(state,player,'step',0),triggered:false};
 const after=Math.max(0,before-1);if(after===before)return {state,triggered:false};
 return {state:setAbilityResource(state,player,'momentum',after),triggered:true,resourceGained:{resourceId:'momentum',amount:after-before}};
}

export function applyAfterPlacePassive(state:CombatState,heroId:HeroId,player:Player,placed:Pos,manaGained:number,options:AfterPlacePassiveOptions={}):PassiveResult {
  const passive=heroes[heroId].passive;
  if(passive==='fortified'){if(manaGained<=0)return {state,triggered:false};return {state:addGuard(state,placed,player),triggered:true,guarded:placed};}
  if(passive==='pressure'&&hasAdjacentEnemy(state,placed,player))return gainOnePressure(state,player);
  if(passive==='formation'&&adjacentFriendlyCount(state,placed,player)>=2)return {state,triggered:true};
  /** Momentum: attack placements gain Momentum and refresh one Flow Step charge; a charged Flow Step can protect one quiet placement. */
  if(passive==='momentum')return updateMomentum(state,player,manaGained,options.preserveMomentum);
  return {state,triggered:false};
}

/** Flow: Arcanist recovers 1 Mana after resolving an active skill. */
export function applyAfterSkillPassive(state:CombatState,heroId:HeroId,player:Player):PassiveResult {if(heroes[heroId].passive!=='flow')return {state,triggered:false};const before=getMana(state,player),after=Math.min(5,before+1);if(after===before)return {state,triggered:false};return {state:setMana(state,player,after),triggered:true,manaRefunded:after-before};}
