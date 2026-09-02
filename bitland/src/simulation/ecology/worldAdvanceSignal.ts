export type WorldAdvanceSignal = {
  tickIndex: number;
  hostility: number;
  signature: number;
};

let pendingSignal: WorldAdvanceSignal | null = null;

export function publishWorldAdvanceSignal(signal: WorldAdvanceSignal): void {
  pendingSignal = { ...signal };
}

export function consumeWorldAdvanceSignal(): WorldAdvanceSignal | null {
  const signal = pendingSignal;
  pendingSignal = null;
  return signal;
}

export function clearWorldAdvanceSignal(): void {
  pendingSignal = null;
}
