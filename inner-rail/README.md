# Inner Rail

Mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P1.1.1 — Magnetic Attachment Correction**

The core control remains tilt-driven. P1 adds one world rule at a time; the first candidate is a **magnetic rail surface**.

The first P1.1 phone pass exposed a physics-model failure: surface-normal attraction alone does not keep a free-rolling sphere on a wall. Even when pressed into a vertical surface, ordinary world-down gravity remains tangent to that surface and makes the sphere roll downward.

P1.1.1 therefore defines the magnetic state as a local gravity anchor:

`Device tilt → calibrated camera-relative intent → magnetic surface anchors passive down → sphere momentum`

While attached:

- the passive down component points into the magnetic surface;
- forward/back tilt remains camera-relative and continues to drive route momentum;
- left/right tilt remains camera-relative rather than rotating with the rail;
- an additional local surface-normal attraction keeps capture stable across authored seams;
- the magnet never writes velocity or adds automatic forward/path-tangent propulsion.

On ordinary track, the P0 gravity model is unchanged.

> P0.4 tuning/validation instrumentation remains available, but the external five-player P0 gate and final primary-orientation lock are still open. P1 exploration does not retroactively mark P0 PASS.

## P1.1 vocabulary test

The default prototype opens a short authored magnetic test route:

1. **Normal approach** — ordinary gravity/momentum behavior.
2. **Magnetic entry** — luminous material introduces attachment on a flat surface.
3. **Roll transition** — magnetic rail rolls through 25°, 55°, 85°, and a 115° overhang.
4. **Return transition** — rail rolls back toward horizontal.
5. **Magnetic release** — luminous material ends and ordinary world-down gravity resumes.
6. **Goal brake** — player slows inside the final goal using reverse-tilt braking.

### World readability

Magnetic surfaces use a distinct luminous cyan material and repeated longitudinal bands. While attachment is active, the inner sphere reference becomes slightly brighter. This remains world/state feedback; no new persistent gameplay HUD or icon is introduced.

## P1.1.1 phone gate

On a real phone, verify that:

- entering luminous rail clearly changes the attachment state;
- neutral input can remain attached through the 85° / 115° overhang instead of immediately falling;
- forward/back tilt still moves along the route without automatic propulsion;
- ordinary left/right screen semantics do not suddenly rotate with the track;
- leaving the luminous rail clearly restores ordinary gravity/momentum;
- after attachment works, the mechanic actually creates useful speed/approach/release decisions.

If attachment works technically but only removes failure without creating decisions, Magnetic Rail still fails the P1 vocabulary gate.

## P0 regression mode

Append `?stage=p0` to return to the frozen P0 validation track. Add `&debug=1` for telemetry and tuning.

P0 device-run history remains separate from P1. Synthetic input is development-only evidence for phone validation.

## Phone controls

1. Tap **ENABLE MOTION**.
2. Hold the phone naturally and tap **SET NEUTRAL & START**.
3. Tilt forward/back/left/right to redirect effective gravity.
4. Return toward neutral to coast; tilt against momentum to brake or reverse.
5. Use **RECENTER** when your natural holding pose changes.
6. Use **RESTART** to restart the active prototype route.

No new button is introduced for magnetic attachment.

## Debug feel tuning

Append `?debug=1` to expose the existing Traditional Chinese tuning panel for input, physics, and camera feel. Magnetic strength remains an authored mechanic rule rather than a player tuning control.

Debug telemetry shows the active magnetic piece and attachment strength.

## Commands

```bash
npm ci
npm test
npm run build
```

## Next vocabulary decision

First close the **P1.1.1 attachment gate**. Only after the overhang is physically controllable should Magnetic Rail be judged for decision depth or used as a foundation for wall/inversion vocabulary.
