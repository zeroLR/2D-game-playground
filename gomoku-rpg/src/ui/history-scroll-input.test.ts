import { describe,expect,it } from 'vitest';
const isDrag=(startY:number,currentY:number)=>Math.abs(currentY-startY)>4;
describe('history input intent',()=>{it('keeps tiny movement as a tap',()=>expect(isDrag(100,103)).toBe(false));it('treats deliberate swipe as scrolling',()=>expect(isDrag(100,110)).toBe(true));});
