# Inner Rail

Mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P1.1.3 — Magnetic Decision Gate**

The core control remains tilt-driven. Magnetic Rail is now technically established: luminous surfaces can become the local down direction, allowing a controllable 78° wall ride without changing the player's input model.

P1.1.3 asks the more important product question: **does magnetic attachment change how the player plans momentum?**

The active route now follows this loop:

`ordinary approach → magnetic entry → gradual wall ride → 78° hold → return to 60° → magnetic release gap → lower ordinary catch deck → brake goal`

The luminous material deliberately ends while the surface is still banked. World gravity returns immediately; there is no hidden floor, scripted impulse, detach button, or automatic forward force. The player must prepare enough speed before release to reach the lower catch deck, then manage the remaining momentum on ordinary track.

### Magnetic rule

While attached:

- passive down points into the magnetic surface;
- forward/back tilt remains camera-relative and drives route momentum;
- left/right tilt remains screen-relative rather than rotating with the rail;
- local normal-only attraction stabilizes capture across authored seams;
- the magnet never writes velocity or provides path-tangent propulsion.

On ordinary track, the unchanged P0 world-gravity model applies immediately.

> P0.4 tuning/validation instrumentation remains available via `?stage=p0`. The external five-player P0 gate and final orientation lock remain open; P1 exploration does not retroactively mark P0 PASS.

## P1.1.3 phone gate

On a real phone, verify that:

1. the 78° wall ride still feels as stable as the accepted P1.1.2 pass;
2. approaching the end of the glow creates a clear reason to think about speed;
3. insufficient momentum can miss the ordinary catch deck rather than being invisibly rescued;
4. excess momentum creates a braking/correction problem after landing;
5. retrying naturally leads to a different approach-speed or braking decision;
6. the switch from magnetic gravity to ordinary gravity is understandable from world behavior alone.

If the route can still be solved by simply holding forward without reconsidering speed, Magnetic Rail has not yet earned its place as core puzzle vocabulary.

## World readability

Magnetic surfaces use luminous cyan material and repeated longitudinal bands. While attachment is active, the inner sphere reference becomes slightly brighter. No persistent gameplay HUD or icon is added for the mechanic.

## P0 regression mode

Append `?stage=p0` to return to the frozen P0 validation track. Add `&debug=1` for telemetry and Traditional Chinese tuning controls.

P0 device-run history remains separate from P1. Synthetic input is development-only evidence for phone validation.

## Phone controls

1. Tap **ENABLE MOTION**.
2. Hold the phone naturally and tap **SET NEUTRAL & START**.
3. Tilt forward/back/left/right to redirect effective gravity.
4. Return toward neutral to coast; tilt against momentum to brake or reverse.
5. Use **RECENTER** when your natural holding pose changes.
6. Use **RESTART** to restart the active prototype route.

No new input is introduced for Magnetic Rail.

## Commands

```bash
npm ci
npm test
npm run build
```

## Next vocabulary decision

Keep Magnetic Rail only if P1.1.3 proves intentional approach / speed / release planning. Only after that decision should the project consider full inversion or a second physical vocabulary item.
