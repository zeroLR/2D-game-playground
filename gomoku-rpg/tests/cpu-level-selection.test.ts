import { describe,expect,it,vi } from 'vitest';
import { createMatchRuntime } from '../src/runtime/match-runtime';
import { cpuProfileLevelForDifficulty } from '../src/runtime/cpu-difficulty-tier';

const runtime=()=>createMatchRuntime({heroId:'arcanist',schedule:vi.fn() as never,cancel:vi.fn(),onChange:vi.fn(),onEvent:vi.fn()});

describe('M7.3-R CPU difficulty selection',()=>{
  it('starts at Normal',()=>{const r=runtime();expect(r.cpuDifficulty()).toBe('normal');expect(r.snapshot().cpuDifficulty).toBe('normal');expect(r.cpuProfileLevel()).toBe(cpuProfileLevelForDifficulty('normal'));});
  it('keeps the selected difficulty through match reset',()=>{const r=runtime();r.selectCpuDifficulty('hard');r.reset();expect(r.cpuDifficulty()).toBe('hard');expect(r.snapshot().cpuDifficulty).toBe('hard');expect(r.cpuProfileLevel()).toBe(cpuProfileLevelForDifficulty('hard'));});
  it('maps every player-facing tier to a hidden internal profile',()=>{const r=runtime();for(const difficulty of ['easy','normal','hard','extreme','manic','chaos'] as const){r.selectCpuDifficulty(difficulty);expect(r.cpuProfileLevel()).toBe(cpuProfileLevelForDifficulty(difficulty));}});
});
