// SRD 5.2 (edición 2024). Contenido © Wizards of the Coast, licencia CC-BY-4.0.
// Descripciones resumidas/parafraseadas para la hoja de personaje.
// En 2024 las características suben con el trasfondo, no con la especie.
import { L, f } from './common.js';
import { enrichClasses } from './progression.js';

const DARK60 = f(['Visión en la oscuridad', 'Darkvision'], ['Ves en la oscuridad hasta 60 pies.', 'You can see in darkness up to 60 ft.']);
const DARK120 = f(['Visión en la oscuridad', 'Darkvision'], ['Ves en la oscuridad hasta 120 pies.', 'You can see in darkness up to 120 ft.']);

const species = [
  {
    id: 'dragonborn', name: L('Dracónido', 'Dragonborn'), size: L('Mediano', 'Medium'), speed: 30,
    languages: [L('Común', 'Common')],
    traits: [
      f(['Linaje dracónico', 'Draconic Ancestry'], ['Elige un tipo de dragón: define el daño de tu aliento y tu resistencia.', 'Choose a dragon type: it sets your breath weapon damage and resistance.']),
      f(['Arma de aliento', 'Breath Weapon'], ['En lugar de un ataque, exhalas energía en un área de 15 pies (1d10; CD 8 + CON + competencia). Usos = bonif. de competencia por descanso largo.', 'Instead of an attack, exhale energy in a 15-ft area (1d10; DC 8 + CON + proficiency). Uses = proficiency bonus per long rest.']),
      f(['Resistencia al daño', 'Damage Resistance'], ['Resistencia al tipo de daño de tu linaje.', 'Resistance to your ancestry damage type.']),
      DARK60,
    ],
  },
  {
    id: 'dwarf', name: L('Enano', 'Dwarf'), size: L('Mediano', 'Medium'), speed: 30, hpPerLevel: 1,
    languages: [L('Común', 'Common')],
    traits: [
      DARK120,
      f(['Resistencia enana', 'Dwarven Resilience'], ['Resistencia al daño de veneno y ventaja en salvaciones contra estar envenenado.', 'Resistance to poison damage and advantage on saves against being poisoned.']),
      f(['Dureza enana', 'Dwarven Toughness'], ['+1 punto de golpe máximo por nivel.', 'Your hit point maximum increases by 1 per level.']),
      f(['Sentido de la piedra', 'Stonecunning'], ['Sentido sísmico (60 pies) sobre piedra, con acción adicional, un número de veces igual a tu bonif. de competencia.', 'Tremorsense (60 ft) on stone as a bonus action, a number of times equal to your proficiency bonus.']),
    ],
  },
  {
    id: 'elf', name: L('Elfo', 'Elf'), size: L('Mediano', 'Medium'), speed: 30,
    languages: [L('Común', 'Common')], skillChoice: { count: 1, from: ['insight', 'perception', 'survival'] },
    traits: [
      DARK60,
      f(['Sentidos agudos', 'Keen Senses'], ['Competencia en Perspicacia, Percepción o Supervivencia (a elegir).', 'Proficiency in Insight, Perception or Survival (choose one).']),
      f(['Ascendencia feérica', 'Fey Ancestry'], ['Ventaja en salvaciones contra ser hechizado.', 'Advantage on saves against being charmed.']),
      f(['Trance', 'Trance'], ['Un descanso largo te lleva 4 horas de trance consciente.', 'A long rest takes 4 hours of conscious trance.']),
    ],
    subraces: [
      { id: 'drow', name: L('Linaje drow', 'Drow lineage'), traits: [f(['Linaje élfico: drow', 'Elven Lineage: Drow'], ['Visión en la oscuridad 120 pies, luces danzantes; fuego feérico (nv 3), oscuridad (nv 5).', 'Darkvision 120 ft, dancing lights; faerie fire (lvl 3), darkness (lvl 5).'])] },
      { id: 'high', name: L('Linaje alto elfo', 'High Elf lineage'), traits: [f(['Linaje élfico: alto elfo', 'Elven Lineage: High Elf'], ['Truco prestidigitación; detectar magia (nv 3), paso brumoso (nv 5).', 'Prestidigitation cantrip; detect magic (lvl 3), misty step (lvl 5).'])] },
      { id: 'wood', name: L('Linaje elfo de los bosques', 'Wood Elf lineage'), speed: 35, traits: [f(['Linaje élfico: elfo de los bosques', 'Elven Lineage: Wood Elf'], ['Velocidad 35 pies; truco arte druídico; zancada (nv 3), pasar sin rastro (nv 5).', 'Speed 35 ft; druidcraft cantrip; longstrider (lvl 3), pass without trace (lvl 5).'])] },
    ],
  },
  {
    id: 'gnome', name: L('Gnomo', 'Gnome'), size: L('Pequeño', 'Small'), speed: 30,
    languages: [L('Común', 'Common')],
    traits: [
      DARK60,
      f(['Astucia gnoma', 'Gnomish Cunning'], ['Ventaja en salvaciones de INT, SAB y CAR.', 'Advantage on INT, WIS and CHA saving throws.']),
    ],
    subraces: [
      { id: 'forest', name: L('Linaje gnomo del bosque', 'Forest Gnome lineage'), traits: [f(['Linaje gnomo: bosque', 'Gnomish Lineage: Forest'], ['Truco ilusión menor; hablar con animales con un número limitado de usos.', 'Minor illusion cantrip; speak with animals a limited number of times.'])] },
      { id: 'rock', name: L('Linaje gnomo de las rocas', 'Rock Gnome lineage'), traits: [f(['Linaje gnomo: rocas', 'Gnomish Lineage: Rock'], ['Trucos remendar y prestidigitación; puedes crear pequeños ingenios mecánicos.', 'Mending and prestidigitation cantrips; you can build tiny clockwork devices.'])] },
    ],
  },
  {
    id: 'goliath', name: L('Goliat', 'Goliath'), size: L('Mediano', 'Medium'), speed: 35,
    languages: [L('Común', 'Common')],
    traits: [
      f(['Ascendencia gigante', 'Giant Ancestry'], ['Elige un don gigante (frío, fuego, rayo, nubes, colinas o tormenta), usable un número de veces igual a tu bonif. de competencia.', 'Choose a giant boon (cold, fire, lightning, cloud, hill or storm), usable a number of times equal to your proficiency bonus.']),
      f(['Constitución poderosa', 'Powerful Build'], ['Ventaja para terminar una presa y cuentas como un tamaño mayor para cargar.', 'Advantage to end a grapple and you count as one size larger for carrying.']),
    ],
  },
  {
    id: 'halfling', name: L('Mediano', 'Halfling'), size: L('Pequeño', 'Small'), speed: 30,
    languages: [L('Común', 'Common')],
    traits: [
      f(['Valiente', 'Brave'], ['Ventaja en salvaciones contra estar asustado.', 'Advantage on saves against being frightened.']),
      f(['Agilidad mediana', 'Halfling Nimbleness'], ['Puedes moverte por el espacio de criaturas más grandes.', 'You can move through the space of larger creatures.']),
      f(['Suerte', 'Luck'], ['Al sacar un 1 en un d20, vuelves a tirar y usas el nuevo resultado.', 'When you roll a 1 on a d20, reroll and use the new roll.']),
      f(['Sigilo natural', 'Naturally Stealthy'], ['Puedes intentar esconderte tras una criatura al menos un tamaño mayor.', 'You can hide behind a creature at least one size larger.']),
    ],
  },
  {
    id: 'human', name: L('Humano', 'Human'), size: L('Mediano o Pequeño', 'Medium or Small'), speed: 30,
    languages: [L('Común', 'Common')], extraLanguages: 1, skillChoice: { count: 1 },
    traits: [
      f(['Ingenioso', 'Resourceful'], ['Obtienes Inspiración heroica tras cada descanso largo.', 'You gain Heroic Inspiration after each long rest.']),
      f(['Habilidoso', 'Skillful'], ['Competencia en una habilidad a tu elección.', 'Proficiency in one skill of your choice.']),
      f(['Versátil', 'Versatile'], ['Obtienes una dote de origen a tu elección.', 'You gain an Origin feat of your choice.']),
    ],
  },
  {
    id: 'orc', name: L('Orco', 'Orc'), size: L('Mediano', 'Medium'), speed: 30,
    languages: [L('Común', 'Common')],
    traits: [
      f(['Descarga de adrenalina', 'Adrenaline Rush'], ['Esprintas como acción adicional y ganas PG temporales = bonif. de competencia.', 'Dash as a bonus action and gain temporary HP equal to your proficiency bonus.']),
      DARK120,
      f(['Aguante incansable', 'Relentless Endurance'], ['Al caer a 0 PG, quedas a 1 PG en su lugar (1 vez por descanso largo).', 'When reduced to 0 HP you drop to 1 HP instead (once per long rest).']),
    ],
  },
  {
    id: 'tiefling', name: L('Tiflin', 'Tiefling'), size: L('Mediano o Pequeño', 'Medium or Small'), speed: 30,
    languages: [L('Común', 'Common')],
    traits: [
      DARK60,
      f(['Presencia sobrenatural', 'Otherworldly Presence'], ['Conoces el truco taumaturgia.', 'You know the thaumaturgy cantrip.']),
    ],
    subraces: [
      { id: 'abyssal', name: L('Legado abisal', 'Abyssal legacy'), traits: [f(['Legado infernal: abisal', 'Fiendish Legacy: Abyssal'], ['Resistencia a veneno; salpicadura de veneno (truco).', 'Poison resistance; poison spray cantrip.'])] },
      { id: 'chthonic', name: L('Legado ctónico', 'Chthonic legacy'), traits: [f(['Legado infernal: ctónico', 'Fiendish Legacy: Chthonic'], ['Resistencia necrótica; toque helado (truco).', 'Necrotic resistance; chill touch cantrip.'])] },
      { id: 'infernal', name: L('Legado infernal', 'Infernal legacy'), traits: [f(['Legado infernal: infernal', 'Fiendish Legacy: Infernal'], ['Resistencia a fuego; rayo de fuego (truco).', 'Fire resistance; fire bolt cantrip.'])] },
    ],
  },
];

const classes = [
  {
    id: 'barbarian', name: L('Bárbaro', 'Barbarian'), hitDie: 12, saves: ['str', 'con'],
    skillChoices: { count: 2, from: ['animalHandling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'] },
    armor: [L('Ligera, media y escudos', 'Light, medium and shields')], weapons: [L('Sencillas y marciales', 'Simple and martial')], tools: [], unarmored: 'con',
    features: [
      f(['Furia', 'Rage'], ['Acción adicional: ventaja en pruebas y salvaciones de FUE, daño extra (+2) y resistencia contundente, cortante y perforante. 2 usos.', 'Bonus action: advantage on STR checks and saves, extra damage (+2) and bludgeoning, piercing and slashing resistance. 2 uses.']),
      f(['Defensa sin armadura', 'Unarmored Defense'], ['Sin armadura, CA = 10 + DES + CON.', 'Without armor, AC = 10 + DEX + CON.']),
      f(['Maestría con armas', 'Weapon Mastery'], ['Usas las propiedades de maestría de 2 armas.', 'Use the mastery properties of 2 weapons.']),
    ],
    equipment: L('A: hacha a dos manos, 4 hachas de mano, paquete de explorador, 15 po · B: 75 po.', 'A: greataxe, 4 handaxes, explorer\'s pack, 15 gp · B: 75 gp.'),
  },
  {
    id: 'bard', name: L('Bardo', 'Bard'), hitDie: 8, saves: ['dex', 'cha'],
    skillChoices: { count: 3, from: 'any' },
    armor: [L('Ligera', 'Light')], weapons: [L('Sencillas', 'Simple')], tools: [L('Tres instrumentos musicales', 'Three musical instruments')],
    spellcasting: { ability: 'cha', slots: 2, cantrips: 2, known: 4 },
    features: [
      f(['Inspiración de bardo', 'Bardic Inspiration'], ['Acción adicional: otorga un d6 a una criatura a 60 pies. Usos = mod. CAR por descanso largo.', 'Bonus action: give a creature within 60 ft a d6. Uses = CHA mod per long rest.']),
      f(['Lanzamiento de conjuros', 'Spellcasting'], ['Característica: Carisma. 2 trucos, 4 conjuros preparados, 2 espacios de nivel 1.', 'Ability: Charisma. 2 cantrips, 4 prepared spells, two 1st-level slots.']),
    ],
    equipment: L('A: armadura de cuero, 2 dagas, instrumento, paquete de artista, 19 po · B: 90 po.', 'A: leather armor, 2 daggers, instrument, entertainer\'s pack, 19 gp · B: 90 gp.'),
  },
  {
    id: 'cleric', name: L('Clérigo', 'Cleric'), hitDie: 8, saves: ['wis', 'cha'],
    skillChoices: { count: 2, from: ['history', 'insight', 'medicine', 'persuasion', 'religion'] },
    armor: [L('Ligera, media y escudos', 'Light, medium and shields')], weapons: [L('Sencillas', 'Simple')], tools: [],
    spellcasting: { ability: 'wis', slots: 2, cantrips: 3, prepared: true },
    features: [
      f(['Lanzamiento de conjuros', 'Spellcasting'], ['Característica: Sabiduría. 3 trucos, 4 conjuros preparados, 2 espacios de nivel 1.', 'Ability: Wisdom. 3 cantrips, 4 prepared spells, two 1st-level slots.']),
      f(['Orden divina', 'Divine Order'], ['Elige Protector (armas marciales y armadura pesada) o Taumaturgo (un truco extra y bonus a Arcanos/Religión).', 'Choose Protector (martial weapons and heavy armor) or Thaumaturge (extra cantrip and Arcana/Religion bonus).']),
    ],
    equipment: L('A: camisa de malla, escudo, maza, símbolo sagrado, paquete de sacerdote, 7 po · B: 110 po.', 'A: chain shirt, shield, mace, holy symbol, priest\'s pack, 7 gp · B: 110 gp.'),
  },
  {
    id: 'druid', name: L('Druida', 'Druid'), hitDie: 8, saves: ['int', 'wis'],
    skillChoices: { count: 2, from: ['arcana', 'animalHandling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'] },
    armor: [L('Ligera y escudos', 'Light and shields')], weapons: [L('Sencillas', 'Simple')], tools: [L('Herramientas de herborista', 'Herbalism kit')],
    spellcasting: { ability: 'wis', slots: 2, cantrips: 2, prepared: true },
    features: [
      f(['Druídico', 'Druidic'], ['Conoces el idioma secreto de los druidas y siempre tienes preparado hablar con animales.', 'You know the secret druid language and always have speak with animals prepared.']),
      f(['Lanzamiento de conjuros', 'Spellcasting'], ['Característica: Sabiduría. 2 trucos, 4 conjuros preparados, 2 espacios de nivel 1.', 'Ability: Wisdom. 2 cantrips, 4 prepared spells, two 1st-level slots.']),
      f(['Orden primigenia', 'Primal Order'], ['Elige Guardián (armas marciales y armadura media) o Chamán (truco extra y bonus a Arcanos/Naturaleza).', 'Choose Warden (martial weapons and medium armor) or Magician (extra cantrip and Arcana/Nature bonus).']),
    ],
    equipment: L('A: armadura de cuero, escudo, hoz, foco druídico (bastón), paquete de explorador, herramientas de herborista, 9 po · B: 50 po.', 'A: leather armor, shield, sickle, druidic focus (quarterstaff), explorer\'s pack, herbalism kit, 9 gp · B: 50 gp.'),
  },
  {
    id: 'fighter', name: L('Guerrero', 'Fighter'), hitDie: 10, saves: ['str', 'con'],
    skillChoices: { count: 2, from: ['acrobatics', 'animalHandling', 'athletics', 'history', 'insight', 'intimidation', 'persuasion', 'perception', 'survival'] },
    armor: [L('Todas y escudos', 'All and shields')], weapons: [L('Sencillas y marciales', 'Simple and martial')], tools: [],
    features: [
      f(['Estilo de combate', 'Fighting Style'], ['Elige una dote de estilo de combate.', 'Choose a Fighting Style feat.']),
      f(['Tomar aliento', 'Second Wind'], ['Acción adicional: recuperas 1d10 + nivel PG. 2 usos por descanso largo.', 'Bonus action: regain 1d10 + level HP. 2 uses per long rest.']),
      f(['Maestría con armas', 'Weapon Mastery'], ['Usas las propiedades de maestría de 3 armas.', 'Use the mastery properties of 3 weapons.']),
    ],
    equipment: L('A: cota de malla, espada a dos manos, mangual, 8 jabalinas, paquete de mazmorrero, 4 po · B: 155 po.', 'A: chain mail, greatsword, flail, 8 javelins, dungeoneer\'s pack, 4 gp · B: 155 gp.'),
  },
  {
    id: 'monk', name: L('Monje', 'Monk'), hitDie: 8, saves: ['str', 'dex'],
    skillChoices: { count: 2, from: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'] },
    armor: [], weapons: [L('Sencillas y marciales con propiedad Ligera', 'Simple and martial with the Light property')],
    tools: [L('Una herramienta de artesano o un instrumento', "One artisan's tool or musical instrument")], unarmored: 'wis',
    features: [
      f(['Artes marciales', 'Martial Arts'], ['Dado de artes marciales d6; ataque desarmado como acción adicional; DES en lugar de FUE.', 'Martial Arts die d6; bonus-action unarmed strike; use DEX instead of STR.']),
      f(['Defensa sin armadura', 'Unarmored Defense'], ['Sin armadura ni escudo, CA = 10 + DES + SAB.', 'Without armor or shield, AC = 10 + DEX + WIS.']),
    ],
    equipment: L('A: lanza, 5 dagas, herramientas de artesano o instrumento, paquete de explorador, 11 po · B: 50 po.', 'A: spear, 5 daggers, artisan\'s tools or instrument, explorer\'s pack, 11 gp · B: 50 gp.'),
  },
  {
    id: 'paladin', name: L('Paladín', 'Paladin'), hitDie: 10, saves: ['wis', 'cha'],
    skillChoices: { count: 2, from: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'] },
    armor: [L('Todas y escudos', 'All and shields')], weapons: [L('Sencillas y marciales', 'Simple and martial')], tools: [],
    spellcasting: { ability: 'cha', slots: 2, cantrips: 0, prepared: true },
    features: [
      f(['Imposición de manos', 'Lay on Hands'], ['Reserva de curación = 5 × nivel PG.', 'Healing pool = 5 × level HP.']),
      f(['Lanzamiento de conjuros', 'Spellcasting'], ['Característica: Carisma. 2 conjuros preparados, 2 espacios de nivel 1.', 'Ability: Charisma. 2 prepared spells, two 1st-level slots.']),
      f(['Maestría con armas', 'Weapon Mastery'], ['Usas las propiedades de maestría de 2 armas.', 'Use the mastery properties of 2 weapons.']),
    ],
    equipment: L('A: cota de malla, escudo, espada larga, 6 jabalinas, símbolo sagrado, paquete de sacerdote, 9 po · B: 150 po.', 'A: chain mail, shield, longsword, 6 javelins, holy symbol, priest\'s pack, 9 gp · B: 150 gp.'),
  },
  {
    id: 'ranger', name: L('Explorador', 'Ranger'), hitDie: 10, saves: ['str', 'dex'],
    skillChoices: { count: 3, from: ['animalHandling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'] },
    armor: [L('Ligera, media y escudos', 'Light, medium and shields')], weapons: [L('Sencillas y marciales', 'Simple and martial')], tools: [],
    spellcasting: { ability: 'wis', slots: 2, cantrips: 0, prepared: true },
    features: [
      f(['Lanzamiento de conjuros', 'Spellcasting'], ['Característica: Sabiduría. 2 conjuros preparados, 2 espacios de nivel 1.', 'Ability: Wisdom. 2 prepared spells, two 1st-level slots.']),
      f(['Enemigo predilecto', 'Favored Enemy'], ['Marca de cazador preparado siempre; usos gratuitos por descanso largo.', "Hunter's Mark always prepared; free uses per long rest."]),
      f(['Maestría con armas', 'Weapon Mastery'], ['Usas las propiedades de maestría de 2 armas.', 'Use the mastery properties of 2 weapons.']),
    ],
    equipment: L('A: cuero tachonado, cimitarra, espada corta, arco largo, 20 flechas, carcaj, foco druídico, paquete de explorador, 7 po · B: 150 po.', 'A: studded leather, scimitar, shortsword, longbow, 20 arrows, quiver, druidic focus, explorer\'s pack, 7 gp · B: 150 gp.'),
  },
  {
    id: 'rogue', name: L('Pícaro', 'Rogue'), hitDie: 8, saves: ['dex', 'int'],
    skillChoices: { count: 4, from: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'persuasion', 'sleightOfHand', 'stealth'] },
    armor: [L('Ligera', 'Light')], weapons: [L('Sencillas y marciales con propiedad Sutil o Ligera', 'Simple and martial with Finesse or Light')],
    tools: [L('Herramientas de ladrón', "Thieves' tools")],
    features: [
      f(['Pericia', 'Expertise'], ['Doble bonificador de competencia en dos habilidades a tu elección.', 'Double proficiency bonus in two skills of your choice.']),
      f(['Ataque furtivo', 'Sneak Attack'], ['+1d6 de daño una vez por turno con ventaja o aliado adyacente.', '+1d6 damage once per turn with advantage or an adjacent ally.']),
      f(['Jerga de ladrones', "Thieves' Cant"], ['Lenguaje secreto y un idioma adicional.', 'Secret language plus one additional language.']),
      f(['Maestría con armas', 'Weapon Mastery'], ['Usas las propiedades de maestría de 2 armas.', 'Use the mastery properties of 2 weapons.']),
    ],
    equipment: L('A: armadura de cuero, 2 dagas, espada corta, arco corto, 20 flechas, carcaj, herramientas de ladrón, paquete de ladrón, 8 po · B: 100 po.', 'A: leather armor, 2 daggers, shortsword, shortbow, 20 arrows, quiver, thieves\' tools, burglar\'s pack, 8 gp · B: 100 gp.'),
  },
  {
    id: 'sorcerer', name: L('Hechicero', 'Sorcerer'), hitDie: 6, saves: ['con', 'cha'],
    skillChoices: { count: 2, from: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'] },
    armor: [], weapons: [L('Sencillas', 'Simple')], tools: [],
    spellcasting: { ability: 'cha', slots: 2, cantrips: 4, known: 2 },
    features: [
      f(['Lanzamiento de conjuros', 'Spellcasting'], ['Característica: Carisma. 4 trucos, 2 conjuros preparados, 2 espacios de nivel 1.', 'Ability: Charisma. 4 cantrips, 2 prepared spells, two 1st-level slots.']),
      f(['Hechicería innata', 'Innate Sorcery'], ['Acción adicional: durante 1 minuto, +1 a la CD de tus conjuros y ventaja en ataques de conjuro. 2 usos por descanso largo.', 'Bonus action: for 1 minute, +1 to your spell save DC and advantage on spell attacks. 2 uses per long rest.']),
    ],
    equipment: L('A: lanza, 2 dagas, foco arcano (cristal), paquete de mazmorrero, 28 po · B: 50 po.', 'A: spear, 2 daggers, arcane focus (crystal), dungeoneer\'s pack, 28 gp · B: 50 gp.'),
  },
  {
    id: 'warlock', name: L('Brujo', 'Warlock'), hitDie: 8, saves: ['wis', 'cha'],
    skillChoices: { count: 2, from: ['arcana', 'deception', 'history', 'intimidation', 'investigation', 'nature', 'religion'] },
    armor: [L('Ligera', 'Light')], weapons: [L('Sencillas', 'Simple')], tools: [],
    spellcasting: { ability: 'cha', slots: 1, cantrips: 2, known: 2, pact: true },
    features: [
      f(['Invocaciones sobrenaturales', 'Eldritch Invocations'], ['Obtienes una invocación a tu elección.', 'You gain one invocation of your choice.']),
      f(['Magia de pacto', 'Pact Magic'], ['Característica: Carisma. 2 trucos, 2 conjuros preparados, 1 espacio que se recupera en descanso corto.', 'Ability: Charisma. 2 cantrips, 2 prepared spells, 1 slot that recovers on a short rest.']),
    ],
    equipment: L('A: armadura de cuero, hoz, 2 dagas, foco arcano (orbe), libro (saber oculto), paquete de erudito, 15 po · B: 100 po.', 'A: leather armor, sickle, 2 daggers, arcane focus (orb), book (occult lore), scholar\'s pack, 15 gp · B: 100 gp.'),
  },
  {
    id: 'wizard', name: L('Mago', 'Wizard'), hitDie: 6, saves: ['int', 'wis'],
    skillChoices: { count: 2, from: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'nature', 'religion'] },
    armor: [], weapons: [L('Sencillas', 'Simple')], tools: [],
    spellcasting: { ability: 'int', slots: 2, cantrips: 3, prepared: true, spellbook: 6 },
    features: [
      f(['Lanzamiento de conjuros', 'Spellcasting'], ['Característica: Inteligencia. 3 trucos, libro de conjuros con 6, 4 preparados; 2 espacios de nivel 1.', 'Ability: Intelligence. 3 cantrips, spellbook with 6, 4 prepared; two 1st-level slots.']),
      f(['Adepto de rituales', 'Ritual Adept'], ['Lanzas como rituales los conjuros de tu libro que lo permitan.', 'Cast spells from your spellbook as rituals if they have the Ritual tag.']),
      f(['Recuperación arcana', 'Arcane Recovery'], ['Tras un descanso corto recuperas espacios de conjuro (una vez al día).', 'After a short rest, recover spell slots (once per day).']),
    ],
    equipment: L('A: 2 dagas, foco arcano (bastón), túnica, libro de conjuros, paquete de erudito, 5 po · B: 55 po.', 'A: 2 daggers, arcane focus (quarterstaff), robe, spellbook, scholar\'s pack, 5 gp · B: 55 gp.'),
  },
];

const backgrounds = [
  {
    id: 'acolyte', name: L('Acólito', 'Acolyte'), skills: ['insight', 'religion'],
    tools: [L('Suministros de calígrafo', "Calligrapher's supplies")],
    abilityOptions: ['int', 'wis', 'cha'],
    feature: f(['Dote de origen: Iniciado en la magia (clérigo)', 'Origin Feat: Magic Initiate (Cleric)'], ['Dos trucos y un conjuro de nivel 1 de la lista de clérigo.', 'Two cantrips and one 1st-level spell from the Cleric list.']),
    equipment: L('A: suministros de calígrafo, libro (oraciones), símbolo sagrado, pergamino (10 hojas), túnica, 8 po · B: 50 po.', 'A: calligrapher\'s supplies, book (prayers), holy symbol, parchment (10 sheets), robe, 8 gp · B: 50 gp.'),
  },
  {
    id: 'criminal', name: L('Criminal', 'Criminal'), skills: ['sleightOfHand', 'stealth'],
    tools: [L('Herramientas de ladrón', "Thieves' tools")],
    abilityOptions: ['dex', 'con', 'int'],
    feature: f(['Dote de origen: Alerta', 'Origin Feat: Alert'], ['Sumas tu bonif. de competencia a la iniciativa y puedes intercambiarla con un aliado.', 'Add your proficiency bonus to initiative and swap initiative with an ally.']),
    equipment: L('A: 2 dagas, herramientas de ladrón, palanca, 2 bolsas, ropa de viajero, 16 po · B: 50 po.', 'A: 2 daggers, thieves\' tools, crowbar, 2 pouches, traveler\'s clothes, 16 gp · B: 50 gp.'),
  },
  {
    id: 'sage', name: L('Sabio', 'Sage'), skills: ['arcana', 'history'],
    tools: [L('Suministros de calígrafo', "Calligrapher's supplies")],
    abilityOptions: ['con', 'int', 'wis'],
    feature: f(['Dote de origen: Iniciado en la magia (mago)', 'Origin Feat: Magic Initiate (Wizard)'], ['Dos trucos y un conjuro de nivel 1 de la lista de mago.', 'Two cantrips and one 1st-level spell from the Wizard list.']),
    equipment: L('A: bastón, suministros de calígrafo, libro (historia), pergamino (8 hojas), túnica, 8 po · B: 50 po.', 'A: quarterstaff, calligrapher\'s supplies, book (history), parchment (8 sheets), robe, 8 gp · B: 50 gp.'),
  },
  {
    id: 'soldier', name: L('Soldado', 'Soldier'), skills: ['athletics', 'intimidation'],
    tools: [L('Un juego de mesa', 'One gaming set')],
    abilityOptions: ['str', 'dex', 'con'],
    feature: f(['Dote de origen: Atacante salvaje', 'Origin Feat: Savage Attacker'], ['Una vez por turno, tiras dos veces el daño de un arma y usas el resultado que prefieras.', 'Once per turn, roll weapon damage twice and use either result.']),
    equipment: L('A: lanza, arco corto, 20 flechas, juego de mesa, botiquín de sanador, carcaj, ropa de viajero, 14 po · B: 50 po.', 'A: spear, shortbow, 20 arrows, gaming set, healer\'s kit, quiver, traveler\'s clothes, 14 gp · B: 50 gp.'),
  },
];

export default {
  id: 'srd52',
  short: 'SRD 5.2',
  name: L('SRD 5.2 (reglas 2024)', 'SRD 5.2 (2024 rules)'),
  description: L('Documento de referencia de reglas 2024, licencia CC-BY-4.0.', '2024 rules reference document, CC-BY-4.0 license.'),
  edition: '2024',
  base: true,
  species, classes: enrichClasses(classes, '2024'), backgrounds,
};
