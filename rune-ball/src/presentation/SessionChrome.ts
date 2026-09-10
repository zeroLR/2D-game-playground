import type { SessionSnapshot, SessionStats } from '../game/SessionDirector';

export interface SessionChromeCallbacks {
  onRetry(): void;
  onHome(): void;
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
  private readonly score: HTMLElement;
  private readonly maxCombo: HTMLElement;
  private readonly breaks: HTMLElement;
  private readonly runes: HTMLElement;
  private readonly overdriveBreaks: HTMLElement;
  private readonly chainLinks: HTMLElement;
  private readonly retryButton: HTMLButtonElement;
  private lastPhase = '';
  private lastTimer = '';

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

    actions.append(retryButton, homeButton);

    const footnote = document.createElement('span');
    footnote.className = 'session-results-note';
    footnote.textContent = 'Retry keeps this stage and Rune build.';

    panel.append(eyebrow, title, scoreLabel, score, stats, actions, footnote);
    results.append(panel);
    root.append(hud, startPrompt, results);
    host.append(root);

    this.root = root;
    this.phase = phase;
    this.timer = timer;
    this.hint = hint;
    this.startPrompt = startPrompt;
    this.results = results;
    this.score = score;
    this.maxCombo = maxCombo;
    this.breaks = breaks;
    this.runes = runes;
    this.overdriveBreaks = overdriveBreaks;
    this.chainLinks = chainLinks;
    this.retryButton = retryButton;
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
          this.phase.textContent = 'FINAL RELEASE';
          this.hint.textContent = 'CASH OUT THE LAST CHAIN';
          this.startPrompt.hidden = true;
          this.results.hidden = true;
          break;
        case 'results':
          this.phase.textContent = 'COMPLETE';
          this.hint.textContent = '';
          this.startPrompt.hidden = true;
          this.showResults(snapshot.stats);
          break;
      }
    }

    if (snapshot.phase === 'results') this.showResults(snapshot.stats);
  }

  setVisible(visible: boolean): void {
    this.root.hidden = !visible;
  }

  destroy(): void {
    this.root.remove();
  }

  private showResults(stats: SessionStats): void {
    this.score.textContent = stats.score.toLocaleString('en-US');
    this.maxCombo.textContent = stats.maxCombo.toString();
    this.breaks.textContent = stats.breaks.toString();
    this.runes.textContent = stats.runesCast.toString();
    this.overdriveBreaks.textContent = stats.overdriveBreaks.toString();
    this.chainLinks.textContent = stats.chainLinks.toString();
    this.results.hidden = false;
    queueMicrotask(() => this.retryButton.focus({ preventScroll: true }));
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
