import { describe,expect,it } from 'vitest';
import { exportMatchesJson } from '../src/match-export';

describe('M7 export compatibility',()=>{it('retains matches v1 schema while adding optional cpuLevel',()=>expect(JSON.parse(exportMatchesJson([])).schema).toBe('gomoku-rpg.matches.v1'));});
