import { describe, expect, it } from 'vitest';
import { DestructionSession, type DestructionEvent } from '../src/game/DestructionSession';
import type { ArenaBounds } from '../src/game/BallModel';

const bounds: ArenaBounds = { left: 0, right: 300, top: 0, bottom: 500 };

describe('Vortex Ascension release', () => {
  it('activates one Singularity at the ball and resolves a Vortex-authored collapse pulse', () => {
    const session = new DestructionSession(bounds);
    const center = session.snapshot.ball.position;

    const activation = session.activateVortexAscension(center);
    expect(activation).toEqual([
      expect.objectContaining({
        type: 'ascension-activated',
        rune: 'vortex',
        ascension: 'singularity',
        center,
      }),
    ]);
    expect(session.activateVortexAscension(center)).toHaveLength(0);

    const events: DestructionEvent[] = [];
    for (let frame = 0; frame < 100; frame += 1) events.push(...session.update(1 / 60));

    const pulse = events.find((event) => event.type === 'ascension-pulse');
    expect(pulse).toBeDefined();
    if (!pulse || pulse.type !== 'ascension-pulse') return;
    expect(pulse.targets.length).toBeGreaterThan(0);

    const singularityBreaks = events.filter(
      (event): event is Extract<DestructionEvent, { type: 'target-break' }> =>
        event.type === 'target-break' && event.source === 'singularity',
    );
    expect(singularityBreaks.length).toBeGreaterThan(0);
    expect(singularityBreaks.every((event) => event.runeInfluence === 'vortex')).toBe(true);
  });
});
