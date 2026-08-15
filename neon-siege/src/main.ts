import { CHARACTERS, selectCharacter, type CharacterDefinition } from './content/characters';
import { weaponAt } from './content/weapons';

const style = document.createElement('style');
style.textContent = `
  #character-select{position:fixed;inset:0;z-index:100;background:radial-gradient(circle at 50% 24%,#10232a 0,#071017 36%,#030609 78%);display:flex;align-items:center;justify-content:center;padding:clamp(14px,4vw,44px);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#eef4f6;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
  .char-shell{width:min(1040px,96vw)}
  .char-kicker{color:#39e3d2;font-size:10px;font-weight:900;letter-spacing:.28em;margin-bottom:8px}.char-title{font-size:clamp(24px,5vw,48px);line-height:.95;margin:0 0 8px;letter-spacing:-.05em}.char-sub{color:#74818a;font-size:10px;margin-bottom:22px}
  .char-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.char-card{position:relative;min-height:310px;padding:18px;text-align:left;border:1px solid #ffffff25;background:linear-gradient(180deg,#0d161dcc,#080d12f5);color:#eef4f6;overflow:hidden;touch-action:none}.char-card::after{content:'';position:absolute;inset:auto -20% -35% 30%;height:180px;border-radius:50%;background:var(--accent);filter:blur(55px);opacity:.12;pointer-events:none}.char-card:hover,.char-card:active,.char-card:focus-visible{border-color:var(--accent);outline:none;transform:translateY(-2px)}
  .char-index{color:var(--accent);font-size:9px;font-weight:900;letter-spacing:.2em}.char-name{font-size:32px;font-weight:950;letter-spacing:-.06em;margin:12px 0 2px}.char-role{color:var(--accent);font-size:10px;font-weight:900;letter-spacing:.12em}.char-code{color:#74818a;font-size:9px;margin:4px 0 18px}.char-desc{font-size:10px;line-height:1.55;color:#cbd4d8;min-height:48px}.char-passive{margin-top:18px;padding-top:14px;border-top:1px solid #ffffff18;color:#f5b942;font-size:9px;line-height:1.5}.char-loadout{position:absolute;left:18px;right:18px;bottom:16px;display:flex;justify-content:space-between;gap:8px;color:#74818a;font-size:8px}.char-loadout b{color:#eef4f6}.char-enter{margin-top:20px;text-align:center;color:#52616a;font-size:9px;letter-spacing:.12em}
  @media(max-width:760px){#character-select{align-items:flex-start;overflow:auto;padding-top:16px}.char-title{font-size:24px}.char-sub{margin-bottom:10px}.char-grid{gap:7px}.char-card{min-height:230px;padding:11px}.char-name{font-size:22px;margin-top:7px}.char-role{font-size:8px}.char-code,.char-desc,.char-passive{font-size:7px}.char-desc{min-height:38px}.char-passive{margin-top:8px;padding-top:8px}.char-loadout{left:11px;right:11px;bottom:9px;font-size:6px}.char-enter{margin-top:8px;font-size:7px}}
`;
document.head.appendChild(style);

const accent = (character: CharacterDefinition) => character.accent === 'pink' ? '#ff357f' : character.accent === 'amber' ? '#f5b942' : '#39e3d2';
const root = document.createElement('section');
root.id = 'character-select';
root.innerHTML = `
  <div class="char-shell">
    <div class="char-kicker">SECTOR 07 // OPERATOR LINK</div>
    <h1 class="char-title">SELECT YOUR<br/>BREACH PROFILE</h1>
    <div class="char-sub">One operator. One run. Your opening doctrine changes the entire defense economy.</div>
    <div class="char-grid"></div>
    <div class="char-enter">SELECT PROFILE TO INITIALIZE RUN</div>
  </div>`;
document.body.appendChild(root);

const grid = root.querySelector<HTMLElement>('.char-grid')!;
CHARACTERS.forEach((character, index) => {
  const card = document.createElement('button');
  card.className = 'char-card';
  card.style.setProperty('--accent', accent(character));
  const weapon = weaponAt(character.startingWeaponIndex);
  card.innerHTML = `
    <div class="char-index">0${index + 1} // ${character.codename}</div>
    <div class="char-name">${character.name}</div>
    <div class="char-role">${character.role}</div>
    <div class="char-code">STARTING DOCTRINE</div>
    <div class="char-desc">${character.description}</div>
    <div class="char-passive">${character.passive}</div>
    <div class="char-loadout"><span>WEAPON <b>${weapon.name}</b></span><span>CREDITS <b>$${character.startingCredits}</b></span><span>HP <b>${character.startingHp}</b></span></div>`;
  card.addEventListener('pointerdown', (event) => event.preventDefault());
  card.addEventListener('click', () => {
    selectCharacter(character.id);
    root.remove();
    style.remove();
    void import('./gameM45');
  });
  grid.appendChild(card);
});
