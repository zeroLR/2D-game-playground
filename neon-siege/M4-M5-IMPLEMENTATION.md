# M4–M5 Integrated Implementation Gate

This branch intentionally defers playtest feedback until both Roadmap milestones can be experienced together.

## M4 — Roguelite RPG Build

Implemented:

- 10-wave vertical-slice run.
- Upgrade checkpoint after every 2 cleared waves.
- `Choose 1 of 3` overlay shared by desktop/mobile.
- 36 non-duplicate upgrades across PLAYER / WEAPON / TOWER / SYSTEM.
- Cross-system modifiers: ballistic/energy damage, tower damage/rate/range/HP, repair, economy, CORE shield, lane transfer, extra build nodes.
- Run build count shown in HUD.
- Existing 4 weapons, 6 towers, and 8 enemy archetypes participate in the modifier model.

## M5 — Multi-Lane Battlefield

Implemented:

- Rooftop / Street / Underground lanes.
- Player, enemies, towers, projectiles and build nodes are lane-aware.
- Enemy archetypes have lane preferences; mixed waves create simultaneous pressure.
- Towers are placed on the player's current lane.
- Most towers attack their lane; Drone Dock can project pressure to adjacent lanes.
- Shared DATA CORE can be pressured from all three lanes.
- Traversal network visualizes Ladder / Elevator / Jump Pad / Drop / Zipline nodes.
- Lane switching requires reaching a compatible transit node, then using W/S (desktop) or LANE▲/LANE▼ (mobile).
- Extra build-node upgrades expand each lane's layout.

## Combined playtest gate

Do not evaluate isolated feature correctness only. Play through multiple runs and observe:

1. Whether upgrade choices create a reason to attempt a different build on the next run.
2. Whether a player sometimes chooses a lower-immediate-DPS upgrade for economy, defense or lane control.
3. Whether wave composition causes movement between lanes before the CORE is already in danger.
4. Whether committing towers to one lane creates an understandable weakness elsewhere.
5. Whether Drone Dock's adjacent-lane coverage feels meaningfully different from lane-locked towers.
6. Whether transit-node positioning creates intentional movement without becoming navigation friction.
7. Whether BUILD / FIRE / FIX / lane traversal remain operable on mobile without accidental input conflicts.
8. Whether 10 waves produce a visible build identity by the end of the run.

## Exit interpretation

M4 passes when the player wants another run specifically to test a different upgrade/defense strategy.

M5 passes when `where should I be now?` becomes a recurring combat decision alongside `what should I shoot/build?`.
