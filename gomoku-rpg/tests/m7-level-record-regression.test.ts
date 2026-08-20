import { describe,expect,it } from 'vitest';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';

describe('M7 recorded CPU difficulty',()=>{
 it('uses the actual selected level rather than the baseline',()=>{expect(cpuDifficulty(4).level).toBe(4);expect(cpuDifficulty(3).level).toBe(3);});
});
