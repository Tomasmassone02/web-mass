/* MASS · carrito */
document.addEventListener("DOMContentLoaded", function () {
  var $ = MASS.$, esc = MASS.esc;
  var fotos = {};

  $("#garantias").innerHTML = [
    ["escudo", "Todavía no pagás", "Te confirmamos el precio final antes"],
    ["camion", "Envío a todo el país", "Armado en Córdoba o desarmado"],
  ].map(function (g) { return "<li>" + MASS.icono(g[0]) + "<div><b>" + g[1] + "</b><span>" + g[2] + "</span></div></li>"; }).join("");

  function pintar() {
    var items = MASS.pedido.leer();
    var vacio = items.length === 0;
    $("#vacio").hidden = !vacio;
    $("#items").hidden = vacio;
    $("#resumen-caja").hidden = vacio;
    $("#items").innerHTML = items.map(function (it) {
      var p = MASS.producto(it.producto);
      if (!p) return "";
      var link = "mueble.html?id=" + p.id + "&color=" + it.color + "&ancho=" + it.ancho + "&alto=" + it.alto + "&prof=" + it.prof + "&columnas=" + it.columnas + "&filas=" + it.filas;
      return '<article class="item" data-uid="' + it.uid + '">' +
        '<a class="item__img" href="' + link + '" data-img="' + it.uid + '" aria-label="Ver ' + esc(p.nombre) + '"></a>' +
        "<div>" +
        '<div class="item__cab"><h3>' + esc(p.nombre) + '</h3><b>' + MASS.formatoPrecio(MASS.precio(p, it) * it.cantidad) + "</b></div>" +
        '<div class="item__datos">' + esc(MASS.color(it.color).nombre) + " · " + MASS.medidasTexto(it) + "<br>" + MASS.frentesTexto(it) + " · " + MASS.nombresBase[it.base] + "</div>" +
        '<div class="item__pie"><div class="contador-ctrl cantidad"><button type="button" data-acc="menos" aria-label="Uno menos">−</button><div><b>' + it.cantidad + '</b></div><button type="button" data-acc="mas" aria-label="Uno más">+</button></div>' +
        '<div class="item__acciones"><a class="btn-texto" href="' + link + '">Editar</a><button class="btn-texto" type="button" data-acc="quitar">Quitar</button></div></div>' +
        "</div></article>";
    }).join("");

    MASS.$$("[data-img]").forEach(function (el) {
      var uid = el.getAttribute("data-img");
      var it = items.filter(function (x) { return x.uid === uid; })[0];
      var p = MASS.producto(it.producto);
      function poner(url) { el.innerHTML = '<img src="' + url + '" alt="">'; }
      if (fotos[uid]) return poner(fotos[uid]);
      MASS3D.foto([MASS.conf3d(p, it)], { ancho: 400, alto: 400, margen: 1.15 }).then(function (url) { fotos[uid] = url; poner(url); });
    });

    var total = MASS.totalPedido(items);
    $("#cant-items").textContent = MASS.pedido.cantidad();
    $("#subtotal").textContent = MASS.formatoPrecio(total);
    $("#total").textContent = MASS.formatoPrecio(total);
  }

  $("#items").addEventListener("click", function (e) {
    var b = e.target.closest("[data-acc]");
    if (!b) return;
    var uid = b.closest("[data-uid]").getAttribute("data-uid");
    var items = MASS.pedido.leer();
    var it = items.filter(function (x) { return x.uid === uid; })[0];
    var acc = b.getAttribute("data-acc");
    if (acc === "mas") it.cantidad++;
    if (acc === "menos") it.cantidad = Math.max(1, it.cantidad - 1);
    if (acc === "quitar") items = items.filter(function (x) { return x.uid !== uid; });
    MASS.pedido.guardar(items);
    pintar();
  });

  pintar();
});
