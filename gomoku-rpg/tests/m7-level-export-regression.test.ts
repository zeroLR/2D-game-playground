import { describe,expect,it } from 'vitest';
import { exportMatchesCsv } from '../src/match-export';
import { MatchRecord } from '../src/match-records';

describe('M7 legacy CPU level export',()=>{
 it('exports an empty CPU level for old records',()=>{const record={id:'old',startedAt:'a',finishedAt:'b',heroId:'arcanist',cpuHeroId:'shade',result:'defeat',turns:2,actions:[],metrics:{}} as unknown as MatchRecord;const row=exportMatchesCsv([record]).split('\n')[1].split(',');expect(row[5]).toBe('');});
});
