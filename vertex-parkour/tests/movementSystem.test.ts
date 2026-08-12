import { describe, expect, it } from 'vitest';
import { GameEventQueue } from '../src/domain/events';
import { createInitialState } from '../src/domain/gameState';
import { MovementSystem, type MovementFrameState } from '../src/systems/MovementSystem';

function frame(): MovementFrameState {
  return { state: createInitialState(), dashDirection: 0, dashVisualTime: 0, restartRequested: false };
}

describe('MovementSystem', () => {
  it('emits dash-started while applying a dash command', () => {
    const system = new MovementSystem();
    const events = new GameEventQueue();
    const next = system.execute(frame(), { type: 'dash', direction: 1, strength: 0.8 }, 12, events);
    expect(next.state.dashReady).toBe(false);
    expect(next.dashDirection).toBe(1);
    expect(events.drain()[0]).toMatchObject({ type: 'dash-started', direction: 1, strength: 0.8 });
  });

  it('keeps air nudge independent from tactical dash consumption', () => {
    const system = new MovementSystem();
    const events = new GameEventQueue();
    const next = system.execute(frame(), { type: 'air-nudge', direction: -1, strength: 0.6 }, 0, events);
    expect(next.state.dashReady).toBe(true);
    expect(next.dashDirection).toBe(-1);
    expect(events.drain()).toEqual([]);
  });

  it('surfaces restart as a runtime lifecycle request', () => {
    const system = new MovementSystem();
    const next = system.execute(frame(), { type: 'restart' }, 0, new GameEventQueue());
    expect(next.restartRequested).toBe(true);
  });
});
