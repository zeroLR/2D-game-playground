import { describe,expect,it } from 'vitest';
const windowFor=(offset:number,count:number,rowH=82,viewportH=500)=>({start:Math.max(0,Math.floor((offset-viewportH)/rowH)),end:Math.min(count,Math.ceil((offset+viewportH*2)/rowH))});
describe('history virtualization overscan',()=>{it('keeps one viewport of rows available around a touch drag',()=>{expect(windowFor(500,100)).toEqual({start:0,end:19});});it('still renders a bounded subset for long histories',()=>{const window=windowFor(3000,1000);expect(window.end-window.start).toBeLessThan(25);});});
