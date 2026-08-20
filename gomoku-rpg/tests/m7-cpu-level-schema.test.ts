import { describe,expect,it } from 'vitest';
import { createMatchRecord } from '../src/match-records';

describe('M7 CPU level schema',()=>{
 it('creates records with selected CPU level',()=>{const record=createMatchRecord({startedAt:'2026-08-20T00:00:00Z',heroId:'arcanist',cpuHeroId:'shade',cpuLevel:4,result:'victory',turns:1,actions:[],metrics:{} as never});expect(record.cpuLevel).toBe(4);});
});
