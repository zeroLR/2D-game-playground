# P8.3.4b — Energy Motion Gate

## Risk question

Can Split's validated SVG silhouette and luminous material gain directional internal motion that reinforces each path's gameplay identity without becoming particle noise or reducing mobile readability?

## Product intent

P8.3.4a established luminous material. This gate adds a separate motion layer so the Rune reads as active energy rather than a glowing static emblem.

The motion must communicate gameplay semantics:

- **Prism**: energy travels from the Core outward through both wings.
- **Lance**: energy travels from the Core forward along the spear axis toward the spearhead.

Motion is not generic breathing or random shimmer.

## Motion grammar

### Base Split

- No directional energy sweep.
- Keeps the pre-evolution state visually restrained.

### Refraction — T1 Prism

- One symmetric outward sweep.
- Starts near the Core and travels toward both wing tips.
- Deliberate cadence; the silhouette remains more important than the sweep.

### Aurora Prism — T2

- Faster outward cadence.
- Adds a second phase-offset sweep.
- Extends farther toward the outer wing tips.
- Reads as a denser evolved energy circuit, not as particles.

### Convergence — T1 Lance

- One forward pulse travels from near the Core toward the spearhead.
- Motion stays centered on the longitudinal axis.

### Void Lance — T2

- Faster forward cadence.
- Adds a second phase-offset pulse.
- Travels farther toward the spear tip.
- Reinforces focus / pierce rather than widening the effect.

## Architecture

`SplitRuntimeSvgSpec` now owns a motion profile alongside geometry and material:

```text
Shared SVG geometry
  + Material profile
  + Energy motion profile
          ↓
SplitRuntimeSvg
          ↓
Pixi runtime presentation
```

The runtime creates the small motion graphics once and only animates transform / alpha during presentation.

## Accessibility

Reduced Motion disables directional sweeps entirely while preserving the static SVG silhouette and P8.3.4a material hierarchy.

## Performance contract

- No particles.
- No emitter.
- No per-frame SVG parsing.
- No per-frame Graphics allocation.
- Motion layers are created once per authored glyph.
- Per-frame work is limited to position, scale, visibility, and alpha updates.

## Scope guard

No gameplay tuning, collision changes, Split duration changes, impact VFX, particle envelope, shader, advanced bloom, Vortex rewrite, or Chain mechanics.

## Phone gate

1. Prism visibly carries energy from Core to wing tips rather than merely pulsing in place.
2. Aurora Prism T2 has richer cadence than Refraction without visual noise.
3. Lance visibly pushes energy forward toward the spearhead.
4. Void Lance T2 feels more charged than Convergence while remaining a single focused spear.
5. Directional motion remains legible while the Ball is moving and rotating.
6. Reduced Motion removes the sweeps but keeps the Rune readable.
7. No obvious frame pacing or input regression on phone.
