# Rune Ball — MVP Art Direction

## 1. Visual thesis

The game should read as **neon occult power fantasy**, not generic cyberpunk and not realistic sports.

The magical ball/core is always the visual anchor. Everything else exists to support trajectory readability, impact contrast, rune legibility, and escalation.

## 2. Visual hierarchy

Priority order:

1. Ball/core and its immediate trajectory.
2. Active rune gesture / rune effect.
3. Breakable targets and chain path.
4. Combo / Overdrive state.
5. Arena environment.
6. Decorative particles.

If decoration competes with the ball path, reduce decoration first.

## 3. Palette

Primary families:

- near-black / deep navy background
- electric cyan / blue for ball energy
- magenta / violet for rune power
- hot pink for high-intensity breaks
- restrained white for UI and peak highlights

Color should communicate function:

- Ball core: cyan-white anchor.
- Rune feedback: violet/magenta.
- Destructible target core: readable hot accent.
- Overdrive: combines cyan + magenta with increased white peak values.

Do not use many unrelated neon hues; the game should look authored rather than rainbow-noisy.

## 4. Arena style

MVP arena should be abstract and inexpensive:

- dark reflective or void-like floor
- large faint arcane geometry
- distant monoliths / floating fragments / gothic silhouettes
- minimal parallax layers
- low-contrast environmental motion

The environment should imply a magical ritual arena without requiring detailed 3D scenery.

## 5. Ball/core design

The ball must not resemble a normal sports ball.

Required visual layers:

- dark or luminous core
- thin arcane ring / glyph layer
- bright leading edge
- directionally stretched trail
- short-lived impact compression / flash

State changes:

- Idle/slow: compact glow.
- Fast: longer trail and stronger rim light.
- Rune-empowered: additional glyph orbit / color accent.
- Overdrive: stronger aura, thicker trail, controlled secondary sparks.

## 6. Target design

### Crystal

- angular silhouette
- clear center/core
- 2–3 major facet planes
- strong fracture readability

### Armored Crystal

- baseline crystal + outer shell/ring
- first hit visibly removes or cracks armor
- second/empowered hit causes full break

Break VFX should use stylized sprite shards rather than expensive physically simulated debris.

## 7. Rune language

Rune gestures need to remain readable while drawn anywhere on the playfield.

### Draw phase

- thin luminous stroke follows pointer path
- newest segment is brightest
- previous segments decay slightly
- rejected/unfinished gesture fades quickly without a harsh error state

### Recognition phase

A valid rune briefly resolves into a cleaner canonical glyph before activation.

Examples:

- Circle → closes and pulses inward before Vortex.
- V → duplicates / fans outward before Split.
- Z → sharp electric trace snaps to nearby targets before Chain.

The drawn gesture and the resulting world effect must feel causally connected.

## 8. VFX intensity ladder

### Tier 1 — Contact

- tiny spark
- subtle flash
- minimal trail kink

### Tier 2 — Break

- short shard burst
- brighter local flash
- small shock ring
- micro camera punch

### Tier 3 — Rune chain

- larger directed effect
- visible relationship between affected targets
- stronger transient / bloom

### Tier 4 — Overdrive release

- largest shockwave
- highest particle density
- strongest white peak
- short screen-scale lighting response

Never run Tier 4 continuously; contrast creates perceived impact.

## 9. Motion language

- basic redirect: immediate, sharp, no long anticipation
- wall bounce: tight squash/flash, no soft floating response
- target hit: 50–100 ms local reaction
- target break: 150–250 ms burst/readability window
- rune recognition: ~100–180 ms confirm beat
- Overdrive entry: brief compression/suction, then rapid expansion

Avoid long tween-heavy transitions that interrupt the action loop.

## 10. Camera feedback

Use camera motion sparingly:

- normal hit: none or nearly imperceptible
- break: tiny punch
- rune chain: short directional kick
- Overdrive entry/release: strongest but still bounded

No continuous handheld shake.

Provide reduced-motion behavior by scaling or disabling shake and large screen flashes.

## 11. UI system

Style:

- thin lines
- restrained uppercase typography
- compact numeric hierarchy
- translucent or no panels where possible
- no skeuomorphic buttons

### HUD

Top-left / top-center:
- score
- combo
- Flow / Overdrive status

Bottom edge:
- three rune readiness indicators
- indicators are informational, not primary activation buttons

The center 70%+ of the screen should remain visually owned by gameplay.

## 12. Results screen

Keep the results state lightweight:

- score
- longest combo
- rune chains
- Overdrive destruction count
- prominent Retry

No currency showers, reward chests, battle pass, or progression UI in MVP.

## 13. Rendering policy

Preferred MVP rendering techniques:

- PixiJS sprites / graphics
- additive blending for selective glow elements
- pooled impact particles
- stylized shard sprites
- trail mesh / sampled trail points
- ring sprites or simple shader for shockwaves
- rune path rendered from sampled gesture points

Avoid relying on expensive full-screen post-processing to make the art work. The scene should remain readable with post effects disabled.

## 14. Performance degradation order

When a device cannot sustain target frame pacing, reduce in this order:

1. decorative background particles
2. shard count
3. secondary sparks
4. trail sample density
5. bloom / screen-space effects
6. camera secondary effects

Do not reduce core collision feedback, rune readability, or ball visibility first.

## 15. MVP visual gate

Before producing additional arenas or skins, verify on an actual phone that:

- [ ] ball trajectory is readable against every arena area
- [ ] normal hit, break, rune chain, and Overdrive are visually distinct
- [ ] Circle, V, and Z drawing remains readable over active gameplay
- [ ] Overdrive looks more intense without obscuring targets
- [ ] UI can be understood at portrait size without covering action
- [ ] reduced-motion mode remains playable and visually coherent
- [ ] target frame pacing survives the highest planned MVP effect density
