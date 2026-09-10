# Inner Rail

Landscape-first mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P0.1 — Repository Scaffold + Tilt Input Harness**

This slice validates the input pipeline before ball physics or a 3D track is introduced:

`Device orientation → screen correction → neutral calibration → dead zone / saturation → smoothing → normalized gravity direction`

### Included

- device-orientation permission flow, including iOS-style `requestPermission()` support;
- explicit first-sample timeout and denied/unavailable recovery state;
- neutral calibration and persistent `RECENTER` action;
- screen-orientation correction in pure/testable math;
- 1.5° dead zone, 25° saturation target, exponential smoothing;
- desktop synthetic tilt using the same `TiltInput` abstraction;
- landscape-only mobile presentation with a portrait rotate-device state;
- `?debug=1` telemetry for raw/corrected/calibrated/filtered input and gravity preview;
- visible bootstrap failure UI rather than an inert mount point.

Three.js and cannon-es are installed now to preserve the agreed P0 technical stack, but P0.1 deliberately does not instantiate the renderer or physics world. P0.2 owns that integration.

## Controls

### Phone

1. Open in landscape.
2. Tap **ENABLE MOTION**.
3. Hold the phone in a comfortable neutral pose and tap **SET NEUTRAL**.
4. Tilt left/right and forward/back; the field vector should respond in screen coordinates.
5. Tap **RECENTER** whenever the physical holding pose changes.

### Desktop / development

- Start **DESKTOP TILT TEST**.
- Calibrate once.
- Drag the synthetic pad or use WASD / arrow keys.
- Append `?debug=1` to expose input telemetry.

## P0.1 phone gate

This implementation is ready for the required real-device gate; the gate is not considered passed by CI alone.

- landscape tilt direction remains perceptually consistent;
- recenter returns the field to neutral without reloading;
- portrait presents a clear rotate-device state;
- denied/unavailable/no-sample sensor states remain recoverable;
- desktop fallback exercises the same normalized input contract.

## Commands

```bash
npm ci
npm test
npm run build
```

## Next slice

**P0.2 — Ball Physics + Stabilized First-Person Camera** after the P0.1 phone gate is confirmed.
