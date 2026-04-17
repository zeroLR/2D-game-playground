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
  // We swap the top-level Pixi stage to match whichever scene is on top. For
  // overlay scenes (Draft/Endgame) the Play scene's root stays on stage so the
  // frozen play-field remains visible.
  // Implementation detail: each scene owns a Container; main merges them into
  // app.stage as the stack changes.
  const sceneLayer = app.stage;

  const mapper: PointerMapper = {
    target: app.canvas,
    clientToPlay: (clientX, clientY) => {
      const rect = app.canvas.getBoundingClientRect();
      const px = ((clientX - rect.left) / rect.width) * PLAY_W;
      const py = ((clientY - rect.top) / rect.height) * PLAY_H;
      return {
        x: Math.max(0, Math.min(PLAY_W, px)),
        y: Math.max(0, Math.min(PLAY_H, py)),
      };
    },
  };

  // Canvas letterboxing: internal resolution is fixed at PLAY_W×PLAY_H. The
  // CSS size is scaled to the largest 9:16 rectangle that fits in #game.
  function fitCanvas(): void {
    const { clientWidth: cw, clientHeight: ch } = gameEl!;
    if (cw === 0 || ch === 0) return;
    const scale = Math.min(cw / PLAY_W, ch / PLAY_H);
    const w = Math.floor(PLAY_W * scale);
    const h = Math.floor(PLAY_H * scale);
    app.canvas.style.width = `${w}px`;
    app.canvas.style.height = `${h}px`;
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
    sceneLayer.removeChildren();
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
    sceneLayer.addChild(play.root);
    // Clear existing stack (exit all current top scenes) before pushing play.
    while (stack.top()) stack.pop();
    stack.push(play);
  }

  function onPickCard(card: Card): void {
    applyCard(play.world, play.avatarId, card);
    stack.pop(); // DraftScene
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
