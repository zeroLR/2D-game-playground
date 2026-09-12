# Inner Rail

Mobile web prototype for a first-person kinetic puzzle where device tilt changes the effective gravity field acting on a rolling sphere.

## Current milestone

**P1.1 — Magnetic Rail / Attached Surface Vocabulary**

The core control remains unchanged:

`Device tilt → calibrated gravity → sphere momentum → track interaction → track-forward stabilized camera`

P1 adds one world rule at a time. The first candidate is a **magnetic rail surface**: luminous cyan rail pieces attract the sphere toward their local surface, allowing the route to roll past vertical without adding a button, steering assist, or scripted path constraint.

> P0.4 tuning/validation instrumentation remains available, but the external five-player P0 gate and final primary-orientation lock are still open. P1.1 is therefore an exploratory vocabulary slice, not a retroactive declaration that P0 passed.

## P1.1 vocabulary test

The default prototype now opens a short authored magnetic test route:

1. **Normal approach** — establishes ordinary gravity/momentum behavior.
2. **Magnetic entry** — luminous material introduces attachment on a flat surface.
3. **Roll transition** — the magnetic rail rolls through 25°, 55°, 85°, and a 115° overhang.
4. **Return transition** — the same rail rolls back toward horizontal.
5. **Magnetic release** — luminous material ends and normal momentum behavior resumes.
6. **Goal brake** — player must slow inside the final goal using the existing reverse-tilt braking rule.

The magnetic field is local to authored magnetic pieces. It does not steer along the route, change player input, or set velocity directly.

### World readability

Magnetic surfaces use a distinct luminous cyan material and repeated longitudinal bands. While attachment is active, the inner sphere reference becomes slightly brighter. This is world/state feedback; there is no new gameplay HUD or icon language.

## P1.1 phone gate

On a real phone, verify that:

- the luminous surface reads as a distinct physical state before explanation is needed;
- the sphere can traverse the overhanging section using the same tilt/gravity control;
- the player still needs to manage forward speed and lateral correction rather than being carried by the magnet;
- leaving the luminous rail clearly returns to ordinary momentum behavior;
- camera stabilization remains comfortable while the physical surface rolls past vertical;
- the mechanic changes route planning enough to justify keeping it.

If magnetic attachment only makes the route easier or more spectacular without creating a new force/momentum decision, remove or redesign it before adding another vocabulary item.

## P0 regression mode

Append `?stage=p0` to return to the frozen P0 validation track. Add `&debug=1` for telemetry and tuning.

P0 device-run history remains separate from P1. Synthetic input is still development-only evidence for phone validation.

## Phone controls

1. Tap **ENABLE MOTION**.
2. Hold the phone naturally and tap **SET NEUTRAL & START**.
3. Tilt forward/back/left/right to redirect effective gravity.
4. Return toward neutral to coast; tilt against momentum to brake or reverse.
5. Use **RECENTER** when your natural holding pose changes.
6. Use **RESTART** to restart the active prototype route.

No new input is introduced for magnetic attachment.

## Debug feel tuning

Append `?debug=1` to expose the existing Traditional Chinese tuning panel for input, physics, and camera feel. Magnetic strength is intentionally **not** exposed as a player-feel slider in P1.1; it is a mechanic rule that should first be judged as a coherent authored behavior.

Debug telemetry now also shows the active magnetic piece and attachment strength.

## Commands

```bash
npm ci
npm test
npm run build
```

## Next vocabulary decision

Keep **Magnetic Rail** only if P1.1 demonstrates a meaningful new planning state. If accepted, the next candidate should build on it—most likely a controlled wall/inversion test—rather than introducing an unrelated mechanic immediately.
