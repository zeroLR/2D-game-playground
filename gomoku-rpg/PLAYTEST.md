# M2.4 Playtest Dataset

Completed matches are stored locally in the browser under `gomoku-rpg.playtest-history.v1`.

## Workflow

1. Play complete matches with Vanguard, Arcanist, and Shade.
2. Use **METRICS / 數據摘要** after any completed match to copy the full accumulated dataset as JSON.
3. Continue playing; Play Again, hero changes, and reloads do not clear completed-match history.
4. Use **CLEAR METRICS** to explicitly start a fresh balance dataset.

Incomplete/restarted matches are not persisted. The exported dataset contains `totalMatches`, `heroCounts`, and every individual match summary.
