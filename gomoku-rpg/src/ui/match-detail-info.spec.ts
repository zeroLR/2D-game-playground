import { describe,expect,it } from 'vitest';
import { matchParticipantInfo } from './match-detail-info';
describe('participant cards',()=>{it('retains CPU difficulty',()=>expect(matchParticipantInfo('arcanist',4).cpuLevel).toBe(4));});
