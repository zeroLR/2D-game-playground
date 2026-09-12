import {
  DEFAULT_PROTOTYPE_TUNING,
  PROTOTYPE_TUNING_RANGES,
  type PrototypeTuningValues,
} from './PrototypeTuning';
import './tuning.css';

export interface PrototypeTuningPanelCallbacks {
  onChange(values: PrototypeTuningValues): void;
  onReset(): void;
}

type TuningKey = keyof PrototypeTuningValues;
type TuningGroup = 'INPUT' | 'PHYSICS' | 'CAMERA';

interface ControlDefinition {
  group: TuningGroup;
  key: TuningKey;
  label: string;
  hint: string;
  format(value: number): string;
}

const GROUP_LABELS: Record<TuningGroup, string> = {
  INPUT: '輸入',
  PHYSICS: '物理',
  CAMERA: '相機',
};

const CONTROLS: ControlDefinition[] = [
  {
    group: 'INPUT',
    key: 'tiltSensitivity',
    label: '傾斜靈敏度',
    hint: '數值越高，只要較小的手機傾斜角度就能產生較強的控制力；越低則需要傾斜更多。',
    format: (value) => `${value.toFixed(2)}×`,
  },
  {
    group: 'INPUT',
    key: 'tiltDeadZoneDeg',
    label: '中立死區',
    hint: '數值越高，越能忽略手持時的小幅晃動；太高會讓細微修正變得不靈敏。',
    format: (value) => `${value.toFixed(2)}°`,
  },
  {
    group: 'INPUT',
    key: 'tiltSaturationDeg',
    label: '滿輸出傾角',
    hint: '數值越低，手機只要傾斜一點就能達到最大控制力；越高則有更大的可控制傾斜範圍。',
    format: (value) => `${Math.round(value)}°`,
  },
  {
    group: 'INPUT',
    key: 'tiltSmoothingResponsePerSecond',
    label: '輸入反應速度',
    hint: '數值越低，輸入越平滑但反應較慢；越高則修正更快，但也更容易感覺敏感或抖動。',
    format: (value) => `${value.toFixed(0)}×`,
  },
  {
    group: 'PHYSICS',
    key: 'ballInertia',
    label: '球體慣性',
    hint: '數值越高，球會保留動量更久、滑得更遠；越低則更容易減速與停下。',
    format: (value) => `${Math.round(value * 100)}%`,
  },
  {
    group: 'PHYSICS',
    key: 'contactFriction',
    label: '軌道摩擦力',
    hint: '數值越高，抓地與煞車效果越明顯；越低則更容易滑動。',
    format: (value) => value.toFixed(2),
  },
  {
    group: 'PHYSICS',
    key: 'contactRestitution',
    label: '碰撞回彈',
    hint: '數值越高，落地或撞到邊緣時彈得越明顯；為了第一人稱舒適度通常不建議太高。',
    format: (value) => value.toFixed(2),
  },
  {
    group: 'CAMERA',
    key: 'cameraFovDeg',
    label: '相機視野 / FOV',
    hint: '數值越低，畫面較像拉近、視野較窄；越高則看得更廣，但速度感也會更強。',
    format: (value) => `${Math.round(value)}°`,
  },
  {
    group: 'CAMERA',
    key: 'cameraYawResponsePerSecond',
    label: '軌道方向跟隨速度',
    hint: '控制相機多快轉向軌道的前進方向。越低轉得較慢、較穩；越高則更快對準彎道。球本身往後或側滑不會讓相機掉頭。',
    format: (value) => `${value.toFixed(1)}×`,
  },
];

const GROUPS: TuningGroup[] = ['INPUT', 'PHYSICS', 'CAMERA'];

export class PrototypeTuningPanel {
  private values: PrototypeTuningValues;
  private readonly inputs = new Map<TuningKey, HTMLInputElement>();
  private readonly valueLabels = new Map<TuningKey, HTMLElement>();

  constructor(
    private readonly root: HTMLElement,
    initialValues: PrototypeTuningValues,
    private readonly callbacks: PrototypeTuningPanelCallbacks,
  ) {
    this.values = { ...initialValues };
    this.root.innerHTML = `
      <details class="tuning-panel">
        <summary>
          <span>調校</span>
          <small>P0.4 手感</small>
        </summary>
        <div class="tuning-panel__body">
          ${GROUPS.map((group) => `
            <section class="tuning-group" aria-label="${GROUP_LABELS[group]}參數調校">
              <p class="tuning-group__label">${GROUP_LABELS[group]}</p>
              ${CONTROLS.filter((control) => control.group === group).map((control) => {
                const range = PROTOTYPE_TUNING_RANGES[control.key];
                return `
                  <label class="tuning-control">
                    <span class="tuning-control__header">
                      <span>${control.label}</span>
                      <output data-tuning-value="${control.key}"></output>
                    </span>
                    <input
                      type="range"
                      min="${range.min}"
                      max="${range.max}"
                      step="${range.step}"
                      data-tuning-input="${control.key}"
                    />
                    <small>${control.hint}</small>
                  </label>
                `;
              }).join('')}
            </section>
          `).join('')}
          <button type="button" class="tuning-reset" data-tuning-reset>重設為基準值</button>
        </div>
      </details>
    `;

    for (const control of CONTROLS) {
      const input = this.requireElement<HTMLInputElement>(`[data-tuning-input="${control.key}"]`);
      const output = this.requireElement<HTMLElement>(`[data-tuning-value="${control.key}"]`);
      this.inputs.set(control.key, input);
      this.valueLabels.set(control.key, output);
      input.addEventListener('input', () => {
        this.values = { ...this.values, [control.key]: Number(input.value) };
        this.renderValues();
        this.callbacks.onChange({ ...this.values });
      });
    }

    this.requireElement<HTMLButtonElement>('[data-tuning-reset]').addEventListener('click', () => {
      this.values = { ...DEFAULT_PROTOTYPE_TUNING };
      this.renderValues();
      this.callbacks.onReset();
    });

    this.renderValues();
  }

  setValues(values: PrototypeTuningValues): void {
    this.values = { ...values };
    this.renderValues();
  }

  private renderValues(): void {
    for (const control of CONTROLS) {
      const value = this.values[control.key];
      const input = this.inputs.get(control.key);
      const output = this.valueLabels.get(control.key);
      if (input) input.value = String(value);
      if (output) output.textContent = control.format(value);
    }
  }

  private requireElement<T extends Element = HTMLElement>(selector: string): T {
    const element = this.root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing tuning element: ${selector}`);
    return element;
  }
}
