# Easy Difficulty Contract

Easy has two responsibilities that must remain separate:

1. **Easy CPU** is a readable beginner opponent.
2. **Easy Main Story** is the teaching layer that deliberately introduces the game.

Free Battle Easy may reuse the Easy CPU without scripted teaching.

## Easy CPU knowledge boundary

Easy is rules-correct, not intentionally broken.

Always preserve:
- immediate winning move recognition
- forced immediate block
- simple center preference
- basic one-line pressure

Intentionally exclude:
- compound-threat evaluation
- fork / double-threat planning
- lookahead search
- Mana/resource planning
- opponent modelling

Pattern attention is intentionally shallow:

| Pattern | Attention |
| --- | ---: |
| five | 100% |
| open four | 100% |
| four | 80% |
| open three | 55% |
| three | 30% |
| open two | 12% |
| two | 5% |

This is a knowledge boundary, not a requirement to randomly choose bad moves. Decision variance can still create openings, but it must not be the only reason Easy feels weak.

## Story teaching sequence

| Encounter | Teaching responsibility | Completion signal |
| --- | --- | --- |
| E1-1 | legal placement + five-in-row | complete a legal five |
| E1-2 | open two/open three + blocking | create or block an open three |
| E1-3 | pattern → Mana + Vanguard identity | gain pattern Mana and reach 2 Mana |
| E1-4 | Blink | successfully use Blink |
| E1-5 | Charge | successfully use Charge for visible positional benefit |
| E1-BOSS | qualification match | defeat a Normal-preview Boss |

The Boss uses Normal intelligence as the next-tier preview and removes most scripted guidance.

## Telemetry contract

Easy teaching should track more than win rate.

Key diagnostics:
- `skillIgnoranceSuccess`: player wins despite >= 4 skill opportunities and zero skill uses
- `manaNeglect`: `manaWasted >= 5` or `manaCappedTurns >= 4`
- starter skill use rate
- match length
- Easy CPU tactical guardrail failure rate

Interpretation:
- early Easy encounters may allow pure Gomoku wins
- late Easy encounters should make Blink/Charge visibly useful
- repeated late-chapter `skillIgnoranceSuccess` means the RPG layer was not actually taught
- the Easy Boss should be beatable without perfect skill play, but effective skill use should materially improve success rate

## Exit criteria before Normal calibration

Easy is ready when:
- CPU never ignores immediate win/forced block because of difficulty variance
- CPU performs no lookahead/fork/resource planning
- the story sequence teaches rules → patterns → Mana → Blink → Charge in that order
- telemetry can identify successful players who ignored skills/Mana
- late Easy playtests show a meaningful drop in `skillIgnoranceSuccess`
- the Boss can act as a readable Normal-preview qualification test
