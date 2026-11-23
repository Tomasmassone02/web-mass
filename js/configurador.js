/* MASS · ficha de un mueble con su configurador (mueble.html?id=...) */
document.addEventListener("DOMContentLoaded", function () {
  var $ = MASS.$, esc = MASS.esc;
  var params = new URLSearchParams(location.search);
  var p = MASS.producto(params.get("id")) || MASS.producto(MASS.sitio.productoDestacado) || MASS.productos[0];
  var conf = MASS.confDefecto(p);
  var cantidad = 1;
  if (params.get("color") && MASS.colores.some(function (c) { return c.id === params.get("color"); })) conf.color = params.get("color");
  // Medidas que vienen en la dirección (por ejemplo desde el configurador del inicio)
  [["ancho", p.medidas.ancho], ["alto", p.medidas.alto], ["prof", p.medidas.prof], ["columnas", p.columnas], ["filas", p.filas]].forEach(function (par) {
    var v = parseInt(params.get(par[0]), 10);
    if (!isNaN(v)) conf[par[0]] = Math.min(par[1].max, Math.max(par[1].min, v));
  });

  document.title = p.nombre + " · MASS";
  var cat = MASS.categoria(p.categoria);
  $("#miga-cat").textContent = cat.nombre;
  $("#miga-cat").href = "muebles.html?cat=" + p.categoria;
  $("#miga-nombre").textContent = p.nombre;
  $("#p-cat").textContent = cat.nombre;
  $("#p-nombre").textContent = p.nombre;
  $("#p-desc").textContent = p.descripcion;
  $("#det-desc").textContent = p.descripcion;

  var visor = new MASS3D.Visor($("#visor"), { yaw: -0.6, margen: 1.12 });

  /* ----- Vistas (miniaturas) ----- */
  var amb = MASS.ambientes.filter(function (a) { return a.foto && a.productos.indexOf(p.id) >= 0; })[0];
  if (amb) {
    $("#vista-foto").hidden = false;
    $("#vista-foto-img").src = amb.foto.replace("-2000", "-1000");
    $("#foto-ambiente").src = amb.foto;
    $("#foto-ambiente").alt = "Ambiente " + amb.nombre;
  }
  $("#vistas").addEventListener("click", function (e) {
    var b = e.target.closest(".vista"); if (!b) return;
    MASS.$$(".vista").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
    var esFoto = b.hasAttribute("data-foto");
    $("#foto-ambiente").hidden = !esFoto;
    if (!esFoto) visor.girarA(parseFloat(b.dataset.yaw));
  });
  function pintarVistas() {
    MASS.$$("[data-vista]").forEach(function (el) {
      MASS3D.foto([MASS.conf3d(p, conf)], { ancho: 240, alto: 240, margen: 1.15, yaw: parseFloat(el.dataset.vista) }).then(function (url) {
        el.innerHTML = '<img src="' + url + '" alt="">';
      });
    });
  }

  /* ----- Color ----- */
  var sw = $("#swatches");
  sw.innerHTML = MASS.coloresDisponibles().map(function (c) {
    return '<button type="button" class="swatch' + (c.veta ? " veta" : "") + '" role="radio" data-color="' + c.id + '" style="background-color:' + c.hex + '" aria-label="' + esc(c.nombre) + '" title="' + esc(c.nombre) + '"></button>';
  }).join("");
  sw.addEventListener("click", function (e) {
    var b = e.target.closest("[data-color]");
    if (!b) return;
    conf.color = b.getAttribute("data-color");
    actualizar(true);
  });

  /* ----- Medidas: barra + botones − / + + número ----- */
  var nombresMedida = { ancho: "Ancho", alto: "Alto", prof: "Profundidad" };
  var gm = $("#grupo-medidas");
  ["ancho", "alto", "prof"].forEach(function (k) {
    var m = p.medidas[k];
    var fila = document.createElement("div");
    fila.className = "medida medida--tienda";
    fila.innerHTML =
      '<label for="n-' + k + '">' + nombresMedida[k] + "</label>" +
      '<input type="range" id="r-' + k + '" min="' + m.min + '" max="' + m.max + '" step="10" value="' + conf[k] + '" aria-label="' + nombresMedida[k] + '">' +
      '<div class="paso-num"><button type="button" data-paso="-10" aria-label="10 mm menos">−</button>' +
      '<input class="medida__num" id="n-' + k + '" type="number" inputmode="numeric" min="' + m.min + '" max="' + m.max + '" step="1" value="' + conf[k] + '">' +
      '<button type="button" data-paso="10" aria-label="10 mm más">+</button></div>' +
      '<div class="rango"><span>mín. ' + m.min + "</span><span>máx. " + m.max + "</span></div>";
    gm.appendChild(fila);
    var rango = fila.querySelector("input[type=range]");
    var num = fila.querySelector(".medida__num");
    function poner(v) {
      v = Math.min(m.max, Math.max(m.min, Math.round(v)));
      conf[k] = v; num.value = v; rango.value = v; actualizar();
    }
    rango.addEventListener("input", function () { poner(+rango.value); });
    num.addEventListener("change", function () { poner(+num.value || m.def); });
    fila.querySelector(".paso-num").addEventListener("click", function (e) {
      var b = e.target.closest("[data-paso]"); if (b) poner(conf[k] + +b.dataset.paso);
    });
  });

  /* ----- Frentes y base ----- */
  function opciones(cont, lista, nombres, clave) {
    if (lista.length < 2) { cont.hidden = true; return; }
    cont.innerHTML = lista.map(function (v) {
      return '<button type="button" class="opcion" role="radio" data-v="' + v + '">' + nombres[v] + "</button>";
    }).join("");
    cont.addEventListener("click", function (e) {
      var b = e.target.closest("[data-v]");
      if (!b) return;
      conf[clave] = b.getAttribute("data-v");
      actualizar(true);
    });
  }
  opciones($("#opc-frente"), p.frentesPosibles, MASS.nombresFrente, "frente");
  opciones($("#opc-base"), p.basesPosibles, MASS.nombresBase, "base");
  if (p.basesPosibles.length < 2) $("#grupo-base").hidden = true;

  var cont = $("#contadores");
  [["columnas", "a lo ancho"], ["filas", "a lo alto"]].forEach(function (par) {
    var k = par[0], lim = p[k];
    if (lim.min === lim.max) return;
    var el = document.createElement("div");
    el.className = "contador-ctrl";
    el.innerHTML = '<button type="button" data-d="-1" aria-label="Menos ' + k + '">−</button><div><b data-n></b><small>' + par[1] + '</small></div><button type="button" data-d="1" aria-label="Más ' + k + '">+</button>';
    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-d]");
      if (!b) return;
      conf[k] = Math.min(lim.max, Math.max(lim.min, conf[k] + +b.getAttribute("data-d")));
      actualizar(true);
    });
    el.dataset.k = k;
    cont.appendChild(el);
  });
  if (!cont.children.length && p.frentesPosibles.length < 2) $("#grupo-frentes").hidden = true;

  /* ----- Cantidad y carrito ----- */
  function pintarCantidad() { $("#cantidad").textContent = cantidad; $("#menos").disabled = cantidad <= 1; }
  $("#menos").addEventListener("click", function () { cantidad = Math.max(1, cantidad - 1); pintarCantidad(); actualizar(); });
  $("#mas").addEventListener("click", function () { cantidad++; pintarCantidad(); actualizar(); });
  pintarCantidad();

  $("#agregar").addEventListener("click", function () {
    MASS.pedido.agregar(Object.assign({}, conf, { cantidad: cantidad }));
    MASS.aviso(p.nombre + " agregado al carrito");
    $("#ver-pedido").hidden = false;
    var b = $("#agregar");
    b.textContent = "Agregado ✓";
    setTimeout(function () { b.textContent = "Agregar otro"; }, 2200);
  });

  $("#restablecer").addEventListener("click", function () {
    var color = conf.color;
    conf = MASS.confDefecto(p);
    conf.color = color;
    ["ancho", "alto", "prof"].forEach(function (k) { $("#r-" + k).value = conf[k]; $("#n-" + k).value = conf[k]; });
    actualizar(true);
  });

  /* Garantías bajo el botón */
  $("#garantias").innerHTML = [
    ["regla", "Medidas a elección", "Ajustás cada medida dentro del rango"],
    ["placa", "Placa de 18 mm", "Con canto en todos los bordes"],
    ["camion", "Armado o desarmado", "Envío a todo el país"],
  ].map(function (g) {
    return "<li>" + MASS.icono(g[0]) + "<div><b>" + g[1] + "</b><span>" + g[2] + "</span></div></li>";
  }).join("");

  /* Pestañas */
  var tabs = MASS.$$("[role=tab]");
  function abrir(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1;
      $("#" + x.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { abrir(t); });
    t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length]; abrir(n); n.focus();
    });
  });

  /* ----- Actualizar todo ----- */
  var pendiente = false, vistasPend = null;
  function actualizar(rehacerVistas) {
    var col = MASS.color(conf.color);
    MASS.$$("[data-color]", sw).forEach(function (b) { b.setAttribute("aria-checked", b.getAttribute("data-color") === conf.color); });
    $("#color-nombre").textContent = col.nombre;
    MASS.$$("#opc-frente [data-v]").forEach(function (b) { b.setAttribute("aria-checked", b.getAttribute("data-v") === conf.frente); });
    MASS.$$("#opc-base [data-v]").forEach(function (b) { b.setAttribute("aria-checked", b.getAttribute("data-v") === conf.base); });
    MASS.$$(".contador-ctrl", cont).forEach(function (el) {
      var k = el.dataset.k;
      el.querySelector("[data-n]").textContent = conf[k];
      el.querySelector('[data-d="-1"]').disabled = conf[k] <= p[k].min;
      el.querySelector('[data-d="1"]').disabled = conf[k] >= p[k].max;
    });
    $("#frentes-titulo").textContent = conf.frente === "abierto" ? "Estantes" : MASS.nombresFrente[conf.frente];
    var unidad = conf.frente === "cajon" ? "cajones" : conf.frente === "puerta" ? "puertas" : "huecos";
    $("#frentes-total").textContent = conf.columnas * conf.filas + " " + unidad;

    $("#p-precio").textContent = MASS.formatoPrecio(MASS.precio(p, conf) * cantidad);
    $("#cotas").textContent = conf.ancho + " × " + conf.alto + " × " + conf.prof + " mm";
    $("#resumen").innerHTML =
      "<dt>Color</dt><dd>" + esc(col.nombre) + "</dd>" +
      "<dt>Medidas</dt><dd>" + MASS.medidasTexto(conf) + "</dd>" +
      "<dt>Frentes</dt><dd>" + conf.columnas * conf.filas + " " + unidad + " (" + conf.columnas + " × " + conf.filas + ")</dd>" +
      "<dt>Base</dt><dd>" + MASS.nombresBase[conf.base] + "</dd>";
    $("#det-lista").innerHTML =
      "<li>Medidas de fábrica: " + MASS.medidasTexto(MASS.confDefecto(p)) + "</li>" +
      "<li>Ancho de " + p.medidas.ancho.min + " a " + p.medidas.ancho.max + " mm</li>" +
      "<li>Alto de " + p.medidas.alto.min + " a " + p.medidas.alto.max + " mm</li>" +
      "<li>Profundidad de " + p.medidas.prof.min + " a " + p.medidas.prof.max + " mm</li>";

    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(function () { pendiente = false; visor.mostrar(MASS.conf3d(p, conf)); });
    }
    clearTimeout(vistasPend);
    vistasPend = setTimeout(pintarVistas, rehacerVistas ? 0 : 400);
    var url = "mueble.html?id=" + p.id + (conf.color !== p.color ? "&color=" + conf.color : "");
    history.replaceState(null, "", url);
  }
  actualizar(true);

  /* ----- Relacionados ----- */
  var rel = MASS.productos.filter(function (x) { return x.id !== p.id && x.categoria === p.categoria; });
  rel = rel.concat(MASS.productos.filter(function (x) { return x.id !== p.id && x.categoria !== p.categoria; })).slice(0, 4);
  var gr = $("#relacionados");
  gr.innerHTML = rel.map(MASS.tarjeta).join("");
  MASS.cargarFotos(gr);
});
