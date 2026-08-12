# VERTEX MVP Roadmap

VERTEX is a mobile-portrait parkour roguelite. The MVP should first prove that movement is intrinsically fun, then layer combat, Flow, and roguelite decisions on top.

## Product rule

Before M4 is complete, do not spend scope on meta progression, shops, inventory, unlock trees, account systems, or long-term save progression.

The key validation question is:

> Would a player keep moving for another 30 seconds even without an external reward?

## Milestones

### M1 — Visual Foundation

Goal: runtime gameplay should clearly resemble the approved concept direction even in a static screenshot.

Scope:
- muted teal / cream / magenta palette
- layered foggy architecture with depth separation
- stronger foreground silhouettes framing the playfield
- platforms integrated into world architecture instead of looking like isolated UI bars
- larger, more readable hooded player silhouette
- scarf / cloak motion cue and dash afterimages
- hazards and crystals restyled as world objects rather than flat icons
- Abyss rendered as animated energy / fog instead of a flat rectangle
- restrained ambient particles
- HUD spacing and hierarchy closer to the concept sheet

Definition of done:
- a runtime screenshot is recognizably the same game as the visual concept
- important gameplay objects remain readable on a phone-sized viewport
- visual effects remain restrained enough to avoid fatigue

### M2 — Parkour Feel

Goal: movement itself becomes the primary source of fun.

Scope:
- vertical velocity and gravity
- platform collision
- auto jump
- coyote time
- dash state and cooldown/reset
- landing response and squash/stretch
- camera follow, look-ahead, dash offset, and impact shake

Definition of done:
- the game feels like vertical parkour rather than lane switching over a scrolling background

### M3 — Gameplay Objects

Goal: world objects create traversal decisions instead of only dealing damage.

Scope:
- platform
- wall / wall jump
- spikes
- dash-kill drone
- crystal that contributes to Flow or mobility reset
- breakable dash-through object
- moving platform
- Abyss pressure

Key rule:
- enemies should become movement resources, not only hazards

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
- M1 Visual Foundation: in progress
- M2–M6: not started
