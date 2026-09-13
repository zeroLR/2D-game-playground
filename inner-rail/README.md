# Inner Rail

Mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P2.1 — Compact Puzzle Room Grammar**

P1 is closed for the current vertical-slice scope. The accepted vocabulary remains intentionally small:

- **Magnetic Rail** changes the local down direction while preserving the same tilt controls;
- **Moving Rail** changes the world on deterministic physical cycles;
- the two rules can act on the same collider as a moving magnetic surface.

P2.1 changes the design unit from a linear mechanic-validation track into one compact 3D puzzle room.

## Active room

The default route is:

`goal visible above the lower route → west lower loop → 24° moving magnetic lift → upper receiver → timed upper moving bridge → south return → elevated goal above previously seen space`

The goal beacon is deliberately visible near the start, but there is no direct lower connection. The intended spatial read is:

1. recognize the elevated destination;
2. follow the lower route around the chamber rather than toward the goal directly;
3. use the magnetic lift to change elevation;
4. cross the upper moving bridge;
5. return over the same chamber from above and reach the goal from the correct height.

No minimap, waypoint arrow, tutorial text, switch, key, friction gimmick, jump, or new input is introduced.

### Spatial-stack support

P2 introduces vertically reused X/Z space. Route-facing camera selection and recovery/section progress are therefore height-aware when upper and lower pieces overlap. This preserves the existing route-forward camera contract while preventing an upper route from inheriting the yaw or checkpoint of the floor below.

## P2.1 phone gate

On a real phone, verify that:

1. the elevated goal is visible or spatially inferable near the start;
2. a plausible route can be formed from world geometry before the room is completed;
3. elevation and rail orientation read as part of the solution rather than decoration;
4. passing through previously seen space from the upper level feels spatially coherent;
5. the magnetic lift and moving bridge remain readable when several candidate surfaces are visible together;
6. failures feel attributable to route planning, timing, or momentum—not uncertainty about the objective;
7. the room feels like one puzzle space rather than a longer obstacle course.

P2.1 passes only when the room itself teaches the plan without adding navigation UI.

## Regression modes

- default: **P2.1 Compact Puzzle Room**
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
6. Use **RESTART** to restart the active route and reset its authored motion cycles.

No new player input is introduced for P2.1.

## Commands

```bash
npm ci
npm test
npm run build
```
