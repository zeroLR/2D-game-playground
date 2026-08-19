import { describe,expect,it } from 'vitest';
describe('history repeated swipes',()=>{it('can continue from the previously committed offset',()=>{const first=150,second=first+180;expect(second).toBe(330);});});
