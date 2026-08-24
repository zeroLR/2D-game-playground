import { describe,expect,it,vi } from 'vitest';
import { setAbilityResource } from '../src/ability-economy';
import { createCombatState } from '../src/combat';
import { createBoard } from '../src/game';
import { resolveAbilityActionTiming } from '../src/action-timing';
import { createMatchRuntime } from '../src/runtime/match-runtime';

function runtimeWith(state:ReturnType<typeof createCombatState>){
  return createMatchRuntime({heroId:'swordmaster',cpuHeroId:'vanguard',initialState:()=>state,schedule:vi.fn(()=>0 as unknown as ReturnType<typeof setTimeout>),cancel:vi.fn(),onChange:vi.fn(),onEvent:vi.fn()});
}

describe('Swordmaster follow-up action model',()=>{
  it('interprets the whole Swordmaster kit as post-placement follow-ups',()=>{
    expect(resolveAbilityActionTiming('swordmaster','step')).toBe('follow-up');
    expect(resolveAbilityActionTiming('swordmaster','sever')).toBe('follow-up');
    expect(resolveAbilityActionTiming('swordmaster','blink')).toBe('follow-up');
    expect(resolveAbilityActionTiming('arcanist','blink')).toBe('primary');
  });

  it('keeps follow-up skills locked until a normal placement and allows skipping',()=>{
    const board=createBoard();board[4][4]=1;
    const runtime=runtimeWith(setAbilityResource(createCombatState(board),1,'momentum',2));
    expect(runtime.snapshot().skillBar.every((item)=>!item.enabled)).toBe(true);
    runtime.tapCell({row:0,col:0});
    expect(runtime.snapshot().followUpOpen).toBe(true);
    expect(runtime.snapshot().turn.phase).toBe('player');
    expect(runtime.snapshot().skillBar.find((item)=>item.skillId==='step')?.enabled).toBe(true);
    runtime.endFollowUp();
    expect(runtime.snapshot().followUpOpen).toBe(false);
    expect(runtime.snapshot().turn.phase).toBe('cpu');
  });

  it('lets Sever follow a placement without sacrificing that placement',()=>{
    const board=createBoard();board[4][2]=1;board[4][3]=1;board[5][4]=2;
    const runtime=runtimeWith(setAbilityResource(createCombatState(board),1,'momentum',3));
    runtime.tapCell({row:4,col:4});
    expect(runtime.snapshot().followUpOpen).toBe(true);
    expect(runtime.snapshot().state.board[4][4]).toBe(1);
    expect(runtime.snapshot().skillBar.find((item)=>item.skillId==='sever')?.enabled).toBe(true);
    runtime.selectSkill('sever');
    runtime.tapCell({row:4,col:4});
    runtime.tapCell({row:5,col:4});
    const snapshot=runtime.snapshot();
    expect(snapshot.state.board[4][4]).toBe(1);
    expect(snapshot.state.board[5][4]).toBe(0);
    expect(snapshot.state.board[6][4]).toBe(2);
    expect(snapshot.followUpOpen).toBe(false);
    expect(snapshot.turn.phase).toBe('cpu');
    expect(runtime.metrics().playerTurns).toBe(1);
    expect(runtime.metrics().skillUses.sever).toBe(1);
  });
});
