import { describe,expect,it } from 'vitest';
import { exportMatchesCsv } from '../src/match-export';

describe('M7 CPU level CSV schema',()=>{
 it('places cpuLevel beside cpuHero',()=>{const header=exportMatchesCsv([]).split(',');expect(header.indexOf('cpuLevel')).toBe(header.indexOf('cpuHero')+1);});
});
