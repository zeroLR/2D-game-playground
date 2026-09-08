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

export function resolveObjectiveArrival(
  progress: ObjectiveProgress,
  page: PageState,
  treasureRequired = true,
): ArrivalResolution {
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
    if (treasureRequired && !progress.treasureCollected) return { progress, event: 'goal-locked' };
    return {
      progress: { ...progress, completed: true },
      event: 'completed',
    };
  }
  return { progress, event: 'none' };
}

/**
 * Resolve objective semantics for an explicit travel command.
 * Intermediate Pages are traversal-only: only the final destination can
 * collect a relic, report a sealed exit, or complete the chapter.
 */
export function resolveObjectiveTraversal(
  progress: ObjectiveProgress,
  traversedPages: readonly PageState[],
  treasureRequired = true,
): ArrivalResolution {
  const destination = traversedPages[traversedPages.length - 1];
  if (!destination) return { progress, event: 'none' };
  return resolveObjectiveArrival(progress, destination, treasureRequired);
}
