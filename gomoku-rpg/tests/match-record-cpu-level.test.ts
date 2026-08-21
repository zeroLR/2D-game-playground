import { describe,expect,it } from 'vitest';
import { exportMatchesCsv,exportMatchesJson } from '../src/match-export';
import { MatchRecord } from '../src/match-records';

const record={id:'m1',startedAt:'2026-08-20T00:00:00Z',finishedAt:'2026-08-20T00:01:00Z',heroId:'arcanist',cpuHeroId:'shade',cpuDifficulty:'hard',cpuProfileLevel:5,result:'victory',turns:12,actions:[],metrics:{skillUses:{},skillOpportunities:{},skillUseManaTotal:{}}} as unknown as MatchRecord;

describe('M7.3-R CPU difficulty telemetry',()=>{
 it('keeps CPU difficulty in JSON export',()=>{const exported=JSON.parse(exportMatchesJson([record])).matches[0];expect(exported.cpuDifficulty).toBe('hard');expect(exported.cpuProfileLevel).toBe(5);});
 it('includes named difficulty and hidden profile in CSV export',()=>{const csv=exportMatchesCsv([record]);expect(csv.split('\n')[0]).toContain('cpuDifficulty');expect(csv.split('\n')[0]).toContain('cpuProfileLevel');expect(csv.split('\n')[1]).toContain(',hard,5,');});
});
