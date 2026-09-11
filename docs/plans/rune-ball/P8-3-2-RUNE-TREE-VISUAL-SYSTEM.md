# P8.3.2 — Rune Tree Visual System Pass

## Risk question

Can Rune Ball establish one reusable visual grammar for Rune evolution so Vortex, Split, and future Chain content read as one authored system rather than separately styled skill trees?

## Visual ownership

- **Rune Card = gesture identity.** `○ / V / Z` remain the input vocabulary and do not repeat inside Tree nodes.
- **Tree node = gameplay effect.** Base, T1, and T2 depict effect silhouettes.
- **Branch = playstyle.** Left/right branches use stable accent families plus rail brightness, frame weight, and halo; state never depends on color alone.
- **Detail surface = language.** Names, mechanics, play pattern, and evolution thresholds stay below the graph.

## Effect glyph grammar

Every glyph uses the same conceptual primitives: core, field/trajectory line, secondary accent, and one recognizable effect silhouette. T2 adds structural complexity rather than merely scaling T1.

- **Vortex base:** field rotation around a core.
- **Gravity:** concentric compression; T2 adds inward spokes and a denser peak core.
- **Orbit:** orbital plane plus satellite; T2 adds a second orbital plane.
- **Split base:** one core dividing into mirrored force directions.
- **Prism:** symmetric crystalline wings; T2 adds a second outer wing layer.
- **Lance:** one continuous spear; T2 extends shaft, guard, and spearhead structure.
- **Chain base:** connected propagation nodes. T1/T2 remain intentionally unauthored until P8.4.

## State grammar

- Configured branch: brighter rail and frame.
- Selected node: white edge plus branch halo.
- Non-configured branch: readable at reduced emphasis.
- Future nodes: muted/dashed, never styled as currency or paywall locks.
- Focus-visible remains explicit for keyboard navigation.
- Reduced-transparency and increased-contrast fallbacks preserve hierarchy.

## Technical approach

The current interaction DOM remains unchanged. `rune-tree-visual-system.css` replaces the older CSS-primitive effect drawings with SVG effect silhouettes and overlays a shared branch/material grammar. This keeps the visual pass isolated from gameplay/domain code and avoids a new UI dependency.

## Scope guard

No Chain evolution mechanics, new Rune effects, new Tree navigation, progression currency, shader/filter dependency, external UI library, or gameplay collision change.

## Phone gate

1. Rune Cards still read as gesture selectors while Tree nodes read as effects.
2. Vortex and Split feel like members of the same visual family.
3. Gravity vs Orbit and Prism vs Lance remain distinguishable without node labels.
4. T2 reads as an evolved silhouette rather than a larger T1 icon.
5. Configured path and selected node are clear without relying only on cyan/magenta.
6. Chain reads as intentionally future-authored rather than broken or paywalled.
