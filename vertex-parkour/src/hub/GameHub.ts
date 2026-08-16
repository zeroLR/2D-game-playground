import { CHAPTER_ONE_BIOMES, HUB_NAV, RELIC_PREVIEWS, TALENT_NODES, type HubPage } from './HubContent';

export type GameHubOptions = {
  onEnterChapter: () => void;
  onResumeRun: () => void;
  hasActiveRun: () => boolean;
};

type HubSettings = { reducedMotion: boolean; highContrast: boolean };

const SETTINGS_KEY = 'vertex-hub-settings-v1';
const NOVA_PROFILE_URL = new URL('./assets/nova/profile-nova.png', import.meta.url).href;
const NOVA_ROSTER_URL = new URL('./assets/nova/roster-nova.png', import.meta.url).href;
const LOCKED_RUNNER_URL = new URL('./assets/locked.png', import.meta.url).href;

function loadSettings(): HubSettings {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as Partial<HubSettings>;
    return { reducedMotion: parsed.reducedMotion === true, highContrast: parsed.highContrast === true };
  } catch {
    return { reducedMotion: false, highContrast: false };
  }
}

export class GameHub {
  readonly root = document.createElement('div');
  readonly gameHomeButton = document.createElement('button');
  private page: HubPage = 'home';
  private settings = loadSettings();

  constructor(private readonly host: HTMLElement, private readonly options: GameHubOptions) {
    this.root.className = 'vertex-hub';
    this.gameHomeButton.className = 'game-home-button';
    this.gameHomeButton.type = 'button';
    this.gameHomeButton.textContent = '◇  HOME';
    this.gameHomeButton.hidden = true;
    this.gameHomeButton.addEventListener('click', () => this.showHub('home'));
    this.host.append(this.root, this.gameHomeButton);
    this.applySettings();
    this.render();
  }

  showHub(page: HubPage = 'home') {
    this.page = page;
    this.root.hidden = false;
    this.gameHomeButton.hidden = true;
    this.host.classList.remove('game-active');
    this.render();
  }

  showGame() {
    this.root.hidden = true;
    this.gameHomeButton.hidden = false;
    this.host.classList.add('game-active');
  }

  private navigate(page: HubPage) {
    this.page = page;
    this.render();
  }

  private render() {
    this.root.innerHTML = `
      <div class="hub-atmosphere" aria-hidden="true"><i></i><i></i><i></i></div>
      <header class="hub-header">
        <div class="brand-lockup">
          <span class="brand-mark">△</span>
          <div><strong>VERTEX</strong><small>ASCENSION PROTOCOL</small></div>
        </div>
        <div class="hub-status"><span class="status-dot"></span> CHAPTER 01 · ONLINE</div>
      </header>
      <main class="hub-main">${this.renderPage()}</main>
      <nav class="hub-nav" aria-label="Main navigation">
        ${HUB_NAV.map((item) => `<button class="hub-nav-item ${this.page === item.id ? 'is-active' : ''}" data-page="${item.id}" type="button"><span>${item.glyph}</span><small>${item.label}</small></button>`).join('')}
      </nav>
    `;

    this.root.querySelectorAll<HTMLElement>('[data-page]').forEach((button) => button.addEventListener('click', () => this.navigate(button.dataset.page as HubPage)));
    this.root.querySelector<HTMLElement>('[data-action="enter"]')?.addEventListener('click', () => { this.options.onEnterChapter(); this.showGame(); });
    this.root.querySelector<HTMLElement>('[data-action="resume"]')?.addEventListener('click', () => { this.options.onResumeRun(); this.showGame(); });
    this.root.querySelectorAll<HTMLInputElement>('[data-setting]').forEach((input) => input.addEventListener('change', () => this.updateSetting(input.dataset.setting as keyof HubSettings, input.checked)));
  }

  private renderPage(): string {
    switch (this.page) {
      case 'profile': return this.profilePage();
      case 'talent': return this.talentPage();
      case 'gate': return this.gatePage();
      case 'relic': return this.relicPage();
      case 'settings': return this.settingsPage();
      default: return this.homePage();
    }
  }

  private homePage() {
    const resume = this.options.hasActiveRun();
    return `
      <section class="home-hero">
        <div class="eyebrow">VERTICAL ROGUELITE · CHAPTER ONE</div>
        <h1>ASCEND<br/><em>BEYOND</em></h1>
        <p>Momentum is survival. Read the route, build Flow, and outrun the Abyss until the Storm Crown yields.</p>
        <div class="hero-actions">
          ${resume ? '<button class="primary-action" data-action="resume" type="button"><span>RESUME ASCENT</span><b>→</b></button>' : '<button class="primary-action" data-page="gate" type="button"><span>BEGIN ASCENT</span><b>→</b></button>'}
          <button class="ghost-action" data-page="profile" type="button">VIEW RUNNER</button>
        </div>
      </section>
      <section class="home-signal panel-cut">
        <div class="signal-line"><span>01</span><b>TEAL RUINS</b><i></i></div>
        <div class="signal-line"><span>02</span><b>AMBER DISTRICT</b><i></i></div>
        <div class="signal-line"><span>03</span><b>VIOLET ZONE</b><i></i></div>
        <div class="signal-line"><span>04</span><b>PALE HEIGHTS</b><i></i></div>
        <div class="signal-line crown"><span>05</span><b>STORM CROWN</b><i></i></div>
      </section>`;
  }

  private profilePage() {
    return `
      <section class="page-heading profile-heading"><span>RUNNER / 01</span><h2>CHARACTER PROFILE</h2><p>Current gameplay identity. Additional runners remain future M10 content.</p></section>
      <section class="runner-profile-stage panel-cut">
        <div class="runner-art-stage">
          <div class="runner-stage-mark" aria-hidden="true"><i></i><i></i><i></i></div>
          <img class="runner-profile-art" src="${NOVA_PROFILE_URL}" alt="Nova, the active VERTEX runner" />
          <div class="runner-art-caption"><span>ACTIVE RUNNER</span><b>01 · NOVA</b></div>
        </div>
        <div class="runner-profile-copy">
          <span class="tag teal">ACTIVE RUNNER</span>
          <h3>NOVA</h3>
          <div class="runner-subtitle">◆ THE ASCENT BEGINS</div>
          <p>Balanced ascender built around clean Dash commitment and sustained Flow.</p>
          <div class="profile-rule"></div>
          <div class="stat-list">
            <div><small>MOBILITY</small><b>◆ ◆ ◆ ◆ ◇</b></div>
            <div><small>CONTROL</small><b>◆ ◆ ◆ ◇ ◇</b></div>
            <div><small>FLOW</small><b>◆ ◆ ◆ ◆ ◇</b></div>
            <div><small>RISK</small><b>◆ ◆ ◆ ◇ ◇</b></div>
          </div>
        </div>
      </section>
      <section class="runner-roster-section">
        <div class="runner-roster-label"><span>RUNNER ROSTER</span><i></i></div>
        <div class="runner-roster">
          <article class="runner-roster-card is-active">
            <img src="${NOVA_ROSTER_URL}" alt="Nova" />
            <b>NOVA</b><small>ACTIVE</small>
          </article>
          <article class="runner-roster-card is-locked"><img class="locked-runner-art" src="${LOCKED_RUNNER_URL}" alt="Locked runner" /><b>KAI</b><small>LOCKED · AGGRESSION</small></article>
          <article class="runner-roster-card is-locked"><img class="locked-runner-art" src="${LOCKED_RUNNER_URL}" alt="Locked runner" /><b>LUMEN</b><small>LOCKED · CONTROL</small></article>
        </div>
      </section>
      <section class="runner-archive-note panel-cut"><span>◉ &nbsp; RUNNER ARCHIVE PROTOCOL</span><p>Additional runner identities are sealed within the Protocol. Ascend further to unlock.</p></section>`;
  }

  private talentPage() {
    return `
      <section class="page-heading"><span>PROTOTYPE / META</span><h2>TALENT MATRIX</h2><p>Visual shell only. Unlock logic and persistent progression arrive in M9.</p></section>
      <section class="talent-matrix panel-cut">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 14 L28 32 M50 14 L72 32 M28 36 L18 58 M28 36 L50 58 M72 36 L50 58 M72 36 L82 58 M18 62 L50 86 M50 62 L50 86 M82 62 L50 86" />
        </svg>
        ${TALENT_NODES.map((node) => `<button class="talent-node ${node.state}" style="left:${node.x}%;top:${node.y}%" type="button"><span>${node.state === 'active' ? '◆' : node.state === 'preview' ? '◇' : '·'}</span><small>${node.label}</small></button>`).join('')}
      </section>
      <div class="prototype-note">META CURRENCY · — &nbsp;&nbsp; / &nbsp;&nbsp; TREE STATE · PROTOTYPE</div>`;
  }

  private gatePage() {
    return `
      <section class="page-heading"><span>GATE / CHAPTER SELECT</span><h2>ASCENSION GATE</h2><p>Choose a chapter and commit to a run.</p></section>
      <section class="gate-card panel-cut">
        <div class="gate-core"><span>CHAPTER</span><strong>01</strong><small>THE ASCENT</small></div>
        <div class="biome-route">${CHAPTER_ONE_BIOMES.map((biome, index) => `<div class="biome-stop" style="--accent:${biome.accent}"><i></i><div><small>0${index + 1} · ${biome.note}</small><b>${biome.label}</b></div></div>`).join('')}</div>
        <button class="primary-action enter-gate" data-action="enter" type="button"><span>${this.options.hasActiveRun() ? 'RESTART CHAPTER 01' : 'ENTER CHAPTER 01'}</span><b>↑</b></button>
      </section>
      <section class="locked-chapter"><span>CHAPTER 02</span><b>SEALED</b><small>Future expedition</small></section>`;
  }

  private relicPage() {
    return `
      <section class="page-heading"><span>PROTOTYPE / COLLECTION</span><h2>RELIC ARCHIVE</h2><p>Run-defining relic rules are planned for M8. This establishes the inventory language first.</p></section>
      <section class="relic-loadout"><div class="relic-slot active">◈<small>PRIMARY</small></div><div class="relic-slot">·<small>SECONDARY</small></div><div class="relic-slot">·<small>WILD</small></div></section>
      <section class="relic-grid">${RELIC_PREVIEWS.map((relic) => `<article class="relic-card panel-cut"><div>${relic.mark}</div><span>CONCEPT</span><b>${relic.name}</b><p>${relic.note}</p></article>`).join('')}</section>`;
  }

  private settingsPage() {
    return `
      <section class="page-heading"><span>SYSTEM / LOCAL</span><h2>SETTINGS</h2><p>Shell preferences are stored locally on this device.</p></section>
      <section class="settings-panel panel-cut">
        ${this.settingRow('reducedMotion', 'REDUCED UI MOTION', 'Reduce menu ambience and transition movement.', this.settings.reducedMotion)}
        ${this.settingRow('highContrast', 'HIGH CONTRAST UI', 'Increase shell borders and text contrast.', this.settings.highContrast)}
        <div class="setting-row static"><div><b>CONTROLS</b><small>Short swipe · Nudge / Long swipe · Dash / Wall · Swipe away</small></div><span>TOUCH</span></div>
        <div class="setting-row static"><div><b>AUDIO</b><small>Audio system is not implemented in the current prototype.</small></div><span>—</span></div>
      </section>`;
  }

  private settingRow(key: keyof HubSettings, label: string, note: string, checked: boolean) {
    return `<label class="setting-row"><div><b>${label}</b><small>${note}</small></div><input data-setting="${key}" type="checkbox" ${checked ? 'checked' : ''}/><span class="toggle"></span></label>`;
  }

  private updateSetting(key: keyof HubSettings, value: boolean) {
    this.settings = { ...this.settings, [key]: value };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    this.applySettings();
  }

  private applySettings() {
    document.documentElement.classList.toggle('vertex-reduced-motion', this.settings.reducedMotion);
    document.documentElement.classList.toggle('vertex-high-contrast', this.settings.highContrast);
  }
}
