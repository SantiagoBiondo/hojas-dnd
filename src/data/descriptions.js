// Tabla de descripciones de rasgos.
//
// Cómo usarla:
//  - La clave es el nombre del rasgo EN INGLÉS, tal como figura en progression.js / srd51.js / srd52.js.
//  - El valor es [descripción en español, descripción en inglés].
//  - Si un rasgo funciona distinto en cada edición, usá la clave 'Nombre|2014' o 'Nombre|2024'
//    (tiene prioridad sobre la clave sin sufijo).
//  - Solo se usa para rasgos que NO traen descripción propia: si el rasgo ya tiene `desc`, esa gana.
//    Esto también sirve para los manuales que cargue el usuario.
//  - Escribí resúmenes con tus propias palabras, no copies el texto del libro.

export const DESCRIPTIONS = {
  // ---- Bárbaro
  'Reckless Attack': ['Ventaja en tus ataques cuerpo a cuerpo con FUE este turno, pero los ataques contra ti tienen ventaja hasta tu próximo turno.', 'Advantage on your STR melee attacks this turn, but attacks against you have advantage until your next turn.'],
  'Danger Sense': ['Ventaja en salvaciones de DES contra efectos que puedas ver, mientras no estés incapacitado.', "Advantage on DEX saves against effects you can see, while you aren't incapacitated."],
  'Fast Movement': ['+10 pies de velocidad mientras no lleves armadura pesada.', '+10 ft speed while not wearing heavy armor.'],
  'Feral Instinct|2014': ['Ventaja en la iniciativa; si te sorprenden, puedes actuar con normalidad si entras en furia.', 'Advantage on initiative; if surprised, you can act normally if you enter your rage.'],
  'Feral Instinct|2024': ['Ventaja en las tiradas de iniciativa.', 'Advantage on initiative rolls.'],
  'Relentless Rage': ['Si caes a 0 PG en furia, puedes superar una salvación de CON para quedar a 1 PG. La CD sube cada vez que lo usas.', 'If you drop to 0 HP while raging, you can make a CON save to drop to 1 HP instead. The DC rises each use.'],
  'Extra Attack': ['Atacas dos veces, en lugar de una, cuando realizas la acción de Atacar.', 'You attack twice, instead of once, when you take the Attack action.'],

  // ---- Bardo
  'Jack of All Trades': ['Sumas la mitad de tu bonificador de competencia (hacia abajo) a las pruebas de característica en las que no seas competente.', "Add half your proficiency bonus (rounded down) to ability checks you aren't proficient in."],
  'Expertise': ['Eliges habilidades en las que ya eres competente: tu bonificador de competencia se duplica en ellas.', 'Choose skills you are proficient in: your proficiency bonus is doubled for them.'],
  'Font of Inspiration': ['Recuperas tus usos de Inspiración de bardo al terminar un descanso corto o largo.', 'You regain your Bardic Inspiration uses when you finish a short or long rest.'],
  'Song of Rest': ['Durante un descanso corto, tú y tus aliados recuperáis dados de golpe extra al gastarlos.', 'During a short rest, you and allies regain extra hit points when spending Hit Dice.'],
  'Magical Secrets': ['Aprendes conjuros de cualquier lista de clase, no solo de la de bardo.', "You learn spells from any class's list, not just the bard list."],
  'Countercharm': ['Acción: tú y los aliados cercanos tenéis ventaja contra ser asustados o hechizados, mientras interpretes.', 'Action: you and nearby allies have advantage against being frightened or charmed while you perform.'],

  // ---- Clérigo / Paladín
  'Channel Divinity': ['Canalizas energía divina para producir efectos de tu clase y subclase. Recuperas usos con descansos.', 'You channel divine energy for effects from your class and subclass. You regain uses with rests.'],
  'Divine Intervention|2014': ['Pides ayuda a tu deidad: si una tirada de d100 es igual o menor a tu nivel de clérigo, interviene.', 'You call on your deity: if a d100 roll is equal to or less than your cleric level, it intervenes.'],
  'Divine Smite': ['Al acertar un ataque cuerpo a cuerpo, gastas un espacio de conjuro para causar daño radiante adicional.', 'When you hit with a melee attack, spend a spell slot to deal extra radiant damage.'],
  'Aura of Protection': ['Tú y tus aliados a 10 pies sumáis tu modificador de CAR (mínimo +1) a todas las salvaciones.', 'You and allies within 10 ft add your CHA modifier (minimum +1) to all saving throws.'],
  'Aura of Courage': ['Tú y tus aliados a 10 pies no podéis ser asustados mientras estés consciente.', "You and allies within 10 ft can't be frightened while you are conscious."],

  // ---- Druida
  'Wild Shape': ['Como acción, te transformas en una bestia que hayas visto, con las limitaciones de tu nivel.', 'As an action, you transform into a beast you have seen, within the limits of your level.'],

  // ---- Guerrero
  'Action Surge': ['Una vez por descanso, realizas una acción adicional en tu turno.', 'Once per rest, you take one additional action on your turn.'],
  'Indomitable': ['Puedes volver a tirar una salvación fallida y debes usar la nueva tirada.', 'You can reroll a failed saving throw and must use the new roll.'],

  // ---- Monje
  'Ki': ['Reserva de puntos de ki (igual a tu nivel de monje) para tus técnicas; se recupera con un descanso corto.', 'A pool of ki points (equal to your monk level) fuels your techniques; it recovers on a short rest.'],
  'Unarmored Movement': ['Sin armadura ni escudo, ganas velocidad adicional que aumenta con el nivel.', 'Without armor or shield, you gain extra speed that increases with level.'],
  'Deflect Missiles': ['Reacción: reduces el daño de un ataque a distancia; si lo reduces a 0, puedes devolver el proyectil.', 'Reaction: reduce the damage of a ranged attack; if reduced to 0 you can throw the missile back.'],
  'Slow Fall': ['Reacción: reduces el daño por caída en 5 × tu nivel de monje.', 'Reaction: reduce fall damage by 5 × your monk level.'],
  'Stunning Strike|2014': ['Gastas 1 punto de ki al acertar un ataque cuerpo a cuerpo: el objetivo supera una salvación de CON o queda aturdido.', 'Spend 1 ki point when you hit with a melee attack: the target must pass a CON save or be stunned.'],
  'Stunning Strike|2024': ['Gastas 1 punto de enfoque al acertar un ataque con arma o desarmado: el objetivo supera una salvación de CON o queda aturdido hasta tu próximo turno.', 'Spend 1 Focus Point when you hit with a weapon or unarmed strike: the target must pass a CON save or be stunned until your next turn.'],
  'Evasion': ['En salvaciones de DES para reducir el daño a la mitad, no recibes daño si la superas y solo la mitad si la fallas.', 'On DEX saves for half damage, you take no damage if you succeed and half if you fail.'],

  // ---- Explorador
  "Land's Stride": ['Moverte por terreno difícil no mágico no te cuesta movimiento extra; ventaja contra plantas que te inmovilicen.', "Moving through nonmagical difficult terrain costs no extra movement; advantage against plants that impede you."],

  // ---- Pícaro
  'Cunning Action': ['Acción adicional en tu turno para Esprintar, Retirarte o Esconderte.', 'Bonus action on your turn to Dash, Disengage or Hide.'],
  'Uncanny Dodge': ['Reacción: reduces a la mitad el daño de un ataque que puedas ver.', 'Reaction: halve the damage of an attack you can see.'],
  'Reliable Talent': ['En pruebas de habilidad en las que seas competente, un resultado de 9 o menos en el d20 cuenta como 10.', 'On ability checks you are proficient in, a d20 roll of 9 or lower counts as 10.'],
  'Slippery Mind|2014': ['Competencia en salvaciones de Sabiduría.', 'Proficiency in Wisdom saving throws.'],
  'Slippery Mind|2024': ['Competencia en salvaciones de Sabiduría y Carisma.', 'Proficiency in Wisdom and Charisma saving throws.'],
  'Elusive': ['Los ataques contra ti no tienen ventaja, salvo que estés incapacitado.', "Attack rolls against you can't have advantage unless you are incapacitated."],
  'Stroke of Luck': ['Si fallas un ataque o una prueba, puedes convertir el resultado en un 20 (una vez por descanso).', 'If you miss an attack or fail a check, you can turn the roll into a 20 (once per rest).'],

  // ---- Hechicero / Brujo / Mago
  'Font of Magic': ['Obtienes puntos de hechicería; puedes convertirlos en espacios de conjuro y al revés.', 'You gain sorcery points; you can convert them into spell slots and back.'],
  'Metamagic': ['Obtienes opciones de metamagia para modificar tus conjuros gastando puntos de hechicería.', 'You gain Metamagic options to modify your spells by spending sorcery points.'],
  'Eldritch Invocations': ['Eliges invocaciones: fragmentos de saber prohibido que te otorgan capacidades mágicas.', 'You choose invocations: fragments of forbidden knowledge that grant magical abilities.'],
  'Pact Boon': ['Eliges un don de tu patrón: Cadena, Hoja o Tomo.', 'You choose a gift from your patron: Chain, Blade or Tome.'],
  'Spell Mastery': ['Eliges un conjuro de nivel 1 y uno de nivel 2 de tu libro: los lanzas a su nivel base sin gastar espacio.', 'Choose a 1st- and a 2nd-level spell from your spellbook: you cast them at their lowest level without a slot.'],
  'Signature Spells': ['Eliges dos conjuros de nivel 3 de tu libro: siempre los tienes preparados y lanzas cada uno una vez por descanso sin gastar espacio.', 'Choose two 3rd-level spells from your spellbook: they are always prepared and each can be cast once per rest without a slot.'],
};

/** Busca la descripción de un rasgo por su nombre en inglés y la edición ('2014' | '2024'). */
export function descFor(name, edition) {
  const key = typeof name === 'string' ? name : name?.en;
  if (!key) return undefined;
  const hit = DESCRIPTIONS[`${key}|${edition}`] ?? DESCRIPTIONS[key];
  return hit ? { es: hit[0], en: hit[1] } : undefined;
}
