export type ChapterTransitionOptions = {
  reducedMotion?: () => boolean;
};

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export class ChapterTransition {
  readonly root = document.createElement('div');

  constructor(private readonly host: HTMLElement, private readonly options: ChapterTransitionOptions = {}) {
    this.root.className = 'chapter-transition';
    this.root.hidden = true;
    this.host.appendChild(this.root);
  }

  async playEntry() {
    this.root.hidden = false;
    this.root.className = 'chapter-transition is-entry';
    this.root.innerHTML = `
      <div class="transition-grid" aria-hidden="true"></div>
      <div class="transition-scan" aria-hidden="true"></div>
      <div class="transition-copy">
        <span>ASCENSION GATE · LINK ESTABLISHED</span>
        <strong>CHAPTER 01</strong>
        <h2>THE ASCENT</h2>
        <i></i>
        <small>TEAL RUINS · INITIAL ALTITUDE</small>
      </div>`;
    await wait(this.duration(1650));
    this.root.classList.add('is-releasing');
    await wait(this.duration(420));
    this.hide();
  }

  async playClear(score: number, elapsed: number) {
    this.root.hidden = false;
    this.root.className = 'chapter-transition is-clear';
    this.root.innerHTML = `
      <div class="transition-grid" aria-hidden="true"></div>
      <div class="summit-mark" aria-hidden="true">△</div>
      <div class="transition-copy">
        <span>SUMMIT SIGNAL · VERIFIED</span>
        <strong>CHAPTER 01 CLEAR</strong>
        <h2>STORM CROWN<br/>YIELDED</h2>
        <i></i>
        <small>${Math.floor(score).toLocaleString()} SCORE · ${elapsed.toFixed(1)}s</small>
      </div>`;
    await wait(this.duration(2100));
    this.root.classList.add('is-releasing');
    await wait(this.duration(520));
    this.hide();
  }

  private duration(ms: number) { return this.options.reducedMotion?.() ? Math.min(ms, 180) : ms; }
  private hide() { this.root.hidden = true; this.root.className = 'chapter-transition'; this.root.innerHTML = ''; }
}
