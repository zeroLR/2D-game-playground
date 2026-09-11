# Inner Rail

Mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P0.2 — Ball Physics + Stabilized First-Person Camera**

P0.2 turns the proven input harness into the first playable physical loop:

`Device tilt → camera-relative gravity → cannon-es sphere → momentum → stabilized first-person camera`

Portrait and landscape remain equal test modes. They use the same input response, ball physics, camera behavior, FOV policy, and sandbox geometry so the eventual orientation decision is based on real gameplay evidence rather than layout preference.

### Included

- cannon-es dynamic sphere with one global material/handling configuration;
- camera-relative effective gravity with approximately constant gravity magnitude;
- broad enclosed sandbox for acceleration, braking, turning, reversing, and wall recovery;
- fixed-step physics with a safety-only maximum speed bound;
- Three.js first-person renderer positioned inside the sphere;
- camera translation follows the ball while camera roll is independent of rigid-body spin;
- damped velocity-heading yaw with a low-speed hold threshold;
- conservative airborne pitch and subtle speed-based FOV expansion;
- `prefers-reduced-motion` removes nonessential shell/pitch/FOV motion;
- faint rotating inner-shell reference so physical ball rotation can be perceived while the horizon remains stable;
- runtime **RESTART** and **RECENTER** actions;
- rotating between portrait and landscape pauses the sandbox and requires a fresh neutral pose;
- `?debug=1` telemetry for input, world gravity, ball state, grounded approximation, speed, camera yaw/pitch/FOV, and recovery count;
- pure tests for orientation, camera-relative gravity, and camera angle damping.

## Controls

### Phone

1. Open in portrait or landscape.
2. Tap **ENABLE MOTION**.
3. Hold the phone comfortably and tap **SET NEUTRAL & START**.
4. Tilt forward to accelerate; return to neutral to coast.
5. Tilt against motion to brake or reverse.
6. Tilt left/right while moving to redirect the gravity field and curve the trajectory.
7. Use **RECENTER** if your natural holding pose changes; use **RESTART** to reset the sandbox.
8. Rotate the phone and recalibrate to compare portrait and landscape under the same simulation rules.

### Desktop / development

- Start **DESKTOP TILT TEST**.
- Calibrate once.
- WASD / arrow keys or the drag pad feed the same `TiltInput` abstraction.
- Append `?debug=1` to expose the tuning telemetry.

## P0.2 phone gate

The sandbox must be sufficient to prove the physical sensation before P0.3 adds authored track geometry.

On a real phone, in both portrait and landscape, verify that you can intentionally:

1. accelerate forward;
2. turn left/right without the camera feeling like direct steering;
3. reverse direction;
4. brake to near-stop by tilting against momentum;
5. hit a wall and recover orientation;
6. understand that the sphere is rotating while the camera horizon does not inherit that roll.

Also compare portrait vs landscape on:

- fine-control precision;
- physical holding comfort;
- visibility of forward space;
- first-person presence / sense of being inside the ball.

If camera comfort or force semantics are weak, remain in P0.2. Do not hide those issues with track gimmicks or tutorials.

## Commands

```bash
npm ci
npm test
npm run build
```

## Next slice

**P0.3 — 60–90 Second Validation Track** only after the P0.2 real-phone movement/camera gate is accepted. The final primary orientation may remain open until the phone comparison produces a clear winner.
