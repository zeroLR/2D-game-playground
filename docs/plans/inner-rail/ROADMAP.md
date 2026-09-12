# Inner Rail — Prototype Roadmap

> Goal: prove the first-person gyro / physics identity, then expand only with physical rules that multiply force, momentum, spatial, and timing decisions.

## Delivery flow

```mermaid
flowchart LR
    P0[P0 Core Physics + Phone Feel] --> P11[P1.1 Magnetic Rail]
    P11 --> P12[P1.2 Moving Rail]
    P12 --> P13[P1.3 First Composition]
    P13 --> P14[P1.4 Composition Generalization]
    P14 --> P2[P2 Spatial Puzzle Levels]
    P2 --> P3[P3 Sensory / Art Vertical Slice]
```

Every slice ends in an observable gameplay gate. New rules are kept only when they create a decision that the existing vocabulary cannot already produce.

---

## P0 — Core Identity

**Status:** implementation complete; formal external validation remains open.

Accepted implementation contracts:

- device tilt changes effective gravity rather than steering position directly;
- Cannon physics is authoritative;
- camera follows authored route-forward rather than instantaneous ball velocity;
- braking and deliberate backward motion remain readable without 180° camera flips;
- P0 validation route remains available through `?stage=p0`;
- P0.4 tuning and local validation instrumentation remain available for later formal phone testing.

Remaining formal P0 evidence:

- baseline feel lock;
- primary orientation lock;
- five-player external protocol.

---

## P1 — Physical Puzzle Vocabulary

**Status:** active; system-depth validation in progress.

### P1.1 — Magnetic Rail

**Status:** **ACCEPTED as core vocabulary**.

Accepted evidence:

- magnetic surfaces establish a local down direction while preserving camera-relative tilt intent;
- progressive geometry supports a controllable 78° wall ride;
- braking / reverse remain usable while attached;
- magnetic release changes approach speed, braking, and momentum planning;
- no detach button, auto-forward force, or velocity rewrite is required.

Full 90°+ inversion remains an extension rather than a requirement.

### P1.2 — Moving Rail

**Status:** implementation complete; isolated route retained for regression.

Implemented contract:

- deterministic kinematic rail motion;
- Cannon owns the live transform / collision velocity;
- Three.js projects simulation state only;
- no countdown HUD, random timing, scripted impulse, or new player input;
- restart resets the authored cycle while checkpoint recovery leaves live timing intact.

The user elected to proceed directly to composition before formally closing the isolated P1.2 phone gate. The isolated route remains available through `?stage=p1-moving` for diagnosis.

### P1.3 — Moving Rail × Magnetic Rail Composition

**Status:** **accepted for progression on real phone**.

The first composition placed both rules on the same physical collider: a 48° magnetic shuttle moving laterally between two magnetic lanes.

Accepted product result:

- moving magnetic attachment is usable enough on-device to continue;
- the composition reads as one physical object rather than two sequential mechanics;
- no new input, detach command, countdown HUD, hidden floor, or scripted route force is required;
- collision, kinematic velocity, render pose, and magnetic field sampling share one live simulation transform.

This establishes a valid first composition, but one successful set piece is not yet evidence of systemic depth.

### P1.4 — Composition Generalization / System Depth Gate

**Status:** implementation active; real-phone gate pending.

**Goal:** prove the accepted Moving + Magnetic vocabulary can generate a second puzzle with a materially different decision structure before adding any third mechanic.

#### Second puzzle contract

- use one 36° magnetic surface that is also a vertically translating kinematic lift;
- lift travel is 4.6 world units on a deterministic eight-second cycle;
- the lift starts docked to the lower magnetic lane and reaches an elevated magnetic receiver halfway through the cycle;
- player must hold position on a short moving surface, then prepare forward momentum before the upper docking window;
- moving magnetic surfaces communicate both properties through composed cyan magnetic bands + amber motion bands;
- elevated checkpoints / goal cues are positioned from authored world height rather than assuming a flat track;
- no new mechanic, player input, UI meter, countdown, hidden floor, or scripted impulse is introduced;
- P1.3 remains selectable through `?stage=p1-composition` for direct A/B comparison.

#### P1.4 phone gate

- [ ] magnetic attachment remains stable through vertical motion;
- [ ] lift contact feels physically trustworthy without bounce / jitter / tunneling;
- [ ] upper receiver and lift cycle are readable from world geometry alone;
- [ ] the short lift creates an understandable need to brake / hold position while being transported;
- [ ] the player prepares forward momentum for the upper transfer rather than simply waiting passively;
- [ ] failure causes a different hold / timing / momentum decision on retry;
- [ ] the puzzle feels materially different from P1.3's lateral alignment problem despite using the same two vocabulary rules.

**System-depth decision:** if the second puzzle collapses to the same "wait for alignment, then go" solution, do not add more mechanics yet. Rework the composition space until the existing rules demonstrate real combinatorial depth.

---

## P2 — Spatial Puzzle Levels

Enter P2 only after P1.4 proves the current vocabulary can generate multiple distinct puzzle structures.

Turn accepted vocabulary into compact 3D mental-map puzzles rather than long race tracks:

- one spatial concept taught at a time;
- visible geometry should preview routes without minimap dependence;
- reuse and crossing of previously visited space is preferred over content length;
- combine rules only when each rule has already demonstrated a readable decision;
- build a small authored level set from reusable puzzle grammar before adding more vocabulary.

---

## P3 — Sensory / Art Vertical Slice

After gameplay vocabulary is stable, establish the premium kinetic-toy identity through restrained materials, lighting, rolling/contact audio, meaningful haptics where supported, and diegetic state cues rather than persistent HUD.

The immediate gameplay gate is **P1.4 Vertical Magnetic Lift on a real phone**.
