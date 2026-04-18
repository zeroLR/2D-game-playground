import "./style.css";
import { Application } from "pixi.js";

import { isMuted, playSfx, primeSfx, setMuted } from "./game/audio";
import { PLAY_H, PLAY_W } from "./game/config";
import { startLoop } from "./game/loop";
import { createRng, pickSeed } from "./game/rng";
import { applyCard, drawOffer, type Card } from "./game/cards";
import { DraftScene } from "./scenes/draft";
import { EndgameScene } from "./scenes/endgame";
import { PlayScene, REROLL_TOKEN_COST, type PointerMapper, type GameMode } from "./scenes/play";
import { SceneStack } from "./scenes/scene";
import { MainMenuScene, type MenuAction } from "./scenes/mainMenu";
import { StageSelectScene } from "./scenes/stageSelect";
import { ShopScene } from "./scenes/shop";
import { EquipmentScene } from "./scenes/equipment";
import { SkillTreeScene } from "./scenes/skillTree";
import { AchievementsScene } from "./scenes/achievements";
import { STAGE_THEMES, DEFAULT_THEME, type StageTheme } from "./game/stageThemes";
import { STAGE_WAVES } from "./game/stageWaves";
import { WAVES } from "./game/waves";
import { survivalWaveSpec } from "./game/survivalWaves";
import { applyEquipment } from "./game/equipment";
import { equipCard, unequipCard } from "./game/equipment";
import { createActiveSkillStates } from "./game/skills";
import { unlockAchievement } from "./game/achievements";
import type { RunResult } from "./game/rewards";
import { iconTimeStop, iconClone, setIconHtml } from "./icons";
import {
  loadProfile, saveProfile,
  loadEquipment, saveEquipment,
  loadSkillTree, saveSkillTree,
  loadAchievements, saveAchievements,
  loadShopUnlocks, saveShopUnlocks,
  loadSettings, saveSettings,
  exportSaveData, downloadSaveData,
  parseSaveData, importSaveData,
} from "./game/storage";
import type {
  PlayerProfile,
  EquipmentLoadout,
  SkillTreeState,
  AchievementState,
  ShopUnlocks,
} from "./game/data/types";

async function boot(): Promise<void> {
  const gameEl = document.getElementById("game");
  const hudHp = document.getElementById("hud-hp");
  const hudWave = document.getElementById("hud-wave");
  const hudPts = document.getElementById("hud-pts");
  const hudTokens = document.getElementById("hud-tokens");
  const hudSeed = document.getElementById("hud-seed");
  const btnRestart = document.getElementById("btn-restart");
  const btnMute = document.getElementById("btn-mute");
  const btnMenu = document.getElementById("btn-menu");
  const hudSkills = document.getElementById("hud-skills");
  if (!gameEl) throw new Error("#game element missing");

  // ── Load persistent state ───────────────────────────────────────────────
  let profile: PlayerProfile = await loadProfile();
  let equipment: EquipmentLoadout = await loadEquipment();
  let skillTree: SkillTreeState = await loadSkillTree();
  let achievements: AchievementState = await loadAchievements();
  let shopUnlocks: ShopUnlocks = await loadShopUnlocks();
  const settings = await loadSettings();

  // ── Pixi init ───────────────────────────────────────────────────────────
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
  let menuRng = createRng(42);

  function setTheme(theme: StageTheme): void {
    app.renderer.background.color = theme.background;
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.background = theme.overlayBg;
  }

  // ── HUD ─────────────────────────────────────────────────────────────────

  function updateHud(
    hp: number,
    maxHp: number,
    waveIdx: number,
    totalWaves: number,
    points: number,
    tokens: number,
  ): void {
    if (hudHp) hudHp.textContent = `HP: ${hp}/${maxHp}`;
    if (hudWave) hudWave.textContent = `W: ${waveIdx}/${totalWaves}`;
    if (hudPts) hudPts.textContent = `${points}pts`;
    if (hudTokens) hudTokens.textContent = `⟐ ${tokens}`;
  }

  const skillButtonUpdaters = new WeakMap<HTMLButtonElement, () => void>();

  function showSkillButtons(): void {
    if (!hudSkills) return;
    hudSkills.innerHTML = "";
    for (let i = 0; i < play.activeSkills.length; i++) {
      const sk = play.activeSkills[i]!;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "skill-btn";
      btn.addEventListener("click", () => play.activateSkill(i));

      const updateLabel = (): void => {
        const icon = sk.id === "timeStop" ? iconTimeStop : iconClone;
        if (sk.active > 0) {
          setIconHtml(btn, icon);
          btn.append(` ${sk.active.toFixed(1)}s`);
          btn.disabled = true;
        } else if (sk.cooldown > 0) {
          setIconHtml(btn, icon);
          btn.append(` ${Math.ceil(sk.cooldown)}s`);
          btn.disabled = true;
        } else {
          setIconHtml(btn, icon);
          btn.append(sk.id === "timeStop" ? " Time Stop" : " Clone");
          btn.disabled = false;
        }
      };
      updateLabel();
      skillButtonUpdaters.set(btn, updateLabel);
      hudSkills.appendChild(btn);
    }
  }

  function refreshSkillButtons(): void {
    if (!hudSkills) return;
    for (const btn of hudSkills.querySelectorAll<HTMLButtonElement>(".skill-btn")) {
      skillButtonUpdaters.get(btn)?.();
    }
  }

  // ── Run lifecycle ───────────────────────────────────────────────────────

  function startRun(mode: GameMode, stageIndex: number): void {
    while (stack.top()) stack.pop();
    app.stage.removeChildren();

    const theme = mode === "normal" ? (STAGE_THEMES[stageIndex] ?? DEFAULT_THEME) : DEFAULT_THEME;
    setTheme(theme);

    seed = pickSeed();
    const rng = createRng(seed);
    // eslint-disable-next-line no-console
    console.log(`[axiom] run seed = ${seed}, mode = ${mode}, stage = ${stageIndex}`);
    if (hudSeed) hudSeed.textContent = `seed: ${seed}`;

    // Build waves
    const waves = mode === "normal"
      ? (STAGE_WAVES[stageIndex] ?? WAVES)
      : [survivalWaveSpec(1, rng)]; // survival starts with wave 1

    const activeSkills = createActiveSkillStates(skillTree);

    play = new PlayScene(
      rng,
      {
        updateHud,
        onWaveCleared: (cleared) => {
          playSfx("draft");
          const label = mode === "survival"
            ? `${cleared}`
            : `${cleared} of ${play.totalWaves()}`;
          const offer = drawOffer(rng, 3);
          let draft: DraftScene;
          draft = new DraftScene(offer, label, {
            onPick: (pick) => onPickCard(pick),
            onReroll: () => {
              if (play.draftTokens < REROLL_TOKEN_COST) return false;
              play.draftTokens -= REROLL_TOKEN_COST;
              draft.setOffer(drawOffer(rng, 3));
              return true;
            },
            onSkip: () => {
              stack.pop();
              play.advanceToNextWave();
            },
            getTokens: () => play.draftTokens,
            rerollCost: REROLL_TOKEN_COST,
          });
          stack.push(draft);
        },
        onPlayerDied: () => {
          playSfx("death");
          const total = mode === "survival" ? play.currentWave1() : play.totalWaves();
          stack.push(new EndgameScene("dead", play.currentWave1(), total, () => showMainMenu()));
        },
        onRunWon: () => {
          const total = play.totalWaves();
          stack.push(new EndgameScene("won", total, total, () => showMainMenu()));
        },
        onRunComplete: (result) => settleRun(result),
      },
      mapper,
      { mode, waves, gridColor: theme.gridColor, stageIndex, activeSkills, theme },
    );

    // Apply equipment loadout at run start.
    applyEquipment(equipment, play.world, play.avatarId);

    app.stage.addChild(play.root);
    stack.push(play);
    showSkillButtons();
  }

  function onPickCard(card: Card): void {
    applyCard(play.world, play.avatarId, card);
    play.recordPick(card);
    stack.pop();
    play.advanceToNextWave();
  }

  async function settleRun(result: RunResult): Promise<void> {
    // Update profile
    profile.points += result.pointsEarned;
    profile.stats.totalRuns += 1;
    profile.stats.totalKills += result.totalKills;
    profile.stats.totalBossKills += result.bossKills;

    // Apply loot
    for (const drop of result.loot) {
      if (drop.kind === "core") skillTree.cores += drop.value;
      if (drop.kind === "skillPoints") skillTree.skillPoints += drop.value;
    }

    // Survival best
    if (result.mode === "survival") {
      profile.stats.bestSurvivalWave = Math.max(profile.stats.bestSurvivalWave, result.wavesCleared);
    }

    // Normal mode clear tracking
    if (result.mode === "normal" && result.wavesCleared >= 8) {
      profile.stats.normalCleared[result.stageIndex] = true;
    }

    // Check achievements
    if (result.bossKills > 0) {
      if (unlockAchievement(achievements, "firstBossKill")) {
        // eslint-disable-next-line no-console
        console.log("[axiom] Achievement unlocked: firstBossKill");
      }
    }
    if (result.noPowerRun && result.mode === "normal" && result.wavesCleared >= 8) {
      unlockAchievement(achievements, "noPowerNormalClear");
    }
    if (result.noPowerRun && result.mode === "survival" && result.wavesCleared >= 16) {
      unlockAchievement(achievements, "noPowerSurvival16");
    }

    // Persist
    await Promise.all([
      saveProfile(profile),
      saveSkillTree(skillTree),
      saveAchievements(achievements),
    ]);
  }

  // ── Main menu ─────────────────────────────────────────────────────────

  function showMainMenu(): void {
    while (stack.top()) stack.pop();
    app.stage.removeChildren();
    setTheme(DEFAULT_THEME);
    if (hudSkills) hudSkills.innerHTML = "";

    const menu = new MainMenuScene(async (action: MenuAction) => {
      switch (action.kind) {
        case "normalMode":
          stack.pop(); // remove menu
          stack.push(new StageSelectScene(
            (idx) => { stack.pop(); startRun("normal", idx); },
            () => { stack.pop(); showMainMenu(); },
          ));
          break;

        case "survivalMode":
          stack.pop();
          startRun("survival", 0);
          break;

        case "shop":
          stack.pop();
          stack.push(new ShopScene({
            getProfile: () => profile,
            getEquipment: () => equipment,
            getShopUnlocks: () => shopUnlocks,
            onPurchase: async (item) => {
              if (profile.points < item.price) return;
              profile.points -= item.price;
              if (item.category === "skin") {
                if (!profile.ownedSkins.includes(item.id)) profile.ownedSkins.push(item.id);
              } else if (item.category === "equipCard") {
                if (!equipment.ownedCards.includes(item.id)) equipment.ownedCards.push(item.id);
              } else if (item.category === "slotExpand") {
                equipment.maxSlots += 1;
              }
              if (!shopUnlocks.purchased.includes(item.id)) shopUnlocks.purchased.push(item.id);
              await Promise.all([saveProfile(profile), saveEquipment(equipment), saveShopUnlocks(shopUnlocks)]);
            },
            onBack: () => { stack.pop(); showMainMenu(); },
          }));
          break;

        case "equipment":
          stack.pop();
          stack.push(new EquipmentScene({
            getLoadout: () => equipment,
            getProfile: () => profile,
            onEquip: async (cardId) => {
              equipCard(equipment, cardId);
              await saveEquipment(equipment);
            },
            onUnequip: async (cardId) => {
              unequipCard(equipment, cardId);
              await saveEquipment(equipment);
            },
            onActivateSkin: async (skinId) => {
              profile.activeSkin = skinId;
              await saveProfile(profile);
            },
            onBack: () => { stack.pop(); showMainMenu(); },
          }));
          break;

        case "skillTree":
          stack.pop();
          stack.push(new SkillTreeScene({
            getState: () => skillTree,
            getRng: () => menuRng,
            onStateChanged: async (state) => {
              skillTree = state;
              // Check achievement
              const anyUnlocked = Object.values(skillTree.skills).some((s) => s.unlocked);
              if (anyUnlocked) {
                if (unlockAchievement(achievements, "firstPrimalSkill")) {
                  await saveAchievements(achievements);
                }
              }
              await saveSkillTree(skillTree);
            },
            onBack: () => { stack.pop(); showMainMenu(); },
          }));
          break;

        case "achievements":
          stack.pop();
          stack.push(new AchievementsScene(
            () => achievements,
            () => { stack.pop(); showMainMenu(); },
          ));
          break;

        case "settings":
          // Simple toggle for now
          setMuted(!isMuted());
          syncMuteLabel();
          break;

        case "exportData": {
          const data = await exportSaveData();
          downloadSaveData(data);
          break;
        }

        case "importData": {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".json";
          input.addEventListener("change", async () => {
            const file = input.files?.[0];
            if (!file) return;
            const text = await file.text();
            const data = parseSaveData(text);
            if (!data) {
              alert("Invalid save file.");
              return;
            }
            await importSaveData(data);
            // Reload state
            profile = await loadProfile();
            equipment = await loadEquipment();
            skillTree = await loadSkillTree();
            achievements = await loadAchievements();
            shopUnlocks = await loadShopUnlocks();
            alert("Data imported successfully!");
            showMainMenu();
          });
          input.click();
          break;
        }
      }
    });
    app.stage.addChild(menu.root);
    stack.push(menu);
  }

  // ── Controls ──────────────────────────────────────────────────────────

  btnRestart?.addEventListener("click", () => showMainMenu());
  btnMenu?.addEventListener("click", () => showMainMenu());

  function onFirstGesture(): void {
    primeSfx();
    document.removeEventListener("pointerdown", onFirstGesture);
  }
  document.addEventListener("pointerdown", onFirstGesture);

  function syncMuteLabel(): void {
    if (btnMute) btnMute.textContent = isMuted() ? "sfx off" : "sfx on";
  }
  btnMute?.addEventListener("click", () => {
    setMuted(!isMuted());
    syncMuteLabel();
    saveSettings({ muted: isMuted() });
  });
  if (settings.muted) setMuted(true);
  syncMuteLabel();

  // ── Start ─────────────────────────────────────────────────────────────

  showMainMenu();

  startLoop(
    (dt) => {
      stack.update(dt);
      refreshSkillButtons();
    },
    (alpha) => stack.render(alpha),
  );
}

boot().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[axiom] boot failed:", err);
});

