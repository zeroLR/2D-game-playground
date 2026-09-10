# Inner Rail — Planning

> Working title. Status: planning only. This directory does **not** register a deployable game yet.

## Product pitch

**Inner Rail** is a mobile-first first-person kinetic puzzle game where the player is inside the rolling ball. Tilting the phone changes the ball's effective gravity, so the player solves a 3D rail maze by managing weight, momentum, braking, banking, and spatial orientation rather than steering with a virtual joystick.

The first validation question is deliberately narrow:

> Does **tilt → force → momentum → correction** feel intuitive and satisfying from inside the ball, without the camera becoming disorienting?

## Gameplay identity

**First-person kinetic puzzle** — the player does not command position directly; they manipulate force and read the physical consequence.

Core pillars:

1. **Embodied control** — device tilt maps to physical force, not cursor-like movement.
2. **Momentum as decision** — speed, braking, line choice, and commitment create the puzzle.
3. **Stable immersion** — the world feels physical while the camera protects the player's horizon.
4. **Track teaches rules** — geometry, motion, and state changes communicate before HUD or text.
5. **Low-system prototype** — one ball, one track, one physical rule set before adding puzzle devices.

## Planning documents

- [`P0-GAMEPLAY-PROTOTYPE-SPEC.md`](./P0-GAMEPLAY-PROTOTYPE-SPEC.md) — control, camera, physics, test track, architecture, and validation gates.
- [`ROADMAP.md`](./ROADMAP.md) — implementation slices after the P0 spec is accepted.

## Proposed stack

Reuse the repository's existing 3D prototype stack:

- **Renderer:** Three.js
- **Physics:** cannon-es
- **Language:** strict TypeScript
- **Build:** Vite
- **Primary target:** mobile web, landscape-first
- **Desktop:** keyboard/pointer simulation for development and smoke testing only

## P0 boundary

Included:

- device-orientation permission + neutral calibration
- gyro/device tilt → effective gravity mapping
- one rolling rigid-body sphere
- stabilized first-person camera inside the sphere
- one 60–90 second authored test track
- simple fall recovery / reset
- minimal permission, calibration, restart, and rotate-device UI
- debug telemetry for tuning

Explicitly excluded:

- multiple ball materials
- magnetic/inverted rails
- moving traps or switches
- level selection / progression
- collectibles / score economy
- backend / account / monetization
- final art production

Implementation should begin only as a complete repository citizen: game folder, lockfile, tests, Vite subpath configuration, CI workflow, reusable Pages registration, bootstrap registration, and mobile/desktop smoke checks.
