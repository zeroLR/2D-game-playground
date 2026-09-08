export type TutorialStage = 'rotate' | 'choose-route' | 'go' | 'complete';
export type TutorialEvent = 'opened-route' | 'selected-reachable' | 'travel-started' | 'reset';

export function advanceTutorial(stage: TutorialStage, event: TutorialEvent): TutorialStage {
  if (event === 'reset') return 'rotate';
  if (stage === 'complete') return 'complete';
  if (stage === 'rotate' && event === 'opened-route') return 'choose-route';
  if (stage === 'choose-route' && event === 'selected-reachable') return 'go';
  if (stage === 'go' && event === 'travel-started') return 'complete';
  return stage;
}

export function newlyReachable(before: ReadonlySet<string>, after: ReadonlySet<string>): readonly string[] {
  return [...after].filter((pageId) => !before.has(pageId));
}
