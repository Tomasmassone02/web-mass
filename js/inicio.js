/* MASS · página de inicio */
document.addEventListener("DOMContentLoaded", function () {
  var S = MASS.sitio, $ = MASS.$, esc = MASS.esc;

  // Textos desde config/sitio.js
  MASS.$$("[data-texto]").forEach(function (el) {
    var v = el.getAttribute("data-texto").split(".").reduce(function (o, k) { return o && o[k]; }, S);
    if (v) el.textContent = v;
  });
  $("#hero-cant-colores").textContent = MASS.coloresDisponibles().length;
  MASS.$$("[data-ico]").forEach(function (el) { el.insertAdjacentHTML("afterbegin", MASS.icono(el.dataset.ico, "dato__ico")); });

  var p = MASS.producto(S.productoDestacado) || MASS.productos[0];
  $("#hero-configurar").href = "mueble.html?id=" + p.id;

  // Línea de muebles (primeros 8)
  var grilla = $("#grilla-inicio");
  grilla.innerHTML = MASS.productos.slice(0, 8).map(MASS.tarjeta).join("");
  MASS.cargarFotos(grilla);

  // ----- Configurador en vivo -----
  var conf = MASS.confDefecto(p);
  var visor = new MASS3D.Visor($("#visor-demo"), { yaw: -0.45, margen: 1.5 });
  var colores = MASS.coloresDisponibles();
  $("#demo-swatches").innerHTML = colores.map(function (c) {
    return '<button type="button" class="swatch' + (c.veta ? " veta" : "") + '" role="radio" data-color="' + c.id + '" style="background-color:' + c.hex + '" aria-label="' + esc(c.nombre) + '" title="' + esc(c.nombre) + '"></button>';
  }).join("");
  var rango = $("#demo-ancho");
  rango.min = p.medidas.ancho.min; rango.max = p.medidas.ancho.max; rango.value = conf.ancho;
  var opcionesCajones = [];
  for (var f = p.filas.min; f <= Math.min(p.filas.max, 4); f++) opcionesCajones.push(f);
  $("#demo-cajones").innerHTML = opcionesCajones.map(function (f) {
    return '<button type="button" class="opcion" role="radio" data-filas="' + f + '">' + (f * conf.columnas) + "</button>";
  }).join("");

  function pintar() {
    MASS.$$("#demo-swatches [data-color]").forEach(function (b) { b.setAttribute("aria-checked", b.dataset.color === conf.color); });
    MASS.$$("#demo-cajones [data-filas]").forEach(function (b) { b.setAttribute("aria-checked", +b.dataset.filas === conf.filas); });
    $("#demo-color").textContent = MASS.color(conf.color).nombre;
    $("#demo-ancho-txt").textContent = conf.ancho + " mm";
    $("#demo-cajones-txt").textContent = conf.columnas * conf.filas + " cajones";
    $("#demo-cotas").textContent = MASS.medidasTexto(conf);
    $("#cota-ancho").textContent = conf.ancho / 10 + " cm";
    $("#cota-alto").textContent = conf.alto / 10 + " cm";
    $("#cota-prof").textContent = conf.prof / 10 + " cm";
    $("#demo-precio").textContent = MASS.formatoPrecio(MASS.precio(p, conf));
    $("#demo-abrir").href = "mueble.html?id=" + p.id + "&color=" + conf.color + "&ancho=" + conf.ancho + "&filas=" + conf.filas;
    visor.mostrar(MASS.conf3d(p, conf));
  }
  $("#demo-swatches").addEventListener("click", function (e) {
    var b = e.target.closest("[data-color]"); if (!b) return;
    conf.color = b.dataset.color; visor.tocado = true; pintar();
  });
  $("#demo-cajones").addEventListener("click", function (e) {
    var b = e.target.closest("[data-filas]"); if (!b) return;
    conf.filas = +b.dataset.filas; pintar();
  });
  var pendiente = false;
  rango.addEventListener("input", function () {
    conf.ancho = +rango.value;
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () { pendiente = false; pintar(); });
  });
  pintar();

  // ----- Comprá por ambiente -----
  var contCat = $("#lista-categorias");
  MASS.ambientes.forEach(function (a) {
    var el = document.createElement("a");
    el.className = "categoria";
    el.href = "ambientes.html#" + a.id;
    el.innerHTML = '<div class="categoria__img"></div><span class="categoria__nombre">' + MASS.icono(a.id) + esc(a.nombre) + "</span>";
    contCat.appendChild(el);
    MASS.imagenAmbiente(a, el.querySelector(".categoria__img"), 720, 900);
  });

  // ----- Armá tu ambiente (juego de muebles) -----
  var combo = S.combo;
  if (combo && combo.muebles && combo.muebles.length) {
    if (combo.titulo) $("#combo-titulo").textContent = combo.titulo;
    var colorCombo = combo.color || colores[0].id;
    var itemsCombo = combo.muebles.map(function (m) { return { p: MASS.producto(m.id), cantidad: m.cantidad || 1 }; }).filter(function (x) { return x.p; });
    var contItems = $("#combo-items");
    contItems.innerHTML = itemsCombo.map(function (x, i) {
      return (i ? '<span class="combo__signo" aria-hidden="true">+</span>' : "") +
        '<a class="combo__item" href="mueble.html?id=' + x.p.id + '">' +
        '<div class="combo__img" data-combo="' + i + '"></div>' +
        '<b>' + esc(x.p.nombre) + (x.cantidad > 1 ? " × " + x.cantidad : "") + "</b>" +
        '<span class="mono">' + MASS.medidasTexto(MASS.confDefecto(x.p)) + "</span></a>";
    }).join("");
    $("#combo-swatches").innerHTML = colores.map(function (c) {
      return '<button type="button" class="swatch' + (c.veta ? " veta" : "") + '" role="radio" data-color="' + c.id + '" style="background-color:' + c.hex + '" aria-label="' + esc(c.nombre) + '" title="' + esc(c.nombre) + '"></button>';
    }).join("");
    var pintarCombo = function () {
      var total = 0;
      MASS.$$("#combo-swatches [data-color]").forEach(function (b) { b.setAttribute("aria-checked", b.dataset.color === colorCombo); });
      $("#combo-color").textContent = MASS.color(colorCombo).nombre;
      itemsCombo.forEach(function (x, i) {
        var c = MASS.confDefecto(x.p); c.color = colorCombo;
        total += MASS.precio(x.p, c) * x.cantidad;
        var caja = $('[data-combo="' + i + '"]');
        MASS3D.foto([MASS.conf3d(x.p, c)], { ancho: 600, alto: 600, margen: 1.1 }).then(function (url) {
          caja.innerHTML = '<img src="' + url + '" alt="' + esc(x.p.nombre) + " en " + esc(MASS.color(colorCombo).nombre) + '">';
        });
      });
      $("#combo-precio").textContent = MASS.formatoPrecio(total);
    };
    $("#combo-swatches").addEventListener("click", function (e) {
      var b = e.target.closest("[data-color]"); if (!b) return;
      colorCombo = b.dataset.color; pintarCombo();
    });
    $("#combo-agregar").addEventListener("click", function () {
      itemsCombo.forEach(function (x) {
        var c = MASS.confDefecto(x.p); c.color = colorCombo; c.cantidad = x.cantidad;
        MASS.pedido.agregar(c);
      });
      MASS.aviso("Juego agregado al carrito");
    });
    pintarCombo();
  }

  // Chips de colores en el bloque de material
  $("#tira-colores").innerHTML = colores.map(function (c) {
    return '<a class="chip-color' + (c.veta ? " veta" : "") + '" href="colores.html?color=' + c.id + '" style="background-color:' + c.hex + '"><span>' + esc(c.nombre) + "</span></a>";
  }).join("");

  // Frase: las palabras se iluminan a medida que la sección entra en pantalla
  var frase = $("[data-palabras]");
  if (frase) {
    frase.innerHTML = frase.textContent.split(" ").map(function (w) { return "<span>" + esc(w) + "</span>"; }).join(" ");
    var palabras = MASS.$$("span", frase);
    var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (quieto) { frase.classList.add("is-completa"); return; }
    var actualizar = function () {
      var r = frase.getBoundingClientRect(), vh = window.innerHeight;
      var avance = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      var n = Math.round(avance * palabras.length);
      palabras.forEach(function (s, i) { s.classList.toggle("is-on", i < n); });
    };
    window.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    actualizar();
  }
});
