import { describe,expect,it } from 'vitest';
const clamp=(value:number,max:number)=>Math.max(0,Math.min(max,value));
const offsetAfterDrag=(initial:number,startY:number,currentY:number,max:number)=>clamp(initial-(currentY-startY),max);
describe('history touch scroll',()=>{it('scrolls down when finger drags upward',()=>expect(offsetAfterDrag(0,500,350,1200)).toBe(150));it('scrolls up when finger drags downward',()=>expect(offsetAfterDrag(400,300,450,1200)).toBe(250));it('clamps at list boundaries',()=>{expect(offsetAfterDrag(0,300,500,1200)).toBe(0);expect(offsetAfterDrag(1150,500,300,1200)).toBe(1200);});});
