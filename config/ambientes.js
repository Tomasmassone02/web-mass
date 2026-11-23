/* =====================================================================
   MASS · AMBIENTES
   ---------------------------------------------------------------------
   Cada ambiente muestra una escena con algunos muebles.
   productos → lista de ids de productos.js que aparecen en la escena
   color     → id del color (de colores.js) para todos los muebles de la escena
   pared / piso → colores de fondo de la escena
   foto      → cuando tengas fotos reales, poné acá la ruta, por ejemplo
               "img/ambientes/dormitorio.jpg". Si está vacío "", se usa la
               escena 3D de muestra.
   ===================================================================== */

window.MASS = window.MASS || {};

MASS.ambientes = [
  {
    id: "dormitorio",
    nombre: "Dormitorio",
    texto: "Cómoda, mesa de luz y cajonera en el mismo decorado. Todo con frentes lisos para que el cuarto se vea ordenado.",
    productos: ["mesa-de-luz", "comoda-seis", "cajonera-alta"],
    color: "scotch",
    pared: "#E6E0D5", piso: "#CFC6B6",
    foto: "img/fotos/dormitorio-2000.jpg",
  },
  {
    id: "living",
    nombre: "Living",
    texto: "Rack bajo y biblioteca a juego. Las medidas se ajustan a la pared que tenés, no al revés.",
    productos: ["biblioteca", "rack-tv"],
    color: "nogal",
    pared: "#DCD7CE", piso: "#B9AE9D",
    foto: "img/fotos/living-2000.jpg",
  },
  {
    id: "oficina",
    nombre: "Oficina",
    texto: "Escritorio con cajonera y biblioteca al lado. Entra en un rincón del living o en el cuarto de huéspedes.",
    productos: ["escritorio", "biblioteca"],
    color: "fresno-gris",
    pared: "#E3DED6", piso: "#C4BBAD",
    foto: "img/fotos/oficina-2000.jpg",
  },
  {
    id: "guardado",
    nombre: "Guardado",
    texto: "Cajoneras y zapateros para ordenar el dormitorio, el pasillo o la entrada. Poca profundidad, mucho lugar.",
    productos: ["zapatero", "cajonera-alta"],
    color: "salvia",
    pared: "#D9D3C8", piso: "#BDB2A2",
    foto: "img/fotos/guardado-2000.jpg",
  },
];
