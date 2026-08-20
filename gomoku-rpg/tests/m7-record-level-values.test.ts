import { describe,expect,it } from 'vitest';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';

describe('M7 CPU telemetry values',()=>{
 it('preserves selectable levels 1 through 6',()=>{expect([1,2,3,4,5,6].map(level=>cpuDifficulty(level).level)).toEqual([1,2,3,4,5,6]);});
});
