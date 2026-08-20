import { describe,expect,it } from 'vitest';
import { createLoadout } from '../heroes';

describe('match detail loadout metadata',()=>{
 it('exposes both participant default loadouts used by current match records',()=>{
  expect(createLoadout('vanguard')).toMatchObject({passive:'fortified',skills:['blink','charge']});
  expect(createLoadout('arcanist')).toMatchObject({passive:'flow',skills:['blink','phase']});
  expect(createLoadout('shade')).toMatchObject({passive:'pressure',skills:['blink','corrupt']});
 });
});
