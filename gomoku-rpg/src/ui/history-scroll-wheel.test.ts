import { describe,expect,it } from 'vitest';
const wheel=(offset:number,delta:number,max:number)=>Math.max(0,Math.min(max,offset+delta));
describe('history wheel scroll',()=>{it('advances offset',()=>expect(wheel(100,80,600)).toBe(180));it('clamps at end',()=>expect(wheel(580,80,600)).toBe(600));});
