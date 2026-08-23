import { describe,expect,it } from 'vitest';
import { getAbilityResource,setAbilityResource } from '../src/ability-economy';
import { createBoard } from '../src/game';
import { createCombatState,getMana,isCorrupted,isGuarded } from '../src/combat';
import { skills } from '../src/skills';
import { resolvePlaceAction,resolveSkillAction } from '../src/runtime/action-resolution';

describe('R1 place resolution',()=>{
 it('reports a legal placement with its pattern Mana',()=>{const b=createBoard();b[4][2]=b[4][3]=1;const r=resolvePlaceAction(createCombatState(b),'arcanist',1,{row:4,col:4});expect(r.ok).toBe(true);expect(r.consumedTurn).toBe(true);expect(r.manaGained).toBe(1);expect(r.state.board[4][4]).toBe(1);});
 it('rejects an occupied intersection without consuming the turn',()=>{const b=createBoard();b[4][4]=2;const r=resolvePlaceAction(createCombatState(b),'arcanist',1,{row:4,col:4});expect(r.ok).toBe(false);expect(r.consumedTurn).toBe(false);expect(r.error).toBe('occupied');});
 it('applies the hero passive as part of the resolution',()=>{const b=createBoard();b[4][2]=b[4][3]=1;const at={row:4,col:4};const r=resolvePlaceAction(createCombatState(b),'vanguard',1,at);expect(r.passiveTriggered).toBe(true);expect(isGuarded(r.state,at)).toBe(true);expect(r.manaGained).toBe(0);});
 it('gains Pressure adjacent to an enemy without reporting Mana gain',()=>{const b=createBoard();b[4][4]=2;const r=resolvePlaceAction(createCombatState(b),'shade',1,{row:4,col:5});expect(r.manaGained).toBe(0);expect(r.passiveMana).toBe(0);expect(getAbilityResource(r.state,1,'pressure')).toBe(1);});
 it('reports a winning placement',()=>{const b=createBoard();for(let c=0;c<4;c++)b[4][c]=1;const r=resolvePlaceAction(createCombatState(b),'arcanist',1,{row:4,col:4});expect(r.won).toBe(true);});
});

describe('R1 skill resolution',()=>{
 it('resolves Vanguard Blink without spending stored Mana',()=>{const b=createBoard();b[4][4]=1;const r=resolveSkillAction(createCombatState(b,2),'vanguard',1,'blink',{row:5,col:5},{row:4,col:4});expect(r.ok).toBe(true);expect(r.state.board[4][4]).toBe(0);expect(r.state.board[5][5]).toBe(1);expect(getMana(r.state,1)).toBe(2);});
 it('rejects an illegal target without mutating state',()=>{const b=createBoard();b[4][4]=1;b[5][5]=2;const state=createCombatState(b,2);const r=resolveSkillAction(state,'vanguard',1,'blink',{row:5,col:5},{row:4,col:4});expect(r.ok).toBe(false);expect(r.error).toBe('invalid-target');expect(r.state).toBe(state);});
 it('rejects a Mana skill the caster cannot pay for',()=>{const b=createBoard();b[4][4]=1;const r=resolveSkillAction(createCombatState(b,1),'arcanist',1,'blink',{row:5,col:5},{row:4,col:4});expect(r.ok).toBe(false);expect(r.error).toBe('insufficient-mana');});
 it('rejects a Pressure skill below its resource requirement',()=>{const b=createBoard();b[4][4]=1;const state=setAbilityResource(createCombatState(b),1,'pressure',1);const r=resolveSkillAction(state,'shade',1,'blink',{row:5,col:5},{row:4,col:4});expect(r.ok).toBe(false);expect(r.error).toBe('insufficient-resource');});
 it('rejects a two-stage skill without a legal source',()=>{const b=createBoard();b[4][4]=1;const r=resolveSkillAction(createCombatState(b,2),'vanguard',1,'blink',{row:5,col:5});expect(r.ok).toBe(false);expect(r.error).toBe('invalid-target');});
 it('applies Flow after a resolved skill',()=>{const r=resolveSkillAction(createCombatState(createBoard(),2),'arcanist',1,'seal',{row:4,col:4});expect(r.passiveTriggered).toBe(true);expect(r.passiveMana).toBe(1);expect(getMana(r.state,1)).toBe(1);});
 it('resolves Corrupt into a dead zone and spends full Pressure',()=>{const b=createBoard();b[4][4]=1;b[4][5]=2;const target={row:4,col:5};const state=setAbilityResource(createCombatState(b),1,'pressure',3);const r=resolveSkillAction(state,'shade',1,'corrupt',target);expect(r.ok).toBe(true);expect(isCorrupted(r.state,target)).toBe(true);expect(getAbilityResource(r.state,1,'pressure')).toBe(0);expect(r.skillCost).toBe(0);});
 it('reports a player victory when Charge completes five in a row',()=>{const b=createBoard();for(let c=0;c<4;c++)b[4][c]=1;b[3][4]=1;const r=resolveSkillAction(createCombatState(b),'vanguard',1,'charge',{row:4,col:4},{row:3,col:4});expect(r.ok).toBe(true);expect(r.state.board[4][4]).toBe(1);expect(r.won).toBe(true);});
});

describe('R1 turn consumption',()=>{
 it('reports consumedTurn from the skill definition',()=>{const b=createBoard();b[4][4]=1;b[4][5]=2;expect(resolveSkillAction(createCombatState(b),'vanguard',1,'blink',{row:5,col:5},{row:4,col:4}).consumedTurn).toBe(true);expect(resolveSkillAction(createCombatState(b),'vanguard',1,'charge',{row:5,col:4},{row:4,col:4}).consumedTurn).toBe(true);const shade=setAbilityResource(createCombatState(b),1,'pressure',3);expect(resolveSkillAction(shade,'shade',1,'corrupt',{row:4,col:5}).consumedTurn).toBe(true);});
 it('declares no free actions after Phase v2',()=>{const free=Object.values(skills).filter((skill)=>!skill.consumesTurn).map((skill)=>skill.id);expect(free).toEqual([]);});
});
