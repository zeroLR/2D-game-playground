import { describe, expect, it } from 'vitest';
import { createCombatState, executePlace, expireEffectsAfterTurn, getMana, isGuarded, isSealed } from '../src/combat';
import { createBoard } from '../src/game';
import { blinkSkill, guardSkill, isLegalPosition, sealSkill } from '../src/skills';
import { applyAfterPlacePassive, applyAfterSkillPassive } from '../src/passives';

describe('M1 turn action model',()=>{
 it('valid placement consumes one action and grants Mana',()=>{const board=createBoard();board[4][2]=board[4][3]=1;const result=executePlace(createCombatState(board),{kind:'place',at:{row:4,col:4}});expect(result.ok).toBe(true);expect(result.consumedTurn).toBe(true);expect(result.manaGained).toBe(1);});
 it('invalid placement does not consume turn',()=>{const board=createBoard();board[4][4]=2;const result=executePlace(createCombatState(board),{kind:'place',at:{row:4,col:4}});expect(result.ok).toBe(false);expect(result.consumedTurn).toBe(false);});
});
describe('M1 persistent skills',()=>{
 it('Blink moves a stone and spends Mana',()=>{const board=createBoard();board[4][4]=1;const state=createCombatState(board,2);const next=blinkSkill.execute({state,player:1},{row:5,col:5},{row:4,col:4});expect(next.board[4][4]).toBe(0);expect(next.board[5][5]).toBe(1);expect(next.mana).toBe(0);});
 it('Guard marks a friendly stone through the opponent turn',()=>{const board=createBoard();board[4][4]=1;const state=createCombatState(board,2);const guarded=guardSkill.execute({state,player:1},{row:4,col:4});expect(isGuarded(guarded,{row:4,col:4})).toBe(true);expect(expireEffectsAfterTurn(guarded,2).guards).toHaveLength(0);});
 it('guarded stones cannot be Blink sources',()=>{const board=createBoard();board[4][4]=1;const state=guardSkill.execute({state:createCombatState(board,2),player:1},{row:4,col:4});expect(isLegalPosition({row:4,col:4},blinkSkill.legalSources?.({state,player:1})??[])).toBe(false);});
 it('Seal blocks placement until opponent completes a turn',()=>{const state=sealSkill.execute({state:createCombatState(createBoard(),2),player:1},{row:4,col:4});expect(isSealed(state,{row:4,col:4})).toBe(true);expect(executePlace({...state,activePlayer:2},{kind:'place',at:{row:4,col:4}}).error).toBe('sealed');});
});
describe('M2 Vanguard Fortified passive',()=>{
 it('guards a pattern-producing placement',()=>{const board=createBoard();board[4][2]=board[4][3]=1;const placed={row:4,col:4};const action=executePlace(createCombatState(board),{kind:'place',at:placed});const passive=applyAfterPlacePassive(action.state,'vanguard',1,placed,action.manaGained);expect(passive.triggered).toBe(true);expect(isGuarded(passive.state,placed)).toBe(true);});
});
describe('M2 Arcanist Flow passive',()=>{
 it('refunds 1 Mana after an Arcanist skill',()=>{const state=createCombatState(createBoard(),2);const spent=sealSkill.execute({state,player:1},{row:4,col:4});expect(getMana(spent,1)).toBe(0);const flow=applyAfterSkillPassive(spent,'arcanist',1);expect(flow.triggered).toBe(true);expect(flow.manaRefunded).toBe(1);expect(getMana(flow.state,1)).toBe(1);});
 it('does not refund Mana for another hero',()=>{const state=createCombatState(createBoard(),2);const spent=sealSkill.execute({state,player:1},{row:4,col:4});const flow=applyAfterSkillPassive(spent,'vanguard',1);expect(flow.triggered).toBe(false);expect(getMana(flow.state,1)).toBe(0);});
 it('never exceeds the Mana cap',()=>{const flow=applyAfterSkillPassive(createCombatState(createBoard(),5),'arcanist',1);expect(flow.triggered).toBe(false);expect(getMana(flow.state,1)).toBe(5);});
});
describe('M2 Shade Pressure passive',()=>{
 it('gains 1 Mana when Shade places adjacent to an enemy stone',()=>{const board=createBoard();board[4][4]=2;const placed={row:4,col:5};const action=executePlace(createCombatState(board),{kind:'place',at:placed});const pressure=applyAfterPlacePassive(action.state,'shade',1,placed,action.manaGained);expect(pressure.triggered).toBe(true);expect(pressure.manaGained).toBe(1);expect(getMana(pressure.state,1)).toBe(1);});
 it('does not trigger without adjacent enemy pressure',()=>{const placed={row:4,col:5};const action=executePlace(createCombatState(createBoard()),{kind:'place',at:placed});const pressure=applyAfterPlacePassive(action.state,'shade',1,placed,action.manaGained);expect(pressure.triggered).toBe(false);expect(getMana(pressure.state,1)).toBe(0);});
 it('does not trigger Pressure for another hero',()=>{const board=createBoard();board[4][4]=2;const placed={row:4,col:5};const action=executePlace(createCombatState(board),{kind:'place',at:placed});const pressure=applyAfterPlacePassive(action.state,'arcanist',1,placed,action.manaGained);expect(pressure.triggered).toBe(false);});
 it('never exceeds the Mana cap',()=>{const board=createBoard();board[4][4]=2;const placed={row:4,col:5};const action=executePlace(createCombatState(board,5),{kind:'place',at:placed});const pressure=applyAfterPlacePassive(action.state,'shade',1,placed,action.manaGained);expect(pressure.triggered).toBe(false);expect(getMana(pressure.state,1)).toBe(5);});
});