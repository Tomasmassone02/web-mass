# MASS · Web de muebles configurables

Tienda online de muebles estándar que el cliente personaliza (color, medidas, cajones) con vista 3D, carrito y página para finalizar la compra.

**Etapa actual:** tienda visual con productos, colores y precios **de ejemplo**. Todavía no hay base de datos ni servidor:

- El carrito queda guardado en el navegador del cliente.
- Al "Confirmar pedido" **no se cobra nada**. Se genera un número de pedido y el resumen, que el cliente te manda por WhatsApp o email. Vos lo cargás a mano en Cortecloud.
- El pago online (Mercado Pago) y el panel para cargar precios se suman en la etapa 2, con servidor.

---

## Qué hay en cada carpeta

```
index.html        → Inicio (portada, ambientes, muebles, configurador, "Armá tu ambiente")
muebles.html      → Catálogo con filtros y buscador
mueble.html       → Ficha de cada mueble: 3D, opciones, cantidad, agregar al carrito
carrito.html      → Carrito
compra.html       → Datos, entrega, forma de pago y confirmación del pedido
colores.html      → Catálogo de colores
ambientes.html    → Muebles agrupados por ambiente
taller.html       → Cómo trabajamos y preguntas frecuentes
creditos.html     → Créditos de las fotos de muestra

config/           ← LO QUE VAS A EDITAR VOS
  sitio.js        → textos del inicio, franja de aviso, WhatsApp, mail, moneda, "Armá tu ambiente"
  productos.js    → muebles: nombre, precio, medidas mínimas y máximas, cajones
  colores.js      → colores disponibles
  ambientes.js    → ambientes, qué muebles muestran y su foto

css/estilos.css   → diseño base (los colores de la marca están arriba de todo)
css/secciones.css → diseño de la portada, la tienda, el carrito y la compra
js/               → funcionamiento (no hace falta tocarlo)
img/              → logo
img/fotos/        → fotos de muestra (ver "Fotos" más abajo)
```

## Fotos

Las fotos actuales son **de muestra**, sacadas de Unsplash (licencia libre, sus autores figuran en `creditos.html`). No son de MASS. Hay que reemplazarlas por fotos tuyas. Lo que más suma:

1. **Taller:** el router cortando, piezas con etiqueta, placas apiladas (reemplazan `cnc-fresa`, `cnc-piezas`, `placas`).
2. **Muebles tuyos terminados**, en una casa o sobre fondo liso, con luz de ventana y sin flash.
3. **Detalles:** el uñero, un canto, la veta del Scotch.

Para cambiar una foto, guardá la tuya en `img/fotos/` **con el mismo nombre** (por ejemplo `portada-2000.jpg`, de 2000 px de ancho, y `portada-1000.jpg`, de 1000 px). Cuando todas sean tuyas, borrá el link "Fotos vía Unsplash" del pie (`js/comun.js`, buscá "Unsplash").

## "Armá tu ambiente"

En `config/sitio.js`, dentro de `combo`, elegís qué muebles forman el juego, cuántos de cada uno y el color inicial.

---

## Cómo editar sin saber programar

Abrí los archivos con un editor de texto simple. Te recomendamos **Visual Studio Code** (es gratis). El Bloc de notas también sirve, pero se equivoca más fácil.

**Tres reglas para no romper nada:**
1. Cambiá solo lo que está **entre comillas** `"así"` o los números.
2. No borres las **comas** `,` del final de cada línea ni las llaves `{ }`.
3. Las líneas que empiezan con `//` o están entre `/*` y `*/` son notas: no hacen nada.

Si algo deja de verse después de un cambio, deshacé el último cambio (Ctrl+Z) y guardá de nuevo.

### Cambiar textos del inicio, WhatsApp o mail
Archivo: `config/sitio.js`

```js
whatsapp: "5493511234567",   // con código de país, sin + ni espacios
titulo: "Muebles a tu medida, al precio de uno estándar.",
```

Mientras `whatsapp` esté vacío `""`, el botón "Enviar por WhatsApp" de la confirmación de compra no aparece (queda solo el email). **Cargalo antes de publicar.**

### Cambiar precios
Archivo: `config/productos.js`. Cada mueble tiene:

```js
precioBase: 385000,       // precio con las medidas de fábrica
precioPorFrente: 32000,   // suma o resta por cada cajón/puerta de más o de menos
```

Para ocultar todos los precios y que diga "A cotizar": en `config/sitio.js` poné `mostrarPrecios: false`.

> El cálculo actual es **de ejemplo**: el precio sube o baja según el tamaño del frente y la profundidad. En la etapa 2 lo reemplazamos por el cálculo real de placa, cantos y herrajes.

### Cambiar medidas permitidas
En `config/productos.js`, cada mueble tiene un mínimo, un máximo y la medida de fábrica (en milímetros):

```js
ancho: { min: 800, max: 1600, def: 1200 },
```

### Agregar un mueble nuevo
1. En `config/productos.js`, copiá un bloque entero, desde `{` hasta `},`.
2. Pegalo debajo del último.
3. Cambiale el `id` (sin espacios ni tildes, por ejemplo `"placard-dos"`), el nombre y los datos.

Aparece solo en el catálogo, con su tarjeta y su página.

### Agregar o quitar un color
En `config/colores.js`, copiá una línea y cambiale el `id`, el `nombre` y el `hex`. Para sacar un color sin borrarlo, poné `disponible: false`.

### Cambiar los colores de la marca
En `css/estilos.css`, las primeras líneas:

```css
--carbon: #2E2B26;   /* textos */
--marfil: #F4F0EA;   /* fondo crema */
--acento: #56683F;   /* verde oliva de botones y detalles */
--radio: 20px;       /* qué tan redondeadas son las esquinas */
```

La letra es **Outfit** (de Google Fonts). Los detalles del estilo suave (sombras, botones redondeados, panel translúcido de la portada) están en `css/suave.css`.

### Cambiar el logo
Reemplazá `img/logo-mass-negro.png` (el logo de la parte de arriba) y `img/logo-mass-blanco.png` (el del pie) por archivos con el mismo nombre.

### Poner fotos reales en los ambientes
Guardá la foto en `img/ambientes/` y en `config/ambientes.js` poné la ruta: `foto: "img/ambientes/dormitorio.jpg"`.

---

## Ver la web en tu computadora

Si hacés doble clic en `index.html`, la web abre, pero algunos navegadores bloquean el 3D cuando la página se abre como archivo. Para verla igual que en internet:

1. Instalá Python desde python.org (una sola vez).
2. Abrí la carpeta del proyecto, hacé clic en la barra de dirección, escribí `cmd` y apretá Enter.
3. Escribí `py -m http.server 8000` y apretá Enter.
4. Abrí `http://localhost:8000` en el navegador.

---

## Publicar en internet

No hace falta compilar nada: se sube la carpeta tal cual.

**Netlify (lo más fácil):**
1. Entrá a app.netlify.com y creá una cuenta.
2. Andá a "Add new site" → "Deploy manually".
3. Arrastrá **la carpeta entera** del proyecto.
4. Te da una dirección tipo `mass-xxxx.netlify.app`. Después podés conectar tu dominio.

Para actualizar, volvés a arrastrar la carpeta en la sección "Deploys".

**Vercel:** subí la carpeta a GitHub y conectala desde vercel.com → "Add New Project". No hace falta configurar nada más.

---

## Detalles técnicos (para un programador)

- Sitio estático sin compilación: HTML, CSS y JavaScript.
- 3D con Three.js 0.170, cargado desde jsDelivr (`js/mueble3d.js`). Los muebles se arman por código a partir de sus medidas (placa de 18 mm, frentes superpuestos, uñero). La cámara solo gira sobre el eje vertical.
- Las imágenes de las tarjetas y los ambientes se generan con el mismo motor, en un único renderer fuera de pantalla.
- El pedido se guarda en `localStorage` con la clave `mass-pedido-v1`.

## Próximas etapas

1. **3D:** texturas reales de cada decorado con la veta a escala, mejores materiales y cotas.
2. **Muebles reales:** medidas, rangos y formas de armado definitivos de cada mueble.
3. **Servidor y base de datos:** panel para cargar precios, muebles y colores sin tocar archivos, pedidos guardados, cálculo de material y optimización de placa. El plan es pasar los archivos de `config/` a una base de datos (por ejemplo Supabase) sin rehacer el diseño.
4. Exportar el pedido en un formato que se pueda cargar en Cortecloud.
