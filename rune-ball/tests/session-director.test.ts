import { describe, expect, it } from 'vitest';
import { SessionDirector } from '../src/game/SessionDirector';

function breakEvent(combo: number, scoreAdded = 100, source: 'ball' | 'split' | 'chain' = 'ball') {
  return {
    type: 'target-break' as const,
    targetId: combo,
    kind: 'crystal' as const,
    position: { x: 10, y: 20 },
    combo,
    scoreAdded,
    source,
  };
}

describe('SessionDirector', () => {
  it('waits for the first valid action before consuming run time', () => {
    const director = new SessionDirector({ totalSeconds: 10, finalReleaseSeconds: 2 });

    director.update(4);
    expect(director.snapshot.phase).toBe('ready');
    expect(director.snapshot.secondsRemaining).toBe(10);

    expect(director.start()).toBe(true);
    director.update(1.5);
    expect(director.snapshot.phase).toBe('playing');
    expect(director.snapshot.secondsRemaining).toBeCloseTo(8.5);
  });

  it('enters final release before results and clamps the run at zero', () => {
    const director = new SessionDirector({ totalSeconds: 10, finalReleaseSeconds: 2 });
    director.start();

    expect(director.update(8)).toBe('final-release');
    expect(director.snapshot.phase).toBe('final-release');
    expect(director.snapshot.phaseSecondsRemaining).toBeCloseTo(2);

    expect(director.update(2)).toBe('results');
    expect(director.snapshot.phase).toBe('results');
    expect(director.snapshot.secondsRemaining).toBe(0);
  });

  it('does not consume time while paused', () => {
    const director = new SessionDirector({ totalSeconds: 10, finalReleaseSeconds: 2 });
    director.start();
    director.update(2);
    director.setPaused(true);
    director.update(5);

    expect(director.snapshot.elapsedSeconds).toBeCloseTo(2);

    director.setPaused(false);
    director.update(1);
    expect(director.snapshot.elapsedSeconds).toBeCloseTo(3);
  });

  it('collects score, combo, rune, chain and overdrive attribution', () => {
    const director = new SessionDirector();
    director.start();

    director.registerEvent({ type: 'rune-activated', rune: 'chain', center: { x: 0, y: 0 } });
    director.registerEvent({ type: 'chain-triggered', origin: { x: 0, y: 0 }, targets: [{ x: 1, y: 1 }, { x: 2, y: 2 }] });
    director.registerEvent({ type: 'overdrive-enter', duration: 12 });
    director.registerEvent(breakEvent(3, 180, 'chain'));
    director.registerEvent({ type: 'overdrive-exit' });
    director.registerEvent(breakEvent(5, 120, 'ball'));

    const { stats } = director.snapshot;
    expect(stats.score).toBe(300);
    expect(stats.maxCombo).toBe(5);
    expect(stats.breaks).toBe(2);
    expect(stats.runeBreaks).toBe(1);
    expect(stats.runesCast).toBe(1);
    expect(stats.runeUsage.chain).toBe(1);
    expect(stats.chainTriggers).toBe(1);
    expect(stats.chainLinks).toBe(2);
    expect(stats.overdriveReached).toBe(true);
    expect(stats.overdriveBreaks).toBe(1);
  });

  it('resets into a clean replayable run', () => {
    const director = new SessionDirector({ totalSeconds: 10, finalReleaseSeconds: 2 });
    director.start();
    director.registerEvent(breakEvent(4, 250, 'split'));
    director.update(10);
    director.reset();

    expect(director.snapshot.phase).toBe('ready');
    expect(director.snapshot.elapsedSeconds).toBe(0);
    expect(director.snapshot.stats.score).toBe(0);
    expect(director.snapshot.stats.breaks).toBe(0);
    expect(director.snapshot.stats.runesCast).toBe(0);
  });
});
