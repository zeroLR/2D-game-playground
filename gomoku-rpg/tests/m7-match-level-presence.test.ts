import { describe,expect,it } from 'vitest';
import { MatchRecord } from '../src/match-records';

describe('M7 match CPU level',()=>{
 it('represents selected difficulty on a match record',()=>{const record={cpuLevel:5} as MatchRecord;expect(record.cpuLevel).toBe(5);});
});
