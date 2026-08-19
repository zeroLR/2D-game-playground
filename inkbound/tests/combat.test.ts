import { describe, expect, it } from 'vitest';
import { createAttackState, isAttackActive, overlaps, playerAttackHitbox, startAttack, stepAttack } from '../src/combat';

describe('combat foundation', () => {
  it('has startup before the slash becomes active', () => {
    const attack = createAttackState(); expect(startAttack(attack)).toBe(true); expect(isAttackActive(attack)).toBe(false);
    stepAttack(attack, 0.07); expect(isAttackActive(attack)).toBe(true);
  });

  it('places the attack hitbox in the facing direction', () => {
    const right = playerAttackHitbox(100, 500, 1); const left = playerAttackHitbox(100, 500, -1);
    expect(right.x).toBeGreaterThan(100); expect(left.x + left.width).toBeLessThanOrEqual(100);
  });

  it('detects enemy hurtbox overlap', () => {
    expect(overlaps(playerAttackHitbox(100, 500, 1), { x: 125, y: 454, width: 32, height: 46 })).toBe(true);
  });
});
