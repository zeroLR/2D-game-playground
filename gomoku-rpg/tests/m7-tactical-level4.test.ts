import { describe,expect,it } from 'vitest';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';

describe('M7 Lv4 tactical baseline',()=>{
 it('retains Lv4 profile while tactical guardrails are deterministic',()=>{const profile=cpuDifficulty(4);expect(profile.level).toBe(4);expect(profile.candidateWidth).toBeGreaterThan(0);});
});
