import { Player, Pos } from './game';
import { CombatState, addGuard } from './combat';
import { HeroId, heroes } from './heroes';

export type PassiveTrigger = 'after-place';
export type PassiveResult = { state: CombatState; triggered: boolean; guarded?: Pos };

/**
 * Fortified: after Vanguard places a stone that creates a new Mana-producing
 * pattern (3/4 line), that newly placed stone is Guarded through the opponent turn.
 *
 * This deliberately reuses the existing Guard vocabulary instead of adding a
 * second protection rule. It rewards Vanguard for building structure while
 * keeping the passive visible and easy to playtest.
 */
export function applyAfterPlacePassive(
  state: CombatState,
  heroId: HeroId,
  player: Player,
  placed: Pos,
  manaGained: number,
): PassiveResult {
  if (heroes[heroId].passive !== 'fortified' || manaGained <= 0) return { state, triggered: false };
  return { state: addGuard(state, placed, player), triggered: true, guarded: placed };
}
