# M2–M3 Implementation Gate

This branch completes the first playable implementation pass for Roadmap M2 and M3. Playtest feedback is intentionally deferred until both milestones can be evaluated as one combat/defense ecology.

## M2 — Tower Defense Core

Implemented roster: Auto Turret, Tesla Node, Barrier, Drone Dock, Hack Node, Mine Layer.

Implemented systems:
- data-driven tower costs, range, cadence and health
- structure durability and destruction
- hold-to-repair interaction (`E` / `FIX`) with credit cost
- fixed build-pad placement constraints
- threat-oriented target selection
- tower disable state used by Hacker enemies
- Barrier clustering
- Tesla multi-target control
- Hack Node machine disable
- Mine Layer area burst
- Drone Dock long-range mobile-pressure abstraction

## M3 — Enemy Ecology

Implemented roster: Grunt, Runner, Heavy, Drone, Shield, Hacker, Sniper, Bomber plus elite modifiers from later waves.

Implemented systems:
- data-driven enemy roles
- deterministic wave composition progression
- wave composition preview in HUD
- role-specific movement/attack behavior
- flying bypass for Drone
- structure pressure for Heavy
- infrastructure disable for Hacker
- ranged player pressure for Sniper
- clustered-structure punishment for Bomber
- ballistic/energy resistance and vulnerability hooks
- elite HP/speed/reward modifiers

## Validation gate

Do not evaluate isolated features only. The milestone passes when changing wave composition causes a meaningful change in tower purchase, repair priority, weapon choice, or player position.
