// SRD 5.1 (edición 2014). Contenido © Wizards of the Coast, licencia CC-BY-4.0.
// Descripciones resumidas/parafraseadas para la hoja de personaje.
import { L, f } from './common.js';
import { enrichClasses } from './progression.js';

const ALL = { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 };
const COMMON = L('Común', 'Common');

const species = [
  {
    id: 'dwarf', name: L('Enano', 'Dwarf'), size: L('Mediano', 'Medium'), speed: 25,
    abilityBonus: { con: 2 }, languages: [COMMON, L('Enano', 'Dwarvish')],
    proficiencies: [L('Hacha de batalla, hacha de mano, martillo ligero, martillo de guerra', 'Battleaxe, handaxe, light hammer, warhammer'), L('Herramientas de herrero, cervecero o albañil (a elegir)', "Smith's, brewer's or mason's tools (choose one)")],
    traits: [
      f(['Visión en la oscuridad', 'Darkvision'], ['Ves en la penumbra a 60 pies como luz tenue y en la oscuridad como penumbra.', 'You see in dim light within 60 ft as bright light, and in darkness as dim light.']),
      f(['Resistencia enana', 'Dwarven Resilience'], ['Ventaja en salvaciones contra veneno y resistencia al daño de veneno.', 'Advantage on saves against poison and resistance to poison damage.']),
      f(['Afinidad con la piedra', 'Stonecunning'], ['Tu bonificador de competencia se duplica en Historia sobre el origen de trabajos en piedra.', 'Double your proficiency bonus on History checks about the origin of stonework.']),
    ],
    subraces: [
      { id: 'hill', name: L('Enano de las colinas', 'Hill Dwarf'), abilityBonus: { wis: 1 }, hpPerLevel: 1,
        traits: [f(['Dureza enana', 'Dwarven Toughness'], ['+1 punto de golpe máximo por nivel.', 'Your hit point maximum increases by 1 per level.'])] },
    ],
  },
  {
    id: 'elf', name: L('Elfo', 'Elf'), size: L('Mediano', 'Medium'), speed: 30,
    abilityBonus: { dex: 2 }, languages: [COMMON, L('Élfico', 'Elvish')], skills: ['perception'],
    traits: [
      f(['Visión en la oscuridad', 'Darkvision'], ['Ves en la penumbra a 60 pies como luz tenue y en la oscuridad como penumbra.', 'You see in dim light within 60 ft as bright light, and in darkness as dim light.']),
      f(['Sentidos agudos', 'Keen Senses'], ['Competencia en Percepción.', 'Proficiency in Perception.']),
      f(['Ascendencia feérica', 'Fey Ancestry'], ['Ventaja contra ser hechizado; no te pueden dormir con magia.', "Advantage against being charmed; magic can't put you to sleep."]),
      f(['Trance', 'Trance'], ['Meditas 4 horas en lugar de dormir 8.', 'You meditate 4 hours instead of sleeping 8.']),
    ],
    subraces: [
      { id: 'high', name: L('Alto elfo', 'High Elf'), abilityBonus: { int: 1 }, extraLanguages: 1,
        traits: [
          f(['Entrenamiento con armas élficas', 'Elf Weapon Training'], ['Competencia con espada larga, espada corta, arco corto y arco largo.', 'Proficiency with longsword, shortsword, shortbow and longbow.']),
          f(['Truco', 'Cantrip'], ['Conoces un truco de la lista de mago (Inteligencia).', 'You know one wizard cantrip (Intelligence).']),
        ] },
    ],
  },
  {
    id: 'halfling', name: L('Mediano', 'Halfling'), size: L('Pequeño', 'Small'), speed: 25,
    abilityBonus: { dex: 2 }, languages: [COMMON, L('Mediano', 'Halfling')],
    traits: [
      f(['Suertudo', 'Lucky'], ['Si sacas un 1 natural en una tirada de d20, puedes volver a tirar.', 'When you roll a natural 1 on a d20, you can reroll it.']),
      f(['Valiente', 'Brave'], ['Ventaja en salvaciones contra miedo.', 'Advantage on saves against being frightened.']),
      f(['Agilidad mediana', 'Halfling Nimbleness'], ['Puedes moverte por el espacio de criaturas más grandes.', 'You can move through the space of larger creatures.']),
    ],
    subraces: [
      { id: 'lightfoot', name: L('Mediano piesligeros', 'Lightfoot Halfling'), abilityBonus: { cha: 1 },
        traits: [f(['Sigilo natural', 'Naturally Stealthy'], ['Puedes esconderte tras una criatura al menos un tamaño mayor.', 'You can hide behind a creature at least one size larger.'])] },
    ],
  },
  {
    id: 'human', name: L('Humano', 'Human'), size: L('Mediano', 'Medium'), speed: 30,
    abilityBonus: { ...ALL }, languages: [COMMON], extraLanguages: 1,
    traits: [f(['Versátil', 'Versatile'], ['+1 a todas las características y un idioma adicional.', '+1 to all ability scores and one extra language.'])],
  },
  {
    id: 'dragonborn', name: L('Dracónido', 'Dragonborn'), size: L('Mediano', 'Medium'), speed: 30,
    abilityBonus: { str: 2, cha: 1 }, languages: [COMMON, L('Dracónico', 'Draconic')],
    traits: [
      f(['Linaje dracónico', 'Draconic Ancestry'], ['Elige un tipo de dragón: determina el daño del aliento y tu resistencia.', 'Choose a dragon type: it sets your breath weapon damage and resistance.']),
      f(['Arma de aliento', 'Breath Weapon'], ['Acción: exhalas energía (2d6 a nivel 1). Salvación CD 8 + CON + competencia. Una vez por descanso.', 'Action: exhale energy (2d6 at level 1). Save DC 8 + CON + proficiency. Once per rest.']),
      f(['Resistencia al daño', 'Damage Resistance'], ['Resistencia al tipo de daño de tu linaje.', 'Resistance to your ancestry damage type.']),
    ],
  },
  {
    id: 'gnome', name: L('Gnomo', 'Gnome'), size: L('Pequeño', 'Small'), speed: 25,
    abilityBonus: { int: 2 }, languages: [COMMON, L('Gnomo', 'Gnomish')],
    traits: [
      f(['Visión en la oscuridad', 'Darkvision'], ['Ves en la penumbra a 60 pies como luz tenue y en la oscuridad como penumbra.', 'You see in dim light within 60 ft as bright light, and in darkness as dim light.']),
      f(['Astucia gnoma', 'Gnome Cunning'], ['Ventaja en salvaciones de INT, SAB y CAR contra magia.', 'Advantage on INT, WIS and CHA saves against magic.']),
    ],
    subraces: [
      { id: 'rock', name: L('Gnomo de las rocas', 'Rock Gnome'), abilityBonus: { con: 1 },
        traits: [
          f(['Conocimiento de artífice', "Artificer's Lore"], ['Doble competencia en Historia sobre objetos mágicos, alquímicos o tecnológicos.', 'Double proficiency on History checks about magic, alchemical or technological items.']),
          f(['Ingeniero', 'Tinker'], ['Competencia con herramientas de artesano (manitas). Puedes fabricar pequeños ingenios.', "Proficiency with tinker's tools. You can build tiny clockwork devices."]),
        ] },
    ],
  },
  {
    id: 'halfelf', name: L('Semielfo', 'Half-Elf'), size: L('Mediano', 'Medium'), speed: 30,
    abilityBonus: { cha: 2 }, abilityChoice: { count: 2, amount: 1, exclude: ['cha'] },
    languages: [COMMON, L('Élfico', 'Elvish')], extraLanguages: 1, skillChoice: { count: 2 },
    traits: [
      f(['Visión en la oscuridad', 'Darkvision'], ['Ves en la penumbra a 60 pies como luz tenue y en la oscuridad como penumbra.', 'You see in dim light within 60 ft as bright light, and in darkness as dim light.']),
      f(['Ascendencia feérica', 'Fey Ancestry'], ['Ventaja contra ser hechizado; no te pueden dormir con magia.', "Advantage against being charmed; magic can't put you to sleep."]),
      f(['Versatilidad de habilidades', 'Skill Versatility'], ['Competencia en dos habilidades a tu elección.', 'Proficiency in two skills of your choice.']),
    ],
  },
  {
    id: 'halforc', name: L('Semiorco', 'Half-Orc'), size: L('Mediano', 'Medium'), speed: 30,
    abilityBonus: { str: 2, con: 1 }, languages: [COMMON, L('Orco', 'Orc')], skills: ['intimidation'],
    traits: [
      f(['Visión en la oscuridad', 'Darkvision'], ['Ves en la penumbra a 60 pies como luz tenue y en la oscuridad como penumbra.', 'You see in dim light within 60 ft as bright light, and in darkness as dim light.']),
      f(['Amenazador', 'Menacing'], ['Competencia en Intimidación.', 'Proficiency in Intimidation.']),
      f(['Aguante incansable', 'Relentless Endurance'], ['Al caer a 0 PG, quedas a 1 PG en su lugar (1 vez por descanso largo).', 'When reduced to 0 HP you drop to 1 HP instead (once per long rest).']),
      f(['Ataques salvajes', 'Savage Attacks'], ['En un crítico con arma cuerpo a cuerpo, tiras un dado de daño extra.', 'On a melee weapon critical hit, roll one extra damage die.']),
    ],
  },
  {
    id: 'tiefling', name: L('Tiflin', 'Tiefling'), size: L('Mediano', 'Medium'), speed: 30,
    abilityBonus: { int: 1, cha: 2 }, languages: [COMMON, L('Infernal', 'Infernal')],
    traits: [
      f(['Visión en la oscuridad', 'Darkvision'], ['Ves en la penumbra a 60 pies como luz tenue y en la oscuridad como penumbra.', 'You see in dim light within 60 ft as bright light, and in darkness as dim light.']),
      f(['Resistencia infernal', 'Hellish Resistance'], ['Resistencia al daño de fuego.', 'Resistance to fire damage.']),
      f(['Legado infernal', 'Infernal Legacy'], ['Conoces el truco taumaturgia; más conjuros a niveles superiores (CAR).', 'You know the thaumaturgy cantrip; more spells at higher levels (CHA).']),
    ],
  },
];

const SKILL_ANY = 'any';

const classes = [
  {
    id: 'barbarian', name: L('Bárbaro', 'Barbarian'), hitDie: 12, saves: ['str', 'con'],
    skillChoices: { count: 2, from: ['animalHandling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'] },
    armor: [L('Armadura ligera y media', 'Light and medium armor'), L('Escudos', 'Shields')],
    weapons: [L('Armas sencillas y marciales', 'Simple and martial weapons')], tools: [], unarmored: 'con',
    features: [
      f(['Furia', 'Rage'], ['Acción adicional: ventaja en pruebas y salvaciones de FUE, +2 al daño cuerpo a cuerpo con FUE y resistencia al daño contundente, cortante y perforante. 2 usos por descanso largo.', 'Bonus action: advantage on STR checks and saves, +2 melee damage with STR and resistance to bludgeoning, piercing and slashing. 2 uses per long rest.']),
      f(['Defensa sin armadura', 'Unarmored Defense'], ['Sin armadura, CA = 10 + DES + CON.', 'Without armor, AC = 10 + DEX + CON.']),
    ],
    equipment: L('Hacha a dos manos (o arma marcial cuerpo a cuerpo) · dos hachas de mano (o arma sencilla) · paquete de explorador y cuatro jabalinas.', 'Greataxe (or any martial melee weapon) · two handaxes (or any simple weapon) · explorer\'s pack and four javelins.'),
  },
  {
    id: 'bard', name: L('Bardo', 'Bard'), hitDie: 8, saves: ['dex', 'cha'],
    skillChoices: { count: 3, from: SKILL_ANY },
    armor: [L('Armadura ligera', 'Light armor')],
    weapons: [L('Armas sencillas, ballesta de mano, espada larga, estoque, espada corta', 'Simple weapons, hand crossbow, longsword, rapier, shortsword')],
    tools: [L('Tres instrumentos musicales', 'Three musical instruments')],
    spellcasting: { ability: 'cha', slots: 2, cantrips: 2, known: 4 },
    features: [
      f(['Lanzamiento de conjuros', 'Spellcasting'], ['Característica: Carisma. 2 trucos y 4 conjuros conocidos, 2 espacios de nivel 1.', 'Ability: Charisma. 2 cantrips and 4 spells known, two 1st-level slots.']),
      f(['Inspiración de bardo', 'Bardic Inspiration'], ['Acción adicional: otorga un d6 a un aliado a 60 pies. Usos = mod. CAR por descanso largo.', 'Bonus action: give an ally within 60 ft a d6. Uses = CHA mod per long rest.']),
    ],
    equipment: L('Estoque, espada larga o arma sencilla · paquete de diplomático o de artista · laúd o instrumento · armadura de cuero y daga.', 'Rapier, longsword or simple weapon · diplomat\'s or entertainer\'s pack · lute or instrument · leather armor and dagger.'),
  },
  {
    id: 'cleric', name: L('Clérigo', 'Cleric'), hitDie: 8, saves: ['wis', 'cha'],
    skillChoices: { count: 2, from: ['history', 'insight', 'medicine', 'persuasion', 'religion'] },
    armor: [L('Armadura ligera y media', 'Light and medium armor'), L('Escudos', 'Shields')],
    weapons: [L('Armas sencillas', 'Simple weapons')], tools: [],
    spellcasting: { ability: 'wis', slots: 2, cantrips: 3, prepared: true },
    features: [
      f(['Lanzamiento de conjuros', 'Spellcasting'], ['Característica: Sabiduría. 3 trucos; preparas SAB + nivel conjuros. 2 espacios de nivel 1.', 'Ability: Wisdom. 3 cantrips; prepare WIS + level spells. Two 1st-level slots.']),
      f(['Dominio divino', 'Divine Domain'], ['Elige un dominio (p. ej. Vida: armadura pesada y Discípulo de la vida).', 'Choose a domain (e.g. Life: heavy armor and Disciple of Life).']),
    ],
    equipment: L('Maza o martillo de guerra · escamas, cuero o cota de malla · ballesta ligera o arma sencilla · paquete de sacerdote o explorador · escudo y símbolo sagrado.', 'Mace or warhammer · scale mail, leather or chain mail · light crossbow or simple weapon · priest\'s or explorer\'s pack · shield and holy symbol.'),
  },
  {
    id: 'druid', name: L('Druida', 'Druid'), hitDie: 8, saves: ['int', 'wis'],
    skillChoices: { count: 2, from: ['arcana', 'animalHandling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'] },
    armor: [L('Armadura ligera y media (no metálica)', 'Light and medium armor (nonmetal)'), L('Escudos (no metálicos)', 'Shields (nonmetal)')],
    weapons: [L('Garrotes, dagas, dardos, jabalinas, mazas, bastones, cimitarras, hoces, hondas, lanzas', 'Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, sickles, slings, spears')],
    tools: [L('Herramientas de herborista', 'Herbalism kit')],
    spellcasting: { ability: 'wis', slots: 2, cantrips: 2, prepared: true },
    features: [
      f(['Druídico', 'Druidic'], ['Conoces el idioma secreto de los druidas.', 'You know the secret language of druids.']),
      f(['Lanzamiento de conjuros', 'Spellcasting'], ['Característica: Sabiduría. 2 trucos; preparas SAB + nivel conjuros. 2 espacios de nivel 1.', 'Ability: Wisdom. 2 cantrips; prepare WIS + level spells. Two 1st-level slots.']),
    ],
    equipment: L('Escudo de madera o arma sencilla · cimitarra o arma sencilla cuerpo a cuerpo · armadura de cuero, paquete de explorador y foco druídico.', 'Wooden shield or simple weapon · scimitar or simple melee weapon · leather armor, explorer\'s pack and druidic focus.'),
  },
  {
    id: 'fighter', name: L('Guerrero', 'Fighter'), hitDie: 10, saves: ['str', 'con'],
    skillChoices: { count: 2, from: ['acrobatics', 'animalHandling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'] },
    armor: [L('Todas las armaduras', 'All armor'), L('Escudos', 'Shields')],
    weapons: [L('Armas sencillas y marciales', 'Simple and martial weapons')], tools: [],
    features: [
      f(['Estilo de combate', 'Fighting Style'], ['Elige un estilo (Arquería, Defensa, Duelo, Armas grandes, Protección o Dos armas).', 'Choose a style (Archery, Defense, Dueling, Great Weapon, Protection or Two-Weapon).']),
      f(['Tomar aliento', 'Second Wind'], ['Acción adicional: recuperas 1d10 + nivel PG. 1 uso por descanso corto o largo.', 'Bonus action: regain 1d10 + level HP. 1 use per short or long rest.']),
    ],
    equipment: L('Cota de malla o cuero + arco largo y 20 flechas · arma marcial y escudo o dos armas marciales · ballesta ligera o dos hachas de mano · paquete de mazmorrero o explorador.', 'Chain mail or leather + longbow and 20 arrows · martial weapon and shield or two martial weapons · light crossbow or two handaxes · dungeoneer\'s or explorer\'s pack.'),
  },
  {
    id: 'monk', name: L('Monje', 'Monk'), hitDie: 8, saves: ['str', 'dex'],
    skillChoices: { count: 2, from: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'] },
    armor: [], weapons: [L('Armas sencillas y espadas cortas', 'Simple weapons and shortswords')],
    tools: [L('Una herramienta de artesano o un instrumento', "One artisan's tool or musical instrument")], unarmored: 'wis',
    features: [
      f(['Defensa sin armadura', 'Unarmored Defense'], ['Sin armadura ni escudo, CA = 10 + DES + SAB.', 'Without armor or shield, AC = 10 + DEX + WIS.']),
      f(['Artes marciales', 'Martial Arts'], ['Ataques sin armas con DES, daño d4 y un ataque desarmado como acción adicional.', 'Use DEX for unarmed strikes, d4 damage, plus a bonus-action unarmed strike.']),
    ],
    equipment: L('Espada corta o arma sencilla · paquete de mazmorrero o explorador · 10 dardos.', 'Shortsword or simple weapon · dungeoneer\'s or explorer\'s pack · 10 darts.'),
  },
  {
    id: 'paladin', name: L('Paladín', 'Paladin'), hitDie: 10, saves: ['wis', 'cha'],
    skillChoices: { count: 2, from: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'] },
    armor: [L('Todas las armaduras', 'All armor'), L('Escudos', 'Shields')],
    weapons: [L('Armas sencillas y marciales', 'Simple and martial weapons')], tools: [],
    features: [
      f(['Sentido divino', 'Divine Sense'], ['Detectas celestiales, infernales y no muertos a 60 pies. 1 + mod. CAR usos por descanso largo.', 'Detect celestials, fiends and undead within 60 ft. 1 + CHA mod uses per long rest.']),
      f(['Imposición de manos', 'Lay on Hands'], ['Reserva de curación = 5 × nivel PG.', 'Healing pool = 5 × level HP.']),
    ],
    equipment: L('Arma marcial y escudo o dos armas marciales · cinco jabalinas o arma sencilla · paquete de sacerdote o explorador · cota de malla y símbolo sagrado.', 'Martial weapon and shield or two martial weapons · five javelins or simple weapon · priest\'s or explorer\'s pack · chain mail and holy symbol.'),
  },
  {
    id: 'ranger', name: L('Explorador', 'Ranger'), hitDie: 10, saves: ['str', 'dex'],
    skillChoices: { count: 3, from: ['animalHandling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'] },
    armor: [L('Armadura ligera y media', 'Light and medium armor'), L('Escudos', 'Shields')],
    weapons: [L('Armas sencillas y marciales', 'Simple and martial weapons')], tools: [],
    features: [
      f(['Enemigo predilecto', 'Favored Enemy'], ['Elige un tipo de enemigo: ventaja para rastrearlo y recordar información sobre él.', 'Choose an enemy type: advantage to track it and recall information about it.']),
      f(['Explorador natural', 'Natural Explorer'], ['Elige un terreno predilecto con ventajas de viaje y exploración.', 'Choose a favored terrain with travel and exploration benefits.']),
    ],
    equipment: L('Cota de escamas o cuero · dos espadas cortas o dos armas sencillas · paquete de mazmorrero o explorador · arco largo y carcaj con 20 flechas.', 'Scale mail or leather · two shortswords or two simple weapons · dungeoneer\'s or explorer\'s pack · longbow and quiver with 20 arrows.'),
  },
  {
    id: 'rogue', name: L('Pícaro', 'Rogue'), hitDie: 8, saves: ['dex', 'int'],
    skillChoices: { count: 4, from: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleightOfHand', 'stealth'] },
    armor: [L('Armadura ligera', 'Light armor')],
    weapons: [L('Armas sencillas, ballesta de mano, espada larga, estoque, espada corta', 'Simple weapons, hand crossbow, longsword, rapier, shortsword')],
    tools: [L('Herramientas de ladrón', "Thieves' tools")],
    features: [
      f(['Pericia', 'Expertise'], ['Elige dos competencias (o una + herramientas de ladrón): doble bonificador de competencia.', "Choose two proficiencies (or one + thieves' tools): double proficiency bonus."]),
      f(['Ataque furtivo', 'Sneak Attack'], ['+1d6 de daño una vez por turno con ventaja o aliado adyacente al objetivo.', '+1d6 damage once per turn with advantage or an ally adjacent to the target.']),
      f(['Jerga de ladrones', "Thieves' Cant"], ['Lenguaje secreto de gestos y códigos.', 'Secret language of signs and codes.']),
    ],
    equipment: L('Estoque o espada corta · arco corto y carcaj o espada corta · paquete de ladrón, mazmorrero o explorador · armadura de cuero, dos dagas y herramientas de ladrón.', 'Rapier or shortsword · shortbow and quiver or shortsword · burglar\'s, dungeoneer\'s or explorer\'s pack · leather armor, two daggers and thieves\' tools.'),
  },
  {
    id: 'sorcerer', name: L('Hechicero', 'Sorcerer'), hitDie: 6, saves: ['con', 'cha'],
    skillChoices: { count: 2, from: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'] },
    armor: [], weapons: [L('Dagas, dardos, hondas, bastones, ballestas ligeras', 'Daggers, darts, slings, quarterstaffs, light crossbows')], tools: [],
    spellcasting: { ability: 'cha', slots: 2, cantrips: 4, known: 2 },
    features: [
      f(['Lanzamiento de conjuros', 'Spellcasting'], ['Característica: Carisma. 4 trucos y 2 conjuros conocidos, 2 espacios de nivel 1.', 'Ability: Charisma. 4 cantrips and 2 spells known, two 1st-level slots.']),
      f(['Origen hechicero', 'Sorcerous Origin'], ['Elige un origen (p. ej. Linaje dracónico: PG +1 por nivel y CA 13 + DES sin armadura).', 'Choose an origin (e.g. Draconic Bloodline: +1 HP per level and AC 13 + DEX unarmored).']),
    ],
    equipment: L('Ballesta ligera o arma sencilla · bolsa de componentes o foco arcano · paquete de mazmorrero o explorador · dos dagas.', 'Light crossbow or simple weapon · component pouch or arcane focus · dungeoneer\'s or explorer\'s pack · two daggers.'),
  },
  {
    id: 'warlock', name: L('Brujo', 'Warlock'), hitDie: 8, saves: ['wis', 'cha'],
    skillChoices: { count: 2, from: ['arcana', 'deception', 'history', 'intimidation', 'investigation', 'nature', 'religion'] },
    armor: [L('Armadura ligera', 'Light armor')], weapons: [L('Armas sencillas', 'Simple weapons')], tools: [],
    spellcasting: { ability: 'cha', slots: 1, cantrips: 2, known: 2, pact: true },
    features: [
      f(['Patrón sobrenatural', 'Otherworldly Patron'], ['Elige un patrón (Archifata, Infernal o Gran Antiguo).', 'Choose a patron (Archfey, Fiend or Great Old One).']),
      f(['Magia de pacto', 'Pact Magic'], ['Característica: Carisma. 2 trucos y 2 conjuros conocidos, 1 espacio que se recupera en descanso corto.', 'Ability: Charisma. 2 cantrips and 2 spells known, 1 slot that recovers on a short rest.']),
    ],
    equipment: L('Ballesta ligera o arma sencilla · bolsa de componentes o foco arcano · paquete de erudito o mazmorrero · armadura de cuero, arma sencilla y dos dagas.', 'Light crossbow or simple weapon · component pouch or arcane focus · scholar\'s or dungeoneer\'s pack · leather armor, simple weapon and two daggers.'),
  },
  {
    id: 'wizard', name: L('Mago', 'Wizard'), hitDie: 6, saves: ['int', 'wis'],
    skillChoices: { count: 2, from: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'] },
    armor: [], weapons: [L('Dagas, dardos, hondas, bastones, ballestas ligeras', 'Daggers, darts, slings, quarterstaffs, light crossbows')], tools: [],
    spellcasting: { ability: 'int', slots: 2, cantrips: 3, prepared: true, spellbook: 6 },
    features: [
      f(['Lanzamiento de conjuros', 'Spellcasting'], ['Característica: Inteligencia. 3 trucos, libro con 6 conjuros; preparas INT + nivel. 2 espacios de nivel 1.', 'Ability: Intelligence. 3 cantrips, spellbook with 6 spells; prepare INT + level. Two 1st-level slots.']),
      f(['Recuperación arcana', 'Arcane Recovery'], ['Una vez al día, tras un descanso corto, recuperas espacios de conjuro (suma de niveles ≤ la mitad de tu nivel).', 'Once per day after a short rest, recover spell slots (combined level ≤ half your level).']),
    ],
    equipment: L('Bastón o daga · bolsa de componentes o foco arcano · paquete de erudito o explorador · libro de conjuros.', 'Quarterstaff or dagger · component pouch or arcane focus · scholar\'s or explorer\'s pack · spellbook.'),
  },
];

const backgrounds = [
  {
    id: 'acolyte', name: L('Acólito', 'Acolyte'), skills: ['insight', 'religion'], extraLanguages: 2, tools: [],
    feature: f(['Refugio de los fieles', 'Shelter of the Faithful'], ['Tú y tus compañeros podéis recibir curación y cuidados en templos de tu fe, y tienes contactos en un templo concreto.', 'You and your companions can receive free healing and care at temples of your faith, and you have ties to a specific temple.']),
    equipment: L('Símbolo sagrado · libro de oraciones · 5 varillas de incienso · vestiduras · ropa común · bolsa con 15 po.', 'Holy symbol · prayer book · 5 sticks of incense · vestments · common clothes · pouch with 15 gp.'),
  },
];

export default {
  id: 'srd51',
  short: 'SRD 5.1',
  name: L('SRD 5.1 (reglas 2014)', 'SRD 5.1 (2014 rules)'),
  description: L('Documento de referencia de reglas básicas, licencia CC-BY-4.0.', 'Basic rules reference document, CC-BY-4.0 license.'),
  edition: '2014',
  base: true,
  species, classes: enrichClasses(classes, '2014'), backgrounds,
};
