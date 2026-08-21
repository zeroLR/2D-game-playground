import { describe,expect,it } from 'vitest';
import { exportMatchesCsv } from '../src/match-export';

describe('M7.3-R CPU difficulty CSV schema',()=>{
 it('places difficulty metadata beside cpuHero',()=>{const header=exportMatchesCsv([]).split(',');expect(header.indexOf('cpuDifficulty')).toBe(header.indexOf('cpuHero')+1);expect(header.indexOf('cpuProfileLevel')).toBe(header.indexOf('cpuDifficulty')+1);});
});
