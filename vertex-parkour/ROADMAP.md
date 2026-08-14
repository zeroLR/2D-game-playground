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

### M3 — Gameplay Objects ✅

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

#### M3.4 — Encounter Pattern Generator ✅

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

Status: mobile playtest confirmed that short traversal patterns are readable as intentional route ideas.

#### M3.5 — Moving Platform Encounter ✅

- Moving Platform is an optional shortcut/reward route, never the only required landing surface
- motion state drives both collision and rendering from the same entity x
- each moving-window encounter preserves a static safe route

Status: mobile playtest confirmed the moving platform reads as an optional route, but encounter frequency/pacing needs a dedicated composition pass.

#### M3.6 — Abyss Pressure ✅

- Abyss is a world-space pursuing boundary rather than a screen-space follower
- sustained upward movement naturally creates distance because the player can climb faster than the Abyss
- stopping or losing height allows the Abyss to visibly rise into the viewport
- the liquid renderer uses a readable surface, layered body, restrained glow, ripples, and motes
- touching the world-space surface ends the run

Status: mobile playtest accepted both the pursuit behavior and liquid visual presentation.

Key rule:
- enemies and objects should create movement decisions, not only subtract HP

#### Level Pacing / Encounter Composition — queued

Goal: control encounter density and sequence over time instead of relying on flat encounter-family probabilities.

Known issue:
- Moving Platform currently appears too sparsely in practical playtests, often only after more than ten platform jumps.

Future scope:
- encounter decks / weighted phases
- minimum and maximum spacing per encounter family
- tutorial → variety → pressure pacing
- deterministic composition for reproducible playtests

### M4 — Flow System 🚧

Goal: Flow becomes a felt gameplay state rather than a HUD number.

Existing foundation:
- Dash, landing, Wall Jump, Crystal pickup, and Drone kills already award Flow
- taking damage resets Flow to baseline
- score already scales with the current Flow multiplier

#### M4.1 — Chain + visual state ✅

- successful Flow gains refresh a short chain grace window
- Flow decays toward baseline when the player stops linking traversal actions
- Flow tiers: Calm → Engaged → Rush → Overdrive
- player aura and restrained streaks increase by Flow tier
- HUD communicates the current tier as well as the multiplier
- this slice does not change movement speed or physics

Status: mobile playtest confirmed that Flow is perceptible through the character presentation without needing to watch the HUD; perceived extra speed was visual rather than a physics change.

#### M4.2 — Environmental momentum feedback 🚧

- high Flow introduces sparse vertical environmental streaks behind gameplay
- streak density, length, and opacity scale from normalized Flow intensity
- feedback begins only above low Flow so Calm/Engaged remain visually quiet
- no movement physics or camera parameters change

Validation target:
- Rush / Overdrive should make the whole scene feel more energetic, not just the player aura
- the effect must not falsely imply a mechanical speed increase strongly enough to confuse control feel
- platform, Spike, Drone, Crystal, and Abyss readability must remain dominant

#### Remaining M4 scope
- stronger high-tier transition feedback
- near-miss Flow gain if it can be made readable and deterministic
- gameplay benefit tied to Flow after visual/decay tuning is validated

Definition of done:
- skilled play naturally forms chains such as dash → kill → reset → crystal → jump
- Flow state changes are readable through motion/visual language, not only HUD text

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
- M3 Gameplay Objects: complete
- M4 Flow System: in progress (M4.2 environmental momentum feedback)
- M5–M6: not started
