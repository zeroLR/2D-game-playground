# Paper Trails — 32 px Pixel Art Direction

## 1. Art target

The MVP should preserve the visual identity of the concept: a restrained antique book containing a small ruined fantasy world. The art must look authored for gameplay, not like an illustration cut into tiles.

### Production rule

Use a **32 px logical pixel grid** as the common unit:

- world construction unit: `32×32 px`
- one page cell: `96×96 px` = `3×3` logical tiles
- player character frame: `32×48 px`, anchored to a 32 px world cell
- small props: usually `16×16`, `16×32`, or `32×32`
- export: lossless RGBA PNG
- runtime filtering: nearest-neighbor only
- scale: integer multiples whenever possible

This creates the intended polished 32-bit-era pixel-art density while keeping asset production small enough for an MVP.

## 2. Palette discipline

### Global families

| Role | Approx color | Use |
|---|---|---|
| Ink | `#121917` | deepest shadow, UI background |
| Deep moss | `#2E3C36` | foliage / atmospheric dark |
| Moss | `#46564B` | foliage midtone |
| Stone | `#777365` | ruins / paths |
| Parchment | `#D8C7A3` | book paper / light stone |
| Antique gold | `#A8874C` | selection, goal, rare warm light |
| Warm ivory | `#E6D7B5` | strongest non-emissive highlight |

### Rules

- Each page asset should generally stay within **12–20 colors** including shade ramps.
- Gold is a state accent, not a terrain color.
- Avoid saturated green grass, cyan water, purple shadows, and RGB rarity language.
- Prefer value separation over hue separation.
- Character must remain readable against both parchment-light paths and moss-dark terrain.

## 3. Pixel rendering rules

- No bilinear filtering.
- No sub-pixel camera movement for the final render transform.
- No fractional sprite scales in the primary gameplay viewport.
- Avoid 1 px high-frequency checker noise on large surfaces; it shimmers on mobile scaling.
- Use deliberate clusters, not isolated random single pixels.
- Lighting is painted into sprite ramps; runtime lighting is optional and subtle.
- Do not use vector strokes over pixel assets unless they snap exactly to the pixel grid.

## 4. Page frame composition

Every `96×96` page follows the same readability zones:

```text
+------------------+
|  border / exit   |
|                  |
|   landmark /     |
|   traversable    |
|      space       |
|                  |
|  border / exit   |
+------------------+
```

### Edge contract

Each cardinal exit uses the same center alignment:

- N/S path opening centered on x = 48
- E/W path opening centered on y = 48
- visual road width target = 24–32 px

Matching exits must look visually continuous when neighboring page sprites touch.

The art pipeline should include an edge-template overlay so page artists do not eyeball connection positions.

## 5. Six Page asset specs

### 5.1 Forest Path

**Role:** baseline connector.

Visual:

- dark moss forest mass frames the traversable parchment/stone trail
- tree canopies form large readable clusters, not noisy individual leaves
- pathway is the highest-value shape after the character
- small branch/leaf motion may be added later, but MVP can use static art

Variants needed for MVP:

- straight NS
- corner NE

Rotation supplies the remaining orientations.

### 5.2 Ruined Gate

**Role:** destination / portal / chapter exit.

Visual:

- broken stone arch as primary silhouette
- a small warm ivory/gold opening identifies the goal
- surrounding ruin should not obscure exit geometry
- goal-active frame may add 2–3 pixels of warm rim light, not a full glow bloom

Variants:

- one base gate page with authored route configuration
- active and inactive goal state

### 5.3 Stone Bridge

**Role:** constrained connector.

Visual:

- pale bridge strip over dark ink-water / void
- water remains low contrast so bridge shape dominates
- bridge parapets use 1–2 px accents only
- if water animation is later added, use 2–3 frame low-amplitude shimmer

Variants:

- straight bridge only for MVP; rotation provides NS/EW

### 5.4 Crossroads

**Role:** routing hub.

Visual:

- open clearing with a strong Y/T silhouette
- central landmark should be tiny and low contrast; connections must read first
- do not fill all corners with equal-detail foliage

Variants:

- 3-way T junction

### 5.5 Shrine / Seal

**Role:** rule page / gated connector.

Visual:

- small shrine or stone altar
- paper seal is the only controlled dark-red/brown micro-accent if needed; otherwise antique gold
- locked state visually blocks one route with a simple seal band
- unlocked state removes the seal and restores path continuity

Variants:

- sealed
- unsealed

### 5.6 Hidden Grove / Treasure

**Role:** optional endpoint.

Visual:

- enclosed darker foliage creates a pocket composition
- small chest/relic at focal center
- reward indicator uses 1–2 gold highlights, not a sparkling particle field
- after collection, switch to an opened/empty prop state

Variants:

- treasure present
- collected

## 6. Player character art spec

### Silhouette

The traveler should read as:

- small cloak
- satchel or book strap
- slightly oversized scarf/cape shape for motion readability
- neutral wandering-scholar identity; avoid large weapon silhouette

The player should feel like a visitor inside the book, not the visual hero of an action RPG.

### Frame size

- `32×48 px` per frame
- feet anchored at world cell bottom-center
- keep head/body center stable between frames to prevent jitter

### MVP animation set

| Animation | Frames | FPS target | Notes |
|---|---:|---:|---|
| Idle south | 2 | 2–3 | breathing / cloak shift |
| Walk south | 4 | 7–9 | readable leg cadence |
| Walk north | 4 | 7–9 | back silhouette |
| Walk east | 4 | 7–9 | flip for west only if asymmetry permits |
| Arrival | 3 | 5–6 | brief look-up / settle |

Total target: **17 authored frames** if west is mirrored.

### Character palette

Use ~10–14 colors:

- near-black outline/shadow
- dark moss/charcoal clothing
- parchment skin/highlight range
- muted rust or antique-gold scarf/satchel accent

No bright primary colors.

## 7. Props and UI art

### Props

MVP minimum:

- gate arch
- shrine seal
- treasure chest/relic
- path stones
- bridge
- 2–3 tree cluster shapes
- 2 ruin cluster shapes

Reuse modular pieces wherever possible, but each page must still have a distinct composition.

### UI

- Book frame is not pixel art at the same density unless it visually benefits; it can be a high-resolution textured frame around the pixel world.
- Gameplay icons should be monochrome or two-tone.
- Selection border: 1–2 logical px antique gold.
- Avoid large colored buttons. Use paper tabs / ink glyphs.

## 8. Sprite sheet organization

Suggested layout:

```text
assets/
  pixel/
    pages/
      forest-path.png
      ruined-gate.png
      stone-bridge.png
      crossroads.png
      shrine-seal.png
      hidden-grove.png
    character/
      traveler.png
      traveler.json
    props/
      props.png
      props.json
```

Prefer one atlas for page/prop sprites and one atlas for character animation once implementation begins.

## 9. Art acceptance checklist

A page/character asset is MVP-ready only when:

- [ ] authored on the 32 px logical grid
- [ ] nearest-neighbor preview looks clean at 2×/3×/4×
- [ ] no fractional-pixel edges
- [ ] page exits line up exactly with the shared edge template
- [ ] page remains readable at actual phone size
- [ ] silhouette still works in grayscale/value-only inspection
- [ ] palette remains within the restrained global families
- [ ] no saturated color competes with goal/selection gold
- [ ] character feet/anchor do not jitter between animation frames
- [ ] transparent PNG edges contain no anti-aliased fringe

## 10. MVP art delivery order

1. Edge template + palette swatches.
2. Forest Path + traveler idle/walk — first in-engine pixel-readability test.
3. Ruined Gate — validate goal hierarchy.
4. Stone Bridge + Crossroads — validate route readability.
5. Shrine/Seal — validate state change.
6. Hidden Grove/Treasure — validate optional reward signal.
7. Arrival animation + polish pass.

Do not create all final assets before the first two types are tested on an actual mobile canvas. Pixel density, scale, and route readability must be validated in-engine first.
