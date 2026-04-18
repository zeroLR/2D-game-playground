# Axiom 特殊 Skill 記錄

資料來源：`src/game/skills.ts`。

## 特殊 Skill 種類與能力描述

| ID | 名稱 | 描述 | 基礎持續時間 | 基礎冷卻時間 |
| --- | --- | --- | ---: | ---: |
| `timeStop` | Time Stop | Slows all enemies and projectiles to near-zero speed. | 5 秒 | 30 秒 |
| `shadowClone` | Shadow Clone | Summons a clone that inherits part of your power. | 5 秒 | 30 秒 |

## 升級規則（目前實作）

- 升級花費：`20 + 15 * 當前等級`
- 持續時間：`baseDuration + durationPerLevel * 等級`
- 冷卻時間：`max(5, baseCooldown - cooldownPerLevel * 等級)`
- `timeStop`：每級持續時間 +0.8 秒，冷卻 -2 秒
- `shadowClone`：每級持續時間 +0.5 秒，冷卻 -2 秒
