# Inner Rail — Prototype Roadmap

> Goal: prove the first-person gyro/physics identity on a real phone before investing in puzzle devices, content production, or progression.

## Delivery strategy

Every slice ends in an observable gameplay gate. P0 implementation is complete only when the 60–90 second test track is playable on phone and the control/camera hypotheses have been evaluated.

```mermaid
flowchart LR
    S[P0 Spec] --> P01[P0.1 Scaffold + Tilt Harness]
    P01 --> P02[P0.2 Ball Physics + Stable Camera]
    P02 --> P03[P0.3 Validation Track]
    P03 --> P04[P0.4 Phone Feel Gate]
    P04 --> P1[P1 Physical Puzzle Vocabulary]
    P1 --> P2[P2 Spatial Puzzle Levels]
    P2 --> P3[P3 Sensory / Art Vertical Slice]
```

## P0 — Gameplay Prototype Spec

**Status:** defined in `P0-GAMEPLAY-PROTOTYPE-SPEC.md`.

**Decision:** validate **tilt → force → momentum → correction** and stabilized first-person comfort before adding mechanics.

---

## P0.1 — Repository Scaffold + Tilt Input Harness

**Objective:** create the deployable `inner-rail/` project and prove that device orientation can be permissioned, calibrated, normalized, and observed reliably.

### Deliverables

- [ ] `inner-rail/` Vite + strict TypeScript project
- [ ] Three.js + cannon-es dependencies and committed lockfile
- [ ] landscape-first full-screen shell
- [ ] explicit bootstrap failure state
- [ ] device-orientation permission flow
- [ ] neutral calibration / recenter
- [ ] screen-orientation correction
- [ ] dead-zone / clamp / smoothing pipeline
- [ ] desktop synthetic tilt source using the same `TiltInput` contract
- [ ] dev telemetry overlay
- [ ] unit tests for orientation math
- [ ] complete CI / GitHub Pages registration for the new game

### Gate

On an actual phone, tilting/recentering changes a visualized gravity vector consistently in landscape; portrait shows a clear rotate-device state; denied/unavailable sensors never leave a blank or inert screen.

---

## P0.2 — Ball Physics + Stabilized First-Person Camera

**Objective:** establish the physical sensation before building a level.

### Deliverables

- [ ] cannon-es world + dynamic sphere
- [ ] tilt-driven effective gravity
- [ ] one broad sandbox plane with walls
- [ ] global friction/restitution/damping config
- [ ] stable fixed-step physics update
- [ ] camera follows ball translation
- [ ] camera roll fixed independent of sphere rotation
- [ ] damped velocity/heading-based yaw
- [ ] conservative pitch behavior
- [ ] low-speed heading stability
- [ ] restart + recenter controls
- [ ] optional reduced-motion suppression of nonessential camera feedback

### Phone gate

From the sandbox alone, the player can intentionally:

1. accelerate forward;
2. turn left/right;
3. reverse direction;
4. brake to near-stop;
5. hit a wall and recover orientation.

If the camera is uncomfortable or braking feels like direct steering, remain in P0.2.

---

## P0.3 — 60–90 Second Validation Track

**Objective:** turn the established movement model into deliberate physical decisions without adding new rules.

### Track sections

- [ ] Calibration Deck
- [ ] Wide S-Curve
- [ ] Narrow Rail
- [ ] Momentum Dip + Gap
- [ ] Banked Turn
- [ ] Goal Brake Zone
- [ ] authored recovery checkpoints

### Design constraint

Every challenge must be solvable with the same gravity/ball rule set. No invisible assists, per-section handling changes, magnets, moving hazards, switches, or scripted launch forces.

### Gate

A competent player can complete the track through force/momentum control alone, and each section tests a visibly different skill: basic cause/effect, correction timing, precision, run-up judgment, fast line choice, and braking.

---

## P0.4 — Phone Feel / Comfort Gate

**Objective:** decide whether the product identity deserves expansion.

### Deliverables

- [ ] tune sensor smoothing/dead zone/saturation
- [ ] tune global ball friction/damping/restitution
- [ ] tune camera yaw/pitch/FOV behavior
- [ ] minimal impact/motion feedback only where it improves physical readability
- [ ] execute the P0 5-player validation protocol
- [ ] record observations against the P0 acceptance thresholds

### Decision

**PASS** only when control is understood, momentum produces intentional decisions, and the stabilized first-person view is acceptable for the short session.

If P0 fails, iterate the three fundamentals in this order:

```mermaid
flowchart LR
    A[Input mapping] --> B[Camera stabilization]
    B --> C[Physics tuning]
    C --> D[Track geometry]
```

Do not add tutorials or mechanics to hide a weak physical core.

---

## P1 — Physical Puzzle Vocabulary

**Objective:** expand the passed physical identity with the smallest set of mechanics that multiply decisions.

Candidates to evaluate one at a time:

- magnetic / attached rail state;
- wall ride / inversion;
- moving or rotating rail section;
- stateful gate / switch;
- alternate friction surface.

### Gate

A new mechanic must change how the player plans force/momentum and interact with existing track geometry. If it only adds spectacle or timing noise, remove it.

---

## P2 — Spatial Puzzle Levels

**Objective:** turn mechanics into readable 3D mental-map puzzles.

- authored compact mechanical objects rather than long race tracks;
- route preview through visible geometry, not minimap dependence;
- intentional reuse/crossing of previously visited space;
- level sequence teaches one spatial concept at a time;
- no content-count target until P1 vocabulary is proven.

---

## P3 — Sensory / Art Vertical Slice

**Objective:** establish the premium kinetic-toy identity after gameplay is proven.

Candidates:

- transparent / mechanical inner shell references;
- material language for rail states;
- restrained environment lighting and depth cues;
- rolling/contact/impact audio driven from physical state;
- meaningful haptics where platform support allows;
- diegetic direction/state cues instead of persistent HUD.

Final art must strengthen motion, surface state, and spatial readability before decoration.

---

## Explicitly later

Do not schedule these until a multi-level core exists:

- multiple collectible ball bodies;
- progression economy;
- cosmetics store;
- daily/season content;
- online leaderboards;
- backend accounts;
- monetization.

The immediate next executable slice is **P0.1 — Repository Scaffold + Tilt Input Harness**.
