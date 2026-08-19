import { describe,expect,it } from 'vitest';
const maxOffset=(count:number,rowH=82,viewportH=500)=>Math.max(0,count*rowH-viewportH);
describe('history scroll boundaries',()=>{it('allows records beyond the initial viewport',()=>expect(maxOffset(14)).toBe(648));it('does not scroll short histories',()=>expect(maxOffset(4)).toBe(0));});
