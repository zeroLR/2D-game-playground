# Inner Rail — P0 Phone Validation Log

Use this sheet only for the **P0.4 Phone Feel / Comfort Gate**. Do not add tutorials, progression, or new mechanics to improve these results.

## Build under test

- Commit / PR:
- Date:
- Device / browser:
- Tuning baseline:
  - tilt sensitivity:
  - dead zone:
  - full-force tilt:
  - input response:
  - ball inertia:
  - track friction:
  - contact bounce:
  - FOV:
  - track follow:

## Orientation A/B

Run the same build and tuning in both orientations before choosing a product default.

| Dimension | Portrait | Landscape | Notes |
| --- | --- | --- | --- |
| Two-axis control precision |  |  |  |
| Comfortable holding posture |  |  |  |
| Forward track readability |  |  |  |
| First-person presence |  |  |  |
| Camera comfort |  |  |  |
| Preferred overall |  |  |  |

Do not lock orientation from completion time alone. The P0 spec requires control precision, posture comfort, forward readability, and first-person presence to be considered together.

## Five-player external test

Give no explanation beyond the in-game start / calibration flow.

| Player | Accelerate / brake / turn intentionally? | Finish within 3 attempts? | Gap solved by deliberate run-up? | Camera blocked continuation? | Describes tilt / gravity / momentum? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| P1 |  |  |  |  |  |  |
| P2 |  |  |  |  |  |  |
| P3 |  |  |  |  |  |  |
| P4 |  |  |  |  |  |  |
| P5 |  |  |  |  |  |  |

## Acceptance thresholds

P0 passes only when all of these hold:

- **4/5 or more** intentionally accelerate, brake, and change direction after calibration.
- **3/5 or more** finish the full validation track within three attempts.
- **3/5 or more** clear the gap by visibly adjusting run-up speed rather than random repetition.
- **1/5 or fewer** report the camera as the primary reason they cannot continue the short session.
- Players describe the control in terms equivalent to **tilt / gravity / momentum**, not joystick-like direct movement.
- Portrait vs landscape evidence is clear enough to choose one primary orientation.

## Track diagnosis

Record the first section where each problem appears. Fix the earliest causal layer rather than compensating later in the course.

| Section | Input clarity | Momentum readability | Camera comfort | Geometry readability | Notes |
| --- | --- | --- | --- | --- | --- |
| Calibration Deck |  |  |  |  |  |
| Wide S-Curve |  |  |  |  |  |
| Narrow Rail |  |  |  |  |  |
| Momentum Dip + Gap |  |  |  |  |  |
| Banked Turn |  |  |  |  |  |
| Goal Brake Zone |  |  |  |  |  |

## Decision

- [ ] P0 PASS — lock primary orientation and enter P1.
- [ ] Remain in P0.4 — input mapping / calibration issue.
- [ ] Remain in P0.4 — camera comfort issue.
- [ ] Remain in P0.4 — global physics tuning issue.
- [ ] Remain in P0.4 — validation-track geometry issue.

### Final orientation

- Primary orientation:
- Why it won:
- Evidence that mattered most:

### Locked baseline tuning

Record the final values that should replace the temporary prototype defaults before P1 begins.
