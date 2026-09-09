export class PreloadScreen {
  private readonly root: HTMLElement;
  private readonly status: HTMLElement;
  private readonly percent: HTMLElement;
  private readonly fill: HTMLElement;
  private readonly enterButton: HTMLButtonElement;

  constructor(host: HTMLElement) {
    const root = document.createElement('section');
    root.className = 'preload-screen';
    root.setAttribute('aria-live', 'polite');

    const frame = document.createElement('div');
    frame.className = 'preload-frame';

    const eyebrow = document.createElement('span');
    eyebrow.className = 'preload-eyebrow';
    eyebrow.textContent = 'ARCANE SPORT // BOOT SEQUENCE';

    const title = document.createElement('h1');
    title.className = 'preload-title';
    title.textContent = 'RUNE BALL';

    const subtitle = document.createElement('p');
    subtitle.className = 'preload-subtitle';
    subtitle.textContent = 'Attuning arena resources';

    const progressRow = document.createElement('div');
    progressRow.className = 'preload-progress-row';

    const status = document.createElement('span');
    status.className = 'preload-status';
    status.textContent = 'INITIALIZING';

    const percent = document.createElement('span');
    percent.className = 'preload-percent';
    percent.textContent = '000%';

    progressRow.append(status, percent);

    const track = document.createElement('div');
    track.className = 'preload-track';
    track.setAttribute('role', 'progressbar');
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', '100');
    track.setAttribute('aria-valuenow', '0');

    const fill = document.createElement('div');
    fill.className = 'preload-fill';
    track.append(fill);

    const enterButton = document.createElement('button');
    enterButton.className = 'preload-enter';
    enterButton.type = 'button';
    enterButton.disabled = true;
    enterButton.textContent = 'LOADING';

    const hint = document.createElement('span');
    hint.className = 'preload-hint';
    hint.textContent = 'Audio and arena resources are prepared before play.';

    frame.append(eyebrow, title, subtitle, progressRow, track, enterButton, hint);
    root.append(frame);
    host.replaceChildren(root);

    this.root = root;
    this.status = status;
    this.percent = percent;
    this.fill = fill;
    this.enterButton = enterButton;
  }

  setProgress(ratio: number, label: string): void {
    const clamped = Math.min(1, Math.max(0, Number.isFinite(ratio) ? ratio : 0));
    const value = Math.round(clamped * 100);
    this.status.textContent = label.toUpperCase();
    this.percent.textContent = `${value.toString().padStart(3, '0')}%`;
    this.fill.style.transform = `scaleX(${clamped})`;
    const track = this.fill.parentElement;
    track?.setAttribute('aria-valuenow', String(value));
  }

  setReady(): void {
    this.setProgress(1, 'READY');
    this.root.dataset.state = 'ready';
    this.enterButton.disabled = false;
    this.enterButton.textContent = 'TAP TO ENTER';
  }

  async waitForSuccessfulEnter(activate: () => Promise<boolean>): Promise<void> {
    await new Promise<void>((resolve) => {
      const attempt = (): void => {
        this.root.dataset.state = 'warming';
        this.status.textContent = 'ATTUNING AUDIO';
        this.percent.textContent = 'READY';
        this.enterButton.disabled = true;
        this.enterButton.textContent = 'PREPARING';

        // The callback is invoked synchronously inside the click handler so browser
        // transient user activation still applies to HTMLMediaElement.play().
        const activation = activate();
        void activation.then((success) => {
          if (success) {
            this.status.textContent = 'ENTERING ARENA';
            this.enterButton.textContent = 'READY';
            resolve();
            return;
          }

          this.root.dataset.state = 'ready';
          this.status.textContent = 'AUDIO BLOCKED — TAP AGAIN';
          this.enterButton.disabled = false;
          this.enterButton.textContent = 'RETRY AUDIO';
          this.enterButton.addEventListener('click', attempt, { once: true });
        });
      };

      this.enterButton.addEventListener('click', attempt, { once: true });
    });
  }
}
