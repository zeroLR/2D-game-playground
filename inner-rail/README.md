# Inner Rail

Mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P1.2 — Moving Rail / Prediction & Timing Gate**

P1.1 Magnetic Rail is accepted as core Physical Puzzle Vocabulary. P1.2 now isolates a second rule: **the world can move on a predictable physical cycle while the player keeps the same tilt-to-gravity controls**.

The active P1.2 route is:

`ordinary approach → waiting deck → lateral moving bridge → ordinary exit → brake goal`

The amber bridge follows a deterministic six-second sine cycle. It starts aligned with the route, travels 4.8 world units laterally, slows at the far turnaround, then returns. There is a real forward gap beneath the crossing; no hidden floor or scripted rescue exists.

### Moving Rail rule

- the moving bridge is a Cannon kinematic body, not a render-only animation;
- physics owns its transform and velocity; Three.js only renders the current simulation state;
- contact with the moving bridge is ordinary physical contact using the same global friction/restitution rules;
- no countdown HUD, random timing, auto-forward movement, jump, or new player button is introduced;
- manual restart resets the motion phase for a reproducible test; checkpoint recovery leaves the live cycle running.

The bridge uses amber emissive material, repeated surface bands, and a subtle under-platform travel guide so its role and motion path are readable from the world itself.

## P1.2 phone gate

On a real phone, verify that:

1. the bridge cycle can be understood without a countdown;
2. waiting for alignment versus committing early creates a noticeable choice;
3. boarding while the bridge is moving produces believable contact/carry behavior rather than collider jitter;
4. failed crossings naturally cause a different timing or approach-speed decision;
5. camera comfort remains stable while the world moves independently of the sphere;
6. the mechanic still feels like Inner Rail's tilt / gravity / momentum loop rather than a scripted platform sequence.

Moving Rail is kept only if it adds a distinct prediction/timing decision. It should be tested by itself before composing it with Magnetic Rail or introducing rotating surfaces.

## Regression modes

- default: **P1.2 Moving Rail**
- `?stage=p1-magnetic`: accepted **P1.1 Magnetic Rail** route
- `?stage=p0`: frozen **P0** validation route
- append `&debug=1` for telemetry and Traditional Chinese tuning controls

P0 device-run history remains separate from P1. Synthetic input is development-only evidence for phone validation.

## Phone controls

1. Tap **ENABLE MOTION**.
2. Hold the phone naturally and tap **SET NEUTRAL & START**.
3. Tilt forward/back/left/right to redirect effective gravity.
4. Return toward neutral to coast; tilt against momentum to brake or reverse.
5. Use **RECENTER** when your natural holding pose changes.
6. Use **RESTART** to restart the active prototype route and reset its authored motion cycle.

No new input is introduced for Moving Rail.

## Commands

```bash
npm ci
npm test
npm run build
```
