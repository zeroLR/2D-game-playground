# P8.3.4a — Rune Material & Glow Gate

## Risk question

Can the validated Split SVG silhouettes gain enough luminous material depth to read as authored energy skills rather than flat vector icons, without sacrificing mobile readability or changing gameplay?

## Scope

This gate applies only to authored Split evolutions:

- Prism T1 — Refraction
- Prism T2 — Aurora Prism
- Lance T1 — Convergence
- Lance T2 — Void Lance

Base Split remains intentionally restrained so evolution has a visible material escalation.

## Runtime material stack

Each evolved SVG is rendered through the same cached vector geometry in four presentation layers:

1. **Back Glow** — broad, low-alpha additive duplicate with stronger blur.
2. **Soft Aura** — tighter additive duplicate with lighter blur.
3. **Body** — the shared SVG silhouette from the Tree/Runtime visual source.
4. **Hot Layer** — crisp additive duplicate that raises edge/core energy without widening the silhouette.

The existing Ball/Core remains the central hot point and renders above the Rune silhouette.

## Path identity

Material must reinforce gameplay identity rather than apply one generic glow preset:

- **Prism / Spread** — wider, softer glow envelope; more atmospheric cyan/magenta diffusion.
- **Lance / Focus** — tighter aura and stronger crisp hot layer; forward silhouette remains sharp.
- **T2** — stronger glow envelope and hot-layer energy than T1, not merely higher global brightness.

## Performance contract

- SVG geometry is parsed once and reused.
- Blur filters are attached to cached presentation layers, not rebuilt every frame.
- Only the currently active Split glyph is visible.
- No particle emitter, shader, external filter package, or gameplay change is introduced.
- Reduced Motion disables pulse animation as before; static material remains readable.

## Scope guard

No particles, energy-flow animation, impact-specific VFX, Bloom/AdvancedBloom plugin, custom shader, Vortex material rewrite, Chain mechanics, Split collision changes, damage changes, duration changes, or progression changes.

## Phone gate

1. Refraction looks luminous rather than like a flat SVG icon.
2. Aurora Prism feels materially more evolved than Refraction without becoming a white blob.
3. Prism retains a broad crystalline-wing silhouette under glow.
4. Convergence remains a sharp readable spear rather than a blurred beam.
5. Void Lance gains a stronger hot core while keeping its spearhead/shaft readable.
6. Target, Ball, and collision readability remain stronger than decorative glow.
7. Frame pacing and input feel show no obvious regression on phone.
