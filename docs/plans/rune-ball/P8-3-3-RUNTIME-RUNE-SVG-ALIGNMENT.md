# P8.3.3 — Runtime Rune SVG Alignment Pass

## Risk question
Can the Split Rune use one authored visual identity from build planning through live gameplay, so the Tree establishes an expectation that the runtime cast actually fulfills?

## Product contract
- Rune Tree and runtime Split visuals share the exact same SVG source files.
- SVG defines the recognizable skill silhouette; PixiJS owns placement, rotation, scale, pulse, and surrounding VFX.
- Collision geometry remains renderer-independent and unchanged.
- Runtime collision points may remain as quiet hints, but they must not become the primary visual silhouette.

## Split visual ladder
### Base Split
One core dividing into mirrored force directions. The runtime SVG spans the existing ±42 lateral echo geometry.

### Prism
- T1 Refraction: one crystalline wing silhouette sized to the existing ±78 lateral coverage.
- T2 Aurora Prism: layered outer wings sized to the existing ±104 coverage.
- Runtime should read as widening wings, not multiple detached balls or collision polygons.

### Lance
- T1 Convergence: one continuous spear anchored to the Ball core and aligned to velocity.
- T2 Void Lance: longer shaft / guard / spearhead silhouette aligned to the existing forward pressure column.
- Runtime should read as one weapon, not a bead/string formation.

## Architecture
`src/assets/runes/*.svg` is the Split visual source of truth.

- Rune Tree CSS references these SVG files as node backgrounds.
- `SplitRuntimeSvg` imports the same SVG files as raw markup and parses them once through PixiJS `GraphicsContext.svg()`.
- The runtime renderer only transforms cached vector geometry each frame.
- `SplitEvolutionTuning` continues to own duration, hit radius, and collision offsets.

## Scope guard
No Split damage changes, collision offset changes, evolution threshold changes, Vortex visual rewrite, Chain evolution, shaders/filters, external UI library, stage content, or economy.

## Phone gate
1. Base / Prism T1 / Prism T2 in the arena visibly match their Tree silhouettes.
2. Lance T1 / T2 read as one continuous spear and visibly match the Tree.
3. Tree and runtime no longer feel like separate art systems.
4. Collision markers are subordinate to the SVG silhouette.
5. Rotation follows Ball trajectory without jitter or wrong orientation.
6. Existing Split hit feel, qualified-use progression, and arena readability remain unchanged.
