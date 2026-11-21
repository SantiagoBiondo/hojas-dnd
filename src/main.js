import './style.css';
import { t, loc, setLang, getLang, LANGS } from './i18n.js';
import { ABILITIES, SKILLS, ARMOR, STANDARD_ARRAY } from './data/common.js';
import { allPacks, buildRegistry, validatePack, PACK_TEMPLATE } from './packs.js';
import { derive, fmt, newCharacter, migrate, pointsLeft, asiKey, skillsFrom, MAX_LEVEL } from './rules.js';
import { POINT_BUY_COST } from './data/common.js';

// ---------------------------------------------------------------- almacenamiento
const KEYS = { settings: 'hojasdnd.settings', packs: 'hojasdnd.packs', draft: 'hojasdnd.draft' };
const store = {
  get(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sin almacenamiento: la app sigue funcionando */ }
  },
};

// ---------------------------------------------------------------- estado
const app = {
  screen: 'start', // 'start' | 'builder'
  step: 0,
  settings: store.get(KEYS.settings, { lang: navigator.language?.startsWith('en') ? 'en' : 'es', edition: '2024', packIds: ['srd52'] }),
  custom: [],
  char: null,
  msg: null,
};
{
  const saved = store.get(KEYS.packs, []);
  app.custom = Array.isArray(saved) ? saved.filter((p) => validatePack(p).length === 0) : [];
}
let draft = store.get(KEYS.draft, null);
setLang(app.settings.lang);

const STEPS = 8;
const SHEET_STEP = 7;
const DETAILS_STEP = 6;

// ---------------------------------------------------------------- utilidades
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const abilityOf = (id) => ABILITIES.find((a) => a.id === id);
const abilityAbbr = (id) => loc(abilityOf(id)?.abbr);
const abilityName = (id) => loc(abilityOf(id)?.name);
const skillName = (id) => loc(SKILLS.find((s) => s.id === id)?.name) || id;
const ALL_SKILL_IDS = SKILLS.map((s) => s.id);

const saveSettings = () => store.set(KEYS.settings, app.settings);
const saveDraft = () => { if (app.char) { draft = app.char; store.set(KEYS.draft, app.char); } };
const registry = () => buildRegistry(allPacks(app.custom), app.char.packIds);
const packsForEdition = (ed) => allPacks(app.custom).filter((p) => String(p.edition) === ed);

function download(filename, data, type = 'application/json') {
  const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function bonusText(obj) {
  const entries = Object.entries(obj || {});
  if (!entries.length) return '';
  if (entries.length === 6 && entries.every(([, v]) => v === entries[0][1])) return `${fmt(entries[0][1])} ${getLang() === 'es' ? 'a todas' : 'to all'}`;
  return entries.map(([k, v]) => `${abilityAbbr(k)} ${fmt(v)}`).join(', ');
}

/** Ajusta las elecciones del personaje para que sigan siendo válidas tras cualquier cambio. */
function sanitize(c) {
  // Clases: solo las que existen en los manuales elegidos, sin repetir, con nivel total <= 20
  const reg = registry();
  const seen = new Set();
  let total = 0;
  c.classes = (c.classes || []).filter((e) => {
    if (!reg.get(e.uid) || seen.has(e.uid)) return false;
    seen.add(e.uid);
    return true;
  }).map((e) => {
    const level = Math.max(1, Math.min(MAX_LEVEL - total, Number(e.level) || 1));
    total += level;
    const k = reg.get(e.uid);
    const sub = (k.subclasses || []).find((s) => s.id === e.subclassId && level >= (s.level ?? k.subclassLevel ?? 1));
    return { uid: e.uid, level, subclassId: sub ? sub.id : null };
  }).filter((e) => e.level >= 1);

  const d = derive(c, reg);
  const grantedIds = new Set(d.granted.keys());
  const classFrom = d.klass ? skillsFrom(d.klass.skillChoices?.from) : [];
  c.classSkills = c.classSkills.filter((s) => classFrom.includes(s) && !grantedIds.has(s)).slice(0, d.klass?.skillChoices?.count || 0);
  const taken = new Set(c.classSkills);
  const extra = {};
  for (const g of d.skillGroups) {
    extra[g.id] = (c.extra?.[g.id] || []).filter((s) => g.from.includes(s) && !grantedIds.has(s) && !taken.has(s)).slice(0, g.count);
    extra[g.id].forEach((s) => taken.add(s));
  }
  c.extra = extra;
  const slotKeys = new Set(d.asiSlots.map((s) => s.key));
  c.asi = Object.fromEntries(Object.entries(c.asi || {}).filter(([k]) => slotKeys.has(k)));
  const ch = d.species?.abilityChoice;
  c.choiceBonus = ch ? c.choiceBonus.filter((a) => !(ch.exclude || []).includes(a)).slice(0, ch.count) : [];
  const opts = d.bg?.abilityOptions || [];
  if (!opts.includes(c.bgPlus2)) c.bgPlus2 = null;
  if (!opts.includes(c.bgPlus1) || c.bgPlus1 === c.bgPlus2) c.bgPlus1 = null;
}

function stepValid(i) {
  const c = app.char;
  const d = derive(c, registry());
  switch (i) {
    case 0: return !!d.species && (!d.species.subraces?.length || !!d.sub);
    case 1: return !!d.klass && d.entries.every((e) => !(e.k.subclasses?.length) || !!e.subclass || e.level < (e.k.subclassLevel ?? 1));
    case 2: return !!d.bg;
    case 3: {
      if (pointsLeft(c.scores) < 0 && c.method === 'pointbuy') return false;
      const ch = d.species?.abilityChoice;
      if (ch && c.choiceBonus.length < ch.count) return false;
      if (d.bg?.abilityOptions?.length && c.bgMode === 'twoOne' && !(c.bgPlus2 && c.bgPlus1)) return false;
      return true;
    }
    case 4: {
      const need = d.klass ? Math.min(d.klass.skillChoices?.count || 0, availableClassSkills(d).length) : 0;
      if (c.classSkills.length < need) return false;
      return d.skillGroups.every((g) => (c.extra[g.id] || []).length >= g.count);
    }
    case 5: return d.asiSlots.every((s) => {
      const v = c.asi[s.key];
      if (!v || v.mode === 'none') return true;
      if (v.mode === 'asi2') return !!v.a;
      if (v.mode === 'asi11') return !!v.a && !!v.b && v.a !== v.b;
      return !!v.feat?.trim();
    });
    default: return true;
  }
}
const maxStepReachable = () => { let i = 0; while (i < STEPS - 1 && stepValid(i)) i++; return i; };

function availableClassSkills(d) {
  const from = d.klass?.skillChoices?.from === 'any' ? ALL_SKILL_IDS : d.klass?.skillChoices?.from || [];
  return from.filter((s) => !d.granted.has(s));
}

// ---------------------------------------------------------------- vistas: inicio
function langSwitch() {
  return `<div class="seg" role="group" aria-label="${esc(t('language'))}">${LANGS.map((l) =>
    `<button type="button" class="seg-btn ${getLang() === l.id ? 'is-on' : ''}" data-action="setLang" data-lang="${l.id}" aria-pressed="${getLang() === l.id}">${l.name}</button>`).join('')}</div>`;
}

function renderStart() {
  const ed = app.settings.edition;
  const packs = packsForEdition(ed);
  const counts = (p) => {
    const es = getLang() === 'es';
    const parts = [];
    if (p.species?.length) parts.push(`${p.species.length} ${es ? 'especies' : 'species'}`);
    if (p.classes?.length) parts.push(`${p.classes.length} ${es ? 'clases' : 'classes'}`);
    if (p.backgrounds?.length) parts.push(`${p.backgrounds.length} ${es ? 'trasfondos' : 'backgrounds'}`);
    return parts.join(' · ');
  };
  return `
  <main class="start">
    <header class="hero">
      <div class="hero-top">${langSwitch()}</div>
      <h1>${esc(t('appTitle'))}</h1>
      <p class="lead">${esc(t('appTagline'))}</p>
    </header>
    ${app.msg ? `<div class="notice notice-${app.msg.kind}" role="status">${esc(app.msg.text)}</div>` : ''}
    <section class="panel">
      <h2><span class="num">1</span>${esc(t('edition'))}</h2>
      <div class="choice-row">
        ${['2014', '2024'].map((e) => `
          <button type="button" class="choice ${ed === e ? 'is-selected' : ''}" data-action="setEdition" data-edition="${e}" aria-pressed="${ed === e}">
            <strong>${esc(t('edition' + e))}</strong>
            <span>${esc(t('editionHint' + e))}</span>
          </button>`).join('')}
      </div>
    </section>
    <section class="panel">
      <h2><span class="num">2</span>${esc(t('manuals'))}</h2>
      <p class="hint">${esc(t('manualsHint'))}</p>
      ${packs.length ? `<ul class="pack-list">${packs.map((p) => `
        <li class="pack">
          <label>
            <input type="checkbox" data-action="togglePack" data-on="change" data-id="${esc(p.id)}" ${app.settings.packIds.includes(p.id) ? 'checked' : ''}>
            <span class="pack-body">
              <strong>${esc(loc(p.name))}</strong>${p.base ? '' : `<span class="tag tag-custom">${esc(t('customPack'))}</span>`}
              <small>${esc(loc(p.description) || counts(p))}</small>
              <small class="dim">${esc(counts(p))}</small>
            </span>
          </label>
          ${p.base ? '' : `<button type="button" class="btn btn-ghost btn-sm" data-action="removePack" data-id="${esc(p.id)}">${esc(t('removePack'))}</button>`}
        </li>`).join('')}</ul>` : `<p class="hint">${esc(t('noManuals'))}</p>`}
      <div class="btn-row">
        <label class="btn btn-secondary">${esc(t('importPack'))}<input type="file" accept="application/json,.json" data-action="importPack" data-on="change" hidden></label>
        <button type="button" class="btn btn-ghost" data-action="downloadTemplate">${esc(t('downloadTemplate'))}</button>
        <span class="soon">${esc(t('pdfSoon'))}</span>
      </div>
    </section>
    <div class="cta">
      ${app.settings.packIds.some((id) => packs.some((p) => p.id === id)) ? '' : `<p class="hint">${esc(t('needManual'))}</p>`}
      <button type="button" class="btn btn-primary btn-lg" data-action="startNew" ${app.settings.packIds.some((id) => packs.some((p) => p.id === id)) ? '' : 'disabled'}>${esc(t('create'))}</button>
      ${draft ? `<button type="button" class="btn btn-secondary" data-action="continueDraft">${esc(t('continueDraft', { name: draft.name || t('unnamed') }))}</button>` : ''}
      <label class="btn btn-ghost">${esc(t('importChar'))}<input type="file" accept="application/json,.json" data-action="importChar" data-on="change" hidden></label>
    </div>
    <footer class="footer"><p>${esc(t('privacy'))}</p><p>${esc(t('legal'))}</p></footer>
  </main>`;
}

// ---------------------------------------------------------------- vistas: asistente
function renderBuilder() {
  const c = app.char;
  const reach = maxStepReachable();
  const d = derive(c, registry());
  const body = [stepSpecies, stepClass, stepBackground, stepAbilities, stepSkills, stepImprovements, stepDetails, stepSheet][app.step](c, d);
  return `
  <div class="builder">
    <header class="topbar no-print">
      <button type="button" class="btn btn-ghost btn-sm" data-action="goHome">← ${esc(t('home'))}</button>
      <strong class="topbar-title">${esc(c.name || t('appTitle'))}</strong>
      ${langSwitch()}
    </header>
    <nav class="stepper no-print" aria-label="Pasos">
      <ol>${t('steps').map((label, i) => `
        <li><button type="button" class="step ${i === app.step ? 'is-current' : ''} ${i < app.step ? 'is-done' : ''}" data-action="goStep" data-step="${i}" ${i > reach ? 'disabled' : ''} ${i === app.step ? 'aria-current="step"' : ''}>
          <span class="step-n">${i + 1}</span><span class="step-l">${esc(label)}</span></button></li>`).join('')}</ol>
    </nav>
    <main class="step-body">${body}</main>
    ${app.step < SHEET_STEP ? `
    <footer class="navbar no-print">
      <button type="button" class="btn btn-secondary" data-action="back" ${app.step === 0 ? 'disabled' : ''}>← ${esc(t('back'))}</button>
      <button type="button" class="btn btn-primary" data-action="next" ${stepValid(app.step) ? '' : 'disabled'}>${esc(t('next'))} →</button>
    </footer>` : ''}
  </div>`;
}

function optionCard(type, it, selected) {
  let meta = '';
  if (type === 'species') meta = [loc(it.size), it.speed ? `${it.speed} ${t('ft')}` : '', bonusText(it.abilityBonus)].filter(Boolean).join(' · ');
  if (type === 'classes') meta = [`d${it.hitDie}`, (it.saves || []).map(abilityAbbr).join('/')].filter(Boolean).join(' · ');
  if (type === 'backgrounds') meta = [(it.skills || []).map(skillName).join(', '), it.abilityOptions ? it.abilityOptions.map(abilityAbbr).join('/') : ''].filter(Boolean).join(' · ');
  return `<button type="button" class="card ${selected ? 'is-selected' : ''}" data-action="pick" data-type="${type}" data-id="${esc(it.uid)}" aria-pressed="${selected}">
    <span class="card-head"><strong>${esc(loc(it.name))}</strong><span class="tag">${esc(it.source)}</span></span>
    <span class="card-meta">${esc(meta)}</span>
  </button>`;
}

function featureList(list) {
  if (!list.length) return '';
  return `<dl class="features">${list.map((ft) => `<dt>${esc(loc(ft.name))}</dt>${ft.desc ? `<dd>${esc(loc(ft.desc))}</dd>` : ''}`).join('')}</dl>`;
}

function pickerStep(c, type, selectedUid, title, extra) {
  const items = registry()[type].filter((it) => it.edition === c.edition);
  return `<h2 class="step-title">${esc(title)}</h2>
    ${items.length ? `<div class="card-grid">${items.map((it) => optionCard(type, it, it.uid === selectedUid)).join('')}</div>` : `<p class="hint">${esc(t('noOptions'))}</p>`}
    ${extra || ''}`;
}

function stepSpecies(c, d) {
  let extra = '';
  if (d.species) {
    const subs = d.species.subraces || [];
    extra = `<section class="detail">
      <h3>${esc(loc(d.species.name))}</h3>
      ${subs.length ? `<label class="field"><span>${esc(t('subrace'))}</span>
        <select data-action="setSub" data-on="change">${subs.map((s) => `<option value="${esc(s.id)}" ${s.id === c.subraceId ? 'selected' : ''}>${esc(loc(s.name))}</option>`).join('')}</select></label>` : ''}
      ${featureList([...(d.species.traits || []), ...(d.sub?.traits || [])])}
    </section>`;
  }
  return pickerStep(c, 'species', c.speciesId, t('species'), extra);
}

function stepClass(c, d) {
  let extra = '';
  if (d.klass) {
    const reg = registry();
    const used = new Set(d.entries.map((e) => e.k.uid));
    const addable = reg.classes.filter((k) => k.edition === c.edition && !used.has(k.uid));
    const rows = d.entries.map((e) => {
      const subs = e.k.subclasses || [];
      const needAt = e.k.subclassLevel ?? 1;
      const subSelect = subs.length ? (e.level >= needAt
        ? `<label class="field"><span>${esc(t('subclass'))}</span><select data-action="setSubclass" data-on="change" data-index="${e.index}">
            <option value="">${esc(t('subclassPick'))}</option>${subs.map((s) => `<option value="${esc(s.id)}" ${e.subclass?.id === s.id ? 'selected' : ''}>${esc(loc(s.name))}</option>`).join('')}</select></label>`
        : `<p class="hint">${esc(t('subclass'))}: ${esc(t('subclassAt', { n: needAt }))}</p>`) : '';
      return `<div class="class-row">
        <div class="class-row-head"><strong>${esc(loc(e.k.name))}</strong>${e.index === 0 ? `<span class="tag">${esc(t('classPrimary'))}</span>` : ''}</div>
        <div class="level-ctl" role="group" aria-label="${esc(t('levelOf', { name: loc(e.k.name) }))}">
          <button type="button" class="btn btn-icon" data-action="levelStep" data-dir="-1" data-index="${e.index}" ${e.level <= 1 ? 'disabled' : ''} aria-label="−">−</button>
          <b>${t('level')} ${e.level}</b>
          <button type="button" class="btn btn-icon" data-action="levelStep" data-dir="1" data-index="${e.index}" ${d.level >= MAX_LEVEL ? 'disabled' : ''} aria-label="+">+</button>
        </div>
        ${subSelect}
        ${e.index > 0 ? `<button type="button" class="btn btn-ghost btn-sm" data-action="removeClass" data-index="${e.index}">${esc(t('removeClass'))}</button>` : ''}
      </div>`;
    }).join('');
    const warn = d.warnings.map((w) => `<div class="notice notice-error" role="status">${esc(t('multiWarn', {
      name: loc(w.k.name),
      abilities: w.mode === 'any' ? t('multiWarnAny', { abilities: w.abilities.map(abilityName).join(' / ') }) : w.abilities.map(abilityName).join(' + '),
    }))}</div>`).join('');
    extra = `<section class="detail">
      <h3>${esc(t('classesLevels'))} <small class="dim">· ${esc(t('totalLevel', { n: d.level }))}</small></h3>
      ${rows}
      ${warn}
      ${d.level < MAX_LEVEL && addable.length ? `<label class="field"><span>${esc(t('addClass'))}</span><select data-action="addClass" data-on="change">
        <option value="">${esc(t('addClassPlaceholder'))}</option>${addable.map((k) => `<option value="${esc(k.uid)}">${esc(loc(k.name))} (${esc(k.source)})</option>`).join('')}</select></label>` : ''}
    </section>
    <section class="detail">
      <h3>${esc(loc(d.klass.name))}</h3>
      <p class="facts"><span>${esc(t('hitDie'))}: <b>d${d.klass.hitDie}</b></span><span>${esc(t('saves'))}: <b>${d.klass.saves.map(abilityName).join(', ')}</b></span></p>
      ${featureList((d.klass.features || []).filter((f) => (f.level ?? 1) <= 1))}
    </section>`;
  }
  return pickerStep(c, 'classes', d.klass?.uid, t('class'), extra);
}

function stepBackground(c, d) {
  let extra = '';
  if (d.bg) {
    extra = `<section class="detail">
      <h3>${esc(loc(d.bg.name))}</h3>
      <p class="facts"><span>${esc(t('skills'))}: <b>${(d.bg.skills || []).map(skillName).join(', ')}</b></span></p>
      ${featureList(d.bg.feature ? [d.bg.feature] : [])}
    </section>`;
  }
  return pickerStep(c, 'backgrounds', c.backgroundId, t('background'), extra);
}

function stepAbilities(c, d) {
  const method = c.method;
  const methods = [['standard', 'methodStandard'], ['pointbuy', 'methodPointBuy'], ['roll', 'methodRoll'], ['manual', 'methodManual']];
  const rows = ABILITIES.map((a) => {
    const ab = d.abilities[a.id];
    let control = '';
    if (method === 'standard' || method === 'roll') {
      control = `<select data-action="assign" data-on="change" data-ability="${a.id}" aria-label="${esc(loc(a.name))}">${c.pool.map((v, i) => `<option value="${i}" ${c.assign[a.id] === i ? 'selected' : ''}>${v}</option>`).join('')}</select>`;
    } else if (method === 'pointbuy') {
      const v = c.scores[a.id];
      const canUp = v < 15 && (POINT_BUY_COST[v + 1] - POINT_BUY_COST[v]) <= pointsLeft(c.scores);
      control = `<span class="stepper-num"><button type="button" class="btn btn-icon" data-action="pb" data-dir="-1" data-ability="${a.id}" ${v <= 8 ? 'disabled' : ''} aria-label="-">−</button><b>${v}</b><button type="button" class="btn btn-icon" data-action="pb" data-dir="1" data-ability="${a.id}" ${canUp ? '' : 'disabled'} aria-label="+">+</button></span>`;
    } else {
      control = `<input type="number" min="3" max="20" value="${c.scores[a.id]}" data-action="manualScore" data-on="change" data-ability="${a.id}" aria-label="${esc(loc(a.name))}">`;
    }
    return `<tr><th scope="row">${esc(loc(a.name))}</th><td>${control}</td><td class="num-c">${ab.bonus ? fmt(ab.bonus) : '–'}</td><td class="num-c"><b>${ab.total}</b></td><td class="num-c mod">${fmt(ab.mod)}</td></tr>`;
  }).join('');

  let bonusBlocks = '';
  const sp = d.species;
  const ch = sp?.abilityChoice;
  if (ch) {
    bonusBlocks += `<section class="detail"><h3>${esc(t('bonusSpecies'))}</h3><p>${esc(t('bonusChoose', { count: ch.count, amount: ch.amount }))}</p>
      <div class="chips">${ABILITIES.filter((a) => !(ch.exclude || []).includes(a.id)).map((a) => {
        const on = c.choiceBonus.includes(a.id);
        const disabled = !on && c.choiceBonus.length >= ch.count;
        return `<button type="button" class="chip ${on ? 'is-on' : ''}" data-action="toggleChoiceBonus" data-ability="${a.id}" aria-pressed="${on}" ${disabled ? 'disabled' : ''}>${esc(loc(a.name))}</button>`;
      }).join('')}</div></section>`;
  }
  const opts = d.bg?.abilityOptions;
  if (opts?.length) {
    const sel = (field, label) => `<label class="field"><span>${esc(label)}</span><select data-action="bgSelect" data-on="change" data-field-name="${field}">
      <option value="">—</option>${opts.map((a) => `<option value="${a}" ${c[field] === a ? 'selected' : ''}>${esc(abilityName(a))}</option>`).join('')}</select></label>`;
    bonusBlocks += `<section class="detail"><h3>${esc(t('bonusBackground'))} · ${esc(loc(d.bg.name))}</h3>
      <div class="seg"><button type="button" class="seg-btn ${c.bgMode === 'twoOne' ? 'is-on' : ''}" data-action="bgMode" data-mode="twoOne">${esc(t('bonusTwoOne'))}</button>
      <button type="button" class="seg-btn ${c.bgMode === 'oneOneOne' ? 'is-on' : ''}" data-action="bgMode" data-mode="oneOneOne">${esc(t('bonusOneOneOne'))}</button></div>
      ${c.bgMode === 'twoOne' ? `<div class="field-row">${sel('bgPlus2', t('bonusPlus2'))}${sel('bgPlus1', t('bonusPlus1'))}</div>` : `<p class="hint">${opts.map(abilityName).join(' · ')}</p>`}</section>`;
  }
  if (sp && !ch && Object.keys(sp.abilityBonus || {}).length === 0 && !opts?.length) bonusBlocks = '';

  return `<h2 class="step-title">${esc(t('steps')[3])}</h2>
    <div class="seg seg-wrap" role="group" aria-label="${esc(t('methodTitle'))}">${methods.map(([id, key]) => `<button type="button" class="seg-btn ${method === id ? 'is-on' : ''}" data-action="setMethod" data-method="${id}" aria-pressed="${method === id}">${esc(t(key))}</button>`).join('')}</div>
    <div class="method-info">
      ${method === 'roll' ? `<button type="button" class="btn btn-secondary btn-sm" data-action="roll">🎲 ${esc(t('roll'))}</button>` : ''}
      ${method === 'pointbuy' ? `<b class="${pointsLeft(c.scores) < 0 ? 'bad' : ''}">${esc(t('pointsLeft', { n: pointsLeft(c.scores) }))}</b>` : ''}
    </div>
    <div class="table-wrap"><table class="scores">
      <thead><tr><th></th><th>${esc(t('base'))}</th><th>${esc(t('bonus'))}</th><th>${esc(t('total'))}</th><th>${esc(t('modifier'))}</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
    ${bonusBlocks}`;
}

const inExtraAny = (c, id) => Object.values(c.extra).some((list) => list.includes(id));

function skillCheckbox(id, { checked, disabled, note, kind }) {
  return `<label class="check ${disabled ? 'is-disabled' : ''}"><input type="checkbox" data-action="toggleSkill" data-on="change" data-kind="${kind}" data-id="${id}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
    <span>${esc(skillName(id))}${note ? ` <small class="dim">(${esc(note)})</small>` : ''}</span></label>`;
}

function stepSkills(c, d) {
  if (!d.klass) return `<h2 class="step-title">${esc(t('steps')[4])}</h2><p class="hint">${esc(t('noOptions'))}</p>`;
  const count = d.klass.skillChoices?.count || 0;
  const from = skillsFrom(d.klass.skillChoices?.from);
  const left = Math.max(0, Math.min(count, availableClassSkills(d).length) - c.classSkills.length);
  const originName = { background: t('fromBackground'), species: t('fromSpecies'), class: t('fromClass') };
  const classBoxes = from.map((id) => {
    const grantedFrom = d.granted.get(id);
    if (grantedFrom) return skillCheckbox(id, { checked: true, disabled: true, note: originName[grantedFrom], kind: 'class' });
    const on = c.classSkills.includes(id);
    return skillCheckbox(id, { checked: on, disabled: !on && (c.classSkills.length >= count || inExtraAny(c, id)), kind: 'class' });
  }).join('');

  const inExtra = (id) => Object.values(c.extra).some((list) => list.includes(id));
  let extra = '';
  for (const g of d.skillGroups) {
    const mine = c.extra[g.id] || [];
    const title = g.origin === 'class' ? `${t('skillsExtra')} · ${loc(g.k.name)}` : `${t('skillsExtra')} · ${t('fromSpecies')}`;
    extra += `<section class="detail"><h3>${esc(title)}</h3><p class="hint">${esc(t('skillsPick', { n: g.count, left: g.count - mine.length }))}</p>
      <div class="checks">${g.from.map((id) => {
        const grantedFrom = d.granted.get(id);
        if (grantedFrom) return skillCheckbox(id, { checked: true, disabled: true, note: originName[grantedFrom], kind: g.id });
        const on = mine.includes(id);
        return skillCheckbox(id, { checked: on, disabled: !on && (mine.length >= g.count || c.classSkills.includes(id) || inExtra(id)), kind: g.id });
      }).join('')}</div></section>`;
  }
  return `<h2 class="step-title">${esc(t('skillsClass'))} · ${esc(loc(d.klass.name))}</h2>
    <p class="hint">${esc(t('skillsPick', { n: count, left }))}${d.klass.skillChoices?.from === 'any' ? ` · ${esc(t('skillsAny'))}` : ''}</p>
    <div class="checks">${classBoxes}</div>${extra}`;
}

function stepImprovements(c, d) {
  const abilityOptions = (sel) => `<option value="">—</option>${ABILITIES.map((a) => `<option value="${a.id}" ${sel === a.id ? 'selected' : ''}>${esc(loc(a.name))}</option>`).join('')}`;
  const blocks = d.asiSlots.map((slot) => {
    const v = c.asi[slot.key] || { mode: 'none' };
    const modes = [['none', 'asiNone'], ['asi2', 'asi2'], ['asi11', 'asi11'], ['feat', 'asiFeat']];
    let fields = '';
    if (v.mode === 'asi2') fields = `<label class="field"><span>${esc(t('firstAbility'))}</span><select data-action="asiAbility" data-on="change" data-key="${esc(slot.key)}" data-slot="a">${abilityOptions(v.a)}</select></label>`;
    if (v.mode === 'asi11') fields = `<div class="field-row">
      <label class="field"><span>${esc(t('firstAbility'))}</span><select data-action="asiAbility" data-on="change" data-key="${esc(slot.key)}" data-slot="a">${abilityOptions(v.a)}</select></label>
      <label class="field"><span>${esc(t('secondAbility'))}</span><select data-action="asiAbility" data-on="change" data-key="${esc(slot.key)}" data-slot="b">${abilityOptions(v.b)}</select></label></div>`;
    if (v.mode === 'feat') fields = `<label class="field"><span>${esc(t('featName'))}</span><input type="text" value="${esc(v.feat || '')}" data-asi-feat="${esc(slot.key)}"></label>`;
    return `<section class="detail"><h3>${esc(loc(slot.k.name))} · ${esc(t('level'))} ${slot.level}</h3>
      <label class="field"><span>${esc(t('improvements'))}</span><select data-action="asiMode" data-on="change" data-key="${esc(slot.key)}">${modes.map(([id, key]) => `<option value="${id}" ${v.mode === id ? 'selected' : ''}>${esc(t(key))}</option>`).join('')}</select></label>
      ${fields}</section>`;
  }).join('');
  return `<h2 class="step-title">${esc(t('improvements'))}</h2><p class="hint">${esc(t('improvementsHint'))}</p>
    ${blocks || `<p class="hint">${esc(t('noImprovements'))}</p>`}`;
}

function stepDetails(c, d) {
  const input = (field, label, type = 'text') => `<label class="field"><span>${esc(label)}</span><input type="${type}" value="${esc(c[field])}" data-field="${field}"></label>`;
  const area = (field, label, rows = 3) => `<label class="field"><span>${esc(label)}</span><textarea rows="${rows}" data-field="${field}">${esc(c[field])}</textarea></label>`;
  return `<h2 class="step-title">${esc(t('details'))}</h2>
    <div class="field-row">${input('name', t('charName'))}${input('player', t('playerName'))}${input('alignment', t('alignment'))}</div>
    <div class="field-row">
      <label class="field"><span>${esc(t('armor'))}</span><select data-action="setArmor" data-on="change">${ARMOR.map((a) => `<option value="${a.id}" ${a.id === c.armorId ? 'selected' : ''}>${esc(loc(a.name))}</option>`).join('')}</select></label>
      <label class="check shield"><input type="checkbox" data-action="toggleShield" data-on="change" ${c.shield ? 'checked' : ''}><span>${esc(t('shield'))}</span></label>
    </div>
    ${d.extraLanguages ? input('extraLanguages', `${t('extraLanguages')} (${t('plusLanguages', { n: d.extraLanguages })})`) : ''}
    ${area('extraEquipment', t('extraEquipment'), 3)}
    ${area('spells', t('spellsNotes'), 3)}
    ${area('personality', t('personality'), 3)}
    ${area('appearance', t('appearance'), 3)}`;
}

// ---------------------------------------------------------------- hoja imprimible
function listText(list) { return list.map(loc).filter(Boolean).join('; '); }

function spellBlock(c, d) {
  if (!d.spells.length) return c.spells ? `<div class="block"><h4>${esc(t('spells'))}</h4><p class="pre">${esc(c.spells)}</p></div>` : '';
  const perClass = d.spells.map((s) => {
    const counts = [
      s.cantrips ? `${t('cantripsLabel')}: ${s.cantrips}` : '',
      s.count != null ? `${t('spells')}: ${s.count} ${t(s.kind === 'known' ? 'spellsKnown' : 'spellsPrepared')}` : '',
      s.spellbook ? `${t('spellbookLabel')}: ${s.spellbook}` : '',
    ].filter(Boolean).join(' · ');
    return `<div class="spell-class"><b>${esc(loc(s.k.name))}</b> <small>${esc(t('spellAbility'))}: ${esc(abilityAbbr(s.ability))} · ${esc(t('spellDc'))} ${s.dc} · ${esc(t('spellAttack'))} ${fmt(s.attack)}</small>
      ${counts ? `<p class="small-note">${esc(counts)}</p>` : ''}</div>`;
  }).join('');
  const slotBoxes = d.slots.map((n, i) => `<div class="slot"><small>${esc(t('slotLevelShort', { n: i + 1 }))}</small><b>${n}</b><span class="slot-dots">${'<span class="dot"></span>'.repeat(n)}</span></div>`).join('');
  return `<div class="block"><h4>${esc(t('spellcasting'))}</h4>${perClass}
    ${slotBoxes ? `<h5 class="sub-h">${esc(t('slotsHeading'))}</h5><div class="slots">${slotBoxes}</div>` : ''}
    ${d.pact ? `<p class="small-note"><b>${esc(t('pactSlots', { n: d.pact[0], lvl: d.pact[1] }))}</b> <span class="slot-dots">${'<span class="dot"></span>'.repeat(d.pact[0])}</span></p>` : ''}
    <p class="pre">${esc(c.spells)}</p></div>`;
}

function stepSheet(c, d) {
  const classLabel = d.entries.length
    ? d.entries.map((e) => `${loc(e.k.name)}${e.subclass ? ` (${loc(e.subclass.name)})` : ''} ${e.level}`).join(' / ')
    : '—';
  const dots = (n) => '<span class="dot"></span>'.repeat(n);
  const equipmentLines = [d.klass?.equipment, d.bg?.equipment].map(loc).filter(Boolean);
  const languages = [...d.languages.map(loc), c.extraLanguages].filter(Boolean).join(', ') + (d.extraLanguages && !c.extraLanguages ? ` (${t('plusLanguages', { n: d.extraLanguages })})` : '');
  const speciesLabel = d.species ? loc(d.species.name) + (d.sub ? ` (${loc(d.sub.name)})` : '') : '—';

  return `
  <div class="sheet-actions no-print">
    <button type="button" class="btn btn-primary" data-action="print">🖨 ${esc(t('print'))}</button>
    <button type="button" class="btn btn-secondary" data-action="exportChar">⬇ ${esc(t('exportChar'))}</button>
    <button type="button" class="btn btn-ghost" data-action="goStep" data-step="${DETAILS_STEP}">← ${esc(t('edit'))}</button>
    <button type="button" class="btn btn-ghost" data-action="newChar">${esc(t('newChar'))}</button>
  </div>
  <article class="sheet" aria-label="${esc(c.name)}">
    <header class="sh-head">
      <div class="sh-name"><strong>${esc(c.name || ' ')}</strong><small>${esc(t('charName'))}</small></div>
      <div class="sh-meta">
        <div><b>${esc(classLabel)}</b><small>${esc(t('sheetClassLevel'))} · ${esc(t('level'))} ${d.level}</small></div>
        <div><b>${esc(d.bg ? loc(d.bg.name) : '—')}</b><small>${esc(t('sheetBackground'))}</small></div>
        <div><b>${esc(c.player || ' ')}</b><small>${esc(t('sheetPlayer'))}</small></div>
        <div><b>${esc(speciesLabel)}</b><small>${esc(t('sheetSpecies'))}</small></div>
        <div><b>${esc(c.alignment || ' ')}</b><small>${esc(t('sheetAlignment'))}</small></div>
        <div><b>&nbsp;</b><small>${esc(t('sheetXp'))}</small></div>
      </div>
    </header>

    <div class="sh-cols">
      <section class="sh-col">
        <div class="abilities">${ABILITIES.map((a) => {
          const ab = d.abilities[a.id];
          return `<div class="ability"><small>${esc(loc(a.name))}</small><b class="big">${fmt(ab.mod)}</b><span class="oval">${ab.total}</span></div>`;
        }).join('')}</div>
        <div class="mini-stats">
          <div class="box"><b>${fmt(d.prof)}</b><small>${esc(t('profBonus'))}</small></div>
          <div class="box"><b>&nbsp;</b><small>${esc(t('inspiration'))}</small></div>
        </div>
        <div class="block"><h4>${esc(t('savingThrows'))}</h4><ul class="plain">${d.saves.map((s) =>
          `<li><span class="mark ${s.proficient ? 'on' : ''}"></span><b>${fmt(s.value)}</b> ${esc(abilityName(s.id))}</li>`).join('')}</ul></div>
        <div class="block"><h4>${esc(t('skills'))}</h4><ul class="plain tight">${d.skills.map((s) =>
          `<li><span class="mark ${s.proficient ? 'on' : ''}"></span><b>${fmt(s.value)}</b> ${esc(loc(s.name))} <small>(${esc(abilityAbbr(s.ability))})</small></li>`).join('')}</ul></div>
        <div class="box wide"><b>${d.passivePerception}</b><small>${esc(t('passivePerception'))}</small></div>
      </section>

      <section class="sh-col">
        <div class="combat">
          <div class="box shield-box"><b>${d.ac}</b><small>${esc(t('ac'))}</small></div>
          <div class="box"><b>${fmt(d.initiative)}</b><small>${esc(t('initiative'))}</small></div>
          <div class="box"><b>${d.speed}</b><small>${esc(t('speed'))} (${esc(t('ft'))})</small></div>
        </div>
        <div class="box hp"><small>${esc(t('hpMax'))}: <b>${d.hp || '—'}</b></small><span class="blank-big">${esc(t('hpCurrent'))}</span></div>
        <div class="box hp-temp"><span class="blank-small">${esc(t('hpTemp'))}</span></div>
        <div class="two">
          <div class="box"><b>${esc(d.hitDiceText || '—')}</b><small>${esc(t('hitDice'))}</small></div>
          <div class="box death"><small>${esc(t('deathSaves'))}</small>
            <div>${esc(t('successes'))} ${dots(3)}</div><div>${esc(t('failures'))} ${dots(3)}</div></div>
        </div>
        <div class="block lined"><h4>${esc(t('attacks'))}</h4>${d.spells.map((s) => `<p class="spell-line">${d.spells.length > 1 ? `<b>${esc(loc(s.k.name))}:</b> ` : ''}${esc(abilityName(s.ability))} · ${esc(t('spellDc'))} <b>${s.dc}</b> · ${esc(t('spellAttack'))} <b>${fmt(s.attack)}</b></p>`).join('')}</div>
        <div class="block"><h4>${esc(t('equipment'))}</h4>
          ${c.extraEquipment ? `<p class="pre">${esc(c.extraEquipment)}</p>` : ''}
          ${equipmentLines.length ? `<p class="small-note"><b>${esc(t('suggestedEquipment'))}:</b> ${esc(equipmentLines.join(' — '))}</p>` : ''}
        </div>
      </section>

      <section class="sh-col">
        <div class="block"><h4>${esc(t('personality'))}</h4><p class="pre">${esc(c.personality)}</p></div>
        <div class="block"><h4>${esc(t('otherProf'))}</h4>
          ${languages ? `<p><b>${esc(t('languages'))}:</b> ${esc(languages)}</p>` : ''}
          ${d.armorProf.length ? `<p><b>${esc(t('armorProf'))}:</b> ${esc(listText(d.armorProf))}</p>` : ''}
          ${d.weaponProf.length ? `<p><b>${esc(t('weaponProf'))}:</b> ${esc(listText(d.weaponProf))}</p>` : ''}
          ${d.toolProf.length ? `<p><b>${esc(t('toolProf'))}:</b> ${esc(listText(d.toolProf))}</p>` : ''}
        </div>
        <div class="block"><h4>${esc(t('appearance'))}</h4><p class="pre">${esc(c.appearance)}</p></div>
      </section>
    </div>

    <div class="sh-page2">
      <div class="block"><h4>${esc(t('featuresTraits'))}</h4>
        <div class="sheet-features">${d.features.map((ft) => `<div class="feat"><b>${esc(loc(ft.name))}</b>${ft.from ? ` <small>· ${esc(loc(ft.from.name))}${ft.level > 1 ? ` · ${esc(t('featureAtLevel', { n: ft.level }))}` : ''}${ft.isFeat ? ` · ${esc(t('asiFeat'))}` : ''}</small>` : ''}${ft.desc ? `<p>${esc(loc(ft.desc))}</p>` : ''}</div>`).join('')}</div>
      </div>
      ${spellBlock(c, d)}
      <div class="block lined tall"><h4>${esc(t('notes'))}</h4></div>
    </div>
  </article>`;
}

// ---------------------------------------------------------------- render
function render() {
  const root = document.getElementById('app');
  root.innerHTML = app.screen === 'start' ? renderStart() : renderBuilder();
  document.title = app.screen === 'builder' && app.char.name ? `${app.char.name} · ${t('appTitle')}` : t('appTitle');
}

function notify(text, kind = 'ok') { app.msg = { text, kind }; }

// ---------------------------------------------------------------- acciones
function startNew() {
  const { edition, packIds } = app.settings;
  const valid = packIds.filter((id) => packsForEdition(edition).some((p) => p.id === id));
  app.char = newCharacter({ edition, lang: getLang(), packIds: valid });
  app.screen = 'builder';
  app.step = 0;
  app.msg = null;
  saveDraft();
}

function resetMethod(c, method) {
  c.method = method;
  if (method === 'standard') { c.pool = [...STANDARD_ARRAY]; identityAssign(c); }
  if (method === 'roll') { rollPool(c); }
  if (method === 'pointbuy') c.scores = Object.fromEntries(ABILITIES.map((a) => [a.id, 8]));
}
function identityAssign(c) {
  ABILITIES.forEach((a, i) => { c.assign[a.id] = i; c.scores[a.id] = c.pool[i]; });
}
function rollPool(c) {
  const die = () => 1 + Math.floor(Math.random() * 6);
  c.pool = Array.from({ length: 6 }, () => {
    const r = [die(), die(), die(), die()].sort((x, y) => x - y);
    return r[1] + r[2] + r[3];
  }).sort((x, y) => y - x);
  identityAssign(c);
}

const actions = {
  setLang(el) {
    setLang(el.dataset.lang);
    app.settings.lang = getLang();
    if (app.char) app.char.lang = getLang();
    saveSettings(); saveDraft();
  },
  setEdition(el) {
    app.settings.edition = el.dataset.edition;
    app.settings.packIds = packsForEdition(el.dataset.edition).map((p) => p.id);
    app.msg = null; saveSettings();
  },
  togglePack(el) {
    const ids = new Set(app.settings.packIds);
    el.checked ? ids.add(el.dataset.id) : ids.delete(el.dataset.id);
    app.settings.packIds = [...ids];
    saveSettings();
  },
  removePack(el) {
    app.custom = app.custom.filter((p) => p.id !== el.dataset.id);
    app.settings.packIds = app.settings.packIds.filter((id) => id !== el.dataset.id);
    store.set(KEYS.packs, app.custom); saveSettings();
  },
  async importPack(el) {
    const file = el.files?.[0];
    el.value = '';
    if (!file) return;
    try {
      const pack = JSON.parse(await file.text());
      const errs = validatePack(pack);
      if (errs.length) return notify(t('packInvalid', { errors: errs.join(', ') }), 'error');
      if (allPacks(app.custom).some((p) => p.id === pack.id)) return notify(t('packDuplicate'), 'error');
      pack.edition = String(pack.edition);
      app.custom.push(pack);
      store.set(KEYS.packs, app.custom);
      app.settings.edition = pack.edition;
      app.settings.packIds = [...new Set([...packsForEdition(pack.edition).filter((p) => p.base || app.settings.packIds.includes(p.id)).map((p) => p.id), pack.id])];
      saveSettings();
      notify(t('packLoaded', { name: loc(pack.name) }));
    } catch {
      notify(t('packInvalid', { errors: 'JSON' }), 'error');
    }
  },
  downloadTemplate() { download('plantilla-manual.json', PACK_TEMPLATE); },
  startNew,
  continueDraft() {
    app.char = migrate(draft, newCharacter(draft));
    setLang(app.char.lang || app.settings.lang);
    sanitize(app.char);
    app.screen = 'builder';
    app.step = maxStepReachable();
    app.msg = null;
  },
  async importChar(el) {
    const file = el.files?.[0];
    el.value = '';
    if (!file) return;
    try {
      const obj = JSON.parse(await file.text());
      if (!obj || typeof obj !== 'object' || !obj.edition || !Array.isArray(obj.packIds)) throw new Error('shape');
      app.char = migrate(obj, newCharacter(obj));
      setLang(app.char.lang || app.settings.lang);
      sanitize(app.char);
      app.screen = 'builder';
      app.step = SHEET_STEP;
      saveDraft();
    } catch {
      notify(t('charInvalid'), 'error');
    }
  },
  goHome() { app.screen = 'start'; app.msg = null; },
  goStep(el) { app.step = Math.min(Number(el.dataset.step), maxStepReachable()); },
  next() { if (stepValid(app.step)) app.step = Math.min(app.step + 1, STEPS - 1); },
  back() { app.step = Math.max(0, app.step - 1); },
  pick(el) {
    const c = app.char;
    const item = registry().get(el.dataset.id);
    if (!item) return;
    const type = el.dataset.type;
    if (type === 'species') {
      c.speciesId = item.uid;
      c.subraceId = item.subraces?.[0]?.id || null;
      c.choiceBonus = []; c.extra = {};
    } else if (type === 'classes') {
      // La clase elegida pasa a ser la inicial; si ya estaba como otra clase, se mueve al primer lugar.
      const prev = c.classes.find((e) => e.uid === item.uid);
      const first = c.classes[0];
      c.classes = [prev || { uid: item.uid, level: first?.level || 1, subclassId: null }, ...c.classes.slice(1).filter((e) => e.uid !== item.uid)];
      c.classSkills = []; c.extra = {};
    } else { c.backgroundId = item.uid; c.bgPlus2 = null; c.bgPlus1 = null; }
    sanitize(c);
  },
  levelStep(el) {
    const c = app.char;
    const e = c.classes[Number(el.dataset.index)];
    if (!e) return;
    const total = c.classes.reduce((n, x) => n + x.level, 0);
    const next = e.level + Number(el.dataset.dir);
    if (next < 1 || (Number(el.dataset.dir) > 0 && total >= MAX_LEVEL)) return;
    e.level = next;
    sanitize(c);
  },
  setSubclass(el) {
    const e = app.char.classes[Number(el.dataset.index)];
    if (e) { e.subclassId = el.value || null; sanitize(app.char); }
  },
  addClass(el) {
    if (!el.value) return;
    const c = app.char;
    if (c.classes.reduce((n, x) => n + x.level, 0) >= MAX_LEVEL || c.classes.some((x) => x.uid === el.value)) return;
    c.classes.push({ uid: el.value, level: 1, subclassId: null });
    sanitize(c);
  },
  removeClass(el) {
    const i = Number(el.dataset.index);
    if (i > 0) { app.char.classes.splice(i, 1); sanitize(app.char); }
  },
  asiMode(el) {
    const c = app.char;
    c.asi[el.dataset.key] = { mode: el.value, a: null, b: null, feat: '' };
  },
  asiAbility(el) {
    const s = app.char.asi[el.dataset.key];
    if (s) s[el.dataset.slot] = el.value || null;
  },
  setSub(el) { app.char.subraceId = el.value; },
  setMethod(el) { resetMethod(app.char, el.dataset.method); },
  roll() { rollPool(app.char); },
  assign(el) {
    const c = app.char;
    const a = el.dataset.ability;
    const idx = Number(el.value);
    const other = ABILITIES.find((x) => x.id !== a && c.assign[x.id] === idx);
    if (other) c.assign[other.id] = c.assign[a];
    c.assign[a] = idx;
    for (const x of ABILITIES) c.scores[x.id] = c.pool[c.assign[x.id]];
  },
  pb(el) {
    const c = app.char;
    const a = el.dataset.ability;
    const next = c.scores[a] + Number(el.dataset.dir);
    if (next < 8 || next > 15) return;
    const before = c.scores[a];
    c.scores[a] = next;
    if (pointsLeft(c.scores) < 0) c.scores[a] = before;
  },
  manualScore(el) { app.char.scores[el.dataset.ability] = Math.max(3, Math.min(20, Math.round(Number(el.value)) || 10)); },
  toggleChoiceBonus(el) {
    const c = app.char;
    const a = el.dataset.ability;
    c.choiceBonus = c.choiceBonus.includes(a) ? c.choiceBonus.filter((x) => x !== a) : [...c.choiceBonus, a];
    sanitize(c);
  },
  bgMode(el) { app.char.bgMode = el.dataset.mode; },
  bgSelect(el) { app.char[el.dataset.fieldName] = el.value || null; sanitize(app.char); },
  toggleSkill(el) {
    const c = app.char;
    const id = el.dataset.id;
    const kind = el.dataset.kind;
    const list = kind === 'class' ? c.classSkills : (c.extra[kind] ||= []);
    const next = el.checked ? [...list, id] : list.filter((s) => s !== id);
    if (kind === 'class') c.classSkills = next; else c.extra[kind] = next;
    sanitize(c);
  },
  setArmor(el) { app.char.armorId = el.value; },
  toggleShield(el) { app.char.shield = el.checked; },
  print() { window.print(); },
  exportChar() {
    const c = app.char;
    download(`${(c.name || 'personaje').replace(/[^\w-]+/g, '_')}.json`, c);
  },
  newChar() {
    if (!confirm(t('confirmNew'))) return;
    try { localStorage.removeItem(KEYS.draft); } catch { /* sin almacenamiento */ }
    draft = null;
    app.char = null;
    app.screen = 'start';
  },
};

// ---------------------------------------------------------------- eventos
const root = document.getElementById('app');

root.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.dataset.on === 'change' || el.disabled || el.tagName === 'LABEL') return;
  const fn = actions[el.dataset.action];
  if (!fn) return;
  await fn(el);
  if (app.char) saveDraft();
  render();
});

root.addEventListener('change', async (e) => {
  const el = e.target.closest('[data-action][data-on="change"]');
  if (!el) return;
  const fn = actions[el.dataset.action];
  if (!fn) return;
  await fn(el);
  if (app.char) saveDraft();
  render();
});

root.addEventListener('input', (e) => {
  const el = e.target;
  if (el.dataset?.asiFeat && app.char) {
    const s = app.char.asi[el.dataset.asiFeat] ||= { mode: 'feat' };
    s.feat = el.value;
    saveDraft();
    return;
  }
  const field = el.dataset?.field;
  if (!field || !app.char) return;
  app.char[field] = el.value;
  saveDraft();
});

render();
