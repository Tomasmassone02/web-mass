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

## Ver la web en la computadora
`py -m http.server 8080 --directory .` y abrir http://localhost:8080
