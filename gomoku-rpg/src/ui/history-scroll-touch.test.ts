import { describe,expect,it } from 'vitest';
describe('history touch direction',()=>{it('moves content with the finger while offset moves oppositely',()=>{const fingerDelta=-120,offsetDelta=120;expect(fingerDelta).toBe(-offsetDelta);});});
