# P8.3.4c — Particle Envelope Gate

## Risk question

Can Split gain a restrained local particle envelope that closes more of the gap to the visual mockup while preserving Ball/Target readability, mobile frame pacing, and the distinct Spread vs Focus identities?

## Product intent

P8.3.4a established luminous material. P8.3.4b established directional internal energy motion. This gate adds only the small detached fragments that make the Rune feel like an active energy construct rather than a clean vector icon.

The particle envelope is deliberately local to the Rune silhouette. It must never become arena-wide ambience or hide gameplay geometry.

## Visual grammar

### Prism — crystal refraction envelope

- Spawn around wing edges and wing tips.
- Alternate cyan / magenta / white fragments.
- Drift primarily outward from the core.
- Use small diamond, streak, and mote shapes.
- T2 increases reach, cadence, and active-particle cap without becoming a particle cloud.

Identity: `Expand → Refract → Shed energy outward`.

### Lance — directional fleck envelope

- Most flecks originate along the shaft and drift backward relative to the spear direction, reinforcing forward speed.
- A minority spawn at the spearhead and continue forward as small tip sparks.
- Keep the envelope narrow around the longitudinal axis.
- T2 increases cadence and spearhead activity while preserving the single-spear silhouette.

Identity: `Focus → Drive forward → Pierce`.

## Architecture

```text
SplitRuntimeSvgSpec
├─ SVG geometry
├─ Material profile
├─ Energy-motion profile
└─ Particle-envelope profile
          ↓
SplitRuntimeSvg
          ↓
SplitParticleEnvelope (preallocated pool)
```

`SplitParticleEnvelope` owns a fixed set of Pixi `Graphics` particles. No particle is allocated during gameplay. Each authored Split form declares a hard maximum active count.

Current caps:

- Refraction: 8
- Aurora Prism: 12
- Convergence: 7
- Void Lance: 10
- Base Split: 0

## Performance contract

- no emitter dependency
- no per-frame particle allocation
- no per-frame SVG parsing
- no unbounded particle growth
- at most two emissions processed in one frame after timing stalls
- particle timestep clamps to avoid pause/resume bursts
- switching Split form resets stale pooled particles

## Accessibility

`Reduced Motion` disables the dynamic particle envelope entirely. The Rune remains understandable through shared SVG silhouette and Material/Glow; directional sweep behavior follows the existing P8.3.4b fallback.

## Scope guard

Not in this gate:

- hit-specific particle bursts
- target impact redesign
- screen-wide particles
- bloom/AdvancedBloom plugin
- custom shaders
- gameplay/collision/duration tuning
- Vortex visual rewrite
- Chain evolution

Impact-specific effects remain P8.3.4d.

## Phone gate

1. Prism gains visible crystal/refraction motes concentrated around the wings rather than random arena noise.
2. Aurora Prism is richer than Refraction but the wing silhouette remains primary.
3. Lance gains directional flecks and occasional spearhead sparks while remaining narrow and focused.
4. Void Lance looks more energetic than Convergence without becoming a beam cloud.
5. Ball, Targets, Rune silhouette, and collision comprehension remain stronger than decorative particles.
6. Reduced Motion removes the particle envelope cleanly.
7. Swipe, Rune gesture input, and frame pacing show no obvious phone regression.
