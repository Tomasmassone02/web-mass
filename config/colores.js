/* =====================================================================
   MASS · CATÁLOGO DE COLORES (DECORADOS DE PLACA)
   ---------------------------------------------------------------------
   Cada color es un bloque { ... }. Para sumar uno, copiá un bloque
   entero, pegalo debajo y cambiale los datos.

   id       → nombre interno, sin espacios ni tildes (ej: "roble-claro")
   nombre   → como lo ve el cliente
   familia  → "Lisos" o "Maderas" (podés inventar otras familias)
   hex      → el color en código (buscá "color picker" en Google para sacarlo)
   veta     → true si es madera (se dibuja una veta de muestra en la tarjeta)
   disponible → false para ocultarlo sin borrarlo

   ⚠ Por ahora son colores simulados. Más adelante cada uno va a
     tener su foto real de textura.
   ===================================================================== */

window.MASS = window.MASS || {};

MASS.colores = [
  { id: "blanco",       nombre: "Blanco Nube",   familia: "Lisos",   hex: "#EEECE7", veta: false, disponible: true },
  { id: "marfil",       nombre: "Marfil",        familia: "Lisos",   hex: "#E4DCCB", veta: false, disponible: true },
  { id: "gris-piedra",  nombre: "Gris Piedra",   familia: "Lisos",   hex: "#A9A49B", veta: false, disponible: true },
  { id: "grafito",      nombre: "Grafito",       familia: "Lisos",   hex: "#3A3936", veta: false, disponible: true },
  { id: "terracota",    nombre: "Terracota",     familia: "Lisos",   hex: "#B4593A", veta: false, disponible: true },
  { id: "salvia",       nombre: "Salvia",        familia: "Lisos",   hex: "#8E9783", veta: false, disponible: true },

  { id: "scotch",       nombre: "Scotch",        familia: "Maderas", hex: "#B98A5E", veta: true,  disponible: true },
  { id: "roble-claro",  nombre: "Roble Claro",   familia: "Maderas", hex: "#CDAF86", veta: true,  disponible: true },
  { id: "nogal",        nombre: "Nogal",         familia: "Maderas", hex: "#6E4B33", veta: true,  disponible: true },
  { id: "fresno-gris",  nombre: "Fresno Gris",   familia: "Maderas", hex: "#9C948A", veta: true,  disponible: true },
];
