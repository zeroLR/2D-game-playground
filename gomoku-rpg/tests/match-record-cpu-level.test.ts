import { describe,expect,it } from 'vitest';
import { exportMatchesCsv,exportMatchesJson } from '../src/match-export';
import { MatchRecord } from '../src/match-records';

const record={id:'m1',startedAt:'2026-08-20T00:00:00Z',finishedAt:'2026-08-20T00:01:00Z',heroId:'arcanist',cpuHeroId:'shade',cpuLevel:4,result:'victory',turns:12,actions:[],metrics:{skillUses:{},skillOpportunities:{},skillUseManaTotal:{}}} as unknown as MatchRecord;

describe('M7 CPU level telemetry',()=>{
 it('keeps CPU level in JSON export',()=>{expect(JSON.parse(exportMatchesJson([record])).matches[0].cpuLevel).toBe(4);});
 it('includes CPU level in CSV export',()=>{const csv=exportMatchesCsv([record]);expect(csv.split('\n')[0]).toContain('cpuLevel');expect(csv.split('\n')[1]).toContain(',4,');});
});
