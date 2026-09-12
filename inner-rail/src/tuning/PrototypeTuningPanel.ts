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

const CONTROLS: ControlDefinition[] = [
  {
    group: 'INPUT',
    key: 'tiltSensitivity',
    label: 'Tilt sensitivity',
    hint: 'Higher = reaches full force with less physical tilt.',
    format: (value) => `${value.toFixed(2)}×`,
  },
  {
    group: 'INPUT',
    key: 'tiltDeadZoneDeg',
    label: 'Neutral dead zone',
    hint: 'Higher = more hand tremor ignored around the calibrated pose.',
    format: (value) => `${value.toFixed(2)}°`,
  },
  {
    group: 'INPUT',
    key: 'tiltSaturationDeg',
    label: 'Full-force tilt',
    hint: 'Lower = reaches maximum field sooner. Higher = larger physical tilt range.',
    format: (value) => `${Math.round(value)}°`,
  },
  {
    group: 'INPUT',
    key: 'tiltSmoothingResponsePerSecond',
    label: 'Input response',
    hint: 'Lower = softer/slower filtering. Higher = faster correction response.',
    format: (value) => `${value.toFixed(0)}×`,
  },
  {
    group: 'PHYSICS',
    key: 'ballInertia',
    label: 'Ball inertia',
    hint: 'Higher = carries momentum longer. Lower = settles faster.',
    format: (value) => `${Math.round(value * 100)}%`,
  },
  {
    group: 'PHYSICS',
    key: 'contactFriction',
    label: 'Track friction',
    hint: 'Higher = stronger traction and braking authority. Lower = more slide.',
    format: (value) => value.toFixed(2),
  },
  {
    group: 'PHYSICS',
    key: 'contactRestitution',
    label: 'Contact bounce',
    hint: 'Higher = more rebound on landings and edges. Keep restrained for comfort.',
    format: (value) => value.toFixed(2),
  },
  {
    group: 'CAMERA',
    key: 'cameraFovDeg',
    label: 'Camera zoom / FOV',
    hint: 'Lower = tighter / closer. Higher = wider / farther.',
    format: (value) => `${Math.round(value)}°`,
  },
  {
    group: 'CAMERA',
    key: 'cameraYawResponsePerSecond',
    label: 'Track follow',
    hint: 'How quickly the view aligns to authored track direction. Ball velocity never turns the camera.',
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
          <span>TUNE</span>
          <small>P0.4 FEEL</small>
        </summary>
        <div class="tuning-panel__body">
          ${GROUPS.map((group) => `
            <section class="tuning-group" aria-label="${group.toLowerCase()} tuning">
              <p class="tuning-group__label">${group}</p>
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
          <button type="button" class="tuning-reset" data-tuning-reset>RESET BASELINE</button>
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
