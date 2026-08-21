import { describe,expect,it } from 'vitest';
import { matchParticipantInfo } from './match-detail-info';

describe('matchParticipantInfo',()=>{
 it('returns hero passive and equipped skills',()=>{expect(matchParticipantInfo('vanguard')).toEqual({heroId:'vanguard',passive:'fortified',skills:['blink','charge'],cpuDifficulty:undefined,cpuProfileLevel:undefined});});
 it('keeps CPU difficulty and hidden profile metadata',()=>{expect(matchParticipantInfo('shade','hard',30)).toEqual({heroId:'shade',passive:'pressure',skills:['blink','corrupt'],cpuDifficulty:'hard',cpuProfileLevel:30});});
});
