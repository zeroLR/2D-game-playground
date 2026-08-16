# Domino Mischief

Portrait-first 3D chain-reaction puzzle prototype built with Three.js + cannon-es.

## Prototype hypothesis

The fun should come from **observe → predict → trigger → watch the consequence**, not from manually placing a full domino line. This first slice validates camera readability, domino physics, chain-reaction satisfaction, and ten compact level shapes before implementing editable puzzle pieces.

## 10 prototype levels

| # | Level | Puzzle idea | Mechanic being tested |
|---|---|---|---|
| 1 | 第一推 | Straight chain | Basic domino readability and impact |
| 2 | 轉個彎 | 90° route | Direction change |
| 3 | 蛇蛇走 | S curve | Dense curved chain readability |
| 4 | 滾球球 | Hit a ball at the end | Domino → object handoff |
| 5 | 叫醒貓 | Reach a sleeping cat | Character as goal |
| 6 | 雞飛狗跳 | Reach a chicken across offset rows | Broken visual rhythm / comic target |
| 7 | 繞圈圈 | Half-circle route | Camera + curved spatial reasoning |
| 8 | 叮一聲 | Hit a bell | Audio/feedback target placeholder |
| 9 | 螺旋 | Collapse inward | Dense 3D chain spectacle |
| 10 | 飛高高 | Reach a balloon | Vertical interaction target placeholder |

## Controls

- Drag: orbit camera
- `推！`: apply the first impulse
- `↻`: reset current level
- 1–10: switch prototype level

## Next validation slice

After physical tuning, add one movable/rotatable missing domino per level and explicit success/failure detection. Then replace placeholder props with actual interactive rigid bodies and character reactions.
