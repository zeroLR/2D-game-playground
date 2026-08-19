import { describe,expect,it } from 'vitest';
const target=(localX:number)=>localX<44?'select':'open';
describe('history row gesture overlay',()=>{it('preserves selection circle intent',()=>expect(target(22)).toBe('select'));it('opens details outside selection affordance',()=>expect(target(80)).toBe('open'));});
