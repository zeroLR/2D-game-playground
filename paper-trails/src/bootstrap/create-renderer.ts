import { Application } from 'pixi.js';
import { withTimeout } from './with-timeout';

export const RENDERER_TIMEOUT_MS = 5000;

export async function createRenderer(resizeTo: HTMLElement): Promise<Application> {
  const attempts = [
    { label: 'WebGL 1', options: { preference: 'webgl' as const, preferWebGLVersion: 1 as const } },
    { label: 'WebGL', options: { preference: 'webgl' as const } },
    { label: 'WebGPU', options: { preference: 'webgpu' as const } },
  ];

  const commonOptions = {
    resizeTo,
    antialias: false,
    autoDensity: true,
    background: '#121917',
    resolution: Math.min(window.devicePixelRatio || 1, 2),
  };

  let lastError: unknown;

  for (const attempt of attempts) {
    const candidate = new Application();
    try {
      console.info(`[Paper Trails] Initializing ${attempt.label} renderer.`);
      await withTimeout(
        candidate.init({ ...commonOptions, ...attempt.options }),
        RENDERER_TIMEOUT_MS,
        `${attempt.label} renderer initialization`,
      );
      console.info(`[Paper Trails] ${attempt.label} renderer ready.`);
      return candidate;
    } catch (error) {
      lastError = error;
      console.warn(`[Paper Trails] ${attempt.label} renderer initialization failed.`, error);
      try {
        candidate.destroy(true);
      } catch {
        // Best-effort cleanup between renderer fallback attempts.
      }
    }
  }

  throw lastError ?? new Error('No renderer could be initialized');
}
