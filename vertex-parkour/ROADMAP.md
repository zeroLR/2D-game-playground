# VERTEX MVP Roadmap

VERTEX is a mobile-portrait parkour roguelite. The MVP should first prove that movement is intrinsically fun, then layer combat, Flow, and roguelite decisions on top.

## Product rule

Before M4 is complete, do not spend scope on meta progression, shops, inventory, unlock trees, account systems, or long-term save progression.

The key validation question is:

> Would a player keep moving for another 30 seconds even without an external reward?

## Milestones

### M1 — Visual Foundation ✅

Goal: runtime gameplay should clearly resemble the approved concept direction even in a static screenshot.

Definition of done:
- a runtime screenshot is recognizably the same game as the visual concept
- important gameplay objects remain readable on a phone-sized viewport
- visual effects remain restrained enough to avoid fatigue

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
- restrained landing / impact feedback

Definition of done:
- the game feels like vertical parkour rather than lane switching over a scrolling background
- short, medium, and long swipe Dash strengths are predictable and useful for landing correction
- camera naturally communicates upward progress

Status: passed mobile playtest feedback on 2026-08-12.

### M3 — Gameplay Objects 🚧

Goal: world objects create traversal decisions instead of only dealing damage.

#### M3.1 — Traversal resources ✅
- Dash becomes a single airborne resource instead of unlimited repeat input
- landing restores Dash
- Crystal restores Dash and adds a small upward lift
- Drone can be destroyed only while actively dashing
- destroying a Drone restores Dash and gives an upward bounce
- non-dashing Drone contact damages the player
- HUD communicates whether Dash is currently ready
- Air Nudge provides repeatable fine correction without consuming Dash

Validation chain:

> jump → nudge → dash → drone/crystal → reset → dash → land

#### M3.2 — Wall traversal ✅
- periodic walls act as rescue/traversal nodes
- wall contact slows falling and restores Dash
- swipe away performs a wall jump
- wall jump preserves Dash for the next routing decision

Validation chain:

> missed platform → wall catch → wall jump → dash → recover route

#### M3.3 — Spike terrain ✅
- spikes are edge hazards attached only to sufficiently wide platforms
- the broad central landing zone remains the default safe target
- directional approaches place the Spike on the far edge
- Air Nudge is recovery rather than mandatory precision input

Status: mobile playtest accepted the higher-tolerance edge-hazard revision.

#### M3.4 — Encounter Pattern Generator 🚧

Goal: stop assembling unrelated obstacles band-by-band and generate short authored traversal sequences with explicit intent.

Initial encounter families:
- **Recovery** — readable platforms + Crystal + rest beat
- **Dash Chain** — route setup → Drone Dash opportunity → resource landing
- **Edge Read** — forgiving Spike edge → route naturally moves away from danger
- **Wall Rescue** — outer route exposes a wall catch → Crystal recovery → rest beat

Generation rules:
- one Encounter spans four bands
- the first three bands define the traversal idea
- the fourth band is always a safe rest/recovery beat
- randomization selects encounter family and mirrors it left/right; it does not independently sprinkle obstacles
- every band retains a safe landing platform
- run seed still deterministically reproduces the same encounter sequence

Validation target:
- players should begin recognizing short route ideas instead of perceiving a random obstacle soup
- objects should appear to explain or support the next movement decision
- the safe route must remain readable without requiring precision movement

#### Remaining M3 scope
- moving platform, only after encounter sequencing is validated
- stronger Abyss pressure behavior
- reconsider Breakable only if a future encounter pattern gives it a clear route-level purpose

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

Definition of done:
- skilled play naturally forms chains such as dash → kill → reset → crystal → jump

### M5 — Roguelite Layer

Goal: build decisions happen without breaking movement.

Scope:
- route-based upgrade choices placed directly in the level
- initial Dash / Jump / Kill / Flow archetypes
- upgrades that change traversal rules rather than only numeric stats

Design rule:
- prefer moving through a route to choose an upgrade over pausing for a modal card picker

### M6 — MVP Vertical Slice

Goal: one complete 5-minute run.

Suggested pacing:
- 0:00 tutorial
- 0:45 first upgrade
- 1:30 speed escalation
- 2:00 elite section
- 2:30 second upgrade
- 3:30 high-Flow section
- 4:30 Abyss chase
- 5:00 escape or death

The first MVP climax should be an Abyss chase rather than a stationary boss fight.

## Current status

- Mechanics prototype: complete
- M1 Visual Foundation: complete
- M2 Parkour Feel: complete
- M3 Gameplay Objects: in progress (M3.4 encounter pattern generator)
- M4–M6: not started
