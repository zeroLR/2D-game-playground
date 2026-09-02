import { Container, Graphics, Text } from 'pixi.js';
import type { CodexState } from '../simulation/codex/codex';
import { clampCodexPage, codexPageCount, codexPageSlice } from './codexLayout';

export type CodexModal = {
  panel: Container;
  body: Text;
  pageText: Text;
  closeButton: Container;
  prevButton: Container;
  nextButton: Container;
};

function makeButton(labelText: string, x: number, y: number, width: number): Container {
  const button = new Container();
  button.position.set(x, y);
  button.eventMode = 'static';
  const plate = new Graphics()
    .roundRect(0, 0, width, 38, 10)
    .fill({ color: 0x0b1a1d, alpha: 0.98 })
    .stroke({ color: 0x78d5c7, width: 2, alpha: 0.72 });
  const label = new Text({ text: labelText, style: { fill: 0xb8fff4, fontFamily: 'monospace', fontSize: 11, fontWeight: '700' } });
  label.anchor.set(0.5);
  label.position.set(width / 2, 19);
  button.addChild(plate, label);
  return button;
}

export function createCodexModal(): CodexModal {
  const panel = new Container();
  panel.zIndex = 300;
  panel.visible = false;

  panel.addChild(new Graphics().rect(0, 0, 960, 540).fill({ color: 0x02090b, alpha: 0.96 }));
  panel.addChild(new Graphics()
    .roundRect(48, 34, 864, 472, 18)
    .fill({ color: 0x061012, alpha: 0.99 })
    .stroke({ color: 0x78d5c7, width: 2, alpha: 0.8 }));

  const title = new Text({ text: 'WORLD CODEX // DISCOVERED LAWS', style: { fill: 0xb8fff4, fontFamily: 'monospace', fontSize: 20, fontWeight: '700' } });
  title.position.set(82, 66);
  panel.addChild(title);

  const hint = new Text({ text: 'Discoveries are persistent laws. New actions shape future region recipes.', style: { fill: 0x78a9a2, fontFamily: 'monospace', fontSize: 11 } });
  hint.position.set(82, 96);
  panel.addChild(hint);

  const body = new Text({ text: '', style: { fill: 0xe1fff9, fontFamily: 'monospace', fontSize: 13, lineHeight: 28, wordWrap: true, wordWrapWidth: 792 } });
  body.position.set(82, 136);
  panel.addChild(body);

  const pageText = new Text({ text: 'PAGE 1 / 1', style: { fill: 0x78a9a2, fontFamily: 'monospace', fontSize: 11 } });
  pageText.position.set(82, 462);
  panel.addChild(pageText);

  const prevButton = makeButton('PREV', 590, 450, 82);
  const nextButton = makeButton('NEXT', 684, 450, 82);
  const closeButton = makeButton('CLOSE', 778, 450, 98);
  panel.addChild(prevButton, nextButton, closeButton);

  return { panel, body, pageText, closeButton, prevButton, nextButton };
}

export function codexLabel(codex: CodexState, page: number): string {
  if (codex.entries.length === 0) return 'No discoveries recorded.\n\nExplore → gather → synthesize to reveal the first law.';
  return codexPageSlice(codex.entries, page)
    .map(entry => `${String(entry.firstDiscoveredOrder).padStart(2, '0')}  ${entry.displayName}\n    ${entry.inputs.join(' + ')}  //  ${entry.traits.join(' · ')}  //  #${entry.discoveryIndex + 1}`)
    .join('\n');
}

export function refreshCodexModal(modal: CodexModal, codex: CodexState, page: number): number {
  const safePage = clampCodexPage(page, codex.entries.length);
  modal.body.text = codexLabel(codex, safePage);
  modal.pageText.text = `PAGE ${safePage + 1} / ${codexPageCount(codex.entries.length)}  ·  ${codex.entries.length} DISCOVERED`;
  modal.prevButton.alpha = safePage <= 0 ? 0.35 : 1;
  modal.nextButton.alpha = safePage >= codexPageCount(codex.entries.length) - 1 ? 0.35 : 1;
  return safePage;
}
