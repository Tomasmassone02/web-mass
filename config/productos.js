/* =====================================================================
   MASS · CATÁLOGO DE MUEBLES
   ---------------------------------------------------------------------
   Cada mueble es un bloque { ... }. Para sumar uno, copiá un bloque
   entero (desde la llave { hasta la llave }, con la coma) y cambiá
   los datos.

   id           → nombre interno, sin espacios ni tildes. Va en la dirección web.
   nombre       → como lo ve el cliente
   categoria    → "dormitorio", "living", "oficina" o "guardado" (ver categorias abajo)
   descripcion  → texto corto de la tarjeta y de la página del mueble
   precioBase   → precio con las medidas de fábrica (las "def")
   precioPorFrente → cuánto suma o resta cada cajón/puerta de más o de menos
   medidas      → en milímetros. min = mínimo, max = máximo, def = la de fábrica
   columnas / filas → cantidad de cajones o puertas (a lo ancho / a lo alto)
   frente       → "cajon", "puerta" o "abierto" (estantes sin frente)
   frentesPosibles → qué frentes puede elegir el cliente
   base         → "zocalo", "patas" o "colgante"
   basesPosibles → qué bases puede elegir el cliente
   color        → id del color de fábrica (de colores.js)
   tipo         → "modulo" (cajonera, placard, biblioteca…) o "escritorio"

   ⚠ Los precios y medidas actuales son DE EJEMPLO.
   ===================================================================== */

window.MASS = window.MASS || {};

MASS.categorias = [
  { id: "dormitorio", nombre: "Dormitorio" },
  { id: "living",     nombre: "Living" },
  { id: "oficina",    nombre: "Oficina" },
  { id: "guardado",   nombre: "Guardado" },
];

MASS.productos = [
  {
    id: "comoda-seis",
    nombre: "Cómoda Seis",
    categoria: "dormitorio",
    descripcion: "Seis cajones en dos columnas, frentes lisos sin tiradores. Se abre desde el uñero superior.",
    precioBase: 385000,
    precioPorFrente: 32000,
    medidas: {
      ancho: { min: 800,  max: 1600, def: 1200 },
      alto:  { min: 600,  max: 1100, def: 800 },
      prof:  { min: 400,  max: 550,  def: 450 },
    },
    columnas: { min: 1, max: 3, def: 2 },
    filas:    { min: 2, max: 5, def: 3 },
    frente: "cajon",  frentesPosibles: ["cajon"],
    base: "zocalo",   basesPosibles: ["zocalo", "patas"],
    color: "scotch",
    tipo: "modulo",
  },
  {
    id: "mesa-de-luz",
    nombre: "Mesa de Luz Dos",
    categoria: "dormitorio",
    descripcion: "Dos cajones sobre patas finas. Pensada para ir de a pares a los lados de la cama.",
    precioBase: 145000,
    precioPorFrente: 28000,
    medidas: {
      ancho: { min: 350, max: 600, def: 450 },
      alto:  { min: 400, max: 650, def: 520 },
      prof:  { min: 300, max: 450, def: 380 },
    },
    columnas: { min: 1, max: 1, def: 1 },
    filas:    { min: 1, max: 3, def: 2 },
    frente: "cajon",  frentesPosibles: ["cajon", "abierto"],
    base: "patas",    basesPosibles: ["patas", "zocalo", "colgante"],
    color: "roble-claro",
    tipo: "modulo",
  },
  {
    id: "cajonera-alta",
    nombre: "Cajonera Alta",
    categoria: "dormitorio",
    descripcion: "Cinco cajones apilados en poco ancho. Entra en el rincón que sobra del placard.",
    precioBase: 310000,
    precioPorFrente: 30000,
    medidas: {
      ancho: { min: 450, max: 800,  def: 600 },
      alto:  { min: 900, max: 1400, def: 1200 },
      prof:  { min: 400, max: 550,  def: 450 },
    },
    columnas: { min: 1, max: 2, def: 1 },
    filas:    { min: 3, max: 7, def: 5 },
    frente: "cajon",  frentesPosibles: ["cajon"],
    base: "zocalo",   basesPosibles: ["zocalo", "patas"],
    color: "blanco",
    tipo: "modulo",
  },
  {
    id: "rack-tv",
    nombre: "Rack TV Bajo",
    categoria: "living",
    descripcion: "Mueble bajo para la tele con puertas lisas. Lleva pasacables en el fondo.",
    precioBase: 265000,
    precioPorFrente: 26000,
    medidas: {
      ancho: { min: 1200, max: 2400, def: 1800 },
      alto:  { min: 350,  max: 600,  def: 450 },
      prof:  { min: 350,  max: 500,  def: 400 },
    },
    columnas: { min: 2, max: 5, def: 3 },
    filas:    { min: 1, max: 1, def: 1 },
    frente: "puerta", frentesPosibles: ["puerta", "cajon", "abierto"],
    base: "patas",    basesPosibles: ["patas", "zocalo", "colgante"],
    color: "nogal",
    tipo: "modulo",
  },
  {
    id: "biblioteca",
    nombre: "Biblioteca Abierta",
    categoria: "living",
    descripcion: "Estantes fijos de 18 mm, sin frentes. Sirve como biblioteca o como divisor de ambientes.",
    precioBase: 298000,
    precioPorFrente: 14000,
    medidas: {
      ancho: { min: 600,  max: 1800, def: 900 },
      alto:  { min: 1200, max: 2200, def: 1800 },
      prof:  { min: 250,  max: 400,  def: 320 },
    },
    columnas: { min: 1, max: 4, def: 2 },
    filas:    { min: 3, max: 7, def: 5 },
    frente: "abierto", frentesPosibles: ["abierto", "puerta"],
    base: "zocalo",    basesPosibles: ["zocalo", "patas"],
    color: "grafito",
    tipo: "modulo",
  },
  {
    id: "aparador",
    nombre: "Aparador Comedor",
    categoria: "living",
    descripcion: "Cuatro puertas con estante interior para vajilla y manteles. Altura justa para servir.",
    precioBase: 420000,
    precioPorFrente: 30000,
    medidas: {
      ancho: { min: 1200, max: 2200, def: 1600 },
      alto:  { min: 700,  max: 950,  def: 800 },
      prof:  { min: 400,  max: 500,  def: 450 },
    },
    columnas: { min: 2, max: 4, def: 4 },
    filas:    { min: 1, max: 2, def: 1 },
    frente: "puerta",  frentesPosibles: ["puerta", "cajon"],
    base: "patas",     basesPosibles: ["patas", "zocalo"],
    color: "terracota",
    tipo: "modulo",
  },
  {
    id: "escritorio",
    nombre: "Escritorio Cajonera",
    categoria: "oficina",
    descripcion: "Tapa de 25 mm con cajonera integrada a un lado. Para trabajar en casa sin ocupar un cuarto.",
    precioBase: 335000,
    precioPorFrente: 28000,
    medidas: {
      ancho: { min: 900, max: 1800, def: 1300 },
      alto:  { min: 720, max: 780,  def: 750 },
      prof:  { min: 500, max: 750,  def: 600 },
    },
    columnas: { min: 1, max: 1, def: 1 },
    filas:    { min: 2, max: 4, def: 3 },
    frente: "cajon",  frentesPosibles: ["cajon"],
    base: "colgante", basesPosibles: ["colgante"],
    color: "fresno-gris",
    tipo: "escritorio",
  },
  {
    id: "zapatero",
    nombre: "Zapatero Recibidor",
    categoria: "guardado",
    descripcion: "Poca profundidad para pasillos angostos. Arriba queda lugar para llaves y correo.",
    precioBase: 210000,
    precioPorFrente: 24000,
    medidas: {
      ancho: { min: 600, max: 1400, def: 900 },
      alto:  { min: 800, max: 1200, def: 1000 },
      prof:  { min: 250, max: 380,  def: 300 },
    },
    columnas: { min: 1, max: 3, def: 2 },
    filas:    { min: 1, max: 3, def: 2 },
    frente: "puerta", frentesPosibles: ["puerta", "cajon"],
    base: "zocalo",   basesPosibles: ["zocalo", "patas", "colgante"],
    color: "salvia",
    tipo: "modulo",
  },
];
