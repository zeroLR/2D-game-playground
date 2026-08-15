import { describe,expect,it } from 'vitest';
import { Cell,createBoard } from '../src/game';
import { CombatState,addSeal,createCombatState,getMana,isSealed } from '../src/combat';
import { createLoadout } from '../src/heroes';
import { getMessages } from '../src/i18n';
import { isLegalPosition,phaseSkill,skills } from '../src/skills';
import { resolveSkillAction } from '../src/runtime/action-resolution';
import { MatchEvent,createMatchRuntime } from '../src/runtime/match-runtime';

const boardWith=(cells:[number,number,Cell][])=>{const board=createBoard();cells.forEach(([r,c,v])=>{board[r][c]=v;});return board;};
function harness(initialState:()=>CombatState){const events:MatchEvent[]=[];const timers:(()=>void)[]=[];const runtime=createMatchRuntime({heroId:'arcanist',initialState,schedule:(callback)=>{timers.push(callback);return timers.length as unknown as ReturnType<typeof setTimeout>;},cancel:()=>{},onChange:()=>{},onEvent:(event)=>{events.push(event);}});return {runtime,timers,runCpu(){timers.splice(0,timers.length).forEach((callback)=>callback());}};}

describe('Phase v2',()=>{
 it('costs 2 Mana and consumes the turn',()=>{expect(phaseSkill.consumesTurn).toBe(true);expect(phaseSkill.cost).toBe(2);});
 it('moves one step and leaves the origin sealed as a temporary Rift',()=>{const source={row:4,col:4};const next=phaseSkill.execute({state:createCombatState(boardWith([[4,4,1]]),2),player:1},{row:4,col:5},source);expect(next.board[4][4]).toBe(0);expect(next.board[4][5]).toBe(1);expect(isSealed(next,source)).toBe(true);expect(getMana(next,1)).toBe(0);});
 it('cannot reach beyond one step',()=>{const legal=phaseSkill.legalTargets({state:createCombatState(boardWith([[4,4,1]]),2),player:1},{row:4,col:4});expect(legal).toContainEqual({row:3,col:3});expect(legal).not.toContainEqual({row:4,col:6});expect(legal).toHaveLength(8);});
 it('cannot move onto an occupied or sealed intersection',()=>{const state=addSeal(createCombatState(boardWith([[4,4,1],[4,5,2]]),2),{row:3,col:4},1);const legal=phaseSkill.legalTargets({state,player:1},{row:4,col:4});expect(isLegalPosition({row:4,col:5},legal)).toBe(false);expect(isLegalPosition({row:3,col:4},legal)).toBe(false);});
 it('remains the Arcanist hero skill with localized copy',()=>{expect(createLoadout('arcanist').skills).toEqual(['blink','phase']);(['en','zh-TW'] as const).forEach((locale)=>{const m=getMessages(locale);expect(typeof m.phase).toBe('string');expect(typeof m[skills.phase.descriptionKey]).toBe('string');});});
});

describe('Phase v2 resolution',()=>{
 it('consumes the turn while Flow refunds 1 Mana',()=>{const r=resolveSkillAction(createCombatState(boardWith([[4,4,1]]),2),'arcanist',1,'phase',{row:4,col:5},{row:4,col:4});expect(r.ok).toBe(true);expect(r.consumedTurn).toBe(true);expect(r.passiveTriggered).toBe(true);expect(r.passiveMana).toBe(1);expect(getMana(r.state,1)).toBe(1);});
 it('hands directly to CPU and blocks the origin during its response',()=>{const h=harness(()=>createCombatState(boardWith([[4,4,1]]),2));h.runtime.selectSkill('phase');h.runtime.tapCell({row:4,col:4});h.runtime.tapCell({row:4,col:5});const afterPhase=h.runtime.snapshot();expect(afterPhase.state.board[4][4]).toBe(0);expect(afterPhase.state.board[4][5]).toBe(1);expect(isSealed(afterPhase.state,{row:4,col:4})).toBe(true);expect(afterPhase.turn).toMatchObject({turn:2,phase:'cpu'});expect(afterPhase.acceptsInput).toBe(false);expect(afterPhase.mana).toBe(1);expect(h.timers).toHaveLength(1);h.runCpu();const afterCpu=h.runtime.snapshot();expect(afterCpu.acceptsInput).toBe(true);expect(isSealed(afterCpu.state,{row:4,col:4})).toBe(false);});
});
