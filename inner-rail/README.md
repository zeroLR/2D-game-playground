# Inner Rail

Mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P1 complete / P2.1 — Compact Puzzle Room Grammar next**

The current Physical Puzzle Vocabulary is intentionally small:

- **Magnetic Rail** changes the local down direction while preserving the same tilt controls;
- **Moving Rail** changes the world on deterministic physical cycles;
- the two rules can act on the same collider and remain collision-authoritative in Cannon.

P1.4 has now passed its system-depth gate on a real phone. The key evidence is that the same Moving + Magnetic vocabulary produced two materially different decisions:

- **P1.3 lateral magnetic shuttle** → read lateral alignment and choose when to transfer;
- **P1.4 vertical magnetic lift** → control position while being transported and prepare momentum before leaving the lift.

That distinction is enough to stop adding mechanics for now. The product question shifts from "what other physical rule can we add?" to **"can this vocabulary create compact, readable spatial puzzles?"**

## P2.1 direction

The next prototype should be one compact 3D puzzle room rather than another linear validation track.

Target structure:

`goal visible / inferable from start → route folds through one chamber → magnetic + moving surfaces change elevation / access → player revisits or crosses previously seen space → goal`

The room should:

- reuse the same physical vocabulary without switches, keys, friction gimmicks, or new controls;
- communicate route possibilities through geometry, material language, movement, and elevation;
- make at least one previously seen area readable from a new height or direction;
- remain understandable without a minimap, waypoint arrow, or text tutorial;
- feel like a spatial puzzle rather than a longer obstacle course.

P2.1 passes when the player can form a plausible mental route from the room itself and failures are about planning / timing / momentum rather than unclear objectives.

## Regression modes

The current default build still runs **P1.4 Vertical Magnetic Lift** until the P2.1 room is implemented.

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
6. Use **RESTART** to restart the active route and reset its authored motion cycle.

No new player input is planned for P2.1.

## Commands

```bash
npm ci
npm test
npm run build
```
