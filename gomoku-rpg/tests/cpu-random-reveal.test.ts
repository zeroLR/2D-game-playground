import { describe,expect,it,vi } from 'vitest';
import { createMatchRuntime } from '../src/runtime/match-runtime';

describe('CPU random opponent deferred reveal',()=>{
  it('does not change CPU hero until randomizeCpuHero is explicitly resolved',()=>{
    const random=vi.fn(()=>0.99);
    const runtime=createMatchRuntime({heroId:'arcanist',cpuHeroId:'vanguard',random,schedule:setTimeout,cancel:clearTimeout,onChange:()=>{},onEvent:()=>{}});
    expect(runtime.cpuHeroId()).toBe('vanguard');
    runtime.reset();
    expect(runtime.cpuHeroId()).toBe('vanguard');
    expect(random).not.toHaveBeenCalled();
    expect(runtime.randomizeCpuHero()).toBe('architect');
    expect(runtime.cpuHeroId()).toBe('architect');
    expect(random).toHaveBeenCalledTimes(1);
    runtime.dispose();
  });
});
