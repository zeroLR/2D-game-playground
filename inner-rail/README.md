# Inner Rail

Mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P0.1.1 — Orientation-Agnostic Tilt Harness**

This slice keeps the P0 input contract independent of portrait/landscape so P0.2 can compare both on real hardware before the product commits to one presentation:

`Device orientation → screen correction → neutral calibration → dead zone / saturation → smoothing → normalized gravity direction`

### Included

- device-orientation permission flow, including iOS-style `requestPermission()` support;
- explicit first-sample timeout and denied/unavailable recovery state;
- neutral calibration and persistent `RECENTER` action;
- screen-orientation correction in pure/testable math;
- 1.5° dead zone, 25° saturation target, exponential smoothing;
- desktop synthetic tilt using the same `TiltInput` abstraction;
- responsive portrait and landscape harness layouts with no orientation blocker;
- automatic return to neutral calibration when the viewport rotates between portrait and landscape;
- visible portrait/landscape test-mode label;
- `?debug=1` telemetry for viewport orientation plus raw/corrected/calibrated/filtered input and gravity preview;
- visible bootstrap failure UI rather than an inert mount point.

Three.js and cannon-es are installed to preserve the agreed P0 technical stack, but the P0.1 family deliberately does not instantiate the renderer or physics world. P0.2 owns that integration.

## Controls

### Phone

1. Open in either portrait or landscape.
2. Tap **ENABLE MOTION**.
3. Hold the phone in a comfortable neutral pose and tap **SET NEUTRAL**.
4. Tilt left/right and forward/back; the field vector should respond in screen coordinates.
5. Rotate the device whenever you want to compare portrait and landscape. The harness will require a fresh neutral pose after the orientation changes.
6. Tap **RECENTER** whenever the physical holding pose changes.

### Desktop / development

- Start **DESKTOP TILT TEST**.
- Calibrate once.
- Drag the synthetic pad or use WASD / arrow keys.
- Append `?debug=1` to expose input telemetry.

## P0.1.1 phone gate

CI verifies the implementation, but the orientation decision remains a real-device gameplay question.

Test the same tilt tasks in both portrait and landscape and compare:

- directional correctness and fine-control stability;
- comfort of the physical holding pose;
- readability of forward space for the upcoming first-person camera;
- whether recenter after rotation reliably restores neutral control;
- denied/unavailable/no-sample sensor recovery.

Do not choose the final product orientation from layout preference alone. P0.2 should evaluate both with the same ball physics and stabilized camera.

## Commands

```bash
npm ci
npm test
npm run build
```

## Next slice

**P0.2 — Ball Physics + Stabilized First-Person Camera**, with portrait/landscape A/B testing retained until the phone feel evidence is strong enough to lock the product orientation.
