// Datos comunes a todas las ediciones: características, habilidades y armaduras.

/** Texto localizado: L('Hola', 'Hello') */
export const L = (es, en) => ({ es, en });

/** Rasgo o dote: f(['Nombre ES','Name EN'], ['Descripción ES','Description EN']) */
export const f = (n, d) => ({ name: L(n[0], n[1]), desc: d ? L(d[0], d[1]) : undefined });

export const ABILITIES = [
  { id: 'str', name: L('Fuerza', 'Strength'), abbr: L('FUE', 'STR') },
  { id: 'dex', name: L('Destreza', 'Dexterity'), abbr: L('DES', 'DEX') },
  { id: 'con', name: L('Constitución', 'Constitution'), abbr: L('CON', 'CON') },
  { id: 'int', name: L('Inteligencia', 'Intelligence'), abbr: L('INT', 'INT') },
  { id: 'wis', name: L('Sabiduría', 'Wisdom'), abbr: L('SAB', 'WIS') },
  { id: 'cha', name: L('Carisma', 'Charisma'), abbr: L('CAR', 'CHA') },
];

export const SKILLS = [
  { id: 'acrobatics', ability: 'dex', name: L('Acrobacias', 'Acrobatics') },
  { id: 'animalHandling', ability: 'wis', name: L('Trato con animales', 'Animal Handling') },
  { id: 'arcana', ability: 'int', name: L('Arcanos', 'Arcana') },
  { id: 'athletics', ability: 'str', name: L('Atletismo', 'Athletics') },
  { id: 'deception', ability: 'cha', name: L('Engaño', 'Deception') },
  { id: 'history', ability: 'int', name: L('Historia', 'History') },
  { id: 'insight', ability: 'wis', name: L('Perspicacia', 'Insight') },
  { id: 'intimidation', ability: 'cha', name: L('Intimidación', 'Intimidation') },
  { id: 'investigation', ability: 'int', name: L('Investigación', 'Investigation') },
  { id: 'medicine', ability: 'wis', name: L('Medicina', 'Medicine') },
  { id: 'nature', ability: 'int', name: L('Naturaleza', 'Nature') },
  { id: 'perception', ability: 'wis', name: L('Percepción', 'Perception') },
  { id: 'performance', ability: 'cha', name: L('Interpretación', 'Performance') },
  { id: 'persuasion', ability: 'cha', name: L('Persuasión', 'Persuasion') },
  { id: 'religion', ability: 'int', name: L('Religión', 'Religion') },
  { id: 'sleightOfHand', ability: 'dex', name: L('Juego de manos', 'Sleight of Hand') },
  { id: 'stealth', ability: 'dex', name: L('Sigilo', 'Stealth') },
  { id: 'survival', ability: 'wis', name: L('Supervivencia', 'Survival') },
];

// dexCap: null = suma toda la Destreza, número = límite máximo (0 = no suma Destreza)
export const ARMOR = [
  { id: 'none', base: 10, dexCap: null, name: L('Sin armadura', 'No armor') },
  { id: 'padded', base: 11, dexCap: null, name: L('Acolchada', 'Padded') },
  { id: 'leather', base: 11, dexCap: null, name: L('Cuero', 'Leather') },
  { id: 'studded', base: 12, dexCap: null, name: L('Cuero tachonado', 'Studded leather') },
  { id: 'hide', base: 12, dexCap: 2, name: L('Pieles', 'Hide') },
  { id: 'chainshirt', base: 13, dexCap: 2, name: L('Camisa de malla', 'Chain shirt') },
  { id: 'scale', base: 14, dexCap: 2, name: L('Armadura de escamas', 'Scale mail') },
  { id: 'breastplate', base: 14, dexCap: 2, name: L('Coraza', 'Breastplate') },
  { id: 'halfplate', base: 15, dexCap: 2, name: L('Semiplacas', 'Half plate') },
  { id: 'ringmail', base: 14, dexCap: 0, name: L('Cota de anillas', 'Ring mail') },
  { id: 'chainmail', base: 16, dexCap: 0, name: L('Cota de malla', 'Chain mail') },
  { id: 'splint', base: 17, dexCap: 0, name: L('Bandas', 'Splint') },
  { id: 'plate', base: 18, dexCap: 0, name: L('Placas', 'Plate') },
];

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
export const POINT_BUY_COST = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const POINT_BUY_BUDGET = 27;
