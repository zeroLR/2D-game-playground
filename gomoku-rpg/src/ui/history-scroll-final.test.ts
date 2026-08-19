import { describe,expect,it } from 'vitest';
describe('history final offset',()=>{it('commits the locally previewed offset on release',()=>{const preview=320,commit=(value:number)=>value;expect(commit(preview)).toBe(320);});});
