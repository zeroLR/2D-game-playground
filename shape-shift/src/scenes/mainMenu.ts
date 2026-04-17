import { Container } from "pixi.js";
import type { Scene } from "./scene";

// ── Main Menu (DOM overlay) ─────────────────────────────────────────────────
// Entry point of the game. Shows mode selection and meta-system access.

export type MenuAction =
  | { kind: "normalMode" }
  | { kind: "survivalMode" }
  | { kind: "shop" }
  | { kind: "equipment" }
  | { kind: "skillTree" }
  | { kind: "achievements" }
  | { kind: "settings" }
  | { kind: "exportData" }
  | { kind: "importData" };

export class MainMenuScene implements Scene {
  readonly root: Container;
  private readonly onAction: (action: MenuAction) => void;

  constructor(onAction: (action: MenuAction) => void) {
    this.root = new Container();
    this.onAction = onAction;
  }

  enter(): void {
    const overlay = document.getElementById("overlay");
    const inner = document.getElementById("overlay-inner");
    if (!overlay || !inner) return;
    inner.innerHTML = "";

    // Title
    const title = document.createElement("div");
    title.className = "overlay-title";
    title.textContent = "shape-shift";
    title.style.fontSize = "22px";
    title.style.marginBottom = "8px";
    inner.appendChild(title);

    // Subtitle
    const sub = document.createElement("div");
    sub.className = "overlay-sub";
    sub.textContent = "reverse bullet-hell deckbuilder";
    sub.style.marginBottom = "16px";
    inner.appendChild(sub);

    // Mode buttons
    this.addBtn(inner, "▶  Normal Mode", "normalMode", "big-btn");
    this.addBtn(inner, "∞  Survival Mode", "survivalMode", "big-btn");

    // Spacer
    const spacer = document.createElement("div");
    spacer.style.height = "12px";
    inner.appendChild(spacer);

    // Meta buttons row
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr 1fr";
    row.style.gap = "8px";
    this.addBtn(row, "🛒 Shop", "shop", "menu-btn");
    this.addBtn(row, "⚙ Equipment", "equipment", "menu-btn");
    this.addBtn(row, "🌳 Skills", "skillTree", "menu-btn");
    this.addBtn(row, "🏆 Achievements", "achievements", "menu-btn");
    inner.appendChild(row);

    // Data row
    const dataRow = document.createElement("div");
    dataRow.style.display = "flex";
    dataRow.style.gap = "8px";
    dataRow.style.marginTop = "8px";
    this.addBtn(dataRow, "📤 Export", "exportData", "menu-btn", "flex:1");
    this.addBtn(dataRow, "📥 Import", "importData", "menu-btn", "flex:1");
    inner.appendChild(dataRow);

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

  private addBtn(
    parent: HTMLElement,
    label: string,
    action: MenuAction["kind"],
    className: string,
    extraStyle?: string,
  ): void {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = className;
    btn.textContent = label;
    if (extraStyle) btn.style.cssText += extraStyle;
    btn.addEventListener("click", () => this.onAction({ kind: action }));
    parent.appendChild(btn);
  }
}
