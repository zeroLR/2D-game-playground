import { describe,expect,it,vi } from 'vitest';
import { createMatchRuntime } from '../src/runtime/match-runtime';
import { CPU_BASELINE_LEVEL,CPU_LEVEL_MAX,CPU_LEVEL_MIN } from '../src/runtime/cpu-difficulty';

const runtime=()=>createMatchRuntime({heroId:'arcanist',schedule:vi.fn() as never,cancel:vi.fn(),onChange:vi.fn(),onEvent:vi.fn()});

describe('M7 CPU level selection',()=>{
  it('starts at the calibrated Lv.3 baseline',()=>{const r=runtime();expect(r.cpuLevel()).toBe(CPU_BASELINE_LEVEL);expect(r.snapshot().cpuLevel).toBe(CPU_BASELINE_LEVEL);});
  it('keeps the selected level through match reset',()=>{const r=runtime();r.selectCpuLevel(7);r.reset();expect(r.cpuLevel()).toBe(7);expect(r.snapshot().cpuLevel).toBe(7);});
  it('clamps setup selection to the public Lv.1-20 range',()=>{const r=runtime();r.selectCpuLevel(-5);expect(r.cpuLevel()).toBe(CPU_LEVEL_MIN);r.selectCpuLevel(99);expect(r.cpuLevel()).toBe(CPU_LEVEL_MAX);});
});
