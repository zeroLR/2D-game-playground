# Gomoku RPG — M0

Portrait-first mobile Web prototype combining Gomoku with a minimal RPG resource/skill loop.

## M0 hypothesis

Does earning a tactical resource from board patterns, then spending it to reposition a stone, create interesting decisions beyond ordinary Gomoku?

## Rules

- 9×9 board; five in a row wins.
- Player vs CPU.
- Placing a stone that forms a line of 3+ grants 1 Mana (max 5).
- **Blink** costs 2 Mana and consumes the whole turn: move one of your stones to any empty intersection.
- CPU first takes a winning move, then blocks an immediate player win, otherwise prefers the center.

## UX / art direction

- Portrait mobile first (390×844 logical canvas).
- Abstract geometric player/opponent identities.
- Warm paper board, restrained gold/violet accents, minimal premium HUD.
- No modal interaction during play.

## Run

```bash
npm install
npm run dev
npm test
npm run build
```

## M0 acceptance

The prototype is successful if playtesting can answer whether Blink changes placement strategy enough to justify continuing the RPG layer. PvP, progression, equipment, multiple classes, matchmaking and backend are intentionally out of scope.