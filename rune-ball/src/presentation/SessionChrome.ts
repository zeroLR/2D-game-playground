import type { SessionSnapshot, SessionStats } from '../game/SessionDirector';
import { calculateArenaLayout } from './ArenaLayout';

export interface SessionChromeCallbacks {
  onRetry(): void;
  onHome(): void;
  onContinue(): void;
}

export interface ProgressionResultPresentation {
  unlockedRune: { glyph: string; name: string } | null;
  nextStageLabel: string | null;
  canContinue: boolean;
}

function formatTime(seconds: number): string {
  const clamped = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(clamped / 60);
  const remainder = clamped % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
}

export class SessionChrome {
  private readonly root: HTMLElement;
  private readonly phase: HTMLElement;
  private readonly timer: HTMLElement;
  private readonly hint: HTMLElement;
  private readonly startPrompt: HTMLElement;
  private readonly results: HTMLElement;
  private readonly resultsEyebrow: HTMLElement;
  private readonly resultsTitle: HTMLElement;
  private readonly score: HTMLElement;
  private readonly maxCombo: HTMLElement;
  private readonly breaks: HTMLElement;
  private readonly runes: HTMLElement;
  private readonly overdriveBreaks: HTMLElement;
  private readonly chainLinks: HTMLElement;
  private readonly reward: HTMLElement;
  private readonly rewardGlyph: HTMLElement;
  private readonly rewardName: HTMLElement;
  private readonly rewardNext: HTMLElement;
  private readonly continueButton: HTMLButtonElement;
  private readonly retryButton: HTMLButtonElement;
  private readonly footnote: HTMLElement;
  private lastPhase = '';
  private lastTimer = '';
  private progressionResult: ProgressionResultPresentation | null = null;

  constructor(host: HTMLElement, callbacks: SessionChromeCallbacks) {
    const root = document.createElement('section');
    root.className = 'session-ui';
    root.setAttribute('aria-live', 'polite');

    const hud = document.createElement('div');
    hud.className = 'session-hud';

    const phase = document.createElement('span');
    phase.className = 'session-phase';

    const timer = document.createElement('strong');
    timer.className = 'session-timer';

    const hint = document.createElement('span');
    hint.className = 'session-hint';

    hud.append(phase, timer, hint);

    const startPrompt = document.createElement('div');
    startPrompt.className = 'session-start-prompt';
    startPrompt.setAttribute('aria-hidden', 'true');

    const startRune = document.createElement('div');
    startRune.className = 'session-start-rune';
    const startRing = document.createElement('span');
    startRing.className = 'session-start-rune-ring';
    const startOrbit = document.createElement('span');
    startOrbit.className = 'session-start-rune-orbit';
    const startSpark = document.createElement('span');
    startSpark.className = 'session-start-rune-spark';
    startOrbit.append(startSpark);
    startRune.append(startRing, startOrbit);
    startPrompt.append(startRune);

    const results = document.createElement('div');
    results.className = 'session-results';
    results.hidden = true;

    const panel = document.createElement('section');
    panel.className = 'session-results-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'session-result-title');

    const eyebrow = document.createElement('span');
    eyebrow.className = 'session-results-eyebrow';
    eyebrow.textContent = 'ARCANE RUN // COMPLETE';

    const title = document.createElement('h2');
    title.id = 'session-result-title';
    title.className = 'session-results-title';
    title.textContent = 'RUN COMPLETE';

    const scoreLabel = document.createElement('span');
    scoreLabel.className = 'session-score-label';
    scoreLabel.textContent = 'SCORE';

    const score = document.createElement('strong');
    score.className = 'session-score';
    score.textContent = '0';

    const reward = document.createElement('section');
    reward.className = 'session-unlock';
    reward.hidden = true;
    const rewardKicker = document.createElement('span');
    rewardKicker.className = 'session-results-eyebrow';
    rewardKicker.textContent = 'RUNE UNLOCKED';
    const rewardIdentity = document.createElement('div');
    rewardIdentity.className = 'session-unlock-identity';
    const rewardGlyph = document.createElement('strong');
    rewardGlyph.className = 'session-unlock-glyph';
    const rewardName = document.createElement('strong');
    rewardName.className = 'session-unlock-name';
    rewardIdentity.append(rewardGlyph, rewardName);
    const rewardNext = document.createElement('span');
    rewardNext.className = 'session-results-note session-unlock-next';
    reward.append(rewardKicker, rewardIdentity, rewardNext);

    const stats = document.createElement('div');
    stats.className = 'session-stats';

    const [maxComboItem, maxCombo] = this.makeStat('MAX COMBO');
    const [breaksItem, breaks] = this.makeStat('BREAKS');
    const [runesItem, runes] = this.makeStat('RUNE CASTS');
    const [overdriveItem, overdriveBreaks] = this.makeStat('OD BREAKS');
    const [chainItem, chainLinks] = this.makeStat('CHAIN LINKS');
    stats.append(maxComboItem, breaksItem, runesItem, overdriveItem, chainItem);

    const actions = document.createElement('div');
    actions.className = 'session-results-actions';

    const continueButton = document.createElement('button');
    continueButton.className = 'session-retry session-continue';
    continueButton.type = 'button';
    continueButton.textContent = 'NEXT STAGE';
    continueButton.hidden = true;
    continueButton.addEventListener('click', callbacks.onContinue);

    const retryButton = document.createElement('button');
    retryButton.className = 'session-retry';
    retryButton.type = 'button';
    retryButton.textContent = 'RETRY';
    retryButton.addEventListener('click', callbacks.onRetry);

    const homeButton = document.createElement('button');
    homeButton.className = 'session-home';
    homeButton.type = 'button';
    homeButton.textContent = 'HOME';
    homeButton.addEventListener('click', callbacks.onHome);

    actions.append(continueButton, retryButton, homeButton);

    const footnote = document.createElement('span');
    footnote.className = 'session-results-note';
    footnote.textContent = 'Retry keeps this stage and Rune build.';

    panel.append(eyebrow, title, scoreLabel, score, reward, stats, actions, footnote);
    results.append(panel);
    root.append(hud, startPrompt, results);
    host.append(root);

    this.root = root;
    this.phase = phase;
    this.timer = timer;
    this.hint = hint;
    this.startPrompt = startPrompt;
    this.results = results;
    this.resultsEyebrow = eyebrow;
    this.resultsTitle = title;
    this.score = score;
    this.maxCombo = maxCombo;
    this.breaks = breaks;
    this.runes = runes;
    this.overdriveBreaks = overdriveBreaks;
    this.chainLinks = chainLinks;
    this.reward = reward;
    this.rewardGlyph = rewardGlyph;
    this.rewardName = rewardName;
    this.rewardNext = rewardNext;
    this.continueButton = continueButton;
    this.retryButton = retryButton;
    this.footnote = footnote;
  }

  render(snapshot: SessionSnapshot): void {
    const timerText = formatTime(snapshot.secondsRemaining);
    if (timerText !== this.lastTimer) {
      this.timer.textContent = timerText;
      this.lastTimer = timerText;
    }

    if (snapshot.phase !== this.lastPhase) {
      this.lastPhase = snapshot.phase;
      this.root.dataset.phase = snapshot.phase;
      switch (snapshot.phase) {
        case 'ready':
          this.phase.textContent = 'READY';
          this.hint.textContent = '';
          this.startPrompt.hidden = false;
          this.results.hidden = true;
          break;
        case 'playing':
          this.phase.textContent = 'RUN';
          this.hint.textContent = '';
          this.startPrompt.hidden = true;
          this.results.hidden = true;
          break;
        case 'final-release':
          this.phase.textContent = snapshot.outcome === 'cleared' ? 'STAGE CLEAR' : 'FINAL RELEASE';
          this.hint.textContent = snapshot.outcome === 'cleared'
            ? snapshot.stats.bossDefeated
              ? `${snapshot.boss?.title ?? 'BOSS'} BROKEN`
              : 'FORMATION COLLAPSED'
            : 'CASH OUT THE LAST CHAIN';
          this.startPrompt.hidden = true;
          this.results.hidden = true;
          break;
        case 'results':
          this.phase.textContent = snapshot.outcome === 'cleared' ? 'CLEARED' : 'EXPIRED';
          this.hint.textContent = '';
          this.startPrompt.hidden = true;
          this.showResults(snapshot.stats, snapshot.outcome === 'cleared');
          break;
      }
    }

    if (snapshot.phase === 'playing') {
      if (snapshot.boss && snapshot.boss.state !== 'defeated') {
        this.phase.textContent = `BOSS ${snapshot.boss.phaseNumber}/${snapshot.boss.totalPhases}`;
        this.hint.textContent = snapshot.boss.state === 'exposed'
          ? `CORE EXPOSED · ${Math.max(1, Math.ceil(snapshot.boss.exposureSecondsRemaining))}`
          : snapshot.boss.phaseTitle;
      } else if (snapshot.encounter) {
        const label = snapshot.encounter.kind === 'elite' ? 'ELITE' : 'ENCOUNTER';
        this.phase.textContent = `${label} ${snapshot.encounter.number}/${snapshot.encounter.total}`;
        this.hint.textContent = snapshot.encounter.title;
      }
    }

    if (snapshot.phase === 'results') this.showResults(snapshot.stats, snapshot.outcome === 'cleared');
  }

  setProgressionResult(result: ProgressionResultPresentation | null): void {
    this.progressionResult = result;
  }

  setViewport(width: number, height: number): void {
    const layout = calculateArenaLayout(width, height);
    this.root.style.setProperty('--session-telemetry-y', `${layout.telemetryY}px`);
  }

  setVisible(visible: boolean): void {
    this.root.hidden = !visible;
  }

  destroy(): void {
    this.root.remove();
  }

  private showResults(stats: SessionStats, cleared: boolean): void {
    const progression = cleared ? this.progressionResult : null;
    const hasUnlock = progression?.unlockedRune !== null && progression?.unlockedRune !== undefined;
    this.resultsEyebrow.textContent = hasUnlock
      ? 'STAGE CLEAR // NEW CAPABILITY'
      : cleared ? 'AUTHORED STAGE // COMPLETE' : 'ARCANE RUN // EXPIRED';
    this.resultsTitle.textContent = cleared ? 'STAGE CLEAR' : 'FIELD COLLAPSED';
    this.score.textContent = stats.score.toLocaleString('en-US');
    this.maxCombo.textContent = stats.maxCombo.toString();
    this.breaks.textContent = stats.breaks.toString();
    this.runes.textContent = stats.runesCast.toString();
    this.overdriveBreaks.textContent = stats.overdriveBreaks.toString();
    this.chainLinks.textContent = stats.chainLinks.toString();

    if (hasUnlock && progression?.unlockedRune) {
      this.reward.hidden = false;
      this.rewardGlyph.textContent = progression.unlockedRune.glyph;
      this.rewardName.textContent = progression.unlockedRune.name;
      this.rewardNext.textContent = progression.nextStageLabel ?? '';
    } else {
      this.reward.hidden = true;
      this.rewardGlyph.textContent = '';
      this.rewardName.textContent = '';
      this.rewardNext.textContent = '';
    }

    this.continueButton.hidden = !cleared || !progression?.canContinue;
    this.footnote.textContent = cleared && progression?.nextStageLabel
      ? progression.nextStageLabel
      : 'Retry keeps this stage and Rune build.';
    this.results.hidden = false;
    queueMicrotask(() => {
      const preferred = !this.continueButton.hidden ? this.continueButton : this.retryButton;
      preferred.focus({ preventScroll: true });
    });
  }

  private makeStat(label: string): [HTMLElement, HTMLElement] {
    const item = document.createElement('div');
    item.className = 'session-stat';
    const value = document.createElement('strong');
    value.textContent = '0';
    const name = document.createElement('span');
    name.textContent = label;
    item.append(value, name);
    return [item, value];
  }
}
