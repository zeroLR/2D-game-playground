export type TutorialStage = 'rotate' | 'choose-route' | 'go' | 'complete';
export type TutorialEvent = 'opened-route' | 'selected-reachable' | 'travel-started' | 'reset';

export const RELIC_GLYPH = '◆';
export const EXIT_GLYPH = '▣';

export interface ObjectiveCopy {
  readonly primary: string;
  readonly secondary: string;
  readonly secondaryActive: boolean;
}

export function advanceTutorial(stage: TutorialStage, event: TutorialEvent): TutorialStage {
  if (event === 'reset') return 'rotate';
  if (stage === 'complete') return 'complete';
  if (stage === 'rotate' && event === 'opened-route') return 'choose-route';
  if (stage === 'choose-route' && event === 'selected-reachable') return 'go';
  if (stage === 'go' && event === 'travel-started') return 'complete';
  return stage;
}

export function objectiveCopy(treasureCollected: boolean, completed: boolean): ObjectiveCopy {
  if (completed) {
    return {
      primary: '✓ CHAPTER COMPLETE',
      secondary: `✓ ${EXIT_GLYPH} EXIT REACHED`,
      secondaryActive: true,
    };
  }
  if (treasureCollected) {
    return {
      primary: `✓ ${RELIC_GLYPH} RELIC RECOVERED`,
      secondary: `${EXIT_GLYPH} RETURN TO EXIT`,
      secondaryActive: true,
    };
  }
  return {
    primary: `${RELIC_GLYPH} FIND THE RELIC`,
    secondary: `${EXIT_GLYPH} EXIT SEALED`,
    secondaryActive: false,
  };
}

export function newlyReachable(before: ReadonlySet<string>, after: ReadonlySet<string>): readonly string[] {
  return [...after].filter((pageId) => !before.has(pageId));
}
