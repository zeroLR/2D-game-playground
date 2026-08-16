import { describe, expect, it } from 'vitest';
import { RunProgression } from '../src/domain/RunProgression';

describe('RunProgression', () => {
  it('ignores climax encounters before Storm Crown', () => {
    const progression = new RunProgression();
    progression.observeEncounter('pale-heights', 'climax', 0);
    progression.observeEncounter('pale-heights', 'climax', 3);
    expect(progression.getPhase()).toBe('running');
    expect(progression.canGenerateProceduralWorld()).toBe(true);
  });

  it('enters final-climax when the Storm Crown climax begins', () => {
    const progression = new RunProgression();
    progression.observeEncounter('storm-crown', 'climax', 0);
    expect(progression.getPhase()).toBe('final-climax');
    expect(progression.canGenerateProceduralWorld()).toBe(true);
  });

  it('locks ordinary procedural generation after the Storm Crown climax completes', () => {
    const progression = new RunProgression();
    progression.observeEncounter('storm-crown', 'climax', 0);
    progression.observeEncounter('storm-crown', 'climax', 3);
    expect(progression.getPhase()).toBe('final-ascent');
    expect(progression.canGenerateProceduralWorld()).toBe(false);
  });

  it('only allows chapter clear after reaching final ascent', () => {
    const progression = new RunProgression();
    progression.markChapterClear();
    expect(progression.getPhase()).toBe('running');

    progression.observeEncounter('storm-crown', 'climax', 0);
    progression.observeEncounter('storm-crown', 'climax', 3);
    progression.markChapterClear();
    expect(progression.getPhase()).toBe('chapter-clear');
    expect(progression.canGenerateProceduralWorld()).toBe(false);
  });

  it('resets back to ordinary run generation', () => {
    const progression = new RunProgression();
    progression.observeEncounter('storm-crown', 'climax', 0);
    progression.observeEncounter('storm-crown', 'climax', 3);
    progression.reset();
    expect(progression.getPhase()).toBe('running');
    expect(progression.canGenerateProceduralWorld()).toBe(true);
  });
});
