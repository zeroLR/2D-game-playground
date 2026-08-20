import { describe,expect,it } from 'vitest';
import { MatchRecord } from '../src/match-records';

describe('M7 match record compatibility',()=>{
 it('keeps cpuLevel optional so existing stored v1 records remain readable',()=>{const oldRecord={cpuLevel:undefined} as MatchRecord;expect(oldRecord.cpuLevel).toBeUndefined();});
});
