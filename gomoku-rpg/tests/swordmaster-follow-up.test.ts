import { describe,expect,it,vi } from 'vitest';
import { setAbilityResource } from '../src/ability-economy';
import { createCombatState } from '../src/combat';
import { createBoard } from '../src/game';
import { resolveAbilityActionTiming } from '../src/action-timing';
import { createMatchRuntime } from '../src/runtime/match-runtime';

function runtimeWith(state:ReturnType<typeof createCombatState>){return createMatchRuntime({heroId:'swordmaster',cpuHeroId:'vanguard',initialState:()=>state,schedule:vi.fn(()=>0 as unknown as ReturnType<typeof setTimeout>),cancel:vi.fn(),onChange:vi.fn(),onEvent:vi.fn()});}

describe('Swordmaster intent-based follow-up model',()=>{
  it('splits precommitted movement from triggered Sever',()=>{
    expect(resolveAbilityActionTiming('swordmaster','step')).toBe('precommit-follow-up');
    expect(resolveAbilityActionTiming('swordmaster','blink')).toBe('precommit-follow-up');
    expect(resolveAbilityActionTiming('swordmaster','sever')).toBe('triggered-follow-up');
    expect(resolveAbilityActionTiming('arcanist','blink')).toBe('primary');
  });

  it('arms Step before placement and resolves it only after the stone is placed',()=>{
    const board=createBoard();board[4][4]=1;
    const runtime=runtimeWith(setAbilityResource(createCombatState(board),1,'momentum',2));
    expect(runtime.snapshot().skillBar.find((item)=>item.skillId==='step')?.enabled).toBe(true);
    runtime.selectSkill('step');
    expect(runtime.snapshot().pendingTechnique).toBe('step');
    expect(runtime.snapshot().followUpOpen).toBe(false);
    runtime.tapCell({row:0,col:0});
    expect(runtime.snapshot().state.board[0][0]).toBe(1);
    expect(runtime.snapshot().turn.phase).toBe('player');
    expect(runtime.snapshot().followUpOpen).toBe(false);
    runtime.tapCell({row:4,col:4});
    runtime.tapCell({row:4,col:5});
    expect(runtime.snapshot().state.board[4][4]).toBe(0);
    expect(runtime.snapshot().state.board[4][5]).toBe(1);
    expect(runtime.snapshot().turn.phase).toBe('cpu');
    expect(runtime.metrics().playerTurns).toBe(1);
  });

  it('ordinary placement auto-ends when no triggered finisher exists',()=>{
    const board=createBoard();board[4][4]=1;
    const runtime=runtimeWith(setAbilityResource(createCombatState(board),1,'momentum',1));
    runtime.tapCell({row:0,col:0});
    expect(runtime.snapshot().followUpOpen).toBe(false);
    expect(runtime.snapshot().turn.phase).toBe('cpu');
  });

  it('triggers Sever only after placement when full Momentum and a legal push exist',()=>{
    const board=createBoard();board[4][2]=1;board[4][3]=1;board[5][4]=2;
    const runtime=runtimeWith(setAbilityResource(createCombatState(board),1,'momentum',3));
    runtime.tapCell({row:4,col:4});
    expect(runtime.snapshot().followUpOpen).toBe(true);
    expect(runtime.snapshot().state.board[4][4]).toBe(1);
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

  it('allows the rare triggered Sever prompt to be skipped',()=>{
    const board=createBoard();board[4][2]=1;board[4][3]=1;board[5][4]=2;
    const runtime=runtimeWith(setAbilityResource(createCombatState(board),1,'momentum',3));
    runtime.tapCell({row:4,col:4});
    expect(runtime.snapshot().followUpOpen).toBe(true);
    runtime.endFollowUp();
    expect(runtime.snapshot().followUpOpen).toBe(false);
    expect(runtime.snapshot().turn.phase).toBe('cpu');
  });
});
