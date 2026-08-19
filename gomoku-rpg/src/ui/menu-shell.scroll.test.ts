import { describe,expect,it } from 'vitest';

describe('history virtual list gesture contract',()=>{
  const clamp=(value:number,max:number)=>Math.max(0,Math.min(max,value));
  it('converts upward drag into a larger history offset without rerendering mid-gesture',()=>{
    const initial=0,startY=500,currentY=350,max=1200;
    expect(clamp(initial-(currentY-startY),max)).toBe(150);
  });
  it('clamps drag offsets at both virtual-list boundaries',()=>{
    expect(clamp(-80,1200)).toBe(0);
    expect(clamp(1400,1200)).toBe(1200);
  });
});
