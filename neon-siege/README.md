# NEON SIEGE MVP

Cyberpunk horizontal action tower-defense RPG prototype built with PixiJS.

## Goal
Validate the core loop before expanding RPG/meta systems:

1. Move and jump across a horizontal combat lane.
2. Shoot incoming enemies directly.
3. Spend combat credits to deploy infrastructure.
4. Protect the CORE through escalating waves.

## Controls

- `A/D` or arrow keys: move
- `W` / `Space`: jump
- `J` / `K`: shoot
- `1`: select Auto Turret
- `2`: select Tesla Node
- `B`: build on the next free node
- `R`: restart after CORE breach

## Visual direction

High-contrast cyan / magenta / yellow on dark desaturated city layers. The MVP intentionally uses procedural vector silhouettes and restrained effects so combat entities remain readable and visual fatigue stays low while keeping the bold poster-like direction.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
