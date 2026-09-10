export class StageLoadingScreen {
  private readonly root: HTMLElement;
  private readonly title: HTMLElement;
  private readonly track: HTMLElement;
  private readonly fill: HTMLElement;

  constructor(host: HTMLElement) {
    const root = document.createElement('section');
    root.className = 'stage-loading-screen';
    root.hidden = true;
    root.setAttribute('aria-live', 'polite');

    const frame = document.createElement('div');
    frame.className = 'stage-loading-frame';

    const title = document.createElement('h1');
    title.className = 'stage-loading-title';

    const track = document.createElement('div');
    track.className = 'stage-loading-track';
    track.setAttribute('role', 'progressbar');
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', '100');
    track.setAttribute('aria-valuenow', '0');

    const fill = document.createElement('div');
    fill.className = 'stage-loading-fill';
    track.append(fill);

    frame.append(title, track);
    root.append(frame);
    host.append(root);

    this.root = root;
    this.title = title;
    this.track = track;
    this.fill = fill;
  }

  show(levelTitle: string, ratio = 0): void {
    this.title.textContent = levelTitle;
    this.setProgress(ratio);
    this.root.hidden = false;
  }

  setProgress(ratio: number): void {
    const clamped = Math.min(1, Math.max(0, Number.isFinite(ratio) ? ratio : 0));
    const value = Math.round(clamped * 100);
    this.fill.style.transform = `scaleX(${clamped})`;
    this.track.setAttribute('aria-valuenow', String(value));
  }

  hide(): void {
    this.root.hidden = true;
  }

  destroy(): void {
    this.root.remove();
  }
}
