// Key-to-Action mapping. Lifted directly from game-systems skill
// (.claude/skills/game-systems/SKILL.md:93-113) and trimmed to the v1 actions.

export type Action =
  | { type: "move"; dx: -1 | 0 | 1; dy: -1 | 0 | 1 }
  | { type: "wait" }
  | { type: "restart" };

const bindings: Record<string, Action> = {
  // Arrow keys
  ArrowUp:    { type: "move", dx: 0, dy: -1 },
  ArrowDown:  { type: "move", dx: 0, dy: 1 },
  ArrowLeft:  { type: "move", dx: -1, dy: 0 },
  ArrowRight: { type: "move", dx: 1, dy: 0 },
  // Vi keys
  h:          { type: "move", dx: -1, dy: 0 },
  j:          { type: "move", dx: 0, dy: 1 },
  k:          { type: "move", dx: 0, dy: -1 },
  l:          { type: "move", dx: 1, dy: 0 },
  // Diagonals (vi)
  y:          { type: "move", dx: -1, dy: -1 },
  u:          { type: "move", dx: 1, dy: -1 },
  b:          { type: "move", dx: -1, dy: 1 },
  n:          { type: "move", dx: 1, dy: 1 },
  // Wait / restart
  ".":        { type: "wait" },
  r:          { type: "restart" },
};

export function keyToAction(e: KeyboardEvent): Action | null {
  return bindings[e.key] ?? null;
}

/**
 * Translate a tap on some tile into a one-step move toward that tile.
 *
 * The game is turn-based and tile-snapped, so instead of path-finding we just
 * take one 8-way step in the direction of the tap. Tapping the tile the player
 * is already standing on returns `null` so the caller can decide whether to
 * wait, open a menu, etc.
 */
export function tapToAction(
  tileX: number,
  tileY: number,
  playerX: number,
  playerY: number,
): Action | null {
  const dx = Math.sign(tileX - playerX) as -1 | 0 | 1;
  const dy = Math.sign(tileY - playerY) as -1 | 0 | 1;
  if (dx === 0 && dy === 0) return null;
  return { type: "move", dx, dy };
}
