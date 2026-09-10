# Rune Ball audio asset provenance

These files are vendored specifically for the Rune Ball P5.2 asset-audio validation slice.

## BGM

### `bgm-claimed-by-void.ogg`

- Work: **Claimed by the Void** / OGG mix
- Author: **vitalezzz**
- License: **CC0 / Public Domain dedication**
- Canonical source: https://opengameart.org/content/claimed-by-the-void
- Acquisition mirror: `Saber-Amir-Kh/Get-Bob-to-the-job`, exact `claimed_by_the_void_mix.ogg` binary

### `bgm-claimed-by-void.mp3`

- Work family: **Claimed by the Void**
- Author: **vitalezzz**
- License: **CC0 / Public Domain dedication**
- Canonical source: https://opengameart.org/content/claimed-by-the-void
- Acquisition mirror: `Saber-Amir-Kh/Get-Bob-to-the-job`
- Purpose: compatibility fallback for browsers without reliable Ogg/Vorbis playback.

The OGG mix is the preferred Rune Ball playback asset. The MP3 fallback is only selected when the browser reports no Ogg/Vorbis support.

## SFX

The SFX below were acquired from `manuel-palacio/brickstorm`, whose `CREDITS.md` records the source/provenance and CC0 status for every audio file. The original or derived assets are CC0 and can be redistributed.

Acquisition source: https://github.com/manuel-palacio/brickstorm/tree/main/public/audio
Provenance record: https://github.com/manuel-palacio/brickstorm/blob/main/CREDITS.md

| Rune Ball file | Source / provenance | Intended Rune Ball role |
| --- | --- | --- |
| `brick-hit.{ogg,mp3}` | Kenney Impact Sounds — `impactMining_000.ogg`, CC0 | target contact |
| `wall-hit.{ogg,mp3}` | Kenney Impact Sounds — `impactPlate_light_002.ogg`, CC0 | rebound |
| `brick-break.{ogg,mp3}` | Kenney Sci-Fi Sounds — `explosionCrunch_000.ogg`, CC0 | crystal break / release layer |
| `laser.{ogg,mp3}` | Kenney Sci-Fi Sounds — `laserSmall_001.ogg`, CC0 | Split / Chain energy |
| `powerup-get.{ogg,mp3}` | Kenney Interface Sounds — `confirmation_001.ogg`, CC0 | Rune resolve / Overdrive accent |
| `heartbeat.{ogg,mp3}` | Kenney Impact Sounds derivative, CC0 | Vortex / low-energy pulse |
| `brick-armored.{ogg,mp3}` | locally synthesized by brickstorm, declared CC0 | armored impact / failed Rune accent |
| `level-complete.{ogg,mp3}` | Kenney Music Jingles — `jingles_NES12.ogg`, CC0 | result-sting placeholder |

Kenney source packs:

- https://kenney.nl/assets/impact-sounds
- https://kenney.nl/assets/sci-fi-sounds
- https://kenney.nl/assets/interface-sounds
- https://kenney.nl/assets/music-jingles

## Product scope

These are characterization / MVP assets, not final production mastering. The `AudioDirector` owns event-to-audio mapping so individual samples or the BGM can be replaced later without changing gameplay/domain events.
