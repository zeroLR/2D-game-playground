import { describe, expect, it } from 'vitest';
import { createCombatState, executePlace, expireEffectsAfterTurn, isGuarded, isSealed } from '../src/combat';
import { createBoard } from '../src/game';
import { blinkSkill, guardSkill, isLegalPosition, sealSkill } from '../src/skills';

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