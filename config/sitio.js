/* =====================================================================
   MASS · DATOS GENERALES DEL SITIO
   ---------------------------------------------------------------------
   Acá cambiás los textos principales, el contacto y la moneda.
   Regla de oro: cambiá solo lo que está ENTRE COMILLAS "así".
   No borres las comas del final de cada línea.
   ===================================================================== */

window.MASS = window.MASS || {};

MASS.sitio = {
  nombre: "MASS",
  bajada: "Muebles cortados en CNC",
  ciudad: "Córdoba, Argentina",

  // Contacto. El WhatsApp va con código de país, sin + ni espacios.
  // Ejemplo: "5493511234567". Si lo dejás vacío "", el botón de WhatsApp no aparece.
  whatsapp: "",
  email: "hola@mass.example",
  instagram: "", // ejemplo: "mass.muebles"

  // Franja de aviso arriba de todo (dejala vacía "" para ocultarla)
  avisoSuperior: "Fabricamos en Córdoba · Envíos desarmados a todo el país",

  // Precios
  moneda: "$",
  mostrarPrecios: true, // true = se ven los precios · false = dice "A cotizar"
  redondeo: 1000,        // los precios se redondean a este número

  // ---------- TEXTOS DE LA PÁGINA DE INICIO ----------
  inicio: {
    etiqueta: "Taller CNC · Córdoba",
    titulo: "Tu mueble. Tus medidas.",
    texto: "Elegís el mueble, el color y las medidas, al precio de uno estándar. Lo cortamos en router CNC y te llega armado o en placas numeradas.",
    botonPrincipal: "Personalizá el tuyo",
    botonSecundario: "Ver los muebles",
  },

  // Producto que aparece en el configurador del inicio (usá el "id" de productos.js)
  productoDestacado: "comoda-seis",

  // "Armá tu ambiente" del inicio: qué muebles forman el juego y cuántos de cada uno
  combo: {
    titulo: "Dormitorio en un solo color.",
    color: "roble-claro",
    muebles: [
      { id: "mesa-de-luz",   cantidad: 2 },
      { id: "comoda-seis",   cantidad: 1 },
      { id: "cajonera-alta", cantidad: 1 },
    ],
  },
};
