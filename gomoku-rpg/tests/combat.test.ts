import { describe, expect, it } from 'vitest';
import { createCombatState, executePlace, expireEffectsAfterTurn, isGuarded, isSealed } from '../src/combat';
import { createBoard } from '../src/game';
import { blinkSkill, guardSkill, isLegalPosition, sealSkill } from '../src/skills';
import { applyAfterPlacePassive } from '../src/passives';

describe('M1 turn action model',()=>{
 it('valid placement consumes one action and grants Mana',()=>{const board=createBoard();board[4][2]=board[4][3]=1;const result=executePlace(createCombatState(board),{kind:'place',at:{row:4,col:4}});expect(result.ok).toBe(true);expect(result.consumedTurn).toBe(true);expect(result.manaGained).toBe(1);});
 it('invalid placement does not consume turn',()=>{const board=createBoard();board[4][4]=2;const result=executePlace(createCombatState(board),{kind:'place',at:{row:4,col:4}});expect(result.ok).toBe(false);expect(result.consumedTurn).toBe(false);});
});

describe('M1 persistent skills',()=>{
 it('Blink moves a stone and spends Mana',()=>{const board=createBoard();board[4][4]=1;const state=createCombatState(board,2);const next=blinkSkill.execute({state,player:1},{row:5,col:5},{row:4,col:4});expect(board[4][4]).toBe(1);expect(next.board[4][4]).toBe(0);expect(next.board[5][5]).toBe(1);expect(next.mana).toBe(0);});
 it('Guard marks a friendly stone through the opponent turn',()=>{const board=createBoard();board[4][4]=1;const state=createCombatState(board,2);const guarded=guardSkill.execute({state,player:1},{row:4,col:4});expect(isGuarded(guarded,{row:4,col:4})).toBe(true);expect(expireEffectsAfterTurn(guarded,1).guards).toHaveLength(1);expect(expireEffectsAfterTurn(guarded,2).guards).toHaveLength(0);});
 it('guarded stones cannot be Blink sources',()=>{const board=createBoard();board[4][4]=1;const state=guardSkill.execute({state:createCombatState(board,2),player:1},{row:4,col:4});expect(isLegalPosition({row:4,col:4},blinkSkill.legalSources?.({state,player:1})??[])).toBe(false);});
 it('Seal blocks placement until opponent completes a turn',()=>{const state=sealSkill.execute({state:createCombatState(createBoard(),2),player:1},{row:4,col:4});expect(isSealed(state,{row:4,col:4})).toBe(true);expect(executePlace({...state,activePlayer:2},{kind:'place',at:{row:4,col:4}}).error).toBe('sealed');expect(isSealed(expireEffectsAfterTurn(state,2),{row:4,col:4})).toBe(false);});
});

describe('M2 Vanguard Fortified passive',()=>{
 it('guards the newly placed stone when Vanguard earns pattern Mana',()=>{const board=createBoard();board[4][2]=board[4][3]=1;const placed={row:4,col:4};const action=executePlace(createCombatState(board),{kind:'place',at:placed});expect(action.manaGained).toBe(1);const passive=applyAfterPlacePassive(action.state,'vanguard',1,placed,action.manaGained);expect(passive.triggered).toBe(true);expect(isGuarded(passive.state,placed)).toBe(true);});
 it('does not trigger on ordinary Vanguard placement',()=>{const placed={row:4,col:4};const action=executePlace(createCombatState(createBoard()),{kind:'place',at:placed});const passive=applyAfterPlacePassive(action.state,'vanguard',1,placed,action.manaGained);expect(passive.triggered).toBe(false);expect(isGuarded(passive.state,placed)).toBe(false);});
 it('does not grant Fortified to another hero',()=>{const board=createBoard();board[4][2]=board[4][3]=1;const placed={row:4,col:4};const action=executePlace(createCombatState(board),{kind:'place',at:placed});const passive=applyAfterPlacePassive(action.state,'arcanist',1,placed,action.manaGained);expect(passive.triggered).toBe(false);expect(isGuarded(passive.state,placed)).toBe(false);});
});