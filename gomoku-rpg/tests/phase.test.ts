import { describe,expect,it } from 'vitest';
import { Cell,createBoard } from '../src/game';
import { CombatState,addSeal,createCombatState,getMana,isEcho } from '../src/combat';
import { createLoadout } from '../src/heroes';
import { getMessages } from '../src/i18n';
import { isLegalPosition,phaseSkill,skills } from '../src/skills';
import { resolveSkillAction } from '../src/runtime/action-resolution';
import { MatchEvent,createMatchRuntime } from '../src/runtime/match-runtime';

const boardWith=(cells:[number,number,Cell][])=>{const board=createBoard();cells.forEach(([r,c,v])=>{board[r][c]=v;});return board;};
function harness(initialState:()=>CombatState){const events:MatchEvent[]=[];const timers:(()=>void)[]=[];const runtime=createMatchRuntime({heroId:'arcanist',initialState,schedule:(callback)=>{timers.push(callback);return timers.length as unknown as ReturnType<typeof setTimeout>;},cancel:()=>{},onChange:()=>{},onEvent:(event)=>{events.push(event);}});return {runtime,timers,runCpu(){timers.splice(0,timers.length).forEach((callback)=>callback());}};}

describe('Phase Fork Prototype',()=>{
 it('costs 3 Mana and consumes the turn',()=>{expect(phaseSkill.consumesTurn).toBe(true);expect(phaseSkill.cost).toBe(3);});
 it('projects a stone while preserving its origin as an Echo',()=>{const source={row:4,col:4};const next=phaseSkill.execute({state:createCombatState(boardWith([[4,4,1]]),3),player:1},{row:4,col:6},source);expect(next.board[4][4]).toBe(1);expect(next.board[4][6]).toBe(1);expect(isEcho(next,source)).toBe(true);expect(getMana(next,1)).toBe(0);});
 it('can target any empty intersection within Chebyshev distance 2',()=>{const legal=phaseSkill.legalTargets({state:createCombatState(boardWith([[4,4,1]]),3),player:1},{row:4,col:4});expect(legal).toContainEqual({row:2,col:2});expect(legal).toContainEqual({row:4,col:6});expect(legal).not.toContainEqual({row:4,col:7});expect(legal).toHaveLength(24);});
 it('cannot project onto an occupied or sealed intersection',()=>{const state=addSeal(createCombatState(boardWith([[4,4,1],[4,5,2]]),3),{row:3,col:4},1);const legal=phaseSkill.legalTargets({state,player:1},{row:4,col:4});expect(isLegalPosition({row:4,col:5},legal)).toBe(false);expect(isLegalPosition({row:3,col:4},legal)).toBe(false);});
 it('does not allow an Echo to become another Phase source',()=>{const source={row:4,col:4};const shifted=phaseSkill.execute({state:createCombatState(boardWith([[4,4,1]]),3),player:1},{row:4,col:6},source);expect(phaseSkill.legalSources?.({state:shifted,player:1})).not.toContainEqual(source);});
 it('remains the Arcanist hero skill with localized copy',()=>{expect(createLoadout('arcanist').skills).toEqual(['blink','phase']);(['en','zh-TW'] as const).forEach((locale)=>{const m=getMessages(locale);expect(typeof m.phase).toBe('string');expect(typeof m[skills.phase.descriptionKey]).toBe('string');});});
});

describe('Phase Fork resolution',()=>{
 it('does not win immediately even when projection visually completes five',()=>{const state=createCombatState(boardWith([[4,1,1],[4,2,1],[4,3,1],[4,4,1],[6,6,1]]),3);const r=resolveSkillAction(state,'arcanist',1,'phase',{row:4,col:5},{row:6,col:6});expect(r.ok).toBe(true);expect(r.won).toBe(false);expect(r.consumedTurn).toBe(true);expect(r.passiveTriggered).toBe(true);expect(r.passiveMana).toBe(1);expect(getMana(r.state,1)).toBe(1);expect(isEcho(r.state,{row:6,col:6})).toBe(true);});
 it('keeps the Echo through the opponent response so the caster can cash in the fork next turn',()=>{const h=harness(()=>createCombatState(boardWith([[4,4,1]]),3));h.runtime.selectSkill('phase');h.runtime.tapCell({row:4,col:4});h.runtime.tapCell({row:4,col:6});const afterPhase=h.runtime.snapshot();expect(isEcho(afterPhase.state,{row:4,col:4})).toBe(true);h.runCpu();const afterCpu=h.runtime.snapshot();expect(afterCpu.acceptsInput).toBe(true);expect(isEcho(afterCpu.state,{row:4,col:4})).toBe(true);expect(afterCpu.state.board[4][4]).toBe(1);});
 it('collapses the Echo origin after the caster completes the following action',()=>{const h=harness(()=>createCombatState(boardWith([[4,4,1]]),3));h.runtime.selectSkill('phase');h.runtime.tapCell({row:4,col:4});h.runtime.tapCell({row:4,col:6});h.runCpu();const before=h.runtime.snapshot();const target=before.state.board.flatMap((row,r)=>row.map((cell,c)=>({cell,row:r,col:c}))).find(({cell,row,col})=>cell===0&&!(row===4&&col===4));expect(target).toBeDefined();if(!target)throw new Error('expected legal follow-up placement');h.runtime.tapCell({row:target.row,col:target.col});const after=h.runtime.snapshot();expect(isEcho(after.state,{row:4,col:4})).toBe(false);expect(after.state.board[4][4]).toBe(0);});
});
