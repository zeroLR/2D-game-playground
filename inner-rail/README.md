# Inner Rail

Mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P1.1 — Magnetic Rail accepted / P1.2 candidate selection**

The core control remains tilt-driven. Magnetic Rail has now passed its real-phone vocabulary gates: luminous surfaces can become the local down direction, the player can traverse a controllable 78° wall ride without changing the input model, and the release sequence creates intentional speed / braking / momentum decisions.

The accepted P1.1 loop is:

`ordinary approach → magnetic entry → gradual wall ride → 78° hold → return to 60° → magnetic release gap → lower ordinary catch deck → brake goal`

The luminous material ends while the surface is still banked. World gravity returns immediately; there is no hidden floor, scripted impulse, detach button, or automatic forward force. Successful play requires preparing enough speed before release, then managing the remaining momentum after landing.

### Accepted Magnetic Rail rule

While attached:

- passive down points into the magnetic surface;
- forward/back tilt remains camera-relative and drives route momentum;
- left/right tilt remains screen-relative rather than rotating with the rail;
- local normal-only attraction stabilizes capture across authored seams;
- the magnet never writes velocity or provides path-tangent propulsion.

On ordinary track, the unchanged P0 world-gravity model applies immediately.

### Accepted phone evidence

- magnetic attraction is clearly perceptible;
- the sphere remains attached on steep magnetic surfaces instead of immediately falling;
- progressive roll geometry supports a stable 78° wall ride;
- braking and backward motion remain controllable while attached;
- the magnetic release makes approach speed and braking matter;
- retries naturally lead to different momentum preparation rather than simply holding forward.

This is sufficient to keep Magnetic Rail as core Physical Puzzle Vocabulary. Full 90°+ inversion remains deferred; it is an extension, not a requirement for the accepted base mechanic.

> P0.4 tuning/validation instrumentation remains available via `?stage=p0`. The external five-player P0 gate and final orientation lock remain open; P1 exploration does not retroactively mark P0 PASS.

## Next vocabulary direction

The next recommended candidate is **P1.2 — Moving / Rotating Rail**.

The goal is not spectacle. A moving or rotating surface should introduce prediction and timing while preserving the same tilt-to-gravity control contract. It should compose with Magnetic Rail so players must decide when to enter, how much momentum to retain, and whether to wait, brake, or commit before the surface changes orientation.

Do not add full inversion, switches, or alternate friction at the same time. P1.2 should isolate one moving-surface rule first and keep it only if it creates a distinct decision that static Magnetic Rail cannot already provide.

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
