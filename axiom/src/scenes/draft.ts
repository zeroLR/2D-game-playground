import { Container } from "pixi.js";
import type { Card } from "../game/cards";
import type { Scene } from "./scene";
import { CARD_GLYPHS, setIconHtml } from "../icons";

// Overlay-based scene — no Pixi drawing. Renders into `#overlay-inner` and
// waits for a tap on one of the offered cards.

export class DraftScene implements Scene {
  readonly root: Container;
  private readonly offer: readonly Card[];
  private readonly onPick: (card: Card) => void;
  private readonly clearedWaveLabel: string;
  private selected: Card | null = null;

  constructor(offer: readonly Card[], clearedWaveLabel: string, onPick: (card: Card) => void) {
    this.root = new Container();
    this.offer = offer;
    this.onPick = onPick;
    this.clearedWaveLabel = clearedWaveLabel;
  }

  enter(): void {
    const overlay = document.getElementById("overlay");
    const inner = document.getElementById("overlay-inner");
    if (!overlay || !inner) return;
    inner.innerHTML = "";
    this.selected = null;

    const title = document.createElement("div");
    title.className = "overlay-title";
    title.textContent = `wave ${this.clearedWaveLabel} cleared — pick a rune`;
    inner.appendChild(title);

    const list = document.createElement("div");
    list.className = "card-list";
    const btnByCard = new Map<string, HTMLButtonElement>();
    for (const card of this.offer) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "card-btn";
      btn.setAttribute("data-card-id", card.id);

      const glyph = document.createElement("span");
      glyph.className = "card-glyph";
      const svgGlyph = CARD_GLYPHS[card.id];
      if (svgGlyph) setIconHtml(glyph, svgGlyph);
      else glyph.textContent = card.glyph;
      glyph.setAttribute("aria-hidden", "true");
      btn.appendChild(glyph);

      const body = document.createElement("span");
      body.className = "card-body";
      const name = document.createElement("span");
      name.className = "card-name";
      name.textContent = card.name;
      const text = document.createElement("span");
      text.className = "card-text";
      text.textContent = card.text;
      const rarity = document.createElement("span");
      rarity.className = "card-rarity";
      rarity.textContent = card.rarity;
      body.appendChild(name);
      body.appendChild(text);
      body.appendChild(rarity);
      btn.appendChild(body);

      btn.addEventListener("click", () => {
        this.selected = card;
        for (const [id, b] of btnByCard) b.classList.toggle("selected", id === card.id);
        confirmBtn.disabled = false;
        confirmBtn.textContent = `confirm: ${card.name}`;
      });
      btnByCard.set(card.id, btn);
      list.appendChild(btn);
    }
    inner.appendChild(list);

    // Two-step commit: user selects a card, then confirms. Prevents an
    // accidental tap (carried over from gameplay drag) from locking in a pick
    // before the user has read the options.
    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "big-btn";
    confirmBtn.disabled = true;
    confirmBtn.textContent = "pick a card first";
    confirmBtn.addEventListener("click", () => {
      if (this.selected) this.onPick(this.selected);
    });
    inner.appendChild(confirmBtn);

    overlay.hidden = false;
  }

  exit(): void {
    const overlay = document.getElementById("overlay");
    const inner = document.getElementById("overlay-inner");
    if (inner) inner.innerHTML = "";
    if (overlay) overlay.hidden = true;
  }

  update(_dt: number): void {}

  render(_alpha: number): void {}
}
