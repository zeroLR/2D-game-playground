import { describe,expect,it } from 'vitest';
import { matchParticipantInfo } from './match-detail-info';

describe('matchParticipantInfo',()=>{
 it('returns hero passive and equipped skills',()=>{expect(matchParticipantInfo('vanguard')).toEqual({heroId:'vanguard',passive:'fortified',skills:['blink','charge'],cpuLevel:undefined});});
 it('keeps CPU level in participant metadata',()=>{expect(matchParticipantInfo('shade',6)).toEqual({heroId:'shade',passive:'pressure',skills:['blink','corrupt'],cpuLevel:6});});
});
