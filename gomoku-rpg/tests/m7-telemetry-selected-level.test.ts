import { describe,expect,it } from 'vitest';
import { createMatchRecord } from '../src/match-records';

describe('M7 selected CPU level telemetry',()=>{it('distinguishes records from different levels',()=>{const base={startedAt:'x' as const,heroId:'arcanist' as const,cpuHeroId:'shade' as const,result:'defeat' as const,turns:1,actions:[],metrics:{} as never};expect(createMatchRecord({...base,cpuLevel:3}).cpuLevel).not.toBe(createMatchRecord({...base,cpuLevel:4}).cpuLevel);});});
