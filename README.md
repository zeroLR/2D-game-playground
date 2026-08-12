# 2D-game-playground

A folder of small browser games, each in its own subfolder.

## Games

| Folder | Description | Play |
|---|---|---|
| [`simple-roguelike/`](./simple-roguelike) | Tiny turn-based roguelike — FOV, dungeon gen, bump-to-attack, goblins, stairs | [Play](https://zerolr.github.io/2D-game-playground/simple-roguelike/) |
| [`axiom/`](./axiom) | Mobile-portrait reverse bullet-hell deckbuilder | [Play](https://zerolr.github.io/2D-game-playground/axiom/) |
| [`vertex-parkour/`](./vertex-parkour) | Mobile-portrait parkour roguelite vertical slice | [Play](https://zerolr.github.io/2D-game-playground/vertex-parkour/) |

## Development

Each game is an independent Vite project. For example:

```sh
cd vertex-parkour
npm ci
npm run dev
npm test
npm run build
```

## Deployment

GitHub Pages is wired up via [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). Any push to `main` that touches a game folder rebuilds and publishes the site.

Each game is served under `https://zerolr.github.io/2D-game-playground/<game-folder>/`.

## Agent skills

`.agent/skills/` and `.claude/skills/` contain project development references used by coding agents.
