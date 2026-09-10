import { describe, expect, it } from 'vitest';
import { DestructionSession } from '../src/game/DestructionSession';

const BOUNDS = { left: 20, right: 380, top: 80, bottom: 640 };

describe('Vortex evolution session integration', () => {
  it('does not advance from a Vortex cast that cannot affect a target', () => {
    const session = new DestructionSession(BOUNDS, { vortexEvolutionPath: 'gravity-well' });
    const emptyCast = session.activateRune('vortex', { x: -1000, y: -1000 });

    expect(emptyCast.some((event) => event.type === 'vortex-evolution-progress')).toBe(false);
    expect(session.snapshot.vortexEvolution.qualifiedUses).toBe(0);
  });

  it('automatically evolves after three qualified Vortex uses', () => {
    const session = new DestructionSession(BOUNDS, { vortexEvolutionPath: 'gravity-well' });
    const target = session.snapshot.targets[0];

    session.activateRune('vortex', target.position);
    session.activateRune('vortex', target.position);
    const thirdCast = session.activateRune('vortex', target.position);

    expect(thirdCast).toContainEqual(expect.objectContaining({
      type: 'vortex-evolved',
      path: 'gravity-well',
      stage: 1,
      stageName: 'GRAVITY WELL',
    }));
    expect(session.snapshot.vortexEvolution).toMatchObject({ stage: 1, qualifiedUses: 3 });
  });
});
