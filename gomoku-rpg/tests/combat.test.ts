import { describe,expect,it } from 'vitest';
import { createCombatState,executePlace,expireEffectsAfterTurn,getMana,isCorrupted,isGuarded,isSealed } from '../src/combat';
import { createBoard } from '../src/game';
import { bulwarkSkill,corruptSkill,guardSkill,isLegalPosition,sealSkill } from '../src/skills';
import { applyAfterPlacePassive } from '../src/passives';
import { resolveSkillAction } from '../src/runtime/action-resolution';

describe('M1 turn action model',()=>{
 it('valid placement consumes one action and grants Mana',()=>{const b=createBoard();b[4][2]=b[4][3]=1;const r=executePlace(createCombatState(b),{kind:'place',at:{row:4,col:4}});expect(r.ok).toBe(true);expect(r.consumedTurn).toBe(true);expect(r.manaGained).toBe(1);});
 it('invalid placement does not consume turn',()=>{const b=createBoard();b[4][4]=2;expect(executePlace(createCombatState(b),{kind:'place',at:{row:4,col:4}}).consumedTurn).toBe(false);});
});

describe('M1 persistent skills',()=>{
 it('Vanguard Blink moves a stone without spending Mana',()=>{const b=createBoard();b[4][4]=1;const r=resolveSkillAction(createCombatState(b,2),'vanguard',1,'blink',{row:5,col:5},{row:4,col:4});expect(r.ok).toBe(true);expect(r.state.board[4][4]).toBe(0);expect(r.state.board[5][5]).toBe(1);expect(getMana(r.state,1)).toBe(2);});
 it('Guard marks a friendly stone through the opponent turn',()=>{const b=createBoard();b[4][4]=1;const g=guardSkill.execute({state:createCombatState(b,2),player:1},{row:4,col:4});expect(isGuarded(g,{row:4,col:4})).toBe(true);expect(expireEffectsAfterTurn(g,2).guards).toHaveLength(0);});
 it('Seal blocks placement',()=>{const s=sealSkill.execute({state:createCombatState(createBoard(),2),player:1},{row:4,col:4});expect(isSealed(s,{row:4,col:4})).toBe(true);});
});

describe('M2 passives',()=>{
 it('Fortified guards a pattern placement',()=>{const b=createBoard();b[4][2]=b[4][3]=1;const p={row:4,col:4};const a=executePlace(createCombatState(b),{kind:'place',at:p});expect(isGuarded(applyAfterPlacePassive(a.state,'vanguard',1,p,a.manaGained).state,p)).toBe(true);});
 it('Flow refunds Mana after activation spending',()=>{const r=resolveSkillAction(createCombatState(createBoard(),2),'arcanist',1,'seal',{row:4,col:4});expect(r.ok).toBe(true);expect(getMana(r.state,1)).toBe(1);});
 it('Pressure gains Mana adjacent to enemy',()=>{const b=createBoard();b[4][4]=2;const p={row:4,col:5};const a=executePlace(createCombatState(b),{kind:'place',at:p});expect(applyAfterPlacePassive(a.state,'shade',1,p,a.manaGained).manaGained).toBe(1);});
});

describe('M2.4 Shade Corrupted Zone',()=>{
 it('Corrupt removes the target and creates a blocked intersection',()=>{const b=createBoard();b[4][4]=1;b[4][5]=2;const target={row:4,col:5};const r=resolveSkillAction(createCombatState(b,3),'shade',1,'corrupt',target);expect(r.ok).toBe(true);expect(r.state.board[4][5]).toBe(0);expect(isCorrupted(r.state,target)).toBe(true);expect(isSealed(r.state,target)).toBe(true);expect(getMana(r.state,1)).toBe(0);});
});

describe('M2.4 Vanguard Bulwark',()=>{
 it('requires a friendly stone connected to another friendly stone',()=>{const b=createBoard();b[4][4]=1;let s=createCombatState(b,3);expect(bulwarkSkill.legalTargets({state:s,player:1})).toEqual([]);b[4][5]=1;s=createCombatState(b,3);expect(bulwarkSkill.legalTargets({state:s,player:1})).toContainEqual({row:4,col:4});});
 it('guards the target and adjacent friendly cluster without spending Mana',()=>{const b=createBoard();b[4][4]=1;b[4][5]=1;b[5][5]=1;b[7][7]=1;const r=resolveSkillAction(createCombatState(b,3),'vanguard',1,'bulwark',{row:4,col:4});expect(r.ok).toBe(true);expect(isGuarded(r.state,{row:4,col:4})).toBe(true);expect(isGuarded(r.state,{row:4,col:5})).toBe(true);expect(isGuarded(r.state,{row:5,col:5})).toBe(true);expect(isGuarded(r.state,{row:7,col:7})).toBe(false);expect(getMana(r.state,1)).toBe(3);});
 it('protected stones cannot be Corrupted',()=>{const b=createBoard();b[4][4]=2;b[4][5]=2;b[5][4]=1;const s=bulwarkSkill.execute({state:createCombatState(b,3,2),player:2},{row:4,col:4});expect(isLegalPosition({row:4,col:4},corruptSkill.legalTargets({state:s,player:1}))).toBe(false);});
});
