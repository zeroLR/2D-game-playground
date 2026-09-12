# P8.3.4d — Impact Integration Gate

## Risk question

Can Split's validated silhouette, material, motion, and local particle envelope remain visually coherent at the exact moment of contact, so Prism and Lance produce distinct impact fantasies without changing damage, collision, or mobile readability?

## Product intent

P8.3.4a–c made the active Rune itself increasingly resemble the visual mockup. The remaining gap is contact: if both branches still land with the same generic hit flash, the authored Rune identity disappears at the most important feedback moment.

This gate keeps the existing generic impact as the common tactile layer and adds a Split-only authored impact layer on top.

```text
Gameplay target-hit(source = split)
        ↓
Generic ImpactPool
        +
SplitImpactPool
        ↓
Path-specific impact identity
```

No new gameplay event family is introduced.

## Visual grammar

### Prism — refraction impact

Prism should feel like a crystalline wing sweeps through a target and releases stored refraction energy.

- brief white hot contact core
- cyan diamond/refraction ring
- magenta transverse slice
- crystal shards fan outward from the Core → target direction
- T2 increases ring size, shard fan, speed, and secondary refraction line

Identity: `Sweep → refract → burst outward`.

### Lance — pierce impact

Lance should feel like one continuous spear drives through the target along Ball velocity.

- compact white hot contact core
- narrow magenta/cyan contact ring
- long forward-aligned pierce streak
- small focused shards continue along the spear axis
- T2 lengthens the streak and adds a stronger secondary line rather than widening the effect

Identity: `Aim → pierce → continue forward`.

## Architecture

```text
SplitRuntimeSvgSpec
├─ SVG geometry
├─ Material profile
├─ Energy-motion profile
├─ Particle-envelope profile
└─ Impact profile
          ↓
DestructionScene target-hit(source = split)
          ↓
SplitImpactPool (fixed pool)
```

`SplitImpactPool` is presentation-only. It reads the current authored Split path/stage and Ball transform from the existing scene snapshot. Damage, target state, qualified-use progression, and collision stay inside `DestructionSession`.

## Layering contract

The generic `ImpactPool` remains active for every hit so baseline contact feel stays consistent across Ball, Split, Chain, and later Rune sources.

The Split-specific layer only adds identity:

- Base Split: no special impact layer
- Prism T1/T2: refraction burst
- Lance T1/T2: pierce streak

Target-break rings, camera kick, audio, and score/combo behavior remain unchanged.

## Performance contract

- fixed pool of impact instances
- no runtime `Graphics` allocation on hit
- each impact has a hard shard cap
- Prism T2: at most 7 authored shards
- Lance T2: at most 5 authored shards
- impact lifetime stays below 0.30 s
- timestep is clamped in the pool update
- pool recycles oldest instances under extreme overlap rather than growing

## Accessibility

With `Reduced Motion` enabled:

- moving shards are removed
- the hot flash / ring / short authored streak remain
- expansion animation is suppressed
- lifetime is shortened

The player still receives immediate cause/effect feedback without a detached burst animation.

## Scope guard

Not in this gate:

- damage or hit-count tuning
- collision geometry changes
- Split duration changes
- new sound assets or audio mix changes
- camera feedback redesign
- full-screen bloom or shader effects
- Vortex runtime rewrite
- Chain evolution

## Phone gate

1. Prism contact reads as refraction/crystal impact rather than a generic spark.
2. Aurora Prism T2 is stronger than Refraction while preserving the broad wing identity.
3. Lance contact reads as a forward pierce aligned with Ball trajectory.
4. Void Lance T2 creates a longer/hotter contact line without widening into a beam cloud.
5. Repeated Split hits remain readable when several targets are close together.
6. Generic hit, target-break, Ball, Target, and Rune silhouette remain visually dominant enough to understand gameplay.
7. Reduced Motion removes moving shards while preserving immediate contact clarity.
8. Phone frame pacing and input feel show no obvious regression.
