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

  it('redirects strongly toward the requested four-way intent while preserving cruise velocity', () => {
    const ball = new BallModel(bounds);
    const cruiseSpeed = ball.snapshot.speed;

    ball.applyDirectionalRedirect('down');
    const afterDown = ball.snapshot;
    expect(afterDown.velocity.y).toBeGreaterThan(0);
    expect(afterDown.speed).toBeCloseTo(cruiseSpeed, 8);

    ball.applyDirectionalRedirect('left');
    const afterLeft = ball.snapshot;
    expect(afterLeft.velocity.x).toBeLessThan(0);
    expect(afterLeft.speed).toBeCloseTo(cruiseSpeed, 8);
  });

  it('does not reward repeated swipe spam with cumulative speed', () => {
    const ball = new BallModel(bounds);
    const cruiseSpeed = ball.snapshot.speed;

    for (let index = 0; index < 30; index += 1) {
      ball.applyDirectionalRedirect(index % 2 === 0 ? 'right' : 'up');
    }

    expect(ball.snapshot.speed).toBeCloseTo(cruiseSpeed, 8);
    expect(ball.snapshot.reboundStrength).toBe(0);
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
      expect(snapshot.speed).toBeLessThanOrEqual(470.000001);
      if (snapshot.reboundStrength <= 0) expect(snapshot.speed).toBeLessThanOrEqual(400.000001);
    }

    expect(hitObserved).toBe(true);
  });

  it('activates a clearly separated rebound velocity tier and decays to cruise', () => {
    const ball = new BallModel(bounds);
    const cruiseSpeed = ball.snapshot.speed;
    let wallHit = false;

    for (let index = 0; index < 240 && !wallHit; index += 1) {
      wallHit = ball.update(1 / 60).wallHits.length > 0;
    }

    expect(wallHit).toBe(true);
    expect(ball.snapshot.reboundStrength).toBeGreaterThan(0.99);
    expect(ball.snapshot.speed).toBeGreaterThan(cruiseSpeed * 1.2);
    expect(ball.snapshot.speed).toBeLessThanOrEqual(470);

    ball.setBounds({ left: -10_000, right: 10_000, top: -10_000, bottom: 10_000 });
    ball.update(0.8);
    expect(ball.snapshot.reboundStrength).toBe(0);
    expect(ball.snapshot.speed).toBeCloseTo(cruiseSpeed, 6);
  });

  it('keeps swipe authoritative during rebound without stacking extra velocity', () => {
    const ball = new BallModel(bounds);
    let wallHit = false;

    for (let index = 0; index < 240 && !wallHit; index += 1) {
      wallHit = ball.update(1 / 60).wallHits.length > 0;
    }

    expect(wallHit).toBe(true);
    const reboundSpeed = ball.snapshot.speed;
    ball.applyDirectionalRedirect('left');
    expect(ball.snapshot.velocity.x).toBeLessThan(0);
    expect(ball.snapshot.speed).toBeCloseTo(reboundSpeed, 6);

    for (let index = 0; index < 20; index += 1) {
      ball.applyDirectionalRedirect(index % 2 === 0 ? 'up' : 'right');
    }
    expect(ball.snapshot.speed).toBeCloseTo(reboundSpeed, 6);
  });

  it('nudges rebound direction toward a forward target without changing speed', () => {
    const ball = new BallModel(bounds);
    const before = ball.snapshot;
    const assisted = ball.applyReboundAssist({ x: bounds.right, y: before.position.y });
    const after = ball.snapshot;

    expect(assisted).toBe(true);
    expect(after.speed).toBeCloseTo(before.speed, 8);
    expect(after.velocity.y).toBeGreaterThan(before.velocity.y);
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
