import { describe,expect,it } from 'vitest';
import { Cell,createBoard } from '../src/game';
import { CombatState,createCombatState,getMana } from '../src/combat';
import { HeroId } from '../src/heroes';
import { MatchEvent,createMatchRuntime } from '../src/runtime/match-runtime';

/** Drives the runtime with a manual clock so the CPU turn fires when the test says so. */
function harness(heroId:HeroId='arcanist',initialState?:()=>CombatState){
  const events:MatchEvent[]=[];const timers:(()=>void)[]=[];let renders=0;
  const runtime=createMatchRuntime({
    heroId,initialState,
    schedule:(callback)=>{timers.push(callback);return timers.length as unknown as ReturnType<typeof setTimeout>;},
    cancel:()=>{},
    onChange:()=>{renders++;},
    onEvent:(event)=>{events.push(event);},
  });
  return {runtime,events,timers,renders:()=>renders,runCpu(){timers.splice(0,timers.length).forEach((callback)=>callback());},
    kinds:()=>events.map((event)=>event.kind)};
}
const boardWith=(cells:[number,number,Cell][])=>{const board=createBoard();cells.forEach(([r,c,v])=>{board[r][c]=v;});return board;};

describe('R7 match runtime loop',()=>{
 it('places a stone, hands over to the CPU, then returns input to the player',()=>{
  const h=harness();
  h.runtime.tapCell({row:4,col:4});
  expect(h.runtime.snapshot().state.board[4][4]).toBe(1);
  expect(h.runtime.snapshot().turn).toMatchObject({turn:2,phase:'cpu'});
  expect(h.runtime.snapshot().acceptsInput).toBe(false);
  expect(h.timers).toHaveLength(1);
  h.runCpu();
  const after=h.runtime.snapshot();
  expect(after.acceptsInput).toBe(true);
  expect(after.state.board.flat().filter((cell)=>cell===2)).toHaveLength(1);
 });
 it('ignores taps while the CPU holds the turn',()=>{
  const h=harness();
  h.runtime.tapCell({row:4,col:4});
  h.runtime.tapCell({row:0,col:0});
  expect(h.runtime.snapshot().state.board[0][0]).toBe(0);
 });
 it('reports an invalid tap without consuming the turn',()=>{
  const h=harness(undefined,()=>createCombatState(boardWith([[4,4,2]])));
  h.runtime.tapCell({row:4,col:4});
  expect(h.kinds()).toEqual(['invalid']);
  expect(h.runtime.snapshot().turn).toMatchObject({turn:1,phase:'player'});
 });
 it('emits move, feedback, mana and action events for a scoring placement',()=>{
  const h=harness(undefined,()=>createCombatState(boardWith([[4,2,1],[4,3,1]])));
  h.runtime.tapCell({row:4,col:4});
  expect(h.kinds()).toEqual(['move','action-feedback','mana-gain','action']);
  expect(h.events[2]).toEqual({kind:'mana-gain',amount:1,fromSkill:false});
 });
 it('ends the match on a winning placement and schedules no CPU turn',()=>{
  const h=harness(undefined,()=>createCombatState(boardWith([[4,0,1],[4,1,1],[4,2,1],[4,3,1]])));
  h.runtime.tapCell({row:4,col:4});
  expect(h.runtime.snapshot().turn.status).toBe('victory');
  expect(h.kinds()).toContain('winning-line');
  expect(h.timers).toHaveLength(0);
 });
});

describe('R7 match runtime skills',()=>{
 it('refuses to select a skill the player cannot pay for',()=>{
  const h=harness();
  h.runtime.selectSkill('blink');
  expect(h.runtime.snapshot().status).toBe('yourTurn');
 });
 it('casts Blink through source and destination and hands over the turn',()=>{
  const h=harness('vanguard',()=>createCombatState(boardWith([[4,4,1]]),2));
  h.runtime.selectSkill('blink');
  expect(h.runtime.snapshot().status).toBe('blink');
  h.runtime.tapCell({row:4,col:4});
  expect(h.runtime.snapshot().status).toBe('selectDestination');
  h.runtime.tapCell({row:6,col:6});
  const after=h.runtime.snapshot();
  expect(after.state.board[4][4]).toBe(0);
  expect(after.state.board[6][6]).toBe(1);
  expect(getMana(after.state,1)).toBe(0);
  expect(after.turn.phase).toBe('cpu');
 });
 it('keeps the skill selected after an illegal target',()=>{
  const h=harness('arcanist',()=>createCombatState(boardWith([[0,0,2],[4,4,1]]),3));
  h.runtime.selectSkill('phase');
  h.runtime.tapCell({row:0,col:0});
  expect(h.kinds()).toEqual(['invalid']);
  expect(h.runtime.snapshot().status).toBe('phase');
 });
});

describe('Slice 2 configurable runtime loadout',()=>{
 it('accepts a legal two-skill loadout without Blink',()=>{
  const h=harness('vanguard',()=>createCombatState(boardWith([[4,4,1],[4,5,1]]),5));
  expect(h.runtime.setLoadout(['guard','bulwark'])).toBe(true);
  expect(h.runtime.snapshot().loadout.skillIds).toEqual(['guard','bulwark']);
  expect(h.runtime.snapshot().skillBar.map((item)=>item.id)).toEqual(['guard','bulwark']);
 });
 it('rejects an illegal loadout and preserves the current configuration',()=>{
  const h=harness('vanguard');
  const before=[...h.runtime.snapshot().loadout.skillIds];
  expect(h.runtime.setLoadout(['charge','corrupt'])).toBe(false);
  expect(h.runtime.snapshot().loadout.skillIds).toEqual(before);
 });
 it('does not allow selecting a skill that is no longer equipped',()=>{
  const h=harness('vanguard',()=>createCombatState(boardWith([[4,4,1],[4,5,1]]),5));
  h.runtime.setLoadout(['guard','bulwark']);
  h.runtime.selectSkill('blink');
  expect(h.runtime.snapshot().status).toBe('yourTurn');
  h.runtime.selectSkill('guard');
  expect(h.runtime.snapshot().status).toBe('guard');
 });
});

describe('R7 match runtime lifecycle',()=>{
 it('reset clears the board, the metrics and the pending CPU turn',()=>{
  const h=harness();
  h.runtime.tapCell({row:4,col:4});
  h.runtime.reset();
  const after=h.runtime.snapshot();
  expect(after.state.board.flat().every((cell)=>cell===0)).toBe(true);
  expect(after.turn).toMatchObject({turn:1,phase:'player',status:'playing'});
  expect(h.runtime.metrics().placements).toBe(0);
  expect(h.kinds()).toContain('reset');
 });
 it('selectHero swaps the loadout for the next match',()=>{
  const h=harness();
  expect(h.runtime.snapshot().loadout.skills).toEqual(['blink','phase']);
  h.runtime.selectHero('shade');
  expect(h.runtime.heroId()).toBe('shade');
  expect(h.runtime.snapshot().loadout.skills).toEqual(['blink','corrupt']);
 });
 it('records placements into the playtest metrics',()=>{
  const h=harness();
  h.runtime.tapCell({row:4,col:4});
  expect(h.runtime.metrics().placements).toBe(1);
  expect(h.runtime.metrics().playerTurns).toBe(1);
 });
});
