# Proyecto MASS — notas para Claude

Contexto para retomar el trabajo desde cualquier computadora.

## Quién es el cliente
Tomás, dueño de Mass (taller de corte CNC en Córdoba, Argentina). No es programador: explicale todo en castellano simple (voseo) y avisale antes de tomar decisiones grandes.

## Qué es
Tienda web de muebles estándar que el cliente personaliza (color, medidas, cajones) con visor 3D. Nombre: **MASS** (logo en `img/logo-mass-*.png`).

## Estado actual (noviembre 2026)
- Sitio estático (HTML/CSS/JS, Three.js por CDN), sin servidor ni base de datos.
- Páginas: inicio, catálogo, ficha de producto (configurador 3D), carrito, compra (no cobra: genera el resumen del pedido para WhatsApp o email), colores, ambientes, taller, créditos.
- Datos editables en `config/` (sitio, productos, colores, ambientes). Precios y medidas **de ejemplo**.
- Fotos de muestra de Unsplash en `img/fotos/` (créditos en `creditos.html`). Tomás las va a reemplazar.
- Publicado en Netlify: https://mass-muebles.netlify.app (con protección: solo se ve con la cuenta de Tomás). La carpeta `.netlify/` guarda el enlace al sitio.
- Para publicar: `netlify deploy --prod --dir <copia sin .claude, .netlify, README.md, netlify.toml>`. **Siempre pedir OK antes de publicar.**

## Cómo quiere trabajar Tomás
- **Ahora: solo estética.** No agregar funciones nuevas hasta que lo visual esté casi listo.
- Estilo actual: verde oliva `#56683F`, fondo crema `#F4F0EA`, tarjetas blancas, esquinas redondeadas, letra Outfit, portada con panel translúcido. Basado en un boceto que mandó ("Tu mueble. Tus medidas.", "Comprá por ambiente", "Destacados", banda del configurador con cotas). Le gusta que se parezca a sus referencias, minimalista.
- Puede mandar sus colores exactos: van en `:root` de `css/estilos.css`. `css/suave.css` tiene el estilo redondeado.
- No usa solo placas FAPLAC (no mencionar la marca).
- Después: 3D realista (veta a escala real, color "Scotch"), medidas reales por mueble, cálculo de material y optimización de placa, servidor y base de datos con panel de precios, pago online. Producción con Cortecloud (DXF, etiquetas QR), por ahora carga manual.
- Lo ve sobre todo desde el celular: revisar siempre en móvil y en PC.

## Historia de decisiones (resumen del primer chat)
1. **Pedido original:** web de muebles configurables en 3D (color, medidas, cajones) que termina en un resumen del pedido para cargar a mano en Cortecloud. Mueble de referencia: cómoda de 6 cajones (2 × 3) sin tiradores. Visor que gira solo en horizontal. Color de prueba "Scotch" (más adelante con textura real y veta a escala).
2. **Primera versión:** estilo arquitectónico/brutalista (carbón, marfil, gris piedra, terracota). Tomás dijo que se veía **muy simple**.
3. **Segunda versión:** fotos de muestra, bloques de color y configurador en vivo en el inicio. Pidió que fuera una **tienda online** como sus referencias (e-commerce de ropa, tecnología y muebles): barra de aviso, carrito con contador, barra inferior en celular, "Comprá por ambiente", ficha de producto con miniaturas, cantidad, "Agregar al carrito", pestañas (Detalles/Materiales/Envío), "También te puede gustar", carrito y página de compra. Le gustaron los "Destacados" con colores en círculos y botón "Personalizar", y el "Armá tu ambiente" (como "Build your outfit").
4. **Tercera versión (la actual):** copiar mucho más de cerca su boceto `referencias/boceto-massone.webp`: verde oliva, crema, tarjetas blancas redondeadas, portada con panel translúcido, categorías con ícono (Living, Dormitorio, Oficina, Guardado), banda del configurador con cotas en cm y barra de "Acabado". No le gusta lo que "se nota hecho con IA", pero el boceto representa lo que quiere.
5. Le da igual que las fotos sean inventadas o de muestra: después las cambia.
6. El nombre en el boceto dice MASSONE, pero el logo y el nombre elegido es **MASS** (preguntarle si lo quiere cambiar).
7. Funciones que **no** se agregaron a propósito: favoritos (corazón), carrusel con puntitos en la portada, pago online.

## Pendientes inmediatos
- Que Tomás mande sus **códigos de color exactos** (si no, queda la paleta del boceto).
- Revisar visualmente en PC y celular las páginas internas con el estilo nuevo (catálogo, ficha, carrito, compra, colores, ambientes, taller).
- Cargar el WhatsApp en `config/sitio.js`.
- Reemplazar fotos de muestra por fotos propias (taller, muebles terminados, detalles).

## Dónde está todo
- Código: GitHub `Tomasmassone02/web-mass` (privado), rama `main`. Copia local en el Escritorio (OneDrive) de su PC.
- Sitio: Netlify, proyecto `mass-muebles`.
- Referencias visuales: carpeta `referencias/`.

## Ver la web en la computadora
`py -m http.server 8080 --directory .` y abrir http://localhost:8080
