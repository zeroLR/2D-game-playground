# Inner Rail

Mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P2.2 — Authored Spatial Puzzle Set**

P2.1 Compact Puzzle Room Grammar passed on a real phone: the elevated goal, folded route, height change, and later return through previously seen chamber space read as one spatial puzzle rather than a longer obstacle course.

The accepted gameplay vocabulary remains intentionally small:

- **Magnetic Rail** changes the local down direction while preserving the same tilt controls;
- **Moving Rail** changes the world on deterministic physical cycles;
- the two rules can act on the same collider as a moving magnetic surface.

P2.2 now asks whether this same vocabulary and room grammar can support a small authored progression without adding another mechanic.

## Authored room set

Test the rooms in this order:

1. **Room A — Teach** (default or `?stage=p2-room-a`)
   - elevated goal is visible near the start;
   - lower route folds around the chamber;
   - moving magnetic lift changes elevation;
   - ordinary moving bridge introduces an upper timing decision;
   - the route returns above previously seen space.
2. **Room B — Vary** (`?stage=p2-room-b`)
   - timing happens first on a lower moving bridge;
   - the magnetic lift is found only after crossing to the far side;
   - the upper route returns above the floor-level path toward the goal near the starting side.
3. **Room C — Mastery** (`?stage=p2-room-c`)
   - vertical moving magnetic lift reaches the upper route;
   - a second moving magnetic surface acts as a lateral shuttle;
   - the player must combine both known physical relationships with a larger mental map before returning toward the start-side goal.

The set deliberately varies **spatial relationships and ordering**, not vocabulary. There is still no minimap, objective arrow, tutorial text, switch, key, friction gimmick, jump, detach command, or new input.

## P2.2 progression gate

On a real phone, play A → B → C and verify that:

1. Room A teaches the room grammar without explanatory UI;
2. Room B feels recognizably related but requires a different plan because timing precedes elevation;
3. Room C feels like mastery of known rules rather than the introduction of a hidden new rule;
4. route preview, height, and moving/magnetic material language remain readable as room density increases;
5. each room can be mentally summarized after completion in one or two spatial relationships;
6. later rooms become harder through composition and topology, not merely longer tracks or narrower margins;
7. by Room C, the player is planning several relationships ahead instead of reacting only to the next platform.

Do not add a third gameplay mechanic unless this authored set exposes a concrete content gap that cannot be solved by varying the accepted grammar.

## Regression modes

- default / `?stage=p2-room-a`: **P2.2 Room A — Teach**
- `?stage=p2-room-b`: **P2.2 Room B — Vary**
- `?stage=p2-room-c`: **P2.2 Room C — Mastery**
- `?stage=p1-generalization`: accepted **P1.4 Vertical Magnetic Lift**
- `?stage=p1-composition`: accepted **P1.3 Magnetic Shuttle**
- `?stage=p1-moving`: isolated **P1.2 Moving Rail**
- `?stage=p1-magnetic`: accepted **P1.1 Magnetic Rail**
- `?stage=p0`: frozen **P0** validation route
- append `&debug=1` for telemetry and Traditional Chinese tuning controls

## Phone controls

1. Tap **ENABLE MOTION**.
2. Hold the phone naturally and tap **SET NEUTRAL & START**.
3. Tilt forward/back/left/right to redirect effective gravity.
4. Return toward neutral to coast; tilt against momentum to brake or reverse.
5. Use **RECENTER** when your natural holding pose changes.
6. Use **RESTART** to restart the active room and reset its authored motion cycles.

No new player input is introduced for P2.2.

## Commands

```bash
npm ci
npm test
npm run build
```
