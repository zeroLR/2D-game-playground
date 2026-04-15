# 2D-game-playground

A folder of small browser games, each in its own subfolder.

## Games

| Folder | Description | Play |
|---|---|---|
| [`simple-roguelike/`](./simple-roguelike) | Tiny turn-based roguelike — FOV, dungeon gen, bump-to-attack, goblins, stairs | [Play](https://zerolr.github.io/2D-game-playground/simple-roguelike/) |

## Development

Each game is an independent Vite project. For example:

```sh
cd simple-roguelike
npm ci
npm run dev       # local dev server
npm test          # vitest suite
npm run build     # production build into dist/
```

## Deployment

GitHub Pages is wired up via [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). Any push to `main` that touches a game folder rebuilds and publishes the site.

The first time this runs, enable Pages in **Settings → Pages → Source = GitHub Actions**.

Each game is served under `https://zerolr.github.io/2D-game-playground/<game-folder>/`. The root `/2D-game-playground/` redirects to `simple-roguelike` for now; swap in a real landing page once there are multiple games.

## Claude skills

`.claude/skills/` contains four skills from [`zeroLR/skills`](https://github.com/zeroLR/skills) that auto-trigger while working on these games: `game-scaffold`, `game-loop`, `game-systems`, `game-perf`.
