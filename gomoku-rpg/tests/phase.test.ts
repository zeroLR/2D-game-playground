import { describe,expect,it } from 'vitest';
import { Cell,createBoard } from '../src/game';
import { CombatState,addSeal,createCombatState,getMana } from '../src/combat';
import { createLoadout } from '../src/heroes';
import { getMessages } from '../src/i18n';
import { isLegalPosition,phaseSkill,skills } from '../src/skills';
import { resolveSkillAction } from '../src/runtime/action-resolution';
import { MatchEvent,createMatchRuntime } from '../src/runtime/match-runtime';

const boardWith=(cells:[number,number,Cell][])=>{const board=createBoard();cells.forEach(([r,c,v])=>{board[r][c]=v;});return board;};

function harness(initialState:()=>CombatState){
  const events:MatchEvent[]=[];const timers:(()=>void)[]=[];
  const runtime=createMatchRuntime({
    heroId:'arcanist',initialState,
    schedule:(callback)=>{timers.push(callback);return timers.length as unknown as ReturnType<typeof setTimeout>;},
    cancel:()=>{},onChange:()=>{},onEvent:(event)=>{events.push(event);},
  });
  return {runtime,timers,runCpu(){timers.splice(0,timers.length).forEach((callback)=>callback());}};
}

describe('R8 Phase skill',()=>{
 it('is a free action that costs 3 Mana',()=>{expect(phaseSkill.consumesTurn).toBe(false);expect(phaseSkill.cost).toBe(3);});
 it('moves a stone one step to an adjacent empty intersection',()=>{
  const next=phaseSkill.execute({state:createCombatState(boardWith([[4,4,1]]),3),player:1},{row:4,col:5},{row:4,col:4});
  expect(next.board[4][4]).toBe(0);expect(next.board[4][5]).toBe(1);expect(getMana(next,1)).toBe(0);
 });
 it('cannot reach beyond one step',()=>{
  const legal=phaseSkill.legalTargets({state:createCombatState(boardWith([[4,4,1]]),3),player:1},{row:4,col:4});
  expect(legal).toContainEqual({row:3,col:3});
  expect(legal).not.toContainEqual({row:4,col:6});
  expect(legal).toHaveLength(8);
 });
 it('cannot move onto an occupied, sealed or corrupted intersection',()=>{
  const state=addSeal(createCombatState(boardWith([[4,4,1],[4,5,2]]),3),{row:3,col:4},1);
  const legal=phaseSkill.legalTargets({state,player:1},{row:4,col:4});
  expect(isLegalPosition({row:4,col:5},legal)).toBe(false);
  expect(isLegalPosition({row:3,col:4},legal)).toBe(false);
 });
 it('offers no source when a stone is boxed in',()=>{
  const board=createBoard();
  [[3,3],[3,4],[3,5],[4,3],[4,5],[5,3],[5,4],[5,5]].forEach(([r,c])=>{board[r][c]=2;});
  board[4][4]=1;
  expect(phaseSkill.legalSources?.({state:createCombatState(board,3),player:1})).toEqual([]);
 });
 it('is the Arcanist hero skill and ships localized copy',()=>{
  expect(createLoadout('arcanist').skills).toEqual(['blink','phase']);
  (['en','zh-TW'] as const).forEach((locale)=>{
   const m=getMessages(locale);
   expect(typeof m.phase).toBe('string');
   expect(typeof m[skills.phase.descriptionKey]).toBe('string');
  });
 });
});

describe('R8 free action resolution',()=>{
 it('resolves without consuming the turn and still triggers Flow',()=>{
  const r=resolveSkillAction(createCombatState(boardWith([[4,4,1]]),3),'arcanist',1,'phase',{row:4,col:5},{row:4,col:4});
  expect(r.ok).toBe(true);
  expect(r.consumedTurn).toBe(false);
  expect(r.passiveTriggered).toBe(true);
  expect(r.passiveMana).toBe(1);
  expect(getMana(r.state,1)).toBe(1);
 });
 it('keeps every other skill turn consuming',()=>{
  const r=resolveSkillAction(createCombatState(boardWith([[4,4,1]]),2),'arcanist',1,'blink',{row:7,col:7},{row:4,col:4});
  expect(r.consumedTurn).toBe(true);
 });
});

describe('R8 Phase in the match runtime',()=>{
 it('Phase -> Flow -> normal placement -> CPU turn',()=>{
  const h=harness(()=>createCombatState(boardWith([[4,4,1]]),3));
  h.runtime.selectSkill('phase');
  h.runtime.tapCell({row:4,col:4});
  h.runtime.tapCell({row:4,col:5});

  // free action: same turn, player still has input, Flow refunded 1 Mana
  const afterPhase=h.runtime.snapshot();
  expect(afterPhase.state.board[4][4]).toBe(0);
  expect(afterPhase.state.board[4][5]).toBe(1);
  expect(afterPhase.turn).toMatchObject({turn:1,phase:'player'});
  expect(afterPhase.acceptsInput).toBe(true);
  expect(afterPhase.mana).toBe(1);
  expect(afterPhase.status).toBe('yourTurn');
  expect(h.timers).toHaveLength(0);

  // the normal placement still happens this turn and hands over to the CPU
  h.runtime.tapCell({row:6,col:6});
  const afterPlace=h.runtime.snapshot();
  expect(afterPlace.state.board[6][6]).toBe(1);
  expect(afterPlace.turn).toMatchObject({turn:2,phase:'cpu'});
  expect(h.timers).toHaveLength(1);
  h.runCpu();
  expect(h.runtime.snapshot().acceptsInput).toBe(true);
 });
 it('a turn-consuming skill still ends the turn',()=>{
  const h=harness(()=>createCombatState(boardWith([[4,4,1]]),2));
  h.runtime.selectSkill('blink');
  h.runtime.tapCell({row:4,col:4});
  h.runtime.tapCell({row:7,col:7});
  expect(h.runtime.snapshot().turn).toMatchObject({turn:2,phase:'cpu'});
 });
 it('does not expire timed effects on a free action',()=>{
  const h=harness(()=>addSeal(createCombatState(boardWith([[4,4,1]]),3),{row:0,col:0},1));
  h.runtime.selectSkill('phase');
  h.runtime.tapCell({row:4,col:4});
  h.runtime.tapCell({row:5,col:5});
  expect(h.runtime.snapshot().state.seals).toHaveLength(1);
 });
});
