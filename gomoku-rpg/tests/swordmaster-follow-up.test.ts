import { describe,expect,it,vi } from 'vitest';
import { getAbilityResource,setAbilityResource } from '../src/ability-economy';
import { createCombatState } from '../src/combat';
import { createBoard } from '../src/game';
import { resolveAbilityActionTiming } from '../src/action-timing';
import { createMatchRuntime } from '../src/runtime/match-runtime';

function runtimeWith(state:ReturnType<typeof createCombatState>){return createMatchRuntime({heroId:'swordmaster',cpuHeroId:'vanguard',initialState:()=>state,schedule:vi.fn(()=>0 as unknown as ReturnType<typeof setTimeout>),cancel:vi.fn(),onChange:vi.fn(),onEvent:vi.fn()});}

describe('Swordmaster intent-based follow-up model',()=>{
  it('keeps Flow Step precommitted and Sever triggered',()=>{
    expect(resolveAbilityActionTiming('swordmaster','step')).toBe('precommit-follow-up');
    expect(resolveAbilityActionTiming('swordmaster','blink')).toBe('precommit-follow-up');
    expect(resolveAbilityActionTiming('swordmaster','sever')).toBe('triggered-follow-up');
    expect(resolveAbilityActionTiming('arcanist','blink')).toBe('primary');
  });

  it('requires Momentum to arm Flow Step',()=>{
    const board=createBoard();board[4][4]=1;
    const empty=runtimeWith(createCombatState(board));
    expect(empty.snapshot().skillBar.find((item)=>item.skillId==='step')?.enabled).toBe(false);
    empty.selectSkill('step');
    expect(empty.snapshot().pendingTechnique).toBe(null);

    const ready=runtimeWith(setAbilityResource(createCombatState(board),1,'momentum',1));
    expect(ready.snapshot().skillBar.find((item)=>item.skillId==='step')?.enabled).toBe(true);
    ready.selectSkill('step');
    expect(ready.snapshot().pendingTechnique).toBe('step');
  });

  it('preserves Momentum on a quiet placement without moving an existing stone',()=>{
    const board=createBoard();board[4][4]=1;
    const runtime=runtimeWith(setAbilityResource(createCombatState(board),1,'momentum',2));
    runtime.selectSkill('step');
    runtime.tapCell({row:0,col:0});
    const snapshot=runtime.snapshot();
    expect(snapshot.state.board[0][0]).toBe(1);
    expect(snapshot.state.board[4][4]).toBe(1);
    expect(getAbilityResource(snapshot.state,1,'momentum')).toBe(2);
    expect(snapshot.pendingTechnique).toBe(null);
    expect(snapshot.followUpOpen).toBe(false);
    expect(snapshot.turn.phase).toBe('cpu');
    expect(runtime.metrics().playerTurns).toBe(1);
    expect(runtime.metrics().skillUses.step).toBe(1);
  });

  it('ordinary quiet placement still decays Momentum and auto-ends',()=>{
    const board=createBoard();board[4][4]=1;
    const runtime=runtimeWith(setAbilityResource(createCombatState(board),1,'momentum',2));
    runtime.tapCell({row:0,col:0});
    expect(getAbilityResource(runtime.snapshot().state,1,'momentum')).toBe(1);
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
