import { GameApp } from './GameApp';

export function bootstrap(): void {
  const hostElement = document.querySelector<HTMLElement>('#app');
  if (!hostElement) throw new Error('Missing #app mount element.');
  const host: HTMLElement = hostElement;

  try {
    const app = new GameApp(host);
    app.start();
    window.addEventListener('pagehide', () => app.destroy(), { once: true });
    host.dataset.bootstrapReady = 'true';
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown bootstrap failure.';
    host.dataset.bootstrapError = message;
    host.innerHTML = `
      <main class="bootstrap-error" role="alert">
        <span>INNER RAIL / BOOT FAILURE</span>
        <h1>Prototype could not start.</h1>
        <p>${escapeHtml(message)}</p>
        <button type="button" onclick="location.reload()">RETRY</button>
      </main>
    `;
    console.error('[inner-rail] bootstrap failed', error);
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[char] ?? char);
}
