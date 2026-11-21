// Reglas: cálculo de todos los valores derivados de un personaje (niveles 1-20 y multiclase).
import { ABILITIES, ARMOR, SKILLS, STANDARD_ARRAY, POINT_BUY_COST, POINT_BUY_BUDGET } from './data/common.js';
import { SLOT_TABLE, PACT_TABLE } from './data/progression.js';
import { descFor } from './data/descriptions.js';

export const MAX_LEVEL = 20;
export const mod = (score) => Math.floor((score - 10) / 2);
export const fmt = (n) => (n >= 0 ? `+${n}` : `${n}`);
export const profBonus = (level) => Math.ceil(level / 4) + 1;
export const pointsSpent = (scores) => ABILITIES.reduce((sum, a) => sum + (POINT_BUY_COST[scores[a.id]] ?? 0), 0);
export const pointsLeft = (scores) => POINT_BUY_BUDGET - pointsSpent(scores);
export const asiKey = (uid, level) => `${uid}@${level}`;

export function newCharacter({ edition, lang, packIds }) {
  return {
    version: 2,
    edition, lang, packIds: [...packIds],
    name: '', player: '', alignment: '',
    speciesId: null, subraceId: null, backgroundId: null,
    classes: [], // [{ uid, level, subclassId }] — la primera es la clase inicial
    method: 'standard',
    pool: [...STANDARD_ARRAY],
    assign: { str: 0, dex: 1, con: 2, int: 3, wis: 4, cha: 5 },
    scores: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
    choiceBonus: [],
    bgMode: 'twoOne', bgPlus2: null, bgPlus1: null,
    classSkills: [], extra: {}, // extra: { species: [...], 'mc:<uid>': [...] }
    asi: {}, // { '<uid>@<nivel>': { mode: 'none'|'asi2'|'asi11'|'feat', a, b, feat } }
    armorId: 'none', shield: false,
    extraEquipment: '', spells: '', personality: '', appearance: '', extraLanguages: '',
  };
}

/** Pasa borradores y archivos de la versión 1 (una sola clase, nivel 1) al formato actual. */
export function migrate(raw, base) {
  const c = { ...base, ...raw };
  if (!Array.isArray(c.classes)) c.classes = [];
  if (raw.classId && !raw.classes) c.classes = [{ uid: raw.classId, level: 1, subclassId: null }];
  if (raw.extraSkills && !raw.extra) c.extra = { species: raw.extraSkills };
  delete c.classId; delete c.extraSkills;
  c.extra = c.extra && typeof c.extra === 'object' ? c.extra : {};
  c.asi = c.asi && typeof c.asi === 'object' ? c.asi : {};
  c.version = 2;
  return c;
}

const allSkillIds = SKILLS.map((s) => s.id);
export const skillsFrom = (from) => (from === 'any' || !from ? allSkillIds : from);

/** Calcula todo lo que muestra la hoja. `reg` viene de buildRegistry. */
export function derive(c, reg) {
  const species = reg.get(c.speciesId);
  const sub = species?.subraces?.find((s) => s.id === c.subraceId) || null;
  const bg = reg.get(c.backgroundId);

  // Clases del personaje (cada una una sola vez), con su subclase si ya la tiene disponible
  const entries = [];
  for (const e of c.classes || []) {
    const k = reg.get(e.uid);
    if (!k || entries.some((x) => x.k.uid === k.uid)) continue;
    const level = Math.max(1, Math.min(MAX_LEVEL, Number(e.level) || 1));
    const subclass = (k.subclasses || []).find((s) => s.id === e.subclassId && level >= (s.level ?? k.subclassLevel ?? 1)) || null;
    entries.push({ k, level, subclass, index: entries.length });
  }
  const primary = entries[0] || null;
  const klass = primary?.k || null;
  const totalLevel = Math.min(MAX_LEVEL, entries.reduce((n, e) => n + e.level, 0)) || 1;
  const prof = profBonus(totalLevel);

  // Mejoras de característica / dotes disponibles
  const asiSlots = [];
  for (const e of entries) {
    for (const lv of e.k.asiLevels || []) {
      if (lv <= e.level) asiSlots.push({ key: asiKey(e.k.uid, lv), level: lv, k: e.k });
    }
  }

  // Características: base + especie/trasfondo + mejoras
  const bonus = Object.fromEntries(ABILITIES.map((a) => [a.id, 0]));
  const addBonus = (obj) => { for (const k in obj || {}) if (k in bonus) bonus[k] += obj[k]; };
  addBonus(species?.abilityBonus);
  addBonus(sub?.abilityBonus);
  const choice = species?.abilityChoice;
  if (choice) for (const a of (c.choiceBonus || []).slice(0, choice.count)) if (a in bonus && !(choice.exclude || []).includes(a)) bonus[a] += choice.amount;
  if (bg?.abilityOptions?.length) {
    if (c.bgMode === 'oneOneOne') for (const a of bg.abilityOptions) bonus[a] += 1;
    else {
      if (c.bgPlus2 && bg.abilityOptions.includes(c.bgPlus2)) bonus[c.bgPlus2] += 2;
      if (c.bgPlus1 && bg.abilityOptions.includes(c.bgPlus1) && c.bgPlus1 !== c.bgPlus2) bonus[c.bgPlus1] += 1;
    }
  }
  const asiFeats = [];
  const asiBonus = Object.fromEntries(ABILITIES.map((a) => [a.id, 0]));
  for (const slot of asiSlots) {
    const s = c.asi?.[slot.key];
    if (!s) continue;
    if (s.mode === 'asi2' && s.a in asiBonus) asiBonus[s.a] += 2;
    if (s.mode === 'asi11') { if (s.a in asiBonus) asiBonus[s.a] += 1; if (s.b in asiBonus && s.b !== s.a) asiBonus[s.b] += 1; }
    if (s.mode === 'feat' && s.feat?.trim()) asiFeats.push({ name: s.feat.trim(), k: slot.k, level: slot.level });
  }
  const abilities = {};
  for (const a of ABILITIES) {
    const base = Number(c.scores[a.id]) || 10;
    const total = Math.min(20, base + bonus[a.id] + asiBonus[a.id]);
    abilities[a.id] = { base, bonus: bonus[a.id], asi: asiBonus[a.id], total, mod: mod(total) };
  }

  // Requisitos de multiclase (13): solo avisos
  const warnings = [];
  if (entries.length > 1) {
    for (const e of entries) {
      const pr = e.k.prereq;
      if (!pr?.abilities?.length) continue;
      const ok = (a) => abilities[a].total >= 13;
      if (!(pr.mode === 'any' ? pr.abilities.some(ok) : pr.abilities.every(ok))) warnings.push({ k: e.k, abilities: pr.abilities, mode: pr.mode });
    }
  }

  // Competencias
  const granted = new Map(); // skillId -> origen
  const grant = (list, from) => { for (const s of list || []) if (!granted.has(s)) granted.set(s, from); };
  grant(bg?.skills, 'background');
  grant(species?.skills, 'species');
  grant(sub?.skills, 'species');

  // Grupos de habilidades a elegir además de las de la clase inicial
  const skillGroups = [];
  if (species?.skillChoice) skillGroups.push({ id: 'species', count: species.skillChoice.count, from: skillsFrom(species.skillChoice.from), origin: 'species' });
  for (const e of entries.slice(1)) {
    const n = e.k.multi?.skills || 0;
    if (n) skillGroups.push({ id: `mc:${e.k.uid}`, count: n, from: skillsFrom(e.k.multi.skillsFrom || e.k.skillChoices?.from), origin: 'class', k: e.k });
  }

  const profSkills = new Set(granted.keys());
  for (const s of c.classSkills || []) profSkills.add(s);
  for (const g of skillGroups) for (const s of (c.extra?.[g.id] || []).slice(0, g.count)) profSkills.add(s);

  const skills = SKILLS.map((s) => ({
    ...s,
    proficient: profSkills.has(s.id),
    value: abilities[s.ability].mod + (profSkills.has(s.id) ? prof : 0),
  }));
  const saves = ABILITIES.map((a) => {
    const proficient = !!klass?.saves?.includes(a.id);
    return { id: a.id, proficient, value: abilities[a.id].mod + (proficient ? prof : 0) };
  });

  // Puntos de golpe (media fija por nivel) y dados de golpe
  const conMod = abilities.con.mod;
  const hpBonusPerLevel = (species?.hpPerLevel || 0) + (sub?.hpPerLevel || 0);
  let hp = 0;
  const hitDice = {};
  entries.forEach((e, i) => {
    const hd = Number(e.k.hitDie) || 8;
    hitDice[hd] = (hitDice[hd] || 0) + e.level;
    if (i === 0) hp += hd + conMod + (e.level - 1) * (Math.floor(hd / 2) + 1 + conMod);
    else hp += e.level * (Math.floor(hd / 2) + 1 + conMod);
  });
  hp = entries.length ? Math.max(totalLevel, hp + hpBonusPerLevel * totalLevel) : 0;
  const hitDiceText = Object.keys(hitDice).map(Number).sort((x, y) => y - x).map((d) => `${hitDice[d]}d${d}`).join(' + ');

  // Clase de armadura
  const dex = abilities.dex.mod;
  const armor = ARMOR.find((a) => a.id === c.armorId) || ARMOR[0];
  let ac;
  if (armor.id === 'none') {
    const unarmored = entries.filter((e) => e.k.unarmored).map((e) => abilities[e.k.unarmored].mod);
    ac = 10 + dex + (unarmored.length ? Math.max(...unarmored) : 0);
  } else {
    ac = armor.base + (armor.dexCap === null ? dex : Math.min(dex, armor.dexCap));
  }
  if (c.shield) ac += 2;

  // Conjuros por clase
  const spellEntries = entries.filter((e) => e.k.spellcasting && e.level >= (e.k.spellcasting.minLevel || 1));
  const spells = spellEntries.map((e) => {
    const sc = e.k.spellcasting;
    const m = abilities[sc.ability].mod;
    const lv = e.level;
    const cantrips = sc.cantripsByLevel ? sc.cantripsByLevel[lv - 1] : sc.cantrips || 0;
    let count = null; let kind = null;
    if (sc.preparedByLevel) { count = sc.preparedByLevel[lv - 1]; kind = 'prepared'; }
    else if (sc.knownByLevel) { count = sc.knownByLevel[lv - 1]; kind = 'known'; }
    else if (sc.prep) { count = Math.max(1, abilities[sc.prep.ability].mod + Math.floor(lv * (sc.prep.mul ?? 1))); kind = 'prepared'; }
    return {
      k: e.k, level: lv, ability: sc.ability, dc: 8 + prof + m, attack: prof + m, cantrips, count, kind,
      spellbook: sc.spellbook ? 6 + 2 * (lv - 1) : null, pact: sc.type === 'pact',
    };
  });

  // Espacios de conjuro (multiclase: se suman los niveles de lanzador; el pacto va aparte)
  const sharedCasters = spellEntries.filter((e) => e.k.spellcasting.type !== 'pact');
  let casterLevel = 0;
  if (sharedCasters.length === 1 && sharedCasters[0].k.spellcasting.type === 'half') {
    casterLevel = Math.ceil(sharedCasters[0].level / 2);
  } else {
    for (const e of sharedCasters) {
      const type = e.k.spellcasting.type || 'full';
      if (type === 'full') casterLevel += e.level;
      else if (type === 'half') casterLevel += c.edition === '2014' ? Math.floor(e.level / 2) : Math.ceil(e.level / 2);
      else if (type === 'third') casterLevel += Math.floor(e.level / 3);
    }
  }
  const slots = casterLevel > 0 ? SLOT_TABLE[Math.min(MAX_LEVEL, casterLevel) - 1] : [];
  const warlock = spellEntries.find((e) => e.k.spellcasting.type === 'pact');
  const pact = warlock ? PACT_TABLE[warlock.level - 1] : null;

  // Rasgos (de clase y subclase hasta el nivel alcanzado) y competencias
  const features = [];
  const pushAll = (list, from, upTo) => {
    for (const ft of list || []) if ((ft.level ?? 1) <= upTo) features.push({ ...ft, desc: ft.desc ?? descFor(ft.name, c.edition), from });
  };
  pushAll(species?.traits, species, 99);
  pushAll(sub?.traits, species, 99);
  for (const e of entries) {
    pushAll(e.k.features, e.k, e.level);
    if (e.subclass) pushAll(e.subclass.features, e.subclass, e.level);
  }
  if (bg?.feature) features.push({ ...bg.feature, from: bg });
  for (const f of asiFeats) features.push({ name: f.name, level: f.level, from: f.k, isFeat: true });

  const multiAdd = (key) => entries.slice(1).flatMap((e) => e.k.multi?.[key] || []);
  const extraLanguages = (species?.extraLanguages || 0) + (sub?.extraLanguages || 0) + (bg?.extraLanguages || 0);
  const skillChoice = skillGroups.find((g) => g.id === 'species') || null;

  return {
    species, sub, klass, bg, entries, abilities, level: totalLevel, prof, skills, saves, granted, skillGroups, skillChoice,
    asiSlots, warnings, hitDie: Number(klass?.hitDie) || 8, hitDiceText, hp, ac, armor, initiative: dex,
    speed: sub?.speed ?? species?.speed ?? 30,
    passivePerception: 10 + skills.find((s) => s.id === 'perception').value,
    spells, slots, pact, casterLevel, features, extraLanguages,
    languages: species?.languages || [],
    armorProf: [...(klass?.armor || []), ...multiAdd('armor')],
    weaponProf: [...(klass?.weapons || []), ...multiAdd('weapons'), ...(species?.proficiencies || [])],
    toolProf: [...(klass?.tools || []), ...multiAdd('tools'), ...(bg?.tools || [])],
  };
}
