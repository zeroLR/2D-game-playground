# Rune Ball — P5 VFX + Audio Characterization

## Risk question

Can the already-validated Rune Ball loop communicate **Contact → Break → Rune / Chain → Overdrive** as distinct power tiers by sight and sound, while keeping the core action readable on a phone?

P5 does not add gameplay. If a feedback change requires a new rule to feel exciting, it is out of scope for this phase.

## Feedback hierarchy

```text
Tier 1  Contact
  local spark + tiny transient
  no camera punch

Tier 2  Break
  shard burst + shock ring + light camera punch

Tier 3  Rune / Chain
  canonical glyph + directional propagation + distinct audio identity
  stronger but bounded directional camera response

Tier 4  Overdrive Entry / Release
  screen-scale shockwave + strongest white peak + bass transition
  largest camera response, still bounded
```

Tier 4 is intentionally reserved for state transitions. Overdrive does **not** continuously run maximum flash / shake, because contrast is the source of perceived impact.

## Ball / trail treatment

The magical core remains the strongest visual anchor:

- dark compact core
- cyan-white leading edge
- rotating arcane orbit / sigil layer
- sampled tapered trail rather than a uniform debug line
- Rebound extends and brightens the existing trajectory language
- Flow subtly energizes the core / arena without changing control
- Overdrive increases white peak, trail thickness, and orbit intensity without obscuring collision readability

## Rune treatment

Successful Rune activation no longer needs a text name to confirm success.

- live draw trail keeps newest segments brightest
- recognized gestures resolve briefly into the canonical glyph
- Vortex uses rotating pull geometry
- Split keeps two readable collision echoes anchored to the ball
- Chain uses a directed link plus a traveling propagation spark
- failed recognition / insufficient charge remain short contextual text because the player needs corrective information

P5 phone feedback clarified that the player does **not** need to inspect whether the finger-drawn path remains visually pristine once recognition is reliable. The important contract is causal confirmation: the player knows the intended Rune was recognized and sees the resulting world response. Do not spend polish budget making gesture handwriting compete with the resulting effect.

## Audio grammar

P5 uses a small procedural Web Audio backend to validate event identity before final sample / BGM production.

- Contact: short transient + body tone
- Armored contact: lower / harder body
- Break: noise crack + low body layer
- Combo milestone: short pitched accent every readable milestone
- Rebound: fast upward launch cue
- Vortex: descending suction cue
- Split: paired diverging upward tones
- Chain: two-step electric rise + propagation accent
- Overdrive entry: bass drop + chord layer
- Overdrive active: arcane drone / pulse driven by Flow state
- Overdrive exit: resolving downward release
- Result sting API exists for P6 results integration

### P5.1 audibility correction

Initial phone playtesting produced no audible sound/music. P5 therefore remains open until a correction proves real device output.

The P5.1 correction:

- supports standard `AudioContext` and the Safari-prefixed fallback where needed
- primes a one-sample source inside the user gesture before `resume()`
- exposes/logs AudioContext support + runtime state so silent failure is observable
- plays one short unlock cue after the first successful transition to `running`
- raises the procedural music/SFX mix from near-inaudible prototype levels to a phone-testable level
- keeps audio failure non-fatal; gameplay never waits on audio

Final sample choice, music composition, mastering, and loudness normalization remain later production work.

## Camera contract

Camera motion is event-tiered and bounded:

- normal Contact: none
- Break: small readable directional punch
- Chain: clearly stronger directional punch
- Overdrive entry: strongest response, hard-capped at 6 px
- Overdrive exit: smaller release response

P5.1 replaces the earlier low-amplitude oscillation with one directional punch plus a small recoil. The intent is **impact, not shake**. Initial values were too subtle to perceive on phone, so the calibration is raised while retaining the same 6 px hard cap.

No continuous handheld shake.

## UI cleanup

P4 playtesting showed that state text was less useful than the world response itself. P5 therefore removes prototype labels such as `OVERDRIVE`, `RUNE FREE`, `COMBO LOCK`, Flow percentage, speed telemetry, and direction telemetry from the primary presentation.

Persistent information remains compact:

- score
- combo
- one thin Flow / Overdrive meter
- Rune charge + `○ V Z` guide

During Overdrive, Rune charge becomes an infinity symbol and the meter / world treatment communicates the temporary free-cast state.

## Performance / effect budget

P5 preserves deterministic gameplay and bounds presentation growth:

- pooled impact particles with a fixed capacity
- particle count scales per tier instead of allocating unbounded effects
- capped active Break rings, Rebound beats, Rune confirmations, Chain beats, and Overdrive beats
- fixed trail history
- no mandatory full-screen post-processing
- no gameplay rule depends on visual effect completion

Recommended degradation order remains:

1. decorative secondary particles
2. shard count
3. secondary sparks
4. trail sample density
5. screen-scale effects
6. camera secondary response

Never degrade ball visibility, Rune recognition, or core collision feedback first.

## Reduced motion

`prefers-reduced-motion` is honored immediately:

- camera displacement is strongly reduced
- large screen flashes are reduced
- Overdrive ray count is reduced
- pooled particle motion / density is reduced

P6 will expose an explicit in-game toggle using the same presentation boundary.

## Product observation: spectacle-forward play

P5 phone feedback also showed a meaningful product behavior: during dense play the tester did not feel a need to deliberately track and select individual targets, and instead freely cast Runes and watched the system resolve the spectacle.

Treat this as an MVP validation observation, not a P5 defect by itself. Rune Ball's intended power fantasy may be more **orchestration / release** than precision target acquisition. P6 should validate whether that remains satisfying over a complete 60–90 second session and whether the player still feels enough authorship in the resulting chain reactions.

Do not force target-selection mechanics into P5 merely to increase precision demand.

## Scope guard

Out of scope for P5:

- new Rune types
- progression / Rune Cards / Ascension
- alternate Overdrive archetypes
- final authored music assets
- final mastering / sample replacement
- session timer / results / Retry
- sound toggle UI
- explicit reduced-motion toggle UI
- production telemetry and deployment completion

Those remain P6 or Post-MVP work.

## Phone playtest gate

On a real phone, verify:

1. Can Contact and Break be distinguished without watching the score / Combo text?
2. Do Vortex, Split, and Chain each have a recognizable world-response **and** sound identity?
3. After drawing, is successful/failed Rune recognition immediately obvious even if the exact finger path is not inspected?
4. Is Overdrive entry unmistakable without the word `OVERDRIVE` appearing?
5. During the densest spectacle, can the player still understand the ball/Rune causal flow even without selecting individual targets?
6. Does Overdrive exit feel like a release / resolution once audio is actually audible?
7. Is Break / Chain / Overdrive camera feedback perceptible but never strong enough to disrupt steering?
8. Does the device remain responsively playable at the densest Overdrive + Rune + Chain overlap?
9. Does reduced-motion mode preserve all gameplay information while substantially lowering large movement / flash?

P5 must not close while Audio is silent on the actual test device. If Audio works and major states communicate without labels while Tier 3 / Tier 4 feedback remains readable, P5 can close without further cosmetic polishing.
