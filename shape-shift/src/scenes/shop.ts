import { Container } from "pixi.js";
import type { Scene } from "./scene";
import { SHOP_ITEMS, type ShopItem } from "../game/data/shop";
import type { PlayerProfile } from "../game/data/types";

// ── Shop scene (DOM overlay) ────────────────────────────────────────────────

export interface ShopCallbacks {
  getProfile: () => PlayerProfile;
  onPurchase: (item: ShopItem) => void;
  onBack: () => void;
}

export class ShopScene implements Scene {
  readonly root: Container;
  private readonly cb: ShopCallbacks;

  constructor(cb: ShopCallbacks) {
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
    title.textContent = "shop";
    inner.appendChild(title);

    const pointsEl = document.createElement("div");
    pointsEl.className = "overlay-sub";
    pointsEl.id = "shop-points";
    this.refreshPoints(pointsEl);
    inner.appendChild(pointsEl);

    const list = document.createElement("div");
    list.className = "card-list";
    list.style.maxHeight = "340px";
    list.style.overflowY = "auto";

    for (const item of SHOP_ITEMS) {
      const profile = this.cb.getProfile();
      const purchased = this.isPurchased(item);
      const canAfford = profile.points >= item.price;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "card-btn";
      if (purchased) btn.style.opacity = "0.5";

      const glyph = document.createElement("span");
      glyph.className = "card-glyph";
      glyph.textContent = item.glyph;
      btn.appendChild(glyph);

      const body = document.createElement("span");
      body.className = "card-body";
      const name = document.createElement("span");
      name.className = "card-name";
      name.textContent = `${item.name} — ${item.price}pts`;
      const desc = document.createElement("span");
      desc.className = "card-text";
      desc.textContent = purchased ? "owned" : item.description;
      body.appendChild(name);
      body.appendChild(desc);
      btn.appendChild(body);

      if (!purchased && canAfford) {
        btn.addEventListener("click", () => {
          this.cb.onPurchase(item);
          // Re-render
          this.enter();
        });
      } else {
        btn.disabled = true;
      }

      list.appendChild(btn);
    }
    inner.appendChild(list);

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

  private refreshPoints(el: HTMLElement): void {
    el.textContent = `points: ${this.cb.getProfile().points}`;
  }

  private isPurchased(item: ShopItem): boolean {
    const profile = this.cb.getProfile();
    if (item.category === "skin") return profile.ownedSkins.includes(item.id);
    // For equipCards and slotExpand, check shop unlocks via purchased list stored in profile
    // We use the shop's own tracking
    return false; // Managed by the onPurchase callback at a higher level
  }
}
