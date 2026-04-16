# Shape Shift (working title)

## Pitch
A 3–5 minute reverse bullet-hell where a geometric avatar auto-fires at converging hostile shapes, drafting rune-cards between waves to mutate its own form and build lethal synergies.

## Worldview
- **Setting:** 一片無盡的白色網格平面。每一把遊戲都是一次「形狀試煉」——抽象的幾何存在互相蠶食、重組、進化。沒有敘事角色，只有形狀與規則。
- **Tone:** 冷靜、極簡、機械感。無音樂氾濫，只有乾淨音效與節拍脈衝；輸贏都不帶情緒渲染。
- **Protagonist:** 一個會自動射擊的幾何圖形（起始為三角形）。玩家只用單指在螢幕下半部拖曳來操控移動，射擊完全自動。
- **Antagonist forces:** 從邊緣湧入的敵方形狀群（圓、方、星、多邊形），每波更密、更快、模式不同；終局是一個由玩家自己抽過的卡堆疊出的「鏡像 Boss」。
- **Themes:** 湧現（Emergence）、輸贏皆在牌組選擇、秩序 vs 混沌的幾何隱喻。
- **Sensory palette:**
  - 主色：純白底 + 單色高對比幾何（黑、洋紅、青）
  - 關鍵音：敵人破碎是短促的玻璃「叮」，抽卡是低頻脈衝
  - 簽名元素：每張卡是一個 glyph 符號，不是插畫
- **References:**
  - Games: *Geometry Wars*, *20 Minutes Till Dawn*, *Balatro*
  - Non-game: 包浩斯海報、Brian Eno 環境音、Sol LeWitt 幾何牆繪

## Verbs
玩家秒對秒在做的事（單指直向觸控）：
- **Drag** — 單指在下半螢幕拖曳，幾何體跟隨移動（或 relative-drag / virtual stick，scaffold 階段定案）
- **Dodge** — 穿梭於敵方彈幕與形狀之間
- **(Auto) fire** — 武器按卡組配置自動射擊，無需瞄準
- **Tap to draft** — 每波結束點選 3 張卡中的 1 張
- **Build synergy** — 組合多張卡讓效果疊加/質變
- **Tap to reroll / skip** — 用有限資源換一次重抽或跳過
- **Unlock** — run 結束累積代幣解鎖新卡池/起始形狀

## Audience & scope
- **Scope:** Game jam（一週內 MVP）
- **Session length:** 3–5 分鐘一把；死亡 < 3 秒重開
- **Platform:** mobile web，**直向 (portrait) 觸控為主**；畫面比例鎖 9:16 / 9:19.5，UI 元素尺寸 ≥ 44pt、遊玩區域完全避開拇指遮擋區（底部 25% 為控制熱區）。桌面瀏覽器以鏡像直向視窗支援（非核心）。

## Chosen Genre
deckbuilder

## Why this genre
遊戲的「決策面」幾乎全部在波間抽卡——射擊與移動雖是即時，但勝負由卡組 synergy 決定，而非操作精度。這種「低操作精度要求」正好契合手機直向單指觸控：移動可以靠拖曳，射擊完全自動。因此 deckbuilder skill 的核心教材（卡牌資料結構、隨機 draft、synergy 與縮放難度、shuffle bias 與 effect ordering 的坑）最契合。auto-shooter 的即時層可視為 deckbuilder 的「結算動畫」：卡組是角色，一場遊戲是一次牌組表演。若 `game-deckbuilder` skill 的預設範本過於回合制，會在 scaffold 階段標注偏離點。
