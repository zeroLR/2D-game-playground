import { describe,expect,it } from 'vitest';
const rendered=(offset:number,count:number)=>{const rowH=82,viewport=500;return Math.min(count,Math.ceil((offset+viewport*2)/rowH))-Math.max(0,Math.floor((offset-viewport)/rowH));};
describe('history overscan',()=>{it('stays virtual for large histories',()=>expect(rendered(5000,1000)).toBeLessThan(25));});
