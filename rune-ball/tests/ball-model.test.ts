import { describe, expect, it } from 'vitest';
import { BallModel, type ArenaBounds } from '../src/game/BallModel';

const bounds: ArenaBounds = { left: 0, right: 300, top: 0, bottom: 500 };

describe('BallModel', () => {
  it('advances deterministically for the same fixed update sequence', () => {
    const first = new BallModel(bounds);
    const second = new BallModel(bounds);

    for (let index = 0; index < 120; index += 1) {
      first.update(1 / 60);
      second.update(1 / 60);
    }

    expect(first.snapshot.position.x).toBeCloseTo(second.snapshot.position.x, 8);
    expect(first.snapshot.position.y).toBeCloseTo(second.snapshot.position.y, 8);
    expect(first.snapshot.velocity.x).toBeCloseTo(second.snapshot.velocity.x, 8);
    expect(first.snapshot.velocity.y).toBeCloseTo(second.snapshot.velocity.y, 8);
  });

  it('redirects strongly toward the requested four-way intent', () => {
    const ball = new BallModel(bounds);
    ball.applyDirectionalRedirect('down');
    const afterDown = ball.snapshot;
    expect(afterDown.velocity.y).toBeGreaterThan(0);
    expect(afterDown.speed).toBeGreaterThanOrEqual(320);

    ball.applyDirectionalRedirect('left');
    const afterLeft = ball.snapshot;
    expect(afterLeft.velocity.x).toBeLessThan(0);
    expect(afterLeft.speed).toBeLessThanOrEqual(440);
  });

  it('keeps repeated redirects inside the authored normal-speed clamp', () => {
    const ball = new BallModel(bounds);
    for (let index = 0; index < 20; index += 1) ball.applyDirectionalRedirect('right');
    expect(ball.snapshot.speed).toBeCloseTo(440, 6);
  });

  it('reflects from arena walls without allowing the ball center outside its radius-safe bounds', () => {
    const ball = new BallModel(bounds);
    let hitObserved = false;

    for (let index = 0; index < 600; index += 1) {
      const result = ball.update(1 / 60);
      if (result.wallHits.length > 0) hitObserved = true;
      const snapshot = ball.snapshot;
      expect(snapshot.position.x).toBeGreaterThanOrEqual(bounds.left + snapshot.radius);
      expect(snapshot.position.x).toBeLessThanOrEqual(bounds.right - snapshot.radius);
      expect(snapshot.position.y).toBeGreaterThanOrEqual(bounds.top + snapshot.radius);
      expect(snapshot.position.y).toBeLessThanOrEqual(bounds.bottom - snapshot.radius);
      expect(snapshot.speed).toBeLessThanOrEqual(440.000001);
    }

    expect(hitObserved).toBe(true);
  });

  it('interpolates between previous and current fixed-step states', () => {
    const ball = new BallModel(bounds);
    const before = ball.snapshot.position;
    ball.update(1 / 60);
    const after = ball.snapshot.position;
    const halfway = ball.interpolatedPosition(0.5);

    expect(halfway.x).toBeCloseTo((before.x + after.x) / 2);
    expect(halfway.y).toBeCloseTo((before.y + after.y) / 2);
  });
});
