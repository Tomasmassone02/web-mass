/* =====================================================================
   MASS · VISOR 3D
   Arma los muebles a partir de sus medidas (no hay modelos 3D aparte).
   No hace falta tocar este archivo para cambiar textos, colores o precios.
   ===================================================================== */
(function () {
  "use strict";

  var URL_THREE = "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
  var promesaThree = null;
  function cargarThree() {
    if (!promesaThree) promesaThree = import(URL_THREE);
    return promesaThree;
  }

  var E = 0.018;   // espesor de placa (m)
  var LUZ = 0.005; // luz entre frentes (m) — un poco exagerada para que se vea en pantalla

  function oscurecer(hex, f) {
    var n = parseInt(hex.replace("#", ""), 16);
    var r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  function materiales(T, hex) {
    return {
      placa: new T.MeshStandardMaterial({ color: new T.Color(hex), roughness: 0.78, metalness: 0 }),
      interior: new T.MeshStandardMaterial({ color: new T.Color(oscurecer(hex, 0.82)), roughness: 0.85 }),
      sombra: new T.MeshStandardMaterial({ color: new T.Color(oscurecer(hex, 0.5)), roughness: 1 }),
      metal: new T.MeshStandardMaterial({ color: new T.Color("#26231F"), roughness: 0.55, metalness: 0.2 }),
    };
  }

  function caja(T, grupo, w, h, d, x, y, z, m) {
    var malla = new T.Mesh(new T.BoxGeometry(w, h, d), m);
    malla.position.set(x, y, z);
    malla.castShadow = true;
    malla.receiveShadow = true;
    grupo.add(malla);
    return malla;
  }

  /* Módulo genérico: cajonera, placard, rack, biblioteca */
  function modulo(T, g, c, M, ox) {
    ox = ox || 0;
    var A = c.ancho / 1000, H = c.alto / 1000, P = c.prof / 1000;
    var nc = Math.max(1, c.columnas | 0), nf = Math.max(1, c.filas | 0);
    var baseH = 0;

    if (c.base === "zocalo") {
      baseH = 0.07;
      caja(T, g, A - 0.05, baseH, P - 0.06, ox, baseH / 2, -0.015, M.sombra);
    } else if (c.base === "patas") {
      baseH = 0.15;
      var pl = 0.032, ix = A / 2 - 0.045, iz = P / 2 - 0.045;
      [[-ix, -iz], [ix, -iz], [-ix, iz], [ix, iz]].forEach(function (p) {
        caja(T, g, pl, baseH, pl, ox + p[0], baseH / 2, p[1], M.metal);
      });
    }

    var y0 = baseH, cH = H - baseH;
    // Cuerpo
    caja(T, g, E, cH, P, ox - A / 2 + E / 2, y0 + cH / 2, 0, M.placa);
    caja(T, g, E, cH, P, ox + A / 2 - E / 2, y0 + cH / 2, 0, M.placa);
    caja(T, g, A - 2 * E, E, P, ox, y0 + cH - E / 2, 0, M.placa);
    caja(T, g, A - 2 * E, E, P, ox, y0 + E / 2, 0, M.placa);
    caja(T, g, A - 2 * E, cH - 2 * E, 0.006, ox, y0 + cH / 2, -P / 2 + 0.003, M.interior);

    var iW = A - 2 * E, iH = cH - 2 * E;
    var colW = (iW - (nc - 1) * E) / nc;
    for (var i = 1; i < nc; i++) {
      var dx = ox - A / 2 + E + i * colW + (i - 1) * E + E / 2;
      caja(T, g, E, iH, P - 0.006, dx, y0 + cH / 2, 0.003, M.placa);
    }

    if (c.frente === "abierto") {
      var s = (iH - (nf - 1) * E) / nf;
      for (var ci = 0; ci < nc; ci++) {
        var cx = ox - A / 2 + E + ci * (colW + E) + colW / 2;
        for (var r = 1; r < nf; r++) {
          caja(T, g, colW, E, P - 0.02, cx, y0 + E + r * s + (r - 1) * E + E / 2, 0.004, M.placa);
        }
      }
      return;
    }

    // Frentes superpuestos (tapan todo el cuerpo)
    caja(T, g, A - 0.004, cH - 0.004, 0.001, ox, y0 + cH / 2, P / 2 + 0.0006, M.sombra);
    var fW = (A - (nc - 1) * LUZ) / nc;
    var fH = (cH - (nf - 1) * LUZ) / nf;
    var zF = P / 2 + E / 2 + 0.0012;
    for (var col = 0; col < nc; col++) {
      for (var fila = 0; fila < nf; fila++) {
        var fx = ox - A / 2 + fW / 2 + col * (fW + LUZ);
        var fy = y0 + fH / 2 + fila * (fH + LUZ);
        if (c.frente === "cajon") {
          // Uñero: el frente es un poco más bajo y deja una ranura arriba
          var u = Math.min(0.014, fH * 0.12);
          caja(T, g, fW, fH - u, E, fx, fy - u / 2, zF, M.placa);
        } else {
          caja(T, g, fW, fH, E, fx, fy, zF, M.placa);
          // Ranura vertical en el borde de apertura (puerta sin tirador)
          var lado = (col % 2 === 0) ? 1 : -1;
          caja(T, g, 0.008, fH * 0.92, 0.002, fx + lado * (fW / 2 - 0.004), fy, zF + E / 2 + 0.0002, M.sombra);
        }
      }
    }
  }

  function escritorio(T, g, c, M) {
    var A = c.ancho / 1000, H = c.alto / 1000, P = c.prof / 1000;
    var tapa = 0.025, cw = 0.42;
    caja(T, g, A, tapa, P, 0, H - tapa / 2, 0, M.placa);
    // Cajonera a la izquierda (colgada de la tapa)
    modulo(T, g, { ancho: cw * 1000, alto: (H - tapa) * 1000, prof: (P - 0.02) * 1000, columnas: 1, filas: c.filas, frente: "cajon", base: "zocalo" }, M, -A / 2 + cw / 2);
    // Lateral derecho y panel de fondo
    caja(T, g, E, H - tapa, P, A / 2 - E / 2, (H - tapa) / 2, 0, M.placa);
    caja(T, g, A - cw - E, 0.3, E, -A / 2 + cw + (A - cw - E) / 2, H - tapa - 0.15, -P / 2 + 0.08, M.placa);
  }

  function construir(T, conf) {
    var g = new T.Group();
    var M = materiales(T, conf.color || "#B98A5E");
    if (conf.tipo === "escritorio") escritorio(T, g, conf, M);
    else modulo(T, g, conf, M, 0);
    g.userData.materiales = M;
    return g;
  }

  function liberar(obj) {
    obj.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
    var M = obj.userData.materiales;
    if (M) Object.keys(M).forEach(function (k) { M[k].dispose(); });
  }

  function luces(T, escena) {
    escena.add(new T.HemisphereLight(0xffffff, 0xcfc6b6, 1.5));
    var sol = new T.DirectionalLight(0xffffff, 2.4);
    sol.position.set(2.5, 4.5, 3.2);
    sol.castShadow = true;
    sol.shadow.mapSize.set(2048, 2048);
    sol.shadow.radius = 6;
    sol.shadow.bias = -0.0004;
    var sc = sol.shadow.camera;
    sc.left = -3; sc.right = 3; sc.top = 3; sc.bottom = -3; sc.near = 0.5; sc.far = 12;
    escena.add(sol);
    var relleno = new T.DirectionalLight(0xfff4e6, 0.6);
    relleno.position.set(-3, 2, 1);
    escena.add(relleno);
  }

  function prepararRenderer(T, r) {
    r.outputColorSpace = T.SRGBColorSpace;
    r.toneMapping = T.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    r.shadowMap.enabled = true;
    r.shadowMap.type = T.PCFSoftShadowMap;
  }

  function encuadrar(T, camara, objeto, aspecto, margen) {
    var caja3 = new T.Box3().setFromObject(objeto);
    var centro = caja3.getCenter(new T.Vector3());
    var tam = caja3.getSize(new T.Vector3());
    var radio = Math.sqrt(tam.x * tam.x + tam.z * tam.z) / 2;
    var vfov = camara.fov * Math.PI / 180;
    var hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspecto);
    var dH = (tam.y / 2) / Math.tan(vfov / 2);
    var dW = radio / Math.tan(hfov / 2);
    var d = Math.max(dH, dW) * (margen || 1.15) + radio * 0.6;
    camara.position.set(0, centro.y + d * 0.16, d);
    camara.lookAt(0, centro.y * 0.96, 0);
  }

  /* ---------------- Visor interactivo ---------------- */
  function Visor(contenedor, opciones) {
    this.el = contenedor;
    this.op = opciones || {};
    this.yaw = this.op.yaw != null ? this.op.yaw : -0.55;
    this.vel = 0;
    this.objeto = null;
    this.pendiente = null;
    var self = this;
    this.listo = cargarThree().then(function (T) { self._iniciar(T); return self; })
      .catch(function () { contenedor.classList.add("visor--sin3d"); });
  }

  Visor.prototype._iniciar = function (T) {
    var self = this;
    this.T = T;
    var r = new T.WebGLRenderer({ antialias: true, alpha: true });
    prepararRenderer(T, r);
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.r = r;
    r.domElement.className = "visor__lienzo";
    this.el.appendChild(r.domElement);

    this.escena = new T.Scene();
    luces(T, this.escena);
    var piso = new T.Mesh(new T.PlaneGeometry(30, 30), new T.ShadowMaterial({ opacity: 0.2 }));
    piso.rotation.x = -Math.PI / 2;
    piso.receiveShadow = true;
    this.escena.add(piso);
    this.pivote = new T.Group();
    this.escena.add(this.pivote);
    this.camara = new T.PerspectiveCamera(28, 1, 0.05, 50);

    // Girar solo en horizontal: arrastrar con el dedo o el mouse
    var arrastrando = false, ultimoX = 0;
    var c = r.domElement;
    c.addEventListener("pointerdown", function (e) {
      arrastrando = true; ultimoX = e.clientX; self.vel = 0; self.tocado = true;
      c.setPointerCapture(e.pointerId); self.el.classList.add("visor--arrastrando");
    });
    c.addEventListener("pointermove", function (e) {
      if (!arrastrando) return;
      var dx = e.clientX - ultimoX; ultimoX = e.clientX;
      self.yaw += dx * 0.009; self.vel = dx * 0.009;
    });
    function soltar() { arrastrando = false; self.el.classList.remove("visor--arrastrando"); }
    c.addEventListener("pointerup", soltar);
    c.addEventListener("pointercancel", soltar);
    this.arrastrando = function () { return arrastrando; };

    new ResizeObserver(function () { self._medir(); }).observe(this.el);
    this._medir();

    this.visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { self.visible = en[0].isIntersecting; }).observe(this.el);
    }
    var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var bucle = function () {
      requestAnimationFrame(bucle);
      if (!self.visible || !self.objeto) return;
      if (!self.arrastrando()) {
        if (self.objetivo != null) {
          self.yaw += (self.objetivo - self.yaw) * 0.12;
          if (Math.abs(self.objetivo - self.yaw) < 0.001) self.objetivo = null;
        }
        self.yaw += self.vel; self.vel *= 0.92;
        if (self.op.autoGiro && !self.tocado && !quieto) self.yaw += 0.0025;
      }
      self.pivote.rotation.y = self.yaw;
      r.render(self.escena, self.camara);
    };
    bucle();
    if (this.pendiente) this.mostrar(this.pendiente);
  };

  /* Gira suave hasta un ángulo (en radianes) */
  Visor.prototype.girarA = function (angulo) {
    this.tocado = true; this.vel = 0;
    var vuelta = Math.PI * 2;
    var actual = ((this.yaw % vuelta) + vuelta) % vuelta;
    this.yaw = actual > Math.PI ? actual - vuelta : actual;
    this.objetivo = angulo;
  };

  Visor.prototype._medir = function () {
    if (!this.r) return;
    var w = this.el.clientWidth, h = this.el.clientHeight;
    if (!w || !h) return;
    this.r.setSize(w, h, false);
    this.camara.aspect = w / h;
    this.camara.updateProjectionMatrix();
    if (this.objeto) encuadrar(this.T, this.camara, this.objeto, w / h, this.op.margen);
  };

  Visor.prototype.mostrar = function (conf) {
    if (!this.T) { this.pendiente = conf; return; }
    var T = this.T;
    if (this.objeto) { this.pivote.remove(this.objeto); liberar(this.objeto); }
    this.objeto = construir(T, conf);
    this.pivote.add(this.objeto);
    var tam = this.el.clientWidth / Math.max(1, this.el.clientHeight);
    // El encuadre se calcula sin giro, con el mueble más grande posible a cualquier ángulo
    encuadrar(T, this.camara, this.objeto, tam, this.op.margen);
    this.el.classList.add("visor--listo");
  };

  /* ---------------- Fotos fijas (tarjetas y ambientes) ---------------- */
  var cola = Promise.resolve();
  var rFoto = null;

  function foto(lista, op) {
    op = op || {};
    var trabajo = cola.then(function () {
      return cargarThree().then(function (T) {
        var w = op.ancho || 800, h = op.alto || 600;
        if (!rFoto) {
          rFoto = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
          prepararRenderer(T, rFoto);
        }
        rFoto.setPixelRatio(1);
        rFoto.setSize(w, h, false);
        var escena = new T.Scene();
        luces(T, escena);
        var grupo = new T.Group();
        var x = 0, sep = op.separacion != null ? op.separacion : 0.25;
        var piezas = lista.map(function (conf) { return construir(T, conf); });
        var anchos = lista.map(function (conf) { return conf.ancho / 1000; });
        var total = anchos.reduce(function (a, b) { return a + b; }, 0) + sep * (lista.length - 1);
        x = -total / 2;
        piezas.forEach(function (p, i) {
          var fondo = lista[i].prof / 1000;
          p.position.x = x + anchos[i] / 2;
          if (op.contraPared) p.position.z = fondo / 2 + 0.01;
          x += anchos[i] + sep;
          grupo.add(p);
        });
        if (op.pared) {
          var pared = new T.Mesh(new T.PlaneGeometry(40, 12), new T.MeshStandardMaterial({ color: new T.Color(op.pared), roughness: 1 }));
          pared.position.set(0, 6, op.contraPared ? 0 : -1);
          pared.receiveShadow = true;
          escena.add(pared);
          var piso = new T.Mesh(new T.PlaneGeometry(40, 20), new T.MeshStandardMaterial({ color: new T.Color(op.piso || "#C9C0B0"), roughness: 1 }));
          piso.rotation.x = -Math.PI / 2; piso.position.z = 10;
          piso.receiveShadow = true;
          escena.add(piso);
        } else {
          var sombra = new T.Mesh(new T.PlaneGeometry(30, 30), new T.ShadowMaterial({ opacity: 0.2 }));
          sombra.rotation.x = -Math.PI / 2; sombra.receiveShadow = true;
          escena.add(sombra);
        }
        grupo.rotation.y = op.yaw != null ? op.yaw : -0.5;
        escena.add(grupo);
        var cam = new T.PerspectiveCamera(op.fov || 28, w / h, 0.05, 60);
        var margen = op.margen || 1.2;
        if (op.anchoMin && total < op.anchoMin) margen *= op.anchoMin / total;
        encuadrar(T, cam, grupo, w / h, margen);
        if (op.pared) {
          // escena de ambiente: cámara de frente, un poco más alta
          var b = new T.Box3().setFromObject(grupo), ctr = b.getCenter(new T.Vector3());
          cam.position.set(ctr.x + (op.desplazar || 0), cam.position.y + 0.15, cam.position.z);
          cam.lookAt(ctr.x, ctr.y * 0.9, ctr.z);
        }
        rFoto.render(escena, cam);
        var url = rFoto.domElement.toDataURL("image/webp", 0.9);
        piezas.forEach(liberar);
        escena.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
        return url;
      });
    });
    cola = trabajo.catch(function () {});
    return trabajo;
  }

  window.MASS3D = { Visor: Visor, foto: foto, cargar: cargarThree };
})();
