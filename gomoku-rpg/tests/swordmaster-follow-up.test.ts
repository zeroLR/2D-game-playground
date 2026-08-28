import { describe,expect,it,vi } from 'vitest';
import { getAbilityCharge,getAbilityResource,setAbilityCharge,setAbilityResource } from '../src/ability-economy';
import { createCombatState } from '../src/combat';
import { createBoard } from '../src/game';
import { resolveAbilityActionTiming } from '../src/action-timing';
import { resolvePlaceAction } from '../src/runtime/action-resolution';
import { createMatchRuntime } from '../src/runtime/match-runtime';

function runtimeWith(state:ReturnType<typeof createCombatState>){return createMatchRuntime({heroId:'swordmaster',cpuHeroId:'vanguard',initialState:()=>state,schedule:vi.fn(()=>0 as unknown as ReturnType<typeof setTimeout>),cancel:vi.fn(),onChange:vi.fn(),onEvent:vi.fn()});}

describe('Swordmaster intent-based follow-up model',()=>{
  it('keeps Flow Step precommitted and Sever triggered',()=>{
    expect(resolveAbilityActionTiming('swordmaster','step')).toBe('precommit-follow-up');
    expect(resolveAbilityActionTiming('swordmaster','blink')).toBe('precommit-follow-up');
    expect(resolveAbilityActionTiming('swordmaster','sever')).toBe('triggered-follow-up');
    expect(resolveAbilityActionTiming('arcanist','blink')).toBe('primary');
  });

  it('earns one Flow Step charge from an attack placement and caps it at one',()=>{
    const board=createBoard();board[4][2]=board[4][3]=1;
    const first=resolvePlaceAction(createCombatState(board),'swordmaster',1,{row:4,col:4});
    expect(first.ok).toBe(true);
    expect(getAbilityCharge(first.state,1,'step')).toBe(1);
    const second=resolvePlaceAction(first.state,'swordmaster',1,{row:4,col:5});
    expect(second.ok).toBe(true);
    expect(getAbilityCharge(second.state,1,'step')).toBe(1);
  });

  it('requires a Flow Step charge rather than stored Momentum to arm',()=>{
    const board=createBoard();board[4][4]=1;
    const momentumOnly=runtimeWith(setAbilityResource(createCombatState(board),1,'momentum',3));
    expect(momentumOnly.snapshot().skillBar.find((item)=>item.skillId==='step')?.enabled).toBe(false);
    momentumOnly.selectSkill('step');
    expect(momentumOnly.snapshot().pendingTechnique).toBe(null);

    const charged=runtimeWith(setAbilityCharge(setAbilityResource(createCombatState(board),1,'momentum',2),1,'step',1));
    expect(charged.snapshot().skillBar.find((item)=>item.skillId==='step')?.enabled).toBe(true);
    charged.selectSkill('step');
    expect(charged.snapshot().pendingTechnique).toBe('step');
  });

  it('spends the charge to preserve one quiet placement, then cannot spam Flow Step',()=>{
    const board=createBoard();board[4][4]=1;
    const state=setAbilityCharge(setAbilityResource(createCombatState(board),1,'momentum',2),1,'step',1);
    const runtime=runtimeWith(state);
    runtime.selectSkill('step');
    runtime.tapCell({row:0,col:0});
    let snapshot=runtime.snapshot();
    expect(snapshot.state.board[0][0]).toBe(1);
    expect(snapshot.state.board[4][4]).toBe(1);
    expect(getAbilityResource(snapshot.state,1,'momentum')).toBe(2);
    expect(getAbilityCharge(snapshot.state,1,'step')).toBe(0);
    expect(runtime.metrics().skillUses.step).toBe(1);

    const secondTurnState={...snapshot.state,activePlayer:1 as const};
    const second=runtimeWith(secondTurnState);
    expect(second.snapshot().skillBar.find((item)=>item.skillId==='step')?.enabled).toBe(false);
    second.selectSkill('step');
    second.tapCell({row:0,col:1});
    snapshot=second.snapshot();
    expect(getAbilityResource(snapshot.state,1,'momentum')).toBe(1);
    expect(getAbilityCharge(snapshot.state,1,'step')).toBe(0);
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
