import { DEFAULT_DEV_TUNING, clampDevTuning, type DevTuning } from './DevTuning';

export function isDevPanelEnabled() {
  return import.meta.env.DEV || new URLSearchParams(window.location.search).get('dev') === '1';
}

export class DevPanel {
  private value: DevTuning;
  private readonly root: HTMLDivElement;

  constructor(initial: DevTuning, private readonly onChange: (value: DevTuning) => void) {
    this.value = { ...initial };
    this.root = document.createElement('div');
    this.root.style.cssText = 'position:fixed;right:10px;top:10px;z-index:9999;font:12px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;color:#e8fbf6;pointer-events:auto;';
    document.body.appendChild(this.root);
    this.renderCollapsed();
  }

  private renderCollapsed() {
    this.root.innerHTML = '';
    const button = document.createElement('button');
    button.textContent = 'DEV';
    button.style.cssText = 'border:1px solid rgba(120,201,191,.45);background:rgba(8,24,27,.82);color:#b7fff1;border-radius:6px;padding:6px 8px;letter-spacing:1px;';
    button.onclick = () => this.renderExpanded();
    this.root.appendChild(button);
  }

  private renderExpanded() {
    this.root.innerHTML = '';
    const panel = document.createElement('div');
    panel.style.cssText = 'width:220px;background:rgba(8,24,27,.94);border:1px solid rgba(120,201,191,.38);border-radius:8px;padding:10px;box-shadow:0 8px 24px rgba(0,0,0,.32);backdrop-filter:blur(6px);';

    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;color:#b7fff1;font-weight:700;letter-spacing:1px;';
    header.innerHTML = '<span>DEV TUNING</span>';
    const close = document.createElement('button');
    close.textContent = '×';
    close.style.cssText = 'border:0;background:transparent;color:#95b4b1;font-size:18px;padding:0 4px;';
    close.onclick = () => this.renderCollapsed();
    header.appendChild(close);
    panel.appendChild(header);

    const invincible = document.createElement('label');
    invincible.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:5px 0 8px;';
    invincible.innerHTML = '<span>Invincible</span>';
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = this.value.invincible;
    check.onchange = () => this.commit({ ...this.value, invincible: check.checked });
    invincible.appendChild(check);
    panel.appendChild(invincible);

    panel.appendChild(this.slider('Jump Power', 'jumpPower', 0.5, 3, 0.1));
    panel.appendChild(this.slider('Dash Power', 'dashPower', 0.5, 3, 0.1));
    panel.appendChild(this.slider('Jump Speed', 'jumpSpeed', 0.5, 2.5, 0.1));

    const reset = document.createElement('button');
    reset.textContent = 'RESET DEFAULTS';
    reset.style.cssText = 'width:100%;margin-top:8px;border:1px solid rgba(120,201,191,.35);background:rgba(23,54,58,.7);color:#cce9e3;border-radius:5px;padding:6px;letter-spacing:.6px;';
    reset.onclick = () => { this.commit({ ...DEFAULT_DEV_TUNING }); this.renderExpanded(); };
    panel.appendChild(reset);

    const note = document.createElement('div');
    note.textContent = 'Local dev or ?dev=1';
    note.style.cssText = 'margin-top:7px;color:#789b99;font-size:10px;text-align:right;';
    panel.appendChild(note);

    this.root.appendChild(panel);
  }

  private slider(label: string, key: 'jumpPower' | 'dashPower' | 'jumpSpeed', min: number, max: number, step: number) {
    const row = document.createElement('label');
    row.style.cssText = 'display:grid;grid-template-columns:86px 1fr 38px;gap:6px;align-items:center;padding:5px 0;';
    const name = document.createElement('span');
    name.textContent = label;
    const input = document.createElement('input');
    input.type = 'range'; input.min = String(min); input.max = String(max); input.step = String(step); input.value = String(this.value[key]);
    const output = document.createElement('span');
    output.textContent = `${this.value[key].toFixed(1)}×`;
    output.style.textAlign = 'right';
    input.oninput = () => { const next = Number(input.value); output.textContent = `${next.toFixed(1)}×`; this.commit({ ...this.value, [key]: next }); };
    row.append(name, input, output);
    return row;
  }

  private commit(next: DevTuning) {
    this.value = clampDevTuning(next);
    this.onChange({ ...this.value });
  }
}
