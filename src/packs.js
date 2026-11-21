// Manuales (packs): registro, validación y carga de manuales propios.
import { ABILITIES, SKILLS } from './data/common.js';
import { BASE_PACKS } from './data/index.js';

const TYPES = ['species', 'classes', 'backgrounds'];
const ABILITY_IDS = ABILITIES.map((a) => a.id);
const SKILL_IDS = SKILLS.map((s) => s.id);

/** Devuelve la lista de errores (vacía si el manual es válido). */
export function validatePack(p) {
  const errs = [];
  if (!p || typeof p !== 'object' || Array.isArray(p)) return ['formato'];
  if (!/^[a-z0-9_-]{2,40}$/i.test(p.id || '')) errs.push('id');
  if (!['2014', '2024'].includes(String(p.edition))) errs.push('edition (2014 | 2024)');
  if (!p.name) errs.push('name');
  for (const type of TYPES) {
    if (p[type] === undefined) continue;
    if (!Array.isArray(p[type])) { errs.push(`${type} (lista)`); continue; }
    p[type].forEach((it, i) => {
      const where = `${type}[${i}]`;
      if (!it || typeof it !== 'object') return errs.push(where);
      if (!/^[a-z0-9_-]{1,40}$/i.test(it.id || '')) errs.push(`${where}.id`);
      if (!it.name) errs.push(`${where}.name`);
      if (type === 'classes' && ![6, 8, 10, 12].includes(Number(it.hitDie))) errs.push(`${where}.hitDie`);
      for (const k of Object.keys(it.abilityBonus || {})) if (!ABILITY_IDS.includes(k)) errs.push(`${where}.abilityBonus.${k}`);
      for (const s of it.skills || []) if (!SKILL_IDS.includes(s)) errs.push(`${where}.skills.${s}`);
    });
  }
  return errs.slice(0, 6);
}

/** Todos los manuales disponibles: incluidos + propios. */
export function allPacks(customPacks) {
  return [...BASE_PACKS, ...customPacks];
}

/** Construye el registro de opciones a partir de los manuales elegidos. */
export function buildRegistry(packs, packIds) {
  const reg = { species: [], classes: [], backgrounds: [], byUid: new Map() };
  for (const pack of packs) {
    if (!packIds.includes(pack.id)) continue;
    for (const type of TYPES) {
      for (const it of pack[type] || []) {
        const item = { ...it, uid: `${pack.id}:${it.id}`, source: pack.short || pack.name, packId: pack.id, edition: String(pack.edition) };
        reg[type].push(item);
        reg.byUid.set(item.uid, item);
      }
    }
  }
  reg.get = (uid) => reg.byUid.get(uid) || null;
  return reg;
}

/** Plantilla descargable para que cada usuario arme su propio manual. */
export const PACK_TEMPLATE = {
  id: 'mi-manual',
  short: 'Mi manual',
  name: 'Mi manual de ejemplo',
  description: 'Descripción opcional',
  edition: '2014',
  species: [
    {
      id: 'ejemplo', name: 'Especie de ejemplo', size: 'Mediano', speed: 30,
      abilityBonus: { str: 1 }, languages: ['Común'],
      traits: [{ name: 'Rasgo de ejemplo', desc: 'Qué hace este rasgo.' }],
    },
  ],
  classes: [
    {
      id: 'ejemplo', name: 'Clase de ejemplo', hitDie: 8, saves: ['str', 'con'],
      skillChoices: { count: 2, from: ['athletics', 'perception', 'survival'] },
      armor: ['Armadura ligera'], weapons: ['Armas sencillas'], tools: [],
      // level: nivel en que se obtiene el rasgo (si falta, es 1)
      features: [
        { name: 'Rasgo de nivel 1', desc: 'Descripción.' },
        { name: 'Rasgo de nivel 2', level: 2, desc: 'Descripción.' },
      ],
      subclassLevel: 3,
      subclasses: [{ id: 'ejemplo', name: 'Subclase de ejemplo', level: 3, features: [{ name: 'Rasgo de subclase', level: 3 }] }],
      asiLevels: [4, 8, 12, 16, 19], // niveles con mejora de característica o dote
      // Opcional. type: 'full' | 'half' | 'third' | 'pact'. Tablas de 20 números (nivel 1 a 20).
      // Usá preparedByLevel o knownByLevel, o prep: { ability, mul } para "mod + nivel × mul".
      // spellcasting: { ability: 'int', type: 'full', cantripsByLevel: [...], preparedByLevel: [...] },
      // Opcional: competencias al tomar la clase como multiclase y requisito de 13 en característica.
      multi: { armor: ['Armadura ligera'], skills: 1 },
      prereq: { mode: 'all', abilities: ['str'] },
      equipment: 'Equipo inicial sugerido',
    },
  ],
  backgrounds: [
    {
      id: 'ejemplo', name: 'Trasfondo de ejemplo', skills: ['insight', 'history'],
      tools: [], feature: { name: 'Rasgo del trasfondo', desc: 'Descripción.' },
      equipment: 'Equipo del trasfondo',
    },
  ],
};
