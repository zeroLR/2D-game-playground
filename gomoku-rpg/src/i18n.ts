export type Locale = 'en' | 'zh-TW';

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_STORAGE_KEY = 'gomoku-rpg.locale';

const messages = {
  en: {
    vsCpu: 'VS CPU  •  LV.1', opponent: 'OPPONENT', mana: 'MANA', turn: 'TURN', you: 'YOU',
    yourTurn: 'YOUR TURN', opponentTurn: 'OPPONENT', victory: 'VICTORY', defeat: 'DEFEAT', draw: 'DRAW',
    blink: 'BLINK', selectDestination: 'SELECT DESTINATION', gainMana: 'New 3-line +1 • 4-line +2 Mana.',
    costMana: (cost: number) => `COST  ${cost} MANA`,
    blinkSelect: 'Select one of your stones, then an empty cell.',
    blinkHelp: 'Move one of your stones. Uses your whole turn.',
    playAgain: 'PLAY AGAIN', language: 'EN / 繁中', footer: 'M1  •  9×9  •  FIVE IN A ROW',
  },
  'zh-TW': {
    vsCpu: '對戰 CPU  •  LV.1', opponent: '對手', mana: '魔力', turn: '回合', you: '你',
    yourTurn: '你的回合', opponentTurn: '對手回合', victory: '勝利', defeat: '落敗', draw: '平手',
    blink: '閃現', selectDestination: '選擇目的地', gainMana: '新三連 +1 • 四連 +2 魔力。',
    costMana: (cost: number) => `消耗 ${cost} 魔力`,
    blinkSelect: '選擇自己的一枚棋子，再選擇空位。',
    blinkHelp: '移動自己一枚棋子，會消耗整個回合。',
    playAgain: '再玩一局', language: 'EN / 繁中', footer: 'M1  •  9×9  •  五子連線',
  },
} as const;

export type Messages = (typeof messages)['en'];

export function getMessages(locale: Locale) { return messages[locale]; }
export function nextLocale(locale: Locale): Locale { return locale === 'en' ? 'zh-TW' : 'en'; }

export function loadLocale(): Locale {
  try {
    const value = localStorage.getItem(LOCALE_STORAGE_KEY);
    return value === 'zh-TW' || value === 'en' ? value : DEFAULT_LOCALE;
  } catch { return DEFAULT_LOCALE; }
}

export function saveLocale(locale: Locale) {
  try { localStorage.setItem(LOCALE_STORAGE_KEY, locale); } catch { /* storage is optional */ }
}
