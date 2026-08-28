import { describe, expect, it } from 'vitest';
import { CONTEXT_JUMP_VELOCITY, createPlayerMotion, DASH_SPEED, stepPlayer, type Rect } from '../src/movement';
const ground: Rect[] = [{ x: 0, y: 500, width: 600, height: 80 }];
describe('player movement', () => {
  it('falls and lands on a platform top', () => { const p=createPlayerMotion(100,450); for(let i=0;i<30;i++) stepPlayer(p,0,false,1/60,ground); expect(p.y).toBe(500); expect(p.grounded).toBe(true); });
  it('starts a directional dash on a press edge', () => { const p=createPlayerMotion(100,500); p.grounded=true; stepPlayer(p,1,true,1/60,ground); expect(p.vx).toBe(DASH_SPEED); expect(p.dashTime).toBeGreaterThan(0); });
  it('does not continuously retrigger dash while held', () => { const p=createPlayerMotion(100,500); p.grounded=true; stepPlayer(p,1,true,1/60,ground); const c=p.dashCooldown; stepPlayer(p,1,false,1/60,ground); expect(p.dashCooldown).toBeLessThan(c); });
  it('starts a context jump toward a raised ledge', () => { const ps:Rect[]=[{x:0,y:500,width:330,height:80},{x:330,y:472,width:130,height:108}]; const p=createPlayerMotion(300,500); p.grounded=true; stepPlayer(p,0.5,false,1/60,ps); expect(p.vy).toBe(CONTEXT_JUMP_VELOCITY); expect(p.contextJumpTime).toBeGreaterThan(0); });
  it('carries a half-stick walk across a gap onto the higher platform', () => { const ps:Rect[]=[{x:330,y:472,width:130,height:108},{x:485,y:430,width:150,height:150}]; const p=createPlayerMotion(445,472); p.grounded=true; for(let i=0;i<50;i++) stepPlayer(p,0.5,false,1/60,ps); expect(p.x).toBeGreaterThan(485); expect(p.y).toBe(430); expect(p.grounded).toBe(true); });
  it('also carries a careful low-stick walk across the same raised seam', () => { const ps:Rect[]=[{x:330,y:472,width:130,height:108},{x:485,y:430,width:150,height:150}]; const p=createPlayerMotion(445,472); p.grounded=true; for(let i=0;i<80;i++) stepPlayer(p,0.1,false,1/60,ps); expect(p.x).toBeGreaterThan(485); expect(p.y).toBe(430); expect(p.grounded).toBe(true); });
  it('dash traverses a raised ledge without dropping into the seam', () => { const ps:Rect[]=[{x:330,y:472,width:130,height:108},{x:485,y:430,width:150,height:150}]; const p=createPlayerMotion(445,472); p.grounded=true; stepPlayer(p,1,true,1/60,ps); expect(p.y).toBeLessThanOrEqual(430); expect(p.x).toBeGreaterThan(445); });
});
