import { describe,expect,it } from 'vitest';
import { exportMatchesJson } from '../src/match-export';
import { MatchRecord } from '../src/match-records';

describe('M7 CPU level JSON field',()=>{
 it('serializes cpuLevel as a number',()=>{const record={id:'m',startedAt:'a',finishedAt:'b',heroId:'arcanist',cpuHeroId:'shade',cpuLevel:6,result:'victory',turns:1,actions:[],metrics:{}} as unknown as MatchRecord;expect(JSON.parse(exportMatchesJson([record])).matches[0].cpuLevel).toBe(6);});
});
