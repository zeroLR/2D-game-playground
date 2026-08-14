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
- spring camera with upward dead-zone follow plus downward recovery follow
- restrained landing / impact feedback

Status: passed mobile playtest feedback on 2026-08-12; downward camera recovery later fixed large-fall visibility without changing normal upward framing.

### M3 — Gameplay Objects ✅

Goal: world objects create traversal decisions instead of only dealing damage.

Delivered:
- single airborne Dash resource, restored by landing / Crystal / Drone routing
- Air Nudge for fine correction
- Wall Catch / Wall Jump recovery route
- forgiving edge Spike terrain
- authored four-band encounter families
- optional Moving Platform shortcut encounters
- world-space pursuing Abyss with liquid presentation

Status: traversal-object loop validated in mobile playtests. Dedicated encounter pacing remains queued because Moving Platform and special encounter frequency is still too sparse.

### M4 — Flow System ✅

Goal: Flow becomes a felt gameplay state rather than a HUD number.

#### M4.1 — Chain + visual state ✅
- successful traversal actions refresh a short chain grace window
- Flow decays toward baseline when chaining stops
- tiers: Calm → Engaged → Rush → Overdrive
- player aura / wake and HUD communicate Flow without changing movement physics

Status: mobile playtest confirmed Flow is perceptible without watching the HUD.

#### M4.2 — Environmental momentum feedback ✅
- high Flow adds restrained environmental speed streaks
- density / length / opacity scale with Flow intensity
- Calm / low Engaged remain visually quiet

Status: mobile playtest confirmed a subtle scene-wide sense of speed while gameplay objects remain readable.

#### M4.3 — Flow recovery benefit ✅
- below Rush, damage resets Flow to 1x
- Rush (6x+) falls back to 3x after a hit
- Overdrive (9x+) falls back to 5x after a hit
- HP damage remains unchanged
- taking a hit ends the active chain grace window

Status: mobile playtest confirmed a mistake remains costly but no longer erases the entire rhythm at high Flow.

#### M4.4 — High-tier momentum transition ✅
- Rush / Overdrive tier entry is communicated through a short transition boost
- player downward wake and background streaks temporarily strengthen
- background receives a restrained teal gradient shift
- shield-like pulse rings and tier-entry camera shake were removed after mobile feedback

Status: mobile playtest found the revised transition direction appropriate and subtly perceptible. Further amplification is deferred until broader level pacing is established, to avoid over-tuning visual intensity in isolation.

#### Deferred Flow experiments
- near-miss Flow gain: defer until encounter geometry/pacing makes near-miss detection readable and deterministic
- additional Flow bonuses: defer until M5 upgrades so Flow does not accumulate unrelated baseline mechanics

Definition of done:
- skilled play naturally forms traversal chains
- Flow state changes are readable through motion / visual language, not only HUD text
- high Flow provides a useful but non-mandatory recovery advantage
- movement physics remain stable across Flow tiers

### M5 — Roguelite Layer 🚧

Goal: build decisions happen without breaking movement.

Design rule:

> Prefer moving through a route to choose an upgrade over pausing for a modal card picker.

#### M5.1 — Route Choice Foundation — next

Goal: prove that the player can make a meaningful build choice while continuing to parkour.

First slice:
- periodically generate a clearly telegraphed two-route choice encounter
- left and right routes each advertise one upgrade before commitment
- collecting / crossing the route pickup applies the upgrade immediately
- both routes rejoin into a safe recovery beat
- no modal, pause screen, inventory, shop, or reroll system
- deterministic generation so the same seed reproduces the same choice

Initial upgrade pair should modify existing traversal rules rather than raw damage numbers:
- **Dash route** — stronger Dash identity / resource interaction
- **Flow route** — stronger chain/recovery identity

Validation target:
- the player understands there is a choice before committing
- choosing a route feels like part of movement rather than menu navigation
- either choice noticeably changes the next 30–60 seconds of traversal
- neither route is strictly required to survive

#### Later M5 slices
- expand to Jump / Kill archetypes after route-choice UX is validated
- run-local upgrade state and stacking rules
- upgrade-aware encounter composition
- lightweight build summary HUD only if needed for readability

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

## Queued systemic work

### Level Pacing / Encounter Composition

Known issue:
- special encounters such as Moving Platform currently appear too sparsely in practical playtests.

Future scope:
- encounter decks / weighted phases
- minimum and maximum spacing per encounter family
- tutorial → variety → pressure pacing
- deterministic composition for reproducible playtests

This should be integrated while building M5/M6 rather than tuned as an isolated probability table.

## Current status

- Mechanics prototype: complete
- M1 Visual Foundation: complete
- M2 Parkour Feel: complete
- M3 Gameplay Objects: complete
- M4 Flow System: complete
- M5 Roguelite Layer: in progress (M5.1 Route Choice Foundation next)
- M6 Vertical Slice: not started
