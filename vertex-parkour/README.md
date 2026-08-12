# VERTEX — Parkour Roguelite MVP

Mobile-portrait browser prototype for the VERTEX concept.

## MVP loop

- Character auto-climbs as the world scrolls downward.
- Swipe left/right (or A/D) to dash between lanes.
- Collect crystals to increase score and Flow.
- Avoid hazards; three hits end the run.
- Difficulty increases continuously with scroll speed.
- Tap or press R to restart.

## Visual direction

The first slice intentionally uses generated geometry instead of production art assets: muted teal architecture, cream character silhouette, warm Flow accents, and a magenta rising Abyss. This keeps the visual load low while preserving a distinct silhouette-driven identity.

## Run locally

```sh
npm ci
npm run dev
```

## Validate

```sh
npm test
npm run build
```
