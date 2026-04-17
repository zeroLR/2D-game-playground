import "./style.css";
import { Application } from "pixi.js";

import { PLAY_H, PLAY_W } from "./game/config";
import { startLoop } from "./game/loop";
import { createRng, pickSeed } from "./game/rng";
import { applyCard, drawOffer, type Card } from "./game/cards";
import { DraftScene } from "./scenes/draft";
import { EndgameScene } from "./scenes/endgame";
import { PlayScene, type PointerMapper } from "./scenes/play";
import { SceneStack } from "./scenes/scene";

async function boot(): Promise<void> {
  const gameEl = document.getElementById("game");
  const hudHp = document.getElementById("hud-hp");
  const hudWave = document.getElementById("hud-wave");
  const hudSeed = document.getElementById("hud-seed");
  const btnRestart = document.getElementById("btn-restart");
  if (!gameEl) throw new Error("#game element missing");

  const app = new Application();
  await app.init({
    width: PLAY_W,
    height: PLAY_H,
    background: 0xffffff,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
  });
  gameEl.insertBefore(app.canvas, gameEl.firstChild);

  const stack = new SceneStack();

  // Cache the canvas rect — pointermove fires at display refresh rate and we
  // don't want a layout read per event. fitCanvas refreshes the cache.
  let cachedRect: DOMRect = app.canvas.getBoundingClientRect();
  const mapper: PointerMapper = {
    target: app.canvas,
    clientToPlay: (clientX, clientY) => {
      const r = cachedRect;
      const px = ((clientX - r.left) / r.width) * PLAY_W;
      const py = ((clientY - r.top) / r.height) * PLAY_H;
      return {
        x: Math.max(0, Math.min(PLAY_W, px)),
        y: Math.max(0, Math.min(PLAY_H, py)),
      };
    },
  };

  // Canvas letterboxing: internal resolution is fixed at PLAY_W×PLAY_H; the
  // CSS size scales to the largest 9:16 rectangle that fits in #game.
  function fitCanvas(): void {
    const { clientWidth: cw, clientHeight: ch } = gameEl!;
    if (cw === 0 || ch === 0) return;
    const scale = Math.min(cw / PLAY_W, ch / PLAY_H);
    const w = Math.floor(PLAY_W * scale);
    const h = Math.floor(PLAY_H * scale);
    app.canvas.style.width = `${w}px`;
    app.canvas.style.height = `${h}px`;
    cachedRect = app.canvas.getBoundingClientRect();
  }
  fitCanvas();
  window.addEventListener("resize", fitCanvas);

  let play: PlayScene;
  let seed = 0;

  function updateHud(hp: number, maxHp: number, waveIdx: number, totalWaves: number): void {
    if (hudHp) hudHp.textContent = `HP: ${hp}/${maxHp}`;
    if (hudWave) hudWave.textContent = `W: ${waveIdx}/${totalWaves}`;
  }

  function startNewRun(): void {
    // Drain the stack first so each scene's exit() runs before its root is
    // detached; otherwise DOM overlay cleanup can trail the Pixi teardown.
    while (stack.top()) stack.pop();
    app.stage.removeChildren();
    seed = pickSeed();
    const rng = createRng(seed);
    // eslint-disable-next-line no-console
    console.log(`[shape-shift] run seed = ${seed}`);
    if (hudSeed) hudSeed.textContent = `seed: ${seed}`;

    play = new PlayScene(
      rng,
      {
        updateHud,
        onWaveCleared: (cleared) => {
          const offer = drawOffer(rng, 3);
          const label = `${cleared} of ${play.totalWaves()}`;
          stack.push(new DraftScene(offer, label, (pick) => onPickCard(pick)));
        },
        onPlayerDied: () => {
          stack.push(new EndgameScene("dead", play.currentWave1(), play.totalWaves(), startNewRun));
        },
        onRunWon: () => {
          stack.push(new EndgameScene("won", play.totalWaves(), play.totalWaves(), startNewRun));
        },
      },
      mapper,
    );
    app.stage.addChild(play.root);
    stack.push(play);
  }

  function onPickCard(card: Card): void {
    applyCard(play.world, play.avatarId, card);
    stack.pop();
    play.advanceToNextWave();
  }

  btnRestart?.addEventListener("click", () => startNewRun());

  startNewRun();

  startLoop(
    (dt) => stack.update(dt),
    (alpha) => stack.render(alpha),
  );
}

boot().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[shape-shift] boot failed:", err);
});
