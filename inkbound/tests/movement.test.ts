import { describe, expect, it } from 'vitest';
import { CONTEXT_JUMP_VELOCITY, createPlayerMotion, DASH_SPEED, stepPlayer, type Rect } from '../src/movement';

const ground: Rect[] = [{ x: 0, y: 500, width: 600, height: 80 }];

describe('player movement', () => {
  it('falls and lands on a platform top', () => {
    const player = createPlayerMotion(100, 450);
    for (let i = 0; i < 30; i++) stepPlayer(player, 0, false, 1 / 60, ground);
    expect(player.y).toBe(500); expect(player.grounded).toBe(true);
  });

  it('starts a directional dash on a press edge', () => {
    const player = createPlayerMotion(100, 500); player.grounded = true;
    stepPlayer(player, 1, true, 1 / 60, ground);
    expect(player.vx).toBe(DASH_SPEED); expect(player.dashTime).toBeGreaterThan(0);
  });

  it('does not continuously retrigger dash while held', () => {
    const player = createPlayerMotion(100, 500); player.grounded = true;
    stepPlayer(player, 1, true, 1 / 60, ground); const cooldown = player.dashCooldown;
    stepPlayer(player, 1, false, 1 / 60, ground); expect(player.dashCooldown).toBeLessThan(cooldown);
  });

  it('context-jumps into the raised second platform instead of falling into the seam', () => {
    const platforms: Rect[] = [{ x: 0, y: 500, width: 330, height: 80 }, { x: 330, y: 472, width: 130, height: 108 }];
    const player = createPlayerMotion(312, 500); player.grounded = true;
    stepPlayer(player, 1, false, 1 / 60, platforms);
    expect(player.vy).toBe(CONTEXT_JUMP_VELOCITY); expect(player.y).toBeLessThan(500);
  });

  it('dash traverses the same raised ledge without dropping into the seam', () => {
    const platforms: Rect[] = [{ x: 0, y: 500, width: 330, height: 80 }, { x: 330, y: 472, width: 130, height: 108 }];
    const player = createPlayerMotion(312, 500); player.grounded = true;
    stepPlayer(player, 1, true, 1 / 60, platforms);
    expect(player.y).toBeLessThanOrEqual(472); expect(player.x).toBeGreaterThan(312);
  });
});
