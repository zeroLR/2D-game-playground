# Inner Rail

Mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P0.4 — Phone Feel / Comfort Gate**

The playable loop is now:

`Device tilt → calibrated gravity → cannon-es sphere → authored validation track → track-forward stabilized camera`

The camera follows the authored route direction rather than instantaneous ball velocity, so braking and deliberate backward movement do not rotate the view 180°.

P0.4 does **not** add new gameplay rules. It exists to settle the feel baseline and decide whether the physical identity is strong enough to enter P1.

### Validation track

The same global physics rules drive the full course:

1. Calibration Deck — basic cause/effect.
2. Wide S-Curve — anticipatory correction.
3. Narrow Rail — fine control.
4. Momentum Dip + Gap — run-up judgment.
5. Banked Turn — physical line choice.
6. Goal Brake Zone — deliberate braking.

Falling recovers to the latest authored checkpoint. The gap contains no hidden floor or scripted launch force.

## Phone controls

1. Tap **ENABLE MOTION**.
2. Hold the phone naturally and tap **SET NEUTRAL & START**.
3. Tilt forward/back/left/right to redirect effective gravity.
4. Return toward neutral to coast; tilt against momentum to brake or reverse.
5. Use **RECENTER** when your natural holding pose changes.
6. Use **RESTART** for a fresh timed validation attempt.

Portrait and landscape remain valid test modes until P0.4 provides enough evidence to lock one primary product orientation.

## Debug feel tuning

Append `?debug=1` and open **TUNE / P0.4 FEEL**. These controls are prototype instrumentation, not player settings.

### Input

- **Tilt sensitivity** — how little physical tilt is required to reach the same maximum field.
- **Neutral dead zone** — how much hand tremor is ignored around the calibrated pose.
- **Full-force tilt** — physical angle at which input saturates.
- **Input response** — exponential smoothing response; higher reacts faster.

### Physics

- **Ball inertia** — mapped to global linear damping.
- **Track friction** — one global ball/track contact friction value.
- **Contact bounce** — one global restitution value.

### Camera

- **Camera zoom / FOV** — first-person field of view.
- **Track follow** — how quickly yaw converges toward authored route-forward.

Changing a tuning value invalidates the current validation timer; press **RESTART** before recording a comparison run. Values persist locally on the test device. Older P0.2 tuning values migrate where compatible.

## P0.4 validation telemetry

Completed runs record locally on the test device:

- portrait / landscape;
- device motion / synthetic input;
- total completion time;
- fall count;
- per-section elapsed time;
- tuning snapshot used for the run.

`?debug=1` shows the best completed **device-motion** run for portrait and landscape. Synthetic runs remain useful for development but do not count toward the phone gate.

Use `docs/plans/inner-rail/P0-VALIDATION-LOG.md` for the five-player external protocol and orientation A/B notes.

## P0.4 pass criteria

P0 passes only after real-phone testing confirms the acceptance thresholds in the prototype spec, including:

- at least 4/5 testers intentionally accelerate, brake, and change direction;
- at least 3/5 finish within three attempts;
- at least 3/5 solve the gap through deliberate run-up adjustment;
- no more than 1/5 is blocked primarily by camera discomfort;
- players describe the control as tilt / gravity / momentum rather than joystick-like movement;
- portrait vs landscape evidence is strong enough to lock the primary orientation.

Do not enter P1 by compensating for a failed gate with more tutorials, obstacles, assists, or progression.

## Commands

```bash
npm ci
npm test
npm run build
```

## Next slice

**P1 — Physical Puzzle Vocabulary**, only after P0.4 locks the baseline feel and primary orientation and the external validation gate passes.
