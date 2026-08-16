import { describe,expect,it } from 'vitest';
import { Cell,createBoard } from '../src/game';
import { addSeal,createCombatState,expireEffectsAfterTurn,getMana,isFlamed } from '../src/combat';
import { createLoadout } from '../src/heroes';
import { getMessages } from '../src/i18n';
import { isLegalPosition,phaseSkill,skills } from '../src/skills';
import { resolveSkillAction } from '../src/runtime/action-resolution';
const boardWith=(cells:[number,number,Cell][])=>{const board=createBoard();cells.forEach(([r,c,v])=>{board[r][c]=v;});return board;};
describe('M2.4d Arcanist Flame prototype',()=>{
 it('costs 3 Mana and consumes the turn',()=>{expect(phaseSkill.consumesTurn).toBe(true);expect(phaseSkill.cost).toBe(3);});
 it('targets legal empty intersections without a source',()=>{const state=createCombatState(boardWith([[4,4,1],[4,5,2]]),3);const legal=phaseSkill.legalTargets({state,player:1});expect(phaseSkill.legalSources).toBeUndefined();expect(isLegalPosition({row:0,col:0},legal)).toBe(true);expect(isLegalPosition({row:4,col:4},legal)).toBe(false);});
 it('cannot target an already sealed intersection',()=>{const state=addSeal(createCombatState(createBoard(),3),{row:3,col:4},1);expect(isLegalPosition({row:3,col:4},phaseSkill.legalTargets({state,player:1}))).toBe(false);});
 it('places a stone and flames the four orthogonal empty neighbours',()=>{const target={row:4,col:4};const next=phaseSkill.execute({state:createCombatState(createBoard(),3),player:1},target);expect(next.board[4][4]).toBe(1);expect(getMana(next,1)).toBe(0);expect(next.flames.map((f)=>f.pos)).toEqual(expect.arrayContaining([{row:3,col:4},{row:5,col:4},{row:4,col:3},{row:4,col:5}]));expect(next.flames).toHaveLength(4);});
 it('flame blocks both players through the opponent turn and then expires',()=>{const next=phaseSkill.execute({state:createCombatState(createBoard(),3),player:1},{row:4,col:4});expect(isFlamed(next,{row:4,col:5})).toBe(true);const expired=expireEffectsAfterTurn({...next,activePlayer:2},2);expect(isFlamed(expired,{row:4,col:5})).toBe(false);});
 it('can win by placing the Flame stone',()=>{const state=createCombatState(boardWith([[4,0,1],[4,1,1],[4,2,1],[4,3,1]]),3);const r=resolveSkillAction(state,'arcanist',1,'phase',{row:4,col:4});expect(r.ok).toBe(true);expect(r.won).toBe(true);expect(r.passiveTriggered).toBe(true);expect(getMana(r.state,1)).toBe(1);});
 it('keeps the legacy phase id only for telemetry compatibility',()=>{expect(createLoadout('arcanist').skills).toEqual(['blink','phase']);(['en','zh-TW'] as const).forEach((locale)=>{const m=getMessages(locale);expect(m.phase).toMatch(locale==='en'?/FLAME/:/烈焰/);expect(typeof m[skills.phase.descriptionKey]).toBe('string');});});
});
