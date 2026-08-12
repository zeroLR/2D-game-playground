import { describe, expect, it } from 'vitest';
import { GameEventQueue } from '../src/domain/events';

describe('GameEventQueue', () => {
  it('drains emitted events in order', () => {
    const queue = new GameEventQueue();
    queue.emit({ type: 'landed', x: 10, y: 20 });
    queue.emit({ type: 'player-hit', x: 30, y: 40 });

    expect(queue.drain()).toEqual([
      { type: 'landed', x: 10, y: 20 },
      { type: 'player-hit', x: 30, y: 40 },
    ]);
    expect(queue.drain()).toEqual([]);
  });

  it('can clear pending events during reset', () => {
    const queue = new GameEventQueue();
    queue.emit({ type: 'dash-started', x: 1, y: 2, direction: 1, strength: 0.8 });
    queue.clear();
    expect(queue.drain()).toEqual([]);
  });
});
