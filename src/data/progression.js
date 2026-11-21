// Progresión nivel 1-20 de las clases del SRD: rasgos por nivel, subclase, conjuros y multiclase.
// Formato compacto: [nivel, 'español', 'english']. Los rasgos de nivel 1 ya están en srd51.js / srd52.js.
// Fuente 2024: reglas básicas 2024 (D&D Beyond). Fuente 2014: SRD 5.1.
import { L } from './common.js';

// ---------------------------------------------------------------- tablas de conjuros
// Espacios por nivel de lanzador (1-20) para los niveles de conjuro 1-9.
export const SLOT_TABLE = [
  [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1],
];
// Magia de pacto del brujo por nivel de clase: [cantidad de espacios, nivel de los espacios].
export const PACT_TABLE = [
  [1, 1], [2, 1], [2, 2], [2, 2], [2, 3], [2, 3], [2, 4], [2, 4], [2, 5], [2, 5],
  [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [4, 5], [4, 5], [4, 5], [4, 5],
];

const cant = (b) => Array.from({ length: 20 }, (_, i) => (i < 3 ? b : i < 9 ? b + 1 : b + 2));
const PREP_24_FULL = [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22];
const PREP_24_HALF = [2, 3, 4, 5, 6, 6, 7, 7, 9, 9, 10, 10, 11, 11, 12, 12, 14, 14, 15, 15];
const PREP_24_SORC = [2, 4, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22];
const KNOWN_WARLOCK = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15];

const SPELL_14 = {
  bard: { type: 'full', ability: 'cha', cantripsByLevel: cant(2), knownByLevel: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22] },
  cleric: { type: 'full', ability: 'wis', cantripsByLevel: cant(3), prep: { ability: 'wis', mul: 1 } },
  druid: { type: 'full', ability: 'wis', cantripsByLevel: cant(2), prep: { ability: 'wis', mul: 1 } },
  paladin: { type: 'half', ability: 'cha', minLevel: 2, prep: { ability: 'cha', mul: 0.5 } },
  ranger: { type: 'half', ability: 'wis', minLevel: 2, knownByLevel: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11] },
  sorcerer: { type: 'full', ability: 'cha', cantripsByLevel: cant(4), knownByLevel: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15] },
  warlock: { type: 'pact', ability: 'cha', cantripsByLevel: cant(2), knownByLevel: KNOWN_WARLOCK },
  wizard: { type: 'full', ability: 'int', cantripsByLevel: cant(3), prep: { ability: 'int', mul: 1 }, spellbook: true },
};
const SPELL_24 = {
  bard: { type: 'full', ability: 'cha', cantripsByLevel: cant(2), preparedByLevel: PREP_24_FULL },
  cleric: { type: 'full', ability: 'wis', cantripsByLevel: cant(3), preparedByLevel: PREP_24_FULL },
  druid: { type: 'full', ability: 'wis', cantripsByLevel: cant(2), preparedByLevel: PREP_24_FULL },
  paladin: { type: 'half', ability: 'cha', preparedByLevel: PREP_24_HALF },
  ranger: { type: 'half', ability: 'wis', preparedByLevel: PREP_24_HALF },
  sorcerer: { type: 'full', ability: 'cha', cantripsByLevel: cant(4), preparedByLevel: PREP_24_SORC },
  warlock: { type: 'pact', ability: 'cha', cantripsByLevel: cant(2), preparedByLevel: KNOWN_WARLOCK },
  wizard: { type: 'full', ability: 'int', cantripsByLevel: cant(3), preparedByLevel: [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 18, 19, 21, 22, 23, 24, 25], spellbook: true },
};

// ---------------------------------------------------------------- multiclase
const A = {
  light: L('Armadura ligera', 'Light armor'), medium: L('Armadura media', 'Medium armor'), shields: L('Escudos', 'Shields'),
  simple: L('Armas sencillas', 'Simple weapons'), martial: L('Armas marciales', 'Martial weapons'),
};
const MULTI_14 = {
  barbarian: { armor: [A.shields], weapons: [A.simple, A.martial] },
  bard: { armor: [A.light], tools: [L('Un instrumento musical', 'One musical instrument')], skills: 1 },
  cleric: { armor: [A.light, A.medium, A.shields] },
  druid: { armor: [A.light, A.medium, A.shields] },
  fighter: { armor: [A.light, A.medium, A.shields], weapons: [A.simple, A.martial] },
  monk: { weapons: [A.simple, L('Espadas cortas', 'Shortswords')] },
  paladin: { armor: [A.light, A.medium, A.shields], weapons: [A.simple, A.martial] },
  ranger: { armor: [A.light, A.medium, A.shields], weapons: [A.simple, A.martial], skills: 1 },
  rogue: { armor: [A.light], tools: [L('Herramientas de ladrón', "Thieves' tools")], skills: 1 },
  sorcerer: {}, warlock: { armor: [A.light], weapons: [A.simple] }, wizard: {},
};
const MULTI_24 = {
  ...MULTI_14,
  barbarian: { armor: [A.shields], weapons: [A.martial] },
  druid: { armor: [A.light, A.shields] },
  fighter: { armor: [A.light, A.medium, A.shields], weapons: [A.martial] },
  monk: {},
  paladin: { armor: [A.light, A.medium, A.shields], weapons: [A.martial] },
  ranger: { armor: [A.light, A.medium, A.shields], weapons: [A.martial], skills: 1 },
  warlock: { armor: [A.light] },
};
// Requisito para entrar o salir hacia esta clase: 13 en la(s) característica(s).
const PREREQ = {
  barbarian: { mode: 'all', abilities: ['str'] }, bard: { mode: 'all', abilities: ['cha'] },
  cleric: { mode: 'all', abilities: ['wis'] }, druid: { mode: 'all', abilities: ['wis'] },
  fighter: { mode: 'any', abilities: ['str', 'dex'] }, monk: { mode: 'all', abilities: ['dex', 'wis'] },
  paladin: { mode: 'all', abilities: ['str', 'cha'] }, ranger: { mode: 'all', abilities: ['dex', 'wis'] },
  rogue: { mode: 'all', abilities: ['dex'] }, sorcerer: { mode: 'all', abilities: ['cha'] },
  warlock: { mode: 'all', abilities: ['cha'] }, wizard: { mode: 'all', abilities: ['int'] },
};
// Niveles con mejora de característica / dote (el 19 es mejora en 2014 y Don épico en 2024).
const ASI = {
  _: [4, 8, 12, 16, 19],
  fighter: [4, 6, 8, 12, 14, 16, 19],
  rogue: [4, 8, 10, 12, 16, 19],
};

// ---------------------------------------------------------------- rasgos por nivel (2014, SRD 5.1)
// f: rasgos de clase desde el nivel 2. sub: subclase del SRD { lvl: nivel de elección, f: rasgos }.
const P14 = {
  barbarian: {
    f: [[2, 'Ataque temerario', 'Reckless Attack'], [2, 'Sentido del peligro', 'Danger Sense'], [3, 'Senda primigenia', 'Primal Path'], [5, 'Ataque adicional', 'Extra Attack'], [5, 'Movimiento rápido', 'Fast Movement'], [7, 'Instinto feral', 'Feral Instinct'], [9, 'Crítico brutal (1 dado)', 'Brutal Critical (1 die)'], [11, 'Furia implacable', 'Relentless Rage'], [13, 'Crítico brutal (2 dados)', 'Brutal Critical (2 dice)'], [15, 'Furia persistente', 'Persistent Rage'], [17, 'Crítico brutal (3 dados)', 'Brutal Critical (3 dice)'], [18, 'Poder indomable', 'Indomitable Might'], [20, 'Campeón primigenio', 'Primal Champion']],
    sub: { id: 'berserker', es: 'Senda del Berserker', en: 'Path of the Berserker', lvl: 3, f: [[3, 'Frenesí', 'Frenzy'], [6, 'Furia irracional', 'Mindless Rage'], [10, 'Presencia intimidante', 'Intimidating Presence'], [14, 'Represalia', 'Retaliation']] },
  },
  bard: {
    f: [[2, 'Aprendiz de todo', 'Jack of All Trades'], [2, 'Canción de descanso', 'Song of Rest'], [3, 'Colegio de bardos', 'Bard College'], [3, 'Pericia', 'Expertise'], [5, 'Fuente de inspiración', 'Font of Inspiration'], [6, 'Contraencantamiento', 'Countercharm'], [10, 'Secretos mágicos', 'Magical Secrets'], [10, 'Pericia (2)', 'Expertise (2)'], [20, 'Inspiración superior', 'Superior Inspiration']],
    sub: { id: 'lore', es: 'Colegio del Conocimiento', en: 'College of Lore', lvl: 3, f: [[3, 'Competencias adicionales', 'Bonus Proficiencies'], [3, 'Palabras hirientes', 'Cutting Words'], [6, 'Secretos mágicos adicionales', 'Additional Magical Secrets'], [14, 'Habilidad sin igual', 'Peerless Skill']] },
  },
  cleric: {
    f: [[2, 'Canalizar divinidad', 'Channel Divinity'], [5, 'Destruir no muertos', 'Destroy Undead'], [10, 'Intervención divina', 'Divine Intervention']],
    sub: { id: 'life', es: 'Dominio de la Vida', en: 'Life Domain', lvl: 1, f: [[1, 'Competencia adicional (armadura pesada)', 'Bonus Proficiency (heavy armor)'], [1, 'Discípulo de la vida', 'Disciple of Life'], [2, 'Canalizar divinidad: Preservar la vida', 'Channel Divinity: Preserve Life'], [6, 'Sanador bendecido', 'Blessed Healer'], [8, 'Golpe divino', 'Divine Strike'], [17, 'Sanación suprema', 'Supreme Healing']] },
  },
  druid: {
    f: [[2, 'Forma salvaje', 'Wild Shape'], [2, 'Círculo druídico', 'Druid Circle'], [18, 'Cuerpo atemporal', 'Timeless Body'], [18, 'Conjuros de bestia', 'Beast Spells'], [20, 'Archidruida', 'Archdruid']],
    sub: { id: 'land', es: 'Círculo de la Tierra', en: 'Circle of the Land', lvl: 2, f: [[2, 'Truco adicional', 'Bonus Cantrip'], [2, 'Recuperación natural', 'Natural Recovery'], [3, 'Conjuros del círculo', 'Circle Spells'], [6, 'Paso por la tierra', "Land's Stride"], [10, 'Resguardo de la naturaleza', "Nature's Ward"], [14, 'Santuario de la naturaleza', "Nature's Sanctuary"]] },
  },
  fighter: {
    f: [[2, 'Oleada de acción', 'Action Surge'], [3, 'Arquetipo marcial', 'Martial Archetype'], [5, 'Ataque adicional', 'Extra Attack'], [9, 'Indomable', 'Indomitable'], [11, 'Ataque adicional (2)', 'Extra Attack (2)'], [20, 'Ataque adicional (3)', 'Extra Attack (3)']],
    sub: { id: 'champion', es: 'Campeón', en: 'Champion', lvl: 3, f: [[3, 'Crítico mejorado', 'Improved Critical'], [7, 'Atleta notable', 'Remarkable Athlete'], [10, 'Estilo de combate adicional', 'Additional Fighting Style'], [15, 'Crítico superior', 'Superior Critical'], [18, 'Superviviente', 'Survivor']] },
  },
  monk: {
    f: [[2, 'Ki', 'Ki'], [2, 'Movimiento sin armadura', 'Unarmored Movement'], [3, 'Tradición monástica', 'Monastic Tradition'], [3, 'Desviar proyectiles', 'Deflect Missiles'], [4, 'Caída lenta', 'Slow Fall'], [5, 'Ataque adicional', 'Extra Attack'], [5, 'Golpe aturdidor', 'Stunning Strike'], [6, 'Golpes potenciados con ki', 'Ki-Empowered Strikes'], [7, 'Evasión', 'Evasion'], [7, 'Quietud mental', 'Stillness of Mind'], [10, 'Pureza corporal', 'Purity of Body'], [13, 'Lengua del sol y la luna', 'Tongue of the Sun and Moon'], [14, 'Alma de diamante', 'Diamond Soul'], [15, 'Cuerpo atemporal', 'Timeless Body'], [18, 'Cuerpo vacío', 'Empty Body'], [20, 'Yo perfecto', 'Perfect Self']],
    sub: { id: 'openhand', es: 'Camino de la Mano Abierta', en: 'Way of the Open Hand', lvl: 3, f: [[3, 'Técnica de la mano abierta', 'Open Hand Technique'], [6, 'Integridad corporal', 'Wholeness of Body'], [11, 'Tranquilidad', 'Tranquility'], [17, 'Palma vibrante', 'Quivering Palm']] },
  },
  paladin: {
    f: [[2, 'Estilo de combate', 'Fighting Style'], [2, 'Castigo divino', 'Divine Smite'], [3, 'Salud divina', 'Divine Health'], [3, 'Juramento sagrado', 'Sacred Oath'], [5, 'Ataque adicional', 'Extra Attack'], [6, 'Aura de protección', 'Aura of Protection'], [10, 'Aura de valor', 'Aura of Courage'], [11, 'Castigo divino mejorado', 'Improved Divine Smite'], [14, 'Toque purificador', 'Cleansing Touch']],
    sub: { id: 'devotion', es: 'Juramento de Devoción', en: 'Oath of Devotion', lvl: 3, f: [[3, 'Conjuros del juramento', 'Oath Spells'], [3, 'Canalizar divinidad: Arma sagrada', 'Channel Divinity: Sacred Weapon'], [7, 'Aura de devoción', 'Aura of Devotion'], [15, 'Pureza de espíritu', 'Purity of Spirit'], [20, 'Nimbo sagrado', 'Holy Nimbus']] },
  },
  ranger: {
    f: [[2, 'Estilo de combate', 'Fighting Style'], [3, 'Arquetipo de explorador', 'Ranger Archetype'], [3, 'Conciencia primigenia', 'Primeval Awareness'], [5, 'Ataque adicional', 'Extra Attack'], [8, 'Paso por la tierra', "Land's Stride"], [10, 'Esconderse a plena vista', 'Hide in Plain Sight'], [14, 'Desvanecerse', 'Vanish'], [18, 'Sentidos feroces', 'Feral Senses'], [20, 'Asesino de enemigos', 'Foe Slayer']],
    sub: { id: 'hunter', es: 'Cazador', en: 'Hunter', lvl: 3, f: [[3, 'Presa del cazador', "Hunter's Prey"], [7, 'Tácticas defensivas', 'Defensive Tactics'], [11, 'Ataque múltiple', 'Multiattack'], [15, 'Defensa superior del cazador', "Superior Hunter's Defense"]] },
  },
  rogue: {
    f: [[2, 'Acción astuta', 'Cunning Action'], [3, 'Arquetipo pícaro', 'Roguish Archetype'], [5, 'Esquiva asombrosa', 'Uncanny Dodge'], [6, 'Pericia (2)', 'Expertise (2)'], [7, 'Evasión', 'Evasion'], [11, 'Talento confiable', 'Reliable Talent'], [14, 'Sentido ciego', 'Blindsense'], [15, 'Mente escurridiza', 'Slippery Mind'], [18, 'Elusivo', 'Elusive'], [20, 'Golpe de suerte', 'Stroke of Luck']],
    sub: { id: 'thief', es: 'Ladrón', en: 'Thief', lvl: 3, f: [[3, 'Manos rápidas', 'Fast Hands'], [3, 'Trabajo en las alturas', 'Second-Story Work'], [9, 'Sigilo supremo', 'Supreme Sneak'], [13, 'Uso de objetos mágicos', 'Use Magic Device'], [17, 'Reflejos del ladrón', "Thief's Reflexes"]] },
  },
  sorcerer: {
    f: [[2, 'Fuente de magia', 'Font of Magic'], [3, 'Metamagia', 'Metamagic'], [10, 'Metamagia (2)', 'Metamagic (2)'], [17, 'Metamagia (3)', 'Metamagic (3)'], [20, 'Restauración hechicera', 'Sorcerous Restoration']],
    sub: { id: 'draconic', es: 'Linaje dracónico', en: 'Draconic Bloodline', lvl: 1, f: [[1, 'Ancestro dracónico', 'Dragon Ancestor'], [1, 'Resiliencia dracónica', 'Draconic Resilience'], [6, 'Afinidad elemental', 'Elemental Affinity'], [14, 'Alas de dragón', 'Dragon Wings'], [18, 'Presencia dracónica', 'Draconic Presence']] },
  },
  warlock: {
    f: [[2, 'Invocaciones sobrenaturales', 'Eldritch Invocations'], [3, 'Don del pacto', 'Pact Boon'], [11, 'Arcano místico (nivel 6)', 'Mystic Arcanum (6th level)'], [13, 'Arcano místico (nivel 7)', 'Mystic Arcanum (7th level)'], [15, 'Arcano místico (nivel 8)', 'Mystic Arcanum (8th level)'], [17, 'Arcano místico (nivel 9)', 'Mystic Arcanum (9th level)'], [20, 'Maestro sobrenatural', 'Eldritch Master']],
    sub: { id: 'fiend', es: 'El Infernal', en: 'The Fiend', lvl: 1, f: [[1, 'Bendición del Oscuro', "Dark One's Blessing"], [1, 'Lista de conjuros ampliada', 'Expanded Spell List'], [6, 'Suerte propia del Oscuro', "Dark One's Own Luck"], [10, 'Resiliencia infernal', 'Fiendish Resilience'], [14, 'Arrojar al infierno', 'Hurl Through Hell']] },
  },
  wizard: {
    f: [[2, 'Tradición arcana', 'Arcane Tradition'], [18, 'Maestría de conjuros', 'Spell Mastery'], [20, 'Conjuros característicos', 'Signature Spells']],
    sub: { id: 'evocation', es: 'Escuela de Evocación', en: 'School of Evocation', lvl: 2, f: [[2, 'Saber de evocación', 'Evocation Savant'], [2, 'Moldear conjuros', 'Sculpt Spells'], [6, 'Truco potente', 'Potent Cantrip'], [10, 'Evocación potenciada', 'Empowered Evocation'], [14, 'Sobrecanalizar', 'Overchannel']] },
  },
};

// ---------------------------------------------------------------- rasgos por nivel (2024, SRD 5.2)
const P24 = {
  barbarian: {
    f: [[2, 'Sentido del peligro', 'Danger Sense'], [2, 'Ataque temerario', 'Reckless Attack'], [3, 'Conocimiento primigenio', 'Primal Knowledge'], [5, 'Ataque adicional', 'Extra Attack'], [5, 'Movimiento rápido', 'Fast Movement'], [7, 'Instinto feral', 'Feral Instinct'], [7, 'Abalanzarse instintivo', 'Instinctive Pounce'], [9, 'Golpe brutal', 'Brutal Strike'], [11, 'Furia implacable', 'Relentless Rage'], [13, 'Golpe brutal mejorado', 'Improved Brutal Strike'], [15, 'Furia persistente', 'Persistent Rage'], [17, 'Golpe brutal mejorado (2)', 'Improved Brutal Strike (2)'], [18, 'Poder indomable', 'Indomitable Might'], [20, 'Campeón primigenio', 'Primal Champion']],
    sub: { id: 'berserker', es: 'Senda del Berserker', en: 'Path of the Berserker', lvl: 3, f: [[3, 'Frenesí', 'Frenzy'], [6, 'Furia irracional', 'Mindless Rage'], [10, 'Represalia', 'Retaliation'], [14, 'Presencia intimidante', 'Intimidating Presence']] },
  },
  bard: {
    f: [[2, 'Pericia', 'Expertise'], [2, 'Aprendiz de todo', 'Jack of All Trades'], [5, 'Fuente de inspiración', 'Font of Inspiration'], [7, 'Contraencantamiento', 'Countercharm'], [9, 'Pericia (2)', 'Expertise (2)'], [10, 'Secretos mágicos', 'Magical Secrets'], [18, 'Inspiración superior', 'Superior Inspiration'], [20, 'Palabras de creación', 'Words of Creation']],
    sub: { id: 'lore', es: 'Colegio del Conocimiento', en: 'College of Lore', lvl: 3, f: [[3, 'Competencias adicionales', 'Bonus Proficiencies'], [3, 'Palabras hirientes', 'Cutting Words'], [6, 'Descubrimientos mágicos', 'Magical Discoveries'], [14, 'Habilidad sin igual', 'Peerless Skill']] },
  },
  cleric: {
    f: [[2, 'Canalizar divinidad', 'Channel Divinity'], [5, 'Abrasar no muertos', 'Sear Undead'], [7, 'Golpes bendecidos', 'Blessed Strikes'], [10, 'Intervención divina', 'Divine Intervention'], [14, 'Golpes bendecidos mejorados', 'Improved Blessed Strikes'], [20, 'Intervención divina superior', 'Greater Divine Intervention']],
    sub: { id: 'life', es: 'Dominio de la Vida', en: 'Life Domain', lvl: 3, f: [[3, 'Discípulo de la vida', 'Disciple of Life'], [3, 'Preservar la vida', 'Preserve Life'], [3, 'Conjuros del dominio de la Vida', 'Life Domain Spells'], [6, 'Sanador bendecido', 'Blessed Healer'], [17, 'Sanación suprema', 'Supreme Healing']] },
  },
  druid: {
    f: [[2, 'Forma salvaje', 'Wild Shape'], [2, 'Compañero salvaje', 'Wild Companion'], [5, 'Resurgimiento salvaje', 'Wild Resurgence'], [7, 'Furia elemental', 'Elemental Fury'], [15, 'Furia elemental mejorada', 'Improved Elemental Fury'], [18, 'Conjuros de bestia', 'Beast Spells'], [20, 'Archidruida', 'Archdruid']],
    sub: { id: 'land', es: 'Círculo de la Tierra', en: 'Circle of the Land', lvl: 3, f: [[3, 'Conjuros del Círculo de la Tierra', 'Circle of the Land Spells'], [3, 'Ayuda de la tierra', "Land's Aid"], [6, 'Recuperación natural', 'Natural Recovery'], [10, 'Resguardo de la naturaleza', "Nature's Ward"], [14, 'Santuario de la naturaleza', "Nature's Sanctuary"]] },
  },
  fighter: {
    f: [[2, 'Oleada de acción', 'Action Surge'], [2, 'Mente táctica', 'Tactical Mind'], [5, 'Ataque adicional', 'Extra Attack'], [5, 'Cambio táctico', 'Tactical Shift'], [9, 'Indomable', 'Indomitable'], [9, 'Maestro táctico', 'Tactical Master'], [11, 'Dos ataques adicionales', 'Two Extra Attacks'], [13, 'Ataques estudiados', 'Studied Attacks'], [20, 'Tres ataques adicionales', 'Three Extra Attacks']],
    sub: { id: 'champion', es: 'Campeón', en: 'Champion', lvl: 3, f: [[3, 'Crítico mejorado', 'Improved Critical'], [3, 'Atleta notable', 'Remarkable Athlete'], [7, 'Estilo de combate adicional', 'Additional Fighting Style'], [10, 'Guerrero heroico', 'Heroic Warrior'], [15, 'Crítico superior', 'Superior Critical'], [18, 'Superviviente', 'Survivor']] },
  },
  monk: {
    f: [[2, 'Enfoque del monje', "Monk's Focus"], [2, 'Movimiento sin armadura', 'Unarmored Movement'], [2, 'Metabolismo asombroso', 'Uncanny Metabolism'], [3, 'Desviar ataques', 'Deflect Attacks'], [4, 'Caída lenta', 'Slow Fall'], [5, 'Ataque adicional', 'Extra Attack'], [5, 'Golpe aturdidor', 'Stunning Strike'], [6, 'Golpes potenciados', 'Empowered Strikes'], [7, 'Evasión', 'Evasion'], [9, 'Movimiento acrobático', 'Acrobatic Movement'], [10, 'Enfoque intensificado', 'Heightened Focus'], [10, 'Autorrestauración', 'Self-Restoration'], [13, 'Desviar energía', 'Deflect Energy'], [14, 'Superviviente disciplinado', 'Disciplined Survivor'], [15, 'Enfoque perfecto', 'Perfect Focus'], [18, 'Defensa superior', 'Superior Defense'], [20, 'Cuerpo y mente', 'Body and Mind']],
    sub: { id: 'openhand', es: 'Guerrero de la Mano Abierta', en: 'Warrior of the Open Hand', lvl: 3, f: [[3, 'Técnica de la mano abierta', 'Open Hand Technique'], [6, 'Integridad corporal', 'Wholeness of Body'], [11, 'Paso veloz', 'Fleet Step'], [17, 'Palma vibrante', 'Quivering Palm']] },
  },
  paladin: {
    f: [[2, 'Estilo de combate', 'Fighting Style'], [2, 'Castigo del paladín', "Paladin's Smite"], [3, 'Canalizar divinidad', 'Channel Divinity'], [5, 'Ataque adicional', 'Extra Attack'], [5, 'Montura fiel', 'Faithful Steed'], [6, 'Aura de protección', 'Aura of Protection'], [9, 'Repeler enemigos', 'Abjure Foes'], [10, 'Aura de valor', 'Aura of Courage'], [11, 'Golpes radiantes', 'Radiant Strikes'], [14, 'Toque restaurador', 'Restoring Touch'], [18, 'Expansión de aura', 'Aura Expansion']],
    sub: { id: 'devotion', es: 'Juramento de Devoción', en: 'Oath of Devotion', lvl: 3, f: [[3, 'Conjuros del Juramento de Devoción', 'Oath of Devotion Spells'], [3, 'Arma sagrada', 'Sacred Weapon'], [7, 'Aura de devoción', 'Aura of Devotion'], [15, 'Castigo de protección', 'Smite of Protection'], [20, 'Nimbo sagrado', 'Holy Nimbus']] },
  },
  ranger: {
    f: [[2, 'Explorador experto', 'Deft Explorer'], [2, 'Estilo de combate', 'Fighting Style'], [5, 'Ataque adicional', 'Extra Attack'], [6, 'Errante', 'Roving'], [9, 'Pericia', 'Expertise'], [10, 'Incansable', 'Tireless'], [13, 'Cazador implacable', 'Relentless Hunter'], [14, 'Velo de la naturaleza', "Nature's Veil"], [17, 'Cazador preciso', 'Precise Hunter'], [18, 'Sentidos feroces', 'Feral Senses'], [20, 'Asesino de enemigos', 'Foe Slayer']],
    sub: { id: 'hunter', es: 'Cazador', en: 'Hunter', lvl: 3, f: [[3, 'Saber del cazador', "Hunter's Lore"], [3, 'Presa del cazador', "Hunter's Prey"], [7, 'Tácticas defensivas', 'Defensive Tactics'], [11, 'Presa superior del cazador', "Superior Hunter's Prey"], [15, 'Defensa superior del cazador', "Superior Hunter's Defense"]] },
  },
  rogue: {
    f: [[2, 'Acción astuta', 'Cunning Action'], [3, 'Puntería firme', 'Steady Aim'], [5, 'Golpe astuto', 'Cunning Strike'], [5, 'Esquiva asombrosa', 'Uncanny Dodge'], [6, 'Pericia (2)', 'Expertise (2)'], [7, 'Evasión', 'Evasion'], [7, 'Talento confiable', 'Reliable Talent'], [11, 'Golpe astuto mejorado', 'Improved Cunning Strike'], [14, 'Golpes pérfidos', 'Devious Strikes'], [15, 'Mente escurridiza', 'Slippery Mind'], [18, 'Elusivo', 'Elusive'], [20, 'Golpe de suerte', 'Stroke of Luck']],
    sub: { id: 'thief', es: 'Ladrón', en: 'Thief', lvl: 3, f: [[3, 'Manos rápidas', 'Fast Hands'], [3, 'Trabajo en las alturas', 'Second-Story Work'], [9, 'Sigilo supremo', 'Supreme Sneak'], [13, 'Uso de objetos mágicos', 'Use Magic Device'], [17, 'Reflejos del ladrón', "Thief's Reflexes"]] },
  },
  sorcerer: {
    f: [[2, 'Fuente de magia', 'Font of Magic'], [2, 'Metamagia', 'Metamagic'], [5, 'Restauración hechicera', 'Sorcerous Restoration'], [7, 'Encarnación hechicera', 'Sorcery Incarnate'], [10, 'Metamagia (2)', 'Metamagic (2)'], [17, 'Metamagia (3)', 'Metamagic (3)'], [20, 'Apoteosis arcana', 'Arcane Apotheosis']],
    sub: { id: 'draconic', es: 'Hechicería dracónica', en: 'Draconic Sorcery', lvl: 3, f: [[3, 'Resiliencia dracónica', 'Draconic Resilience'], [3, 'Conjuros dracónicos', 'Draconic Spells'], [6, 'Afinidad elemental', 'Elemental Affinity'], [14, 'Alas de dragón', 'Dragon Wings'], [18, 'Compañero dragón', 'Dragon Companion']] },
  },
  warlock: {
    f: [[2, 'Astucia mágica', 'Magical Cunning'], [9, 'Contactar con el patrón', 'Contact Patron'], [11, 'Arcano místico (nivel 6)', 'Mystic Arcanum (level 6)'], [13, 'Arcano místico (nivel 7)', 'Mystic Arcanum (level 7)'], [15, 'Arcano místico (nivel 8)', 'Mystic Arcanum (level 8)'], [17, 'Arcano místico (nivel 9)', 'Mystic Arcanum (level 9)'], [20, 'Maestro sobrenatural', 'Eldritch Master']],
    sub: { id: 'fiend', es: 'Patrón Infernal', en: 'Fiend Patron', lvl: 3, f: [[3, 'Bendición del Oscuro', "Dark One's Blessing"], [3, 'Conjuros del Infernal', 'Fiend Spells'], [6, 'Suerte propia del Oscuro', "Dark One's Own Luck"], [10, 'Resiliencia infernal', 'Fiendish Resilience'], [14, 'Arrojar al infierno', 'Hurl Through Hell']] },
  },
  wizard: {
    f: [[2, 'Erudito', 'Scholar'], [5, 'Memorizar conjuro', 'Memorize Spell'], [18, 'Maestría de conjuros', 'Spell Mastery'], [20, 'Conjuros característicos', 'Signature Spells']],
    sub: { id: 'evoker', es: 'Evocador', en: 'Evoker', lvl: 3, f: [[3, 'Saber de evocación', 'Evocation Savant'], [3, 'Truco potente', 'Potent Cantrip'], [6, 'Moldear conjuros', 'Sculpt Spells'], [10, 'Evocación potenciada', 'Empowered Evocation'], [14, 'Sobrecanalizar', 'Overchannel']] },
  },
};

// Rasgos de nivel 1 que en 2014 eran "elige subclase": ahora los cubre el selector de subclase.
const PLACEHOLDERS = new Set(['Divine Domain', 'Sorcerous Origin', 'Otherworldly Patron']);

const toFeature = ([level, es, en]) => ({ level, name: L(es, en) });

/** Completa las clases base con niveles 1-20, subclase, conjuros, multiclase y mejoras. */
export function enrichClasses(classes, edition) {
  const P = edition === '2014' ? P14 : P24;
  const SPELL = edition === '2014' ? SPELL_14 : SPELL_24;
  const MULTI = edition === '2014' ? MULTI_14 : MULTI_24;
  return classes.map((c) => {
    const p = P[c.id];
    if (!p) return c;
    const base = (c.features || []).filter((f) => !PLACEHOLDERS.has(f.name?.en)).map((f) => ({ ...f, level: 1 }));
    const sub = p.sub;
    const { slots, cantrips, known, ...rest } = c; // los números fijos de nivel 1 se sustituyen por tablas
    void slots; void cantrips; void known;
    const sc = SPELL[c.id];
    return {
      ...rest,
      features: [...base, ...p.f.map(toFeature)],
      subclasses: [{ id: sub.id, name: L(sub.es, sub.en), level: sub.lvl, features: sub.f.map(toFeature) }],
      subclassLevel: sub.lvl,
      asiLevels: ASI[c.id] || ASI._,
      multi: MULTI[c.id] || {},
      prereq: PREREQ[c.id],
      ...(sc ? { spellcasting: { ...(c.spellcasting || {}), ...sc } } : {}),
    };
  });
}
