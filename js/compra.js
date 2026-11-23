/* MASS · finalizar compra
   Por ahora NO cobra: guarda el pedido, muestra un número y arma el resumen
   para mandarlo por WhatsApp o email. El pago online se suma en la etapa 2. */
document.addEventListener("DOMContentLoaded", function () {
  var $ = MASS.$, esc = MASS.esc, S = MASS.sitio;
  var items = MASS.pedido.leer();
  if (!items.length && !sessionStorage.getItem("mass-ultimo")) { location.href = "carrito.html"; return; }

  function pintarResumen(lista) {
    $("#mini-items").innerHTML = lista.map(function (it) {
      var p = MASS.producto(it.producto); if (!p) return "";
      return '<div class="mini-item"><div><b>' + esc(p.nombre) + (it.cantidad > 1 ? " × " + it.cantidad : "") + "</b><span>" +
        esc(MASS.color(it.color).nombre) + " · " + MASS.medidasTexto(it) + "</span></div><span>" + MASS.formatoPrecio(MASS.precio(p, it) * it.cantidad) + "</span></div>";
    }).join("");
    var total = MASS.totalPedido(lista);
    $("#subtotal").textContent = MASS.formatoPrecio(total);
    $("#total").textContent = MASS.formatoPrecio(total);
  }
  pintarResumen(items);

  // Mostrar dirección solo si hay envío
  var form = $("#form");
  function cambiarEntrega() {
    var v = form.entrega.value;
    var envio = v.indexOf("Envío") === 0;
    $("#campos-direccion").hidden = !envio;
    $("#envio").textContent = envio ? "Según destino" : "Sin costo";
  }
  form.addEventListener("change", cambiarEntrega);
  cambiarEntrega();

  // Validación simple con el error debajo de cada campo
  function validar() {
    var ok = true;
    [["nombre", function (v) { return v.trim().length > 1; }],
     ["telefono", function (v) { return v.replace(/\D/g, "").length >= 6; }],
     ["email", function (v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); }]].forEach(function (r) {
      var input = form[r[0]], bien = r[1](input.value);
      input.setAttribute("aria-invalid", !bien);
      input.parentNode.querySelector(".error").hidden = bien;
      if (!bien && ok) { input.focus(); ok = false; }
    });
    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validar()) return;
    var nro = "M-" + Date.now().toString(36).toUpperCase().slice(-6);
    var datos = {
      "Nombre": form.nombre.value, "Teléfono": form.telefono.value, "Email": form.email.value,
      "Entrega": form.entrega.value, "Dirección": form.direccion.value, "Localidad": form.localidad.value,
      "Pago": form.pago.value, "Comentarios": form.notas.value,
    };
    var texto = MASS.textoPedido(items, datos, nro);
    sessionStorage.setItem("mass-ultimo", texto);
    MASS.pedido.guardar([]);

    $("#nro-pedido").textContent = nro;
    $("#resumen-texto").textContent = texto;
    if (S.whatsapp) $("#btn-wa").href = "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(texto);
    else $("#btn-wa").hidden = true;
    $("#btn-mail").href = "mailto:" + S.email + "?subject=" + encodeURIComponent("Pedido MASS " + nro) + "&body=" + encodeURIComponent(texto);
    form.hidden = true;
    $("#confirmacion").hidden = false;
    $("#titulo-compra").textContent = "Pedido confirmado";
    var pasos = MASS.$$("#pasos li");
    pasos[1].removeAttribute("aria-current"); pasos[1].classList.add("is-hecho");
    pasos[2].setAttribute("aria-current", "step");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  $("#btn-copiar").addEventListener("click", function () {
    var t = $("#resumen-texto").textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject())
      .then(function () { MASS.aviso("Resumen copiado"); })
      .catch(function () { MASS.aviso("No se pudo copiar, seleccioná el texto"); });
  });
});
