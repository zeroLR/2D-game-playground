import { Player, Pos } from './game';
import { CombatState, addGuard, getMana, setMana } from './combat';
import { HeroId, heroes } from './heroes';

export type PassiveTrigger = 'after-place'|'after-skill';
export type PassiveResult = { state: CombatState; triggered: boolean; guarded?: Pos; manaRefunded?: number };

export function applyAfterPlacePassive(state:CombatState,heroId:HeroId,player:Player,placed:Pos,manaGained:number):PassiveResult {
  if (heroes[heroId].passive !== 'fortified' || manaGained <= 0) return { state, triggered:false };
  return { state:addGuard(state,placed,player), triggered:true, guarded:placed };
}

/** Flow: Arcanist recovers 1 Mana after resolving an active skill. */
export function applyAfterSkillPassive(state:CombatState,heroId:HeroId,player:Player):PassiveResult {
  if (heroes[heroId].passive !== 'flow') return { state, triggered:false };
  const before=getMana(state,player);const after=Math.min(5,before+1);
  if(after===before)return { state, triggered:false };
  return { state:setMana(state,player,after), triggered:true, manaRefunded:after-before };
}
