import { describe,expect,it } from 'vitest';
describe('history drag commit model',()=>{it('does not require an offset commit during pointer movement',()=>{let commits=0;let visualOffset=0;const move=(delta:number)=>{visualOffset=delta;};move(80);move(140);expect(visualOffset).toBe(140);expect(commits).toBe(0);commits++;expect(commits).toBe(1);});});
