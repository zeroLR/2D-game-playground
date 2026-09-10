export interface RuntimePreferences {
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export interface PreferenceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const RUNTIME_PREFERENCES_KEY = 'rune-ball.preferences.v1';

export function readRuntimePreferences(
  storage: PreferenceStorage | null,
  systemReducedMotion: boolean,
): RuntimePreferences {
  const fallback: RuntimePreferences = {
    soundEnabled: true,
    reducedMotion: systemReducedMotion,
  };

  if (!storage) return fallback;

  try {
    const raw = storage.getItem(RUNTIME_PREFERENCES_KEY);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return fallback;

    return {
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : fallback.soundEnabled,
      reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : fallback.reducedMotion,
    };
  } catch {
    return fallback;
  }
}

export function writeRuntimePreferences(
  storage: PreferenceStorage | null,
  preferences: RuntimePreferences,
): boolean {
  if (!storage) return false;

  try {
    storage.setItem(RUNTIME_PREFERENCES_KEY, JSON.stringify(preferences));
    return true;
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
