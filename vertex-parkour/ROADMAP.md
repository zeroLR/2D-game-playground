# VERTEX MVP Roadmap

VERTEX is a mobile-portrait parkour roguelite. The MVP should first prove that movement is intrinsically fun, then layer combat, Flow, and roguelite decisions on top.

## Product rule

Before M4 is complete, do not spend scope on meta progression, shops, inventory, unlock trees, account systems, or long-term save progression.

The key validation question is:

> Would a player keep moving for another 30 seconds even without an external reward?

## Milestones

### M1 — Visual Foundation ✅

Goal: runtime gameplay should clearly resemble the approved concept direction even in a static screenshot.

Status: passed mobile screenshot review on 2026-08-12.

### M2 — Parkour Feel ✅

Goal: movement itself becomes the primary source of fun.

Delivered:
- world-space vertical velocity and gravity
- reachable procedural platform spacing
- auto jump with short landing compression
- asymmetric rise/apex/fall gravity
- variable-strength velocity Dash controlled by swipe distance
- forgiving platform landing tolerance
- spring camera with upward dead-zone follow

Status: passed mobile playtest feedback on 2026-08-12.

### M3 — Gameplay Objects 🚧

Goal: world objects create traversal decisions instead of only dealing damage.

#### M3.1 — Traversal resources ✅
- single airborne Tactical Dash
- landing / Crystal / Drone restore Dash
- Air Nudge provides free landing correction
- Drone is destroyed only by active Dash

#### M3.2 — Wall traversal ✅
- wall slide acts as a recovery window
- wall contact restores Dash
- swipe away performs wall jump

#### M3.3 — Spike terrain ✅
- spikes are edge hazards on sufficiently wide platforms
- a broad central landing zone is guaranteed
- directional approaches place spikes on the far edge
- rest and wall-rescue bands remain spike-free

Status: mobile playtest accepted the edge-hazard revision; tolerance is higher without turning every landing into precision platforming.

#### M3.4 — Breakable Dash-through routes 🚧
- periodic breakable gates occupy an alternate traversal lane
- only an active Tactical Dash can smash through
- smashing restores Dash so the player can continue the chain
- non-dashing contact damages the player
- breakable destruction has dedicated burst / camera feedback

Validation chain:

> jump → identify breakable lane → Dash through → Dash reset → continue route

The object should read as an optional aggressive route, not a mandatory blocker on the only viable landing path.

#### Remaining M3 scope
- moving platform
- stronger Abyss pressure behavior

Key rule:
- enemies and objects should create movement decisions, not only subtract HP

### M4 — Flow System

Goal: Flow becomes a felt gameplay state rather than a HUD number.

Scope:
- Flow gain from clean traversal, kills, crystals, and near misses
- Flow loss on mistakes
- increasingly visible but restrained movement trails
- speed-linked environmental streaks
- Flow state feedback at higher multipliers
- gameplay benefits tied to Flow

### M5 — Roguelite Layer

Goal: build decisions happen without breaking movement.

### M6 — MVP Vertical Slice

Goal: one complete 5-minute run.

## Current status

- Mechanics prototype: complete
- M1 Visual Foundation: complete
- M2 Parkour Feel: complete
- M3 Gameplay Objects: in progress (M3.4 breakable dash-through routes)
- M4–M6: not started
