export type TutorialStage = 'rotate' | 'choose-route' | 'go' | 'complete';
export type TutorialEvent = 'opened-route' | 'selected-reachable' | 'travel-started' | 'reset';

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
      secondary: '✓ RELIC RETURNED TO THE GATE',
      secondaryActive: true,
    };
  }
  if (treasureCollected) {
    return {
      primary: '✓ RELIC RECOVERED',
      secondary: '◆ RETURN TO THE GATE',
      secondaryActive: true,
    };
  }
  return {
    primary: '◆ FIND THE RELIC',
    secondary: '○ RETURN TO THE GATE',
    secondaryActive: false,
  };
}

export function newlyReachable(before: ReadonlySet<string>, after: ReadonlySet<string>): readonly string[] {
  return [...after].filter((pageId) => !before.has(pageId));
}
