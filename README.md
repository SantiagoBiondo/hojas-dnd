# Hojas DnD

Creador de hojas de personaje de D&D (5e 2014 y 2024) que corre 100 % en el navegador, sin servidor.

- Eliges edición, idioma (es/en) y qué manuales se permiten.
- Asistente: especie, clase, trasfondo, características, habilidades y detalles.
- Hoja A4 imprimible (botón *Imprimir / Guardar PDF*).
- Manuales propios: se cargan como JSON (hay una plantilla descargable en la pantalla de inicio).
- Los datos viajan en tu navegador (`localStorage`); no se sube nada.

## Desarrollo

```powershell
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/ (sitio estático listo para publicar)
```

## Estructura

- `src/data/` — SRD 5.1 y 5.2 (CC-BY-4.0) en formato de manual (`srd51.js`, `srd52.js`).
- `src/packs.js` — validación y registro de manuales (incluidos + propios).
- `src/rules.js` — cálculo de modificadores, CA, PG, salvaciones, conjuros…
- `src/main.js` — interfaz y asistente. `src/i18n.js` — textos es/en.

- Niveles 1 a 20, multiclase (con aviso del requisito de 13), subclases, mejoras de característica/dotes,
  espacios de conjuro de multiclase y magia de pacto aparte.
- Para armar un manual propio con niveles y subclases, descargá la plantilla en la pantalla de inicio:
  cada rasgo lleva `level`, cada clase puede traer `subclasses`, `asiLevels`, `spellcasting`, `multi` y `prereq`.

## Datos

- Tablas de 2024 tomadas de las reglas básicas 2024 (D&D Beyond); las de 2014 del SRD 5.1. Revisalas contra tu libro.
- Los rasgos de nivel 2 en adelante muestran solo el nombre y el nivel (la descripción está en el manual).
- Los puntos de golpe usan el valor medio por nivel.

## Pendiente

- Importar manuales desde PDF (con pantalla de revisión). Los PDFs de prueba van en `pdf-pruebas/` (ignorada por git).
- Cargar manuales por URL (JSON / Open5e) y enlaces compartibles.
- Listas de conjuros por clase, objetos y armas.

## Licencia del contenido

Contenido del SRD 5.1 y SRD 5.2 © Wizards of the Coast LLC, bajo Creative Commons Attribution 4.0 (CC-BY-4.0). Proyecto no oficial.
No se incluyen ni se publican manuales con copyright.
