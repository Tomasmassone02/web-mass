/* =====================================================================
   MASS · FUNCIONES COMUNES (encabezado, pie, pedido, precios)
   No hace falta tocar este archivo para cambiar textos, colores o precios.
   ===================================================================== */
(function () {
  "use strict";
  var S = MASS.sitio;

  MASS.$ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  MASS.$$ = function (sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };
  MASS.esc = function (t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  MASS.producto = function (id) { return MASS.productos.filter(function (p) { return p.id === id; })[0]; };
  MASS.color = function (id) { return MASS.colores.filter(function (c) { return c.id === id; })[0] || MASS.colores[0]; };
  MASS.categoria = function (id) { return MASS.categorias.filter(function (c) { return c.id === id; })[0] || { nombre: id }; };
  MASS.coloresDisponibles = function () { return MASS.colores.filter(function (c) { return c.disponible !== false; }); };

  MASS.nombresFrente = { cajon: "Cajones", puerta: "Puertas", abierto: "Estantes abiertos" };
  MASS.nombresBase = { zocalo: "Zócalo", patas: "Patas de hierro", colgante: "Colgante (sin base)" };

  /* Configuración de fábrica de un producto */
  MASS.confDefecto = function (p) {
    return {
      producto: p.id,
      ancho: p.medidas.ancho.def, alto: p.medidas.alto.def, prof: p.medidas.prof.def,
      columnas: p.columnas.def, filas: p.filas.def,
      frente: p.frente, base: p.base, color: p.color,
    };
  };

  /* Lo que necesita el visor 3D */
  MASS.conf3d = function (p, c) {
    return {
      tipo: p.tipo, ancho: c.ancho, alto: c.alto, prof: c.prof,
      columnas: c.columnas, filas: c.filas, frente: c.frente, base: c.base,
      color: MASS.color(c.color).hex,
    };
  };

  /* Precio estimado de ejemplo: escala con el tamaño del frente y suma por cajón/puerta */
  MASS.precio = function (p, c) {
    var m = p.medidas;
    var area = (c.ancho * c.alto) / (m.ancho.def * m.alto.def);
    var fondo = c.prof / m.prof.def;
    var frentesDef = p.columnas.def * p.filas.def;
    var frentes = c.columnas * c.filas;
    var precio = p.precioBase * (0.35 + 0.65 * area) * (0.85 + 0.15 * fondo) + (frentes - frentesDef) * p.precioPorFrente;
    var red = S.redondeo || 1;
    return Math.max(red, Math.round(precio / red) * red);
  };

  MASS.formatoPrecio = function (n) {
    if (!S.mostrarPrecios) return "A cotizar";
    return S.moneda + " " + Math.round(n).toLocaleString("es-AR");
  };

  MASS.medidasTexto = function (c) { return c.ancho + " × " + c.alto + " × " + c.prof + " mm"; };

  /* ---------------- Pedido (se guarda en el navegador) ---------------- */
  var CLAVE = "mass-pedido-v1";
  MASS.pedido = {
    leer: function () { try { return JSON.parse(localStorage.getItem(CLAVE)) || []; } catch (e) { return []; } },
    guardar: function (items) { localStorage.setItem(CLAVE, JSON.stringify(items)); MASS.actualizarContador(); },
    agregar: function (conf) {
      var items = this.leer();
      items.push(Object.assign({ uid: Date.now().toString(36), cantidad: 1 }, conf));
      this.guardar(items);
    },
    cantidad: function () { return this.leer().reduce(function (a, i) { return a + (i.cantidad || 1); }, 0); },
  };

  MASS.frentesTexto = function (c) {
    var n = c.columnas * c.filas;
    return n + " " + (c.frente === "cajon" ? "cajones" : c.frente === "puerta" ? "puertas" : "huecos") + " (" + c.columnas + " × " + c.filas + ")";
  };
  MASS.totalPedido = function (items) {
    return items.reduce(function (t, it) { var p = MASS.producto(it.producto); return t + (p ? MASS.precio(p, it) * (it.cantidad || 1) : 0); }, 0);
  };
  /* Texto del pedido para mandar por WhatsApp o email (lo que Tomás carga a mano) */
  MASS.textoPedido = function (items, datos, nro) {
    var l = ["PEDIDO MASS" + (nro ? " " + nro : ""), "──────────────"];
    items.forEach(function (it, i) {
      var p = MASS.producto(it.producto); if (!p) return;
      l.push((i + 1) + ". " + p.nombre + " × " + (it.cantidad || 1));
      l.push("   Color: " + MASS.color(it.color).nombre);
      l.push("   Medidas finales: " + it.ancho + " ancho × " + it.alto + " alto × " + it.prof + " prof. (mm)");
      l.push("   Frentes: " + MASS.frentesTexto(it) + " · " + MASS.nombresFrente[it.frente]);
      l.push("   Base: " + MASS.nombresBase[it.base]);
      l.push("   Estimado: " + MASS.formatoPrecio(MASS.precio(p, it) * (it.cantidad || 1)));
      l.push("");
    });
    l.push("Total estimado: " + MASS.formatoPrecio(MASS.totalPedido(items)));
    if (datos) {
      l.push("──────────────");
      Object.keys(datos).forEach(function (k) { if (datos[k]) l.push(k + ": " + datos[k]); });
    }
    return l.join("\n");
  };

  MASS.actualizarContador = function () {
    var n = MASS.pedido.cantidad();
    MASS.$$("[data-contador]").forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
  };

  /* ---------------- Encabezado y pie ---------------- */
  var paginas = [
    { url: "muebles.html", texto: "Muebles" },
    { url: "ambientes.html", texto: "Ambientes" },
    { url: "colores.html", texto: "Colores" },
    { url: "taller.html", texto: "Cómo trabajamos" },
  ];

  function actual() {
    var f = location.pathname.split("/").pop() || "index.html";
    if (f === "mueble.html") f = "muebles.html";
    if (f === "compra.html") f = "carrito.html";
    return f;
  }

  /* Íconos de línea (dibujados con código, se pintan del color del texto) */
  var ICONOS = {
    inicio: '<path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    muebles: '<rect x="4" y="4" width="16" height="16"/><path d="M4 10.5h16M12 10.5V20M9 7.25h6"/>',
    ambientes: '<path d="M3 20h18M5 20v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/>',
    carrito: '<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    buscar: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    camion: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
    regla: '<path d="M3 16 16 3l5 5L8 21z"/><path d="m7 12 2 2M10 9l2 2M13 6l2 2"/>',
    placa: '<path d="M4 7h16v4H4zM4 13h16v4H4z"/>',
    escudo: '<path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    caja: '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>',
    herraje: '<rect x="3" y="4" width="7" height="16" rx="1"/><rect x="14" y="4" width="7" height="16" rx="1"/><path d="M10 8h4M10 16h4"/>',
    canto: '<path d="M3 15 15 5l6 4-12 10z"/><path d="M3 15v2l6 4v-2"/>',
    living: '<path d="M4 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v4H3zM5 17v2M19 17v2"/>',
    dormitorio: '<path d="M3 18V7M3 14h18v4M21 18v-5a3 3 0 0 0-3-3h-7v4"/><circle cx="7" cy="11" r="1.6"/>',
    oficina: '<path d="M3 9h18M5 9v11M19 9v11"/><rect x="12" y="9" width="7" height="5"/><path d="M14.5 11.5h2"/>',
    guardado: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 3v18M10 11v2M14 11v2"/>',
  };
  MASS.icono = function (n, cls) {
    return '<svg class="ico ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + ICONOS[n] + "</svg>";
  };

  function encabezado() {
    var a = actual();
    var links = paginas.map(function (p) {
      return '<a class="nav__link' + (p.url === a ? " is-activo" : "") + '" href="' + p.url + '"' + (p.url === a ? ' aria-current="page"' : "") + ">" + p.texto + "</a>";
    }).join("");
    var barra = [
      { url: "index.html", texto: "Inicio", ico: "inicio" },
      { url: "muebles.html", texto: "Muebles", ico: "muebles" },
      { url: "ambientes.html", texto: "Ambientes", ico: "ambientes" },
      { url: "carrito.html", texto: "Carrito", ico: "carrito" },
    ].map(function (b) {
      return '<a href="' + b.url + '"' + (b.url === a ? ' aria-current="page" class="is-activo"' : "") + ">" + MASS.icono(b.ico) +
        (b.ico === "carrito" ? '<span class="contador contador--mini" data-contador hidden>0</span>' : "") + "<span>" + b.texto + "</span></a>";
    }).join("");
    return '' +
      '<a class="saltar" href="#contenido">Ir al contenido</a>' +
      (S.avisoSuperior ? '<div class="aviso-sup">' + MASS.icono("camion") + "<span>" + MASS.esc(S.avisoSuperior) + "</span></div>" : "") +
      '<header class="cab">' +
      '  <div class="wrap cab__fila">' +
      '    <a class="cab__logo" href="index.html" aria-label="MASS, ir al inicio"><img src="img/logo-mass-negro.png" alt="MASS" width="378" height="114"></a>' +
      '    <nav class="nav" id="menu" aria-label="Principal">' + links + "</nav>" +
      '    <div class="cab__iconos">' +
      '      <a class="cab__ico" href="muebles.html#buscar" aria-label="Buscar muebles">' + MASS.icono("buscar") + "</a>" +
      '      <a class="cab__ico cab__carrito" href="carrito.html" aria-label="Ver carrito">' + MASS.icono("carrito") + '<span class="contador contador--mini" data-contador hidden>0</span></a>' +
      '      <button class="cab__menu" type="button" aria-expanded="false" aria-controls="menu"><span></span><span></span><span class="sr">Abrir menú</span></button>' +
      "    </div>" +
      '  </div>' +
      '</header>' +
      '<nav class="barra-movil" aria-label="Accesos rápidos">' + barra + "</nav>";
  }

  function pie() {
    var anio = new Date().getFullYear();
    var cats = MASS.categorias.map(function (c) {
      return '<li><a href="muebles.html?cat=' + c.id + '">' + MASS.esc(c.nombre) + "</a></li>";
    }).join("");
    var contacto = '<li><a href="mailto:' + S.email + '">' + S.email + "</a></li>";
    if (S.whatsapp) contacto += '<li><a href="https://wa.me/' + S.whatsapp + '">WhatsApp</a></li>';
    if (S.instagram) contacto += '<li><a href="https://instagram.com/' + S.instagram + '">Instagram</a></li>';
    return '' +
      '<footer class="pie">' +
      '  <div class="wrap">' +
      '    <div class="pie__marca"><img src="img/logo-mass-blanco.png" alt="MASS" width="378" height="114"><p>' + MASS.esc(S.bajada) + " · " + MASS.esc(S.ciudad) + "</p></div>" +
      '    <div class="pie__cols">' +
      '      <div><h2 class="etiqueta">Muebles</h2><ul>' + cats + "</ul></div>" +
      '      <div><h2 class="etiqueta">Taller</h2><ul><li><a href="taller.html">Cómo trabajamos</a></li><li><a href="colores.html">Colores</a></li><li><a href="carrito.html">Tu carrito</a></li></ul></div>' +
      '      <div><h2 class="etiqueta">Contacto</h2><ul>' + contacto + "</ul></div>" +
      "    </div>" +
      '    <p class="pie__legal">© ' + anio + " " + MASS.esc(S.nombre) + '. Precios de referencia, se confirman con el pedido. · <a href="creditos.html">Fotos vía Unsplash</a></p>' +
      "  </div>" +
      "</footer>";
  }

  MASS.aviso = function (texto) {
    var el = MASS.$(".aviso");
    if (!el) { el = document.createElement("div"); el.className = "aviso"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = texto;
    el.classList.add("is-visible");
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("is-visible"); }, 2600);
  };

  /* ---------------- Tarjeta de producto ---------------- */
  MASS.tarjeta = function (p) {
    var c = MASS.confDefecto(p);
    var cols = MASS.coloresDisponibles();
    var puntos = cols.slice(0, 4).map(function (x) {
      return '<i class="punto' + (x.veta ? " veta" : "") + '" style="background-color:' + x.hex + '"></i>';
    }).join("") + (cols.length > 4 ? '<em>+' + (cols.length - 4) + "</em>" : "");
    return '' +
      '<a class="tarjeta" href="mueble.html?id=' + p.id + '">' +
      '  <div class="tarjeta__img" data-foto="' + p.id + '"><span class="tarjeta__cat etiqueta">' + MASS.esc(MASS.categoria(p.categoria).nombre) + "</span></div>" +
      '  <div class="tarjeta__cuerpo">' +
      '    <div class="tarjeta__fila"><h3 class="tarjeta__titulo">' + MASS.esc(p.nombre) + '</h3><span class="tarjeta__precio">' + (S.mostrarPrecios ? "Desde " : "") + MASS.formatoPrecio(MASS.precio(p, c)) + "</span></div>" +
      '    <p class="tarjeta__desc">Personalizable en medidas, ' + (p.frente === "abierto" ? "estantes" : p.frente === "puerta" ? "puertas" : "cajones") + ' y color.</p>' +
      '    <div class="tarjeta__fila"><span class="puntos" aria-label="' + cols.length + ' colores">' + puntos + '</span><span class="tarjeta__medidas">' + MASS.medidasTexto(c) + "</span></div>" +
      '    <span class="tarjeta__boton">Personalizar <i aria-hidden="true">→</i></span>' +
      "  </div>" +
      "</a>";
  };

  /* Carga las fotos 3D de las tarjetas visibles, de a una */
  MASS.cargarFotos = function (raiz) {
    MASS.$$("[data-foto]", raiz).forEach(function (el) {
      var p = MASS.producto(el.getAttribute("data-foto"));
      if (!p || el.dataset.cargada) return;
      el.dataset.cargada = "1";
      var cfg = MASS.conf3d(p, MASS.confDefecto(p));
      // Escena tipo foto: pared crema y piso de madera clara
      MASS3D.foto([cfg], { ancho: 900, alto: 700, pared: "#EEE8DF", piso: "#D8C6AC", contraPared: true, yaw: -0.3, margen: 1.02, anchoMin: 0.95, fov: 30 }).then(function (url) {
        var img = new Image();
        img.alt = p.nombre + " en " + MASS.color(p.color).nombre;
        img.src = url;
        el.appendChild(img);
        requestAnimationFrame(function () { el.classList.add("is-cargada"); });
      }).catch(function () {});
    });
  };

  /* Imagen de un ambiente: foto real si hay, si no una escena 3D de muestra */
  MASS.imagenAmbiente = function (amb, el, ancho, alto) {
    function poner(url) {
      var img = new Image();
      img.alt = "Ambiente " + amb.nombre + " con muebles MASS";
      img.src = url;
      el.appendChild(img);
    }
    if (amb.foto) { poner(amb.foto); return; }
    var lista = amb.productos.map(function (id) {
      var p = MASS.producto(id);
      if (!p) return null;
      var c = MASS.confDefecto(p);
      if (amb.color) c.color = amb.color;
      return MASS.conf3d(p, c);
    }).filter(Boolean);
    MASS3D.foto(lista, { ancho: ancho, alto: alto, pared: amb.pared, piso: amb.piso, contraPared: true, yaw: 0, separacion: 0.3, margen: 1.08, fov: 32, anchoMin: 2.2 })
      .then(poner).catch(function () {});
  };

  document.addEventListener("DOMContentLoaded", function () {
    var top = document.getElementById("encabezado");
    if (top) top.outerHTML = encabezado();
    var bot = document.getElementById("pie");
    if (bot) bot.outerHTML = pie();
    MASS.actualizarContador();

    var btn = MASS.$(".cab__menu");
    if (btn) btn.addEventListener("click", function () {
      var abierto = document.body.classList.toggle("menu-abierto");
      btn.setAttribute("aria-expanded", abierto ? "true" : "false");
      btn.querySelector(".sr").textContent = abierto ? "Cerrar menú" : "Abrir menú";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-abierto")) btn.click();
    });
  });
})();
