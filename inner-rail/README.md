# Inner Rail

Mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P1.4 — Composition Generalization / System Depth Gate**

P1.1 Magnetic Rail is accepted core vocabulary. P1.2 established deterministic kinematic rail motion. P1.3 proved the first combined surface: a moving magnetic shuttle can act as one physical object instead of two sequential set pieces.

P1.4 does **not** add another mechanic. It asks whether the same Moving + Magnetic vocabulary can produce a second, meaningfully different puzzle.

The active route is:

`ordinary approach → magnetic bank to 36° → vertical moving magnetic lift → elevated magnetic receiver → magnetic unwind → elevated ordinary brake / goal`

The lift is simultaneously:

- **magnetic**, so passive down remains attached to the 36° surface;
- **kinematic**, moving 4.6 world units vertically on a deterministic eight-second cycle;
- physically authoritative in Cannon for contact, velocity, and magnetic field position;
- rendered from the same live simulation pose.

Unlike P1.3's lateral alignment puzzle, the intended decision is to **hold position on a short rising surface, read the upper docking window, and prepare forward momentum before the receiver becomes reachable**.

## P1.4 phone gate

On a real phone, verify that:

1. the sphere remains attached while the magnetic surface rises and descends;
2. vertical platform motion feels physically believable rather than jittery or springy;
3. the upper receiver is readable from world geometry without a height meter or countdown;
4. staying on the short lift requires understandable braking / position control;
5. successful transfer requires preparing forward momentum before or during the upper docking window;
6. a missed transfer causes a different hold / timing / momentum decision on retry;
7. the puzzle feels materially different from P1.3's sideways shuttle despite using exactly the same vocabulary.

The system-depth gate passes only if #7 is true. If the solution reduces to "wait until aligned, then hold forward" again, the composition has not generalized enough.

## Regression modes

- default: **P1.4 Vertical Magnetic Lift**
- `?stage=p1-composition`: accepted **P1.3 Magnetic Shuttle** composition
- `?stage=p1-moving`: isolated **P1.2 Moving Rail**
- `?stage=p1-magnetic`: accepted **P1.1 Magnetic Rail**
- `?stage=p0`: frozen **P0** validation route
- append `&debug=1` for telemetry and Traditional Chinese tuning controls

Moving magnetic surfaces now show both cyan magnetic bands and amber movement bands so composed physical rules remain readable directly from the world.

## Phone controls

1. Tap **ENABLE MOTION**.
2. Hold the phone naturally and tap **SET NEUTRAL & START**.
3. Tilt forward/back/left/right to redirect effective gravity.
4. Return toward neutral to coast; tilt against momentum to brake or reverse.
5. Use **RECENTER** when your natural holding pose changes.
6. Use **RESTART** to restart the active route and reset its authored motion cycle.

No new player input is introduced for P1.4.

## Commands

```bash
npm ci
npm test
npm run build
```
