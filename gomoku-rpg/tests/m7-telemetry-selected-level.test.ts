import { describe,expect,it } from 'vitest';
import { createMatchRecord } from '../src/match-records';

describe('M7 selected CPU level telemetry',()=>{it('distinguishes records from different levels',()=>{const base={startedAt:'x',heroId:'arcanist',cpuHeroId:'shade',result:'defeat',turns:1,actions:[],metrics:{} as never} as const;expect(createMatchRecord({...base,cpuLevel:3}).cpuLevel).not.toBe(createMatchRecord({...base,cpuLevel:4}).cpuLevel);});});
