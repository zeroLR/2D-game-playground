import { describe, expect, it } from 'vitest';
import { createPlayerMotion, DASH_SPEED, stepPlayer, type Rect } from '../src/movement';

const ground: Rect[] = [{ x: 0, y: 500, width: 600, height: 80 }];

describe('player movement', () => {
  it('falls and lands on a platform top', () => {
    const player = createPlayerMotion(100, 450);
    for (let i = 0; i < 30; i++) stepPlayer(player, 0, false, 1 / 60, ground);
    expect(player.y).toBe(500);
    expect(player.grounded).toBe(true);
  });

  it('starts a directional dash on a press edge', () => {
    const player = createPlayerMotion(100, 500);
    player.grounded = true;
    stepPlayer(player, 1, true, 1 / 60, ground);
    expect(player.vx).toBe(DASH_SPEED);
    expect(player.dashTime).toBeGreaterThan(0);
  });

  it('does not continuously retrigger dash while held', () => {
    const player = createPlayerMotion(100, 500);
    player.grounded = true;
    stepPlayer(player, 1, true, 1 / 60, ground);
    const cooldown = player.dashCooldown;
    stepPlayer(player, 1, false, 1 / 60, ground);
    expect(player.dashCooldown).toBeLessThan(cooldown);
  });
});
