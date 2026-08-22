import { describe, expect, it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState, setMana } from '../src/combat';
import { createMatchRuntime } from '../src/runtime/match-runtime';
import { easyStoryRuntimeRules } from '../src/story/easy-teaching-runtime';

function runtimeForE11(){
  const callbacks:Array<()=>void>=[];
  const runtime=createMatchRuntime({
    heroId:'vanguard',
    cpuHeroId:'vanguard',
    cpuLevel:1,
    initialState:()=>setMana(setMana(createCombatState(createBoard()),1,10),2,10),
    schedule:(callback)=>{callbacks.push(callback);return 0 as ReturnType<typeof setTimeout>;},
    cancel:()=>{},
    onChange:()=>{},
    onEvent:()=>{},
    random:()=>0,
  });
  const rules=easyStoryRuntimeRules('E1-1');
  runtime.setPolicy({playerSkillsEnabled:rules.playerSkillsEnabled,cpuSkillsEnabled:rules.cpuSkillsEnabled});
  runtime.reset();
  return {runtime,callbacks};
}

describe('E1-1 match runtime policy integration',()=>{
  it('removes player skills from the runtime surface and ignores skill selection',()=>{
    const {runtime}=runtimeForE11();
    expect(runtime.snapshot().skillBar).toEqual([]);
    runtime.selectSkill('charge');
    expect(runtime.snapshot().highlights.sources).toEqual([]);
    expect(runtime.snapshot().highlights.targets).toEqual([]);
  });

  it('prevents CPU skill candidates even when CPU has enough mana',()=>{
    const {runtime,callbacks}=runtimeForE11();
    runtime.tapCell({row:7,col:7});
    expect(callbacks).toHaveLength(1);
    callbacks[0]();
    const cpuAction=runtime.snapshot().actionHistory.find(entry=>entry.actor==='cpu');
    expect(cpuAction?.kind).toBe('place');
    expect(cpuAction?.decision?.topCandidates.every(candidate=>candidate.action.kind==='place')).toBe(true);
  });
});
