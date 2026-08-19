import { describe,expect,it } from 'vitest';
const rowAt=(offset:number,localY:number,rowH=82)=>Math.floor((offset+localY)/rowH);
describe('history row hit mapping',()=>{it('maps taps after scrolling to the correct virtual row',()=>expect(rowAt(164,20)).toBe(2));});
