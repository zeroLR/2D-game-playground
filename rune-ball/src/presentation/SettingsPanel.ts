import type { RuntimePreferences } from '../preferences/RuntimePreferences';

export interface SettingsPanelCallbacks {
  onSoundChange(enabled: boolean): void;
  onReducedMotionChange(enabled: boolean): void;
  onOpenChange(open: boolean): void;
}

export class SettingsPanel {
  private readonly root: HTMLElement;
  private readonly launcher: HTMLButtonElement;
  private readonly overlay: HTMLElement;
  private readonly soundButton: HTMLButtonElement;
  private readonly motionButton: HTMLButtonElement;
  private readonly callbacks: SettingsPanelCallbacks;
  private preferences: RuntimePreferences;
  private open = false;

  constructor(host: HTMLElement, preferences: RuntimePreferences, callbacks: SettingsPanelCallbacks) {
    this.preferences = { ...preferences };
    this.callbacks = callbacks;

    const root = document.createElement('div');
    root.className = 'runtime-settings';

    const launcher = document.createElement('button');
    launcher.className = 'runtime-settings-launcher';
    launcher.type = 'button';
    launcher.setAttribute('aria-label', 'Open settings');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.innerHTML = '<span></span><span></span><span></span>';
    launcher.addEventListener('click', () => this.setOpen(true));

    const overlay = document.createElement('div');
    overlay.className = 'runtime-settings-overlay';
    overlay.hidden = true;
    overlay.addEventListener('pointerdown', (event) => {
      if (event.target === overlay) this.setOpen(false);
    });

    const panel = document.createElement('section');
    panel.className = 'runtime-settings-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'runtime-settings-title');

    const eyebrow = document.createElement('span');
    eyebrow.className = 'runtime-settings-eyebrow';
    eyebrow.textContent = 'RUNE BALL';

    const title = document.createElement('h2');
    title.id = 'runtime-settings-title';
    title.textContent = 'SETTINGS';

    const soundButton = this.makeToggle('SOUND', this.preferences.soundEnabled, (enabled) => {
      this.preferences.soundEnabled = enabled;
      this.callbacks.onSoundChange(enabled);
    });

    const motionButton = this.makeToggle('REDUCED MOTION', this.preferences.reducedMotion, (enabled) => {
      this.preferences.reducedMotion = enabled;
      this.callbacks.onReducedMotionChange(enabled);
    });

    const closeButton = document.createElement('button');
    closeButton.className = 'runtime-settings-close';
    closeButton.type = 'button';
    closeButton.textContent = 'CLOSE';
    closeButton.addEventListener('click', () => this.setOpen(false));

    panel.append(eyebrow, title, soundButton, motionButton, closeButton);
    overlay.append(panel);
    root.append(launcher, overlay);
    host.append(root);

    this.root = root;
    this.launcher = launcher;
    this.overlay = overlay;
    this.soundButton = soundButton;
    this.motionButton = motionButton;

    window.addEventListener('keydown', this.handleKeyDown);
  }

  setPreferences(preferences: RuntimePreferences): void {
    this.preferences = { ...preferences };
    this.renderToggle(this.soundButton, preferences.soundEnabled);
    this.renderToggle(this.motionButton, preferences.reducedMotion);
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.root.remove();
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.open) this.setOpen(false);
  };

  private setOpen(open: boolean): void {
    if (this.open === open) return;
    this.open = open;
    this.overlay.hidden = !open;
    this.launcher.setAttribute('aria-expanded', String(open));
    this.callbacks.onOpenChange(open);

    if (open) {
      queueMicrotask(() => this.soundButton.focus({ preventScroll: true }));
    } else {
      this.launcher.focus({ preventScroll: true });
    }
  }

  private makeToggle(label: string, enabled: boolean, onChange: (enabled: boolean) => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'runtime-settings-toggle';
    button.type = 'button';
    button.dataset.label = label;
    button.setAttribute('aria-label', label);
    button.addEventListener('click', () => {
      const next = button.getAttribute('aria-pressed') !== 'true';
      this.renderToggle(button, next);
      onChange(next);
    });
    this.renderToggle(button, enabled);
    return button;
  }

  private renderToggle(button: HTMLButtonElement, enabled: boolean): void {
    button.setAttribute('aria-pressed', String(enabled));
    button.innerHTML = `<span class="runtime-settings-toggle-label">${button.dataset.label ?? ''}</span><span class="runtime-settings-toggle-state">${enabled ? 'ON' : 'OFF'}</span>`;
  }
}
