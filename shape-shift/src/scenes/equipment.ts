import { Container } from "pixi.js";
import type { Scene } from "./scene";
import type { EquipmentLoadout } from "../game/data/types";
import { SHOP_ITEMS, EQUIP_EFFECTS } from "../game/data/shop";
import { canEquip, MAX_SAME_CARD } from "../game/equipment";

// ── Equipment management scene (DOM overlay) ────────────────────────────────

export interface EquipmentCallbacks {
  getLoadout: () => EquipmentLoadout;
  onEquip: (cardId: string) => void;
  onUnequip: (cardId: string) => void;
  onBack: () => void;
}

export class EquipmentScene implements Scene {
  readonly root: Container;
  private readonly cb: EquipmentCallbacks;

  constructor(cb: EquipmentCallbacks) {
    this.root = new Container();
    this.cb = cb;
  }

  enter(): void {
    const overlay = document.getElementById("overlay");
    const inner = document.getElementById("overlay-inner");
    if (!overlay || !inner) return;
    inner.innerHTML = "";

    const title = document.createElement("div");
    title.className = "overlay-title";
    title.textContent = "equipment";
    inner.appendChild(title);

    const loadout = this.cb.getLoadout();

    // Current slots
    const slotsLabel = document.createElement("div");
    slotsLabel.className = "overlay-sub";
    slotsLabel.textContent = `slots: ${loadout.equipped.length}/${loadout.maxSlots}`;
    inner.appendChild(slotsLabel);

    // Equipped list
    const equippedDiv = document.createElement("div");
    equippedDiv.className = "card-list";
    if (loadout.equipped.length === 0) {
      const empty = document.createElement("div");
      empty.className = "card-text";
      empty.textContent = "no cards equipped";
      empty.style.textAlign = "center";
      empty.style.padding = "12px";
      equippedDiv.appendChild(empty);
    }
    for (const cardId of loadout.equipped) {
      const item = SHOP_ITEMS.find((i) => i.id === cardId);
      const eff = EQUIP_EFFECTS[cardId];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "card-btn selected";
      const glyph = document.createElement("span");
      glyph.className = "card-glyph";
      glyph.textContent = item?.glyph ?? "?";
      btn.appendChild(glyph);
      const body = document.createElement("span");
      body.className = "card-body";
      const name = document.createElement("span");
      name.className = "card-name";
      name.textContent = item?.name ?? cardId;
      const desc = document.createElement("span");
      desc.className = "card-text";
      desc.textContent = eff ? `${eff.effectKind}: ${eff.effectValue}` : "";
      body.appendChild(name);
      body.appendChild(desc);
      btn.appendChild(body);
      btn.addEventListener("click", () => {
        this.cb.onUnequip(cardId);
        this.enter();
      });
      equippedDiv.appendChild(btn);
    }
    inner.appendChild(equippedDiv);

    // Divider
    const divider = document.createElement("div");
    divider.style.borderTop = "1px solid #ccc";
    divider.style.margin = "8px 0";
    inner.appendChild(divider);

    // Owned cards (unequipped)
    const ownLabel = document.createElement("div");
    ownLabel.className = "overlay-sub";
    ownLabel.textContent = "owned cards";
    inner.appendChild(ownLabel);

    const ownedDiv = document.createElement("div");
    ownedDiv.className = "card-list";
    ownedDiv.style.maxHeight = "180px";
    ownedDiv.style.overflowY = "auto";

    const unequipped = loadout.ownedCards.filter(
      (id) => {
        const eqCount = loadout.equipped.filter((e) => e === id).length;
        return eqCount < MAX_SAME_CARD;
      }
    );

    if (unequipped.length === 0) {
      const empty = document.createElement("div");
      empty.className = "card-text";
      empty.textContent = "no cards available — buy from shop";
      empty.style.textAlign = "center";
      empty.style.padding = "12px";
      ownedDiv.appendChild(empty);
    }

    for (const cardId of [...new Set(unequipped)]) {
      const item = SHOP_ITEMS.find((i) => i.id === cardId);
      const able = canEquip(loadout, cardId);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "card-btn";
      if (!able) btn.style.opacity = "0.5";
      const glyph = document.createElement("span");
      glyph.className = "card-glyph";
      glyph.textContent = item?.glyph ?? "?";
      btn.appendChild(glyph);
      const body = document.createElement("span");
      body.className = "card-body";
      const name = document.createElement("span");
      name.className = "card-name";
      name.textContent = item?.name ?? cardId;
      const desc = document.createElement("span");
      desc.className = "card-text";
      desc.textContent = item?.description ?? "";
      body.appendChild(name);
      body.appendChild(desc);
      btn.appendChild(body);
      if (able) {
        btn.addEventListener("click", () => {
          this.cb.onEquip(cardId);
          this.enter();
        });
      }
      ownedDiv.appendChild(btn);
    }
    inner.appendChild(ownedDiv);

    const back = document.createElement("button");
    back.type = "button";
    back.className = "big-btn";
    back.textContent = "← back";
    back.style.marginTop = "8px";
    back.addEventListener("click", () => this.cb.onBack());
    inner.appendChild(back);

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
