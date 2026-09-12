# Inner Rail — Prototype Roadmap

> Goal: prove the first-person gyro/physics identity, then expand it only with physical rules that multiply force/momentum decisions.

## Delivery strategy

Every slice ends in an observable gameplay gate. P1 vocabulary work evaluates one mechanic at a time; a candidate is kept only when it changes planning rather than adding spectacle or handling exceptions.

```mermaid
flowchart LR
    S[P0 Spec] --> P01[P0.1 Scaffold + Tilt Harness]
    P01 --> P011[P0.1.1 Orientation-Agnostic Harness]
    P011 --> P02[P0.2 Ball Physics + Stable Camera]
    P02 --> P03[P0.3 Validation Track]
    P03 --> P031[P0.3.1 Track-Forward Camera]
    P031 --> P04[P0.4 Phone Feel Gate]
    P04 --> P11[P1.1 Magnetic Rail]
    P11 --> P111[P1.1.1 Attachment Correction]
    P111 --> P1X[P1 Further Vocabulary]
    P1X --> P2[P2 Spatial Puzzle Levels]
    P2 --> P3[P3 Sensory / Art Vertical Slice]
```

## P0 — Gameplay Prototype Spec

**Status:** implementation complete; final external validation remains open.

**Decision:** validate **tilt → force → momentum → correction** and stabilized first-person comfort before allowing P1 mechanics to redefine the experience.

---

## P0.1 — Repository Scaffold + Tilt Input Harness

**Status:** complete.

- [x] mobile web scaffold
- [x] device-orientation permission flow
- [x] neutral calibration / recenter
- [x] screen-orientation correction
- [x] dead-zone / clamp / smoothing pipeline
- [x] desktop synthetic tilt using the same abstraction
- [x] debug telemetry

---

## P0.1.1 — Orientation-Agnostic Harness

**Status:** complete; real-device portrait/landscape input mapping accepted.

- [x] portrait and landscape share one `TiltInput` contract
- [x] viewport rotation invalidates stale calibration
- [x] both orientations reach the same physics path

---

## P0.2 — Ball Physics + Stabilized First-Person Camera

**Status:** implementation complete; real-device direction mapping accepted.

- [x] cannon-es dynamic sphere
- [x] tilt-driven camera-relative gravity
- [x] global friction / restitution / damping
- [x] fixed-step simulation
- [x] stabilized first-person camera
- [x] debug feel tuning

---

## P0.3 — 60–90 Second Validation Track

**Status:** implementation complete.

- [x] Calibration Deck
- [x] Wide S-Curve
- [x] Narrow Rail
- [x] Momentum Dip + Gap
- [x] Banked Turn
- [x] Goal Brake Zone
- [x] authored recovery checkpoints

P0 track geometry uses one shared gravity/ball rule set. No magnets, per-section handling changes, scripted launch forces, or hidden assists exist in the baseline track.

---

## P0.3.1 — Track-Forward Camera

**Status:** complete; real-phone backward-motion behavior accepted.

- [x] camera yaw follows authored track-forward rather than velocity heading
- [x] backward motion no longer rotates the camera 180°
- [x] lateral drift does not redefine facing
- [x] authored bends still rotate the view smoothly
- [x] checkpoint recovery restores route-facing heading

**Accepted phone result:** braking and deliberate backward movement read more naturally while the camera continues to face route-forward.

---

## P0.4 — Phone Feel / Comfort Gate

**Status:** tuning + validation instrumentation implemented; baseline lock, primary orientation decision, and external 5-player protocol remain open.

### Implemented

- [x] live sensitivity / dead-zone / saturation / smoothing tuning
- [x] live inertia / friction / restitution tuning
- [x] live camera FOV / track-follow tuning
- [x] local completed-run timing / falls / section splits
- [x] portrait / landscape device-run comparison telemetry
- [x] `P0-VALIDATION-LOG.md`

### Remaining P0 evidence

- [ ] settle baseline feel values from real-phone runs
- [ ] lock the primary product orientation
- [ ] execute the 5-player external protocol
- [ ] record all P0 acceptance thresholds

The user has chosen to begin P1 exploration before those external checks are complete. This does **not** mark P0 PASS; the frozen P0 validation route remains available via `?stage=p0` for regression and later formal validation.

---

## P1 — Physical Puzzle Vocabulary

**Status:** active exploration.

**Objective:** expand the core identity with the smallest set of physical rules that multiply decisions. Evaluate one vocabulary item at a time and reject mechanics that merely add spectacle, timing noise, or bespoke controls.

### P1.1 — Magnetic Rail / Attached Surface

**Status:** first phone gate failed; corrective implementation in P1.1.1.

The first implementation used only a local surface-normal attraction force. Real-phone testing showed that the sphere still fell from the rolled/overhanging section.

**Root cause:** a free-rolling sphere pressed against a vertical wall still experiences ordinary world-down gravity tangent to that wall, so it rolls downward. Increasing normal attraction alone does not solve the control model.

#### Existing vocabulary route

- [x] normal approach establishes baseline behavior
- [x] flat magnetic entry introduces the state
- [x] authored roll transition reaches 115° overhang
- [x] continuous magnetic return transition
- [x] release back onto ordinary track
- [x] ordinary braking goal after release
- [x] authored checkpoints before/after the magnetic challenge

#### Existing readability / architecture

- [x] magnetic material is distinct through luminous cyan surface bands
- [x] inner-shell intensity subtly increases while attached
- [x] debug telemetry reports active magnetic piece + strength
- [x] one authored track definition drives render + collision
- [x] P0 track remains selectable with `?stage=p0`

### P1.1.1 — Magnetic Attachment Correction

**Status:** implementation in progress; real-phone gate pending.

**Corrected rule:** magnetic rail anchors the passive down component of effective gravity into the local surface while preserving camera-relative horizontal tilt intent. The explicit magnetic force remains only as local surface-normal seam/capture adhesion.

This means:

- neutral input presses the sphere into a wall/overhang instead of allowing world-down gravity to roll it off;
- forward/back tilt remains camera-relative and continues to control route momentum;
- left/right tilt keeps the same screen-relative semantics instead of rotating with the rail;
- the system never writes velocity or adds automatic route-forward propulsion;
- ordinary track immediately returns to the unchanged P0 gravity model.

#### P1.1.1 phone gate

- [ ] neutral input remains attached through the 85° / 115° overhang
- [ ] forward/back tilt still produces intentional route motion
- [ ] no automatic forward movement is introduced
- [ ] left/right input does not unexpectedly rotate with the rail
- [ ] release from magnetic material clearly restores ordinary gravity
- [ ] after technical attachment passes, evaluate whether Magnetic Rail creates meaningful approach/speed/release decisions

**KEEP** Magnetic Rail only if the corrected attachment state changes planning. Technical ability to cling to a wall is necessary but not sufficient.

### Later candidates — one at a time

Do not schedule these automatically. Choose the next only after P1.1.1 evidence:

- controlled wall / inversion route using accepted magnetic behavior;
- moving or rotating rail section;
- stateful gate / switch;
- alternate friction surface.

---

## P2 — Spatial Puzzle Levels

**Objective:** turn accepted mechanics into readable 3D mental-map puzzles.

- authored compact mechanical objects rather than long race tracks;
- route preview through visible geometry, not minimap dependence;
- intentional reuse/crossing of previously visited space;
- one spatial concept taught at a time;
- no content-count target until P1 vocabulary is proven.

---

## P3 — Sensory / Art Vertical Slice

**Objective:** establish the premium kinetic-toy identity after gameplay vocabulary is proven.

Candidates:

- transparent / mechanical inner-shell references;
- material language for rail states;
- restrained environment lighting and depth cues;
- rolling/contact/impact audio driven from physical state;
- meaningful haptics where platform support allows;
- diegetic state cues instead of persistent HUD.

---

## Explicitly later

Do not schedule these until a multi-level core exists:

- collectible ball bodies;
- progression economy;
- cosmetics store;
- daily / season content;
- online leaderboards;
- backend accounts;
- monetization.

The immediate gameplay gate is **P1.1.1 Magnetic Attachment Correction on a real phone**. First prove that the sphere can remain controllably attached through the overhang; only then judge Magnetic Rail for puzzle depth.
