import type { PageState } from './model';

export type ObjectiveKind = 'treasure' | 'goal';
export type ObjectiveEvent = 'none' | 'treasure-collected' | 'goal-locked' | 'completed';

export interface ObjectiveProgress {
  readonly treasureCollected: boolean;
  readonly completed: boolean;
}

export interface ArrivalResolution {
  readonly progress: ObjectiveProgress;
  readonly event: ObjectiveEvent;
}

export function createObjectiveProgress(): ObjectiveProgress {
  return { treasureCollected: false, completed: false };
}

export function pageObjective(page: PageState): ObjectiveKind | null {
  const value = page.state.objective;
  return value === 'treasure' || value === 'goal' ? value : null;
}

export function resolveObjectiveArrival(progress: ObjectiveProgress, page: PageState): ArrivalResolution {
  if (progress.completed) return { progress, event: 'none' };
  const objective = pageObjective(page);
  if (objective === 'treasure') {
    if (progress.treasureCollected) return { progress, event: 'none' };
    return {
      progress: { ...progress, treasureCollected: true },
      event: 'treasure-collected',
    };
  }
  if (objective === 'goal') {
    if (!progress.treasureCollected) return { progress, event: 'goal-locked' };
    return {
      progress: { ...progress, completed: true },
      event: 'completed',
    };
  }
  return { progress, event: 'none' };
}
