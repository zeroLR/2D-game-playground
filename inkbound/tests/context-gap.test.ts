import { describe, expect, it } from 'vitest';
import { createPlayerMotion, stepPlayer, type Rect } from '../src/movement';

describe('context gap traversal', () => {
  it('keeps horizontal carry after the context jump starts', () => {
    const platforms: Rect[] = [{ x: 330, y: 472, width: 130, height: 108 }, { x: 485, y: 430, width: 150, height: 150 }];
    const player = createPlayerMotion(445, 472); player.grounded = true;
    stepPlayer(player, 0.5, false, 1 / 60, platforms);
    const firstX = player.x;
    stepPlayer(player, 0.5, false, 1 / 60, platforms);
    expect(player.x).toBeGreaterThan(firstX);
    expect(player.contextJumpTime).toBeGreaterThan(0);
  });
});
