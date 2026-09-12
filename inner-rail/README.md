# Inner Rail

Mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P1.3 — Moving Rail × Magnetic Rail Composition**

P1.1 Magnetic Rail is accepted core vocabulary. P1.2 established the implementation boundary for deterministic kinematic rails; the isolated P1.2 phone gate remains available as a regression route, but the current product test now composes both rules directly.

The active route is:

`ordinary approach → magnetic bank climb → 48° moving magnetic shuttle → opposite magnetic receiver → gradual magnetic unwind → ordinary release → brake goal`

The shuttle is one physical collider with two simultaneous properties:

- it is **magnetic**, so passive down is rebased into its 48° surface;
- it is **kinematic**, so the same collider moves laterally on a deterministic seven-second cycle;
- Cannon owns the live transform used for collision and velocity;
- magnetic sampling follows that same live transform instead of the authored rest position;
- Three.js only projects the current simulation pose.

There is no detach button, countdown HUD, scripted carry, automatic forward force, or hidden floor. The player must remain attached while the shuttle moves, then decide when to leave for the opposite magnetic receiver as the surfaces align.

## P1.3 phone gate

On a real phone, verify that:

1. the sphere stays magnetically attached to the **moving** 48° shuttle without field lag or sudden drop;
2. lateral platform motion physically carries/pushes the sphere without visible collider jitter;
3. the opposite receiver can be read from world geometry and shuttle motion alone;
4. waiting versus committing to the receiver creates a clear timing decision;
5. failed transfers naturally cause a different timing, braking, or forward-tilt decision;
6. camera and screen-relative tilt semantics stay stable while the attached surface moves sideways;
7. returning from 48° to flat magnetic track and then ordinary gravity feels continuous.

The composition passes only if the combined decision is richer than playing Magnetic Rail and Moving Rail as two unrelated set pieces.

## Regression modes

- default: **P1.3 Magnetic Shuttle composition**
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

No new player input is introduced for the composition.

## Commands

```bash
npm ci
npm test
npm run build
```
