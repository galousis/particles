// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../dist/electrons.js":[function(require,module,exports) {
var Electrons;

(function (Electrons) {
  'use strict';

  var Vector = function () {
    function Vector(_x, _y, _z) {
      this.x = _x;
      this.y = _y;
      this.z = _z;
    }

    Vector.prototype.RotateX = function (scalarA, scalarB) {
      return new Vector(this.x, scalarA * this.y - scalarB * this.z, scalarB * this.y + scalarA * this.z);
    };

    Vector.prototype.RotateY = function (scalarA, scalarB) {
      return new Vector(scalarA * this.x + scalarB * this.z, this.y, scalarA * this.z - scalarB * this.x);
    };

    Vector.prototype.RotateZ = function (scalarA, scalarB) {
      return new Vector(scalarA * this.x - scalarB * this.y, scalarB * this.x - scalarA * this.y, this.z);
    };

    Vector.prototype.Normalize = function () {
      var magnitude = this.abs();
      this.x /= magnitude;
      this.y /= magnitude;
      this.z /= magnitude;
      return this;
    };

    Vector.Distance = function (a, b) {
      var dx = b.x - a.x;
      var dy = b.y - a.y;
      var dz = b.z - a.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };

    Vector.Midpoint = function (a, b) {
      return new Vector((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
    };

    Vector.Dot = function (a, b) {
      return a.x * b.x + a.y * b.y + a.z * b.z;
    };

    Vector.prototype.dotProduct = function (v2) {
      return this.x * v2.x + this.y * v2.y + this.z * v2.z;
    };

    Vector.prototype.absSquared = function () {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    };

    Vector.prototype.abs = function () {
      return Math.sqrt(this.absSquared());
    };

    Vector.prototype.crossProduct = function (v2) {
      return this.x * v2.y - this.y * v2.x;
    };

    Vector.prototype.getDirection = function () {
      return Math.atan2(this.y, this.x);
    };

    Vector.prototype.add = function (v2) {
      return new Vector(this.x + v2.x, this.y + v2.y, this.z + v2.z);
    };

    Vector.prototype.addTo = function (v2) {
      this.x += v2.x;
      this.y += v2.y;
      this.z += v2.z;
    };

    Vector.prototype.subtract = function (v2) {
      return new Vector(this.x - v2.x, this.y - v2.y, this.z - v2.z);
    };

    Vector.prototype.subtractFrom = function (v2) {
      this.x -= v2.x;
      this.y -= v2.y;
      this.z -= v2.z;
    };

    Vector.prototype.multiply = function (scalar) {
      return new Vector(scalar * this.x, scalar * this.y, scalar * this.z);
    };

    Vector.prototype.multiplyBy = function (scalar) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
    };

    Vector.Zero = new Vector(0, 0, 0);
    return Vector;
  }();

  function RadiansFromDegrees(d) {
    return d * (Math.PI / 180);
  }

  var RotationMatrix = function () {
    function RotationMatrix(r, s, t) {
      this.r = r;
      this.s = s;
      this.t = t;
    }

    RotationMatrix.prototype.RotateX = function (radians) {
      var a = Math.cos(radians);
      var b = Math.sin(radians);
      return new RotationMatrix(this.r.RotateX(a, b), this.s.RotateX(a, b), this.t.RotateX(a, b));
    };

    RotationMatrix.prototype.RotateY = function (radians) {
      var a = Math.cos(radians);
      var b = Math.sin(radians);
      return new RotationMatrix(this.r.RotateY(a, b), this.s.RotateY(a, b), this.t.RotateY(a, b));
    };

    RotationMatrix.prototype.RotateZ = function (radians) {
      var a = Math.cos(radians);
      var b = Math.sin(radians);
      return new RotationMatrix(this.r.RotateZ(a, b), this.s.RotateZ(a, b), this.t.RotateZ(a, b));
    };

    RotationMatrix.prototype.Rotate = function (v) {
      return new Vector(v.dotProduct(this.r), v.dotProduct(this.s), v.dotProduct(this.t));
    };

    RotationMatrix.Unrotated = new RotationMatrix(new Vector(1, 0, 0), new Vector(0, 1, 0), new Vector(0, 0, 1));
    return RotationMatrix;
  }();

  var Electron = function () {
    function Electron(position) {
      this.position = position.Normalize();
    }

    Electron.prototype.AddExtForce = function (v2) {
      var dp = this.position.subtract(v2.position);
      var forcemagnitude = 1 / dp.absSquared();
      var force = dp.Normalize().multiply(forcemagnitude);
      this.force = this.force.add(force);
      v2.force = v2.force.subtract(force);
    };

    Electron.prototype.UpdatePosition = function (positionShift) {
      this.position = this.position.add(positionShift).Normalize();
    };

    Electron.prototype.TangentialForce = function () {
      var radialForce = this.position.multiply(this.force.dotProduct(this.position));
      return this.force.subtract(radialForce);
    };

    Electron.prototype.Rotate = function (rotmat) {
      this.position = rotmat.Rotate(this.position);
    };

    Electron.prototype.GetPosition = function () {
      return this.position;
    };

    Electron.prototype.ResetForce = function () {
      this.force = Vector.Zero;
    };

    return Electron;
  }();

  var CameraCoords = function () {
    function CameraCoords(h, v) {
      this.horizontal = h;
      this.vertical = v;
    }

    return CameraCoords;
  }();

  var Display = function () {
    function Display(pixelsWide, pixelsHigh, zoomFactor, parallaxDistance) {
      this.pixelsWide = pixelsWide;
      this.pixelsHigh = pixelsHigh;
      this.zoomFactor = zoomFactor;
      this.parallaxDistance = parallaxDistance;
    }

    Display.prototype.Erase = function (context) {
      context.clearRect(0, 0, this.pixelsWide, this.pixelsHigh);
    };

    Display.prototype.GetCameraCoords = function (point) {
      var scale = this.pixelsWide * this.zoomFactor / (this.parallaxDistance - point.z);
      var horizontal = scale * point.x;
      var vertical = scale * point.y;
      return new CameraCoords(this.pixelsWide / 2 + horizontal, this.pixelsHigh / 2 - vertical);
    };

    Display.prototype.DrawSphere = function (context, center, radius, color) {
      var origin = this.GetCameraCoords(center);
      var rho = radius / this.parallaxDistance;
      var xp = rho * Math.sqrt(this.parallaxDistance * this.parallaxDistance - radius * radius);
      var zp = rho * radius;
      var tangent = center.add(new Vector(xp, 0, zp));
      var edge = this.GetCameraCoords(tangent);
      var cradius = Math.abs(edge.horizontal - origin.horizontal);
      context.beginPath();
      context.arc(origin.horizontal, origin.vertical, cradius, 0, 2 * Math.PI, true);
      context.fillStyle = "white";
      context.strokeStyle = color;
      context.lineWidth = 1;
      context.stroke();
      return tangent.z;
    };

    Display.prototype.DrawLine = function (context, startpoint, endpoint, startcolor, endcolor, linedash) {
      var startcam = this.GetCameraCoords(startpoint);
      var endcam = this.GetCameraCoords(endpoint);
      var gradient = context.createLinearGradient(startcam.horizontal, startcam.vertical, endcam.horizontal, endcam.vertical);
      gradient.addColorStop(0, startcolor);
      gradient.addColorStop(1, endcolor);
      context.setLineDash(linedash);
      context.beginPath();
      context.moveTo(startcam.horizontal, startcam.vertical);
      context.lineTo(endcam.horizontal, endcam.vertical);
      context.strokeStyle = gradient;
      context.lineWidth = 1;
      context.stroke();
      context.setLineDash([]);
    };

    return Display;
  }();

  var Simulation = function () {
    function Simulation() {
      this.sphereCenter = new Vector(0, 0, 0);
      this.eList = [];
    }

    Simulation.prototype.AddElectron = function (p) {
      this.eList.push(p);
    };

    Simulation.prototype.RemoveElectron = function () {
      if (this.eList.length > 1) {
        this.eList.pop();
      }
    };

    Simulation.prototype.CountElectrons = function () {
      return this.eList.length;
    };

    Simulation.prototype.Update = function () {
      var n = this.eList.length;

      for (var i = 0; i < n; ++i) {
        this.eList[i].ResetForce();
      }

      for (var i = 0; i < n - 1; ++i) {
        for (var j = i + 1; j < n; ++j) {
          this.eList[i].AddExtForce(this.eList[j]);
        }
      }

      var tangentialForceList = [];
      var maxForceMag = 0;

      for (var i = 0; i < n; ++i) {
        var tf = this.eList[i].TangentialForce();
        var forceMag = tf.abs();
        tangentialForceList.push(tf);
        maxForceMag = Math.max(maxForceMag, forceMag);
      }

      if (maxForceMag > 0) {
        var dt = 0.005 / (maxForceMag * Math.sqrt(n));

        for (var i = 0; i < n; ++i) {
          this.eList[i].UpdatePosition(tangentialForceList[i].multiply(dt));
        }
      }
    };

    Simulation.prototype.AdjustCountElectrons = function (newCount) {
      while (this.CountElectrons() < newCount) {
        this.AddElectron(new Electron(RandomUnitVector()));
      }

      while (this.CountElectrons() > newCount) {
        this.RemoveElectron();
      }

      SaveOptions();
    };

    Simulation.prototype.Render = function (display) {
      var context = canvas.getContext('2d');
      display.Erase(context);
      var zbend = display.DrawSphere(context, this.sphereCenter, 1.0, '#d9d9d9');

      for (var _i = 0, _a = this.eList; _i < _a.length; _i++) {
        var p = _a[_i];
        display.DrawSphere(context, p.GetPosition(), 0.01, this.PointColor(p.GetPosition(), zbend));
      }

      var isConnectedIndex = {};
      var linedash = [[], [1, 3], [1, 6], [1, 9], [1, 13]];

      for (var level = 0; level < 5; ++level) {
        var nextIsConnectedIndex = {};
        var minDistance = null;

        for (var i = 0; i < this.eList.length - 1; ++i) {
          if (!isConnectedIndex[i]) {
            var ipos = this.eList[i].GetPosition();

            for (var j = i + 1; j < this.eList.length; ++j) {
              if (!isConnectedIndex[j]) {
                var jpos = this.eList[j].GetPosition();
                var distance = Vector.Distance(ipos, jpos);

                if (minDistance === null || distance < minDistance) {
                  minDistance = distance;
                }
              }
            }
          }
        }

        if (minDistance === null) {
          break;
        }

        var threshold = 1.005 * minDistance;

        for (var i = 0; i < this.eList.length - 1; ++i) {
          if (!isConnectedIndex[i]) {
            var ipos = this.eList[i].GetPosition();
            var icolor = this.PointColor(ipos, zbend);

            for (var j = i + 1; j < this.eList.length; ++j) {
              if (!isConnectedIndex[j]) {
                var jpos = this.eList[j].GetPosition();
                var distance = Vector.Distance(ipos, jpos);

                if (distance <= threshold) {
                  var jcolor = this.PointColor(jpos, zbend);
                  display.DrawLine(context, ipos, jpos, icolor, jcolor, linedash[level]);
                  nextIsConnectedIndex[i] = nextIsConnectedIndex[j] = true;
                }
              }
            }
          }
        }

        for (var i in nextIsConnectedIndex) {
          isConnectedIndex[i] = true;
        }
      }
    };

    Simulation.prototype.ColorRound = function (x) {
      return Math.round(255 * Math.min(1, Math.max(0, x)));
    };

    Simulation.prototype.PointColor = function (p, zlimit) {
      var frac = (zlimit - p.z) / (zlimit - -1.1);
      var red = this.ColorRound(0.2 + 0.8 * frac);
      var blue = this.ColorRound(1.7 * frac);
      var green = this.ColorRound(frac);
      return 'rgb(' + red + ',' + green + ',' + blue + ')';
    };

    Simulation.prototype.Rotate = function (rotmat) {
      for (var _i = 0, _a = this.eList; _i < _a.length; _i++) {
        var p = _a[_i];
        p.Rotate(rotmat);
      }
    };

    return Simulation;
  }();

  var canvas;
  var sim;
  var display;
  var UpdatesPerFrame = 10;
  var FrameDelayMillis = 30;
  var ZoomFactor = 7;
  var ParallaxDistance = 15.0;
  var MinElectronsCount = 2;
  var MaxElectronsCount = 200;
  var Options;
  var ySpinner = RotationMatrix.Unrotated.RotateY(RadiansFromDegrees(0.15));
  var xSpinner = RotationMatrix.Unrotated.RotateX(RadiansFromDegrees(0.0377));
  var initialTilt = RotationMatrix.Unrotated.RotateX(RadiansFromDegrees(-15.0));

  function AnimationFrame() {
    sim.Render(display);

    for (var i = 0; i < UpdatesPerFrame; ++i) {
      sim.Update();
    }

    sim.Rotate(ySpinner);
    sim.Rotate(xSpinner);
    window.setTimeout(AnimationFrame, FrameDelayMillis);
  }

  function RandomUnitVector() {
    while (true) {
      var a = 1 - 2 * Math.random();
      var b = 1 - 2 * Math.random();
      var mag = a * a + b * b;

      if (mag < 1) {
        var root = 2 * Math.sqrt(1 - mag);
        return new Vector(a * root, b * root, 1 - 2 * mag);
      }
    }
  }

  function OnEditElectronsCount() {
    var electronsCountEdit = document.getElementById('ElectronsCountEditBox');
    var errorMessage = document.getElementById('ErrorMessage');
    var text = electronsCountEdit.value;

    if (text.match(/^[0-9]{1,4}$/)) {
      var count = parseInt(text);

      if (count >= MinElectronsCount && count <= MaxElectronsCount) {
        sim.AdjustCountElectrons(count);
        errorMessage.textContent = '';
        electronsCountEdit.blur();
        return;
      }
    }

    errorMessage.textContent = 'Invalid number of electrons. Must be an integer in the range ' + MinElectronsCount + ' to ' + MaxElectronsCount;
  }

  function LoadOptions() {
    try {
      Options = JSON.parse(window.localStorage.getItem('Electrons'));
    } catch (e) {}

    if (!Options || typeof Options.CountElectrons !== 'number') {
      Options = {
        CountElectrons: 22
      };
    }
  }

  function SaveOptions() {
    try {
      Options.CountElectrons = sim.CountElectrons();
      window.localStorage.setItem('Electrons', JSON.stringify(Options));
    } catch (e) {}
  }

  window.onload = function () {
    LoadOptions();
    var hidePrompt = '&laquo;&nbsp;Κλείσιμο';
    var showPrompt = 'Πληροφορίες&nbsp;&raquo;';
    canvas = document.getElementById('SimCanvas');
    sim = new Simulation();

    for (var i = 0; i < Options.CountElectrons; ++i) {
      sim.AddElectron(new Electron(RandomUnitVector()));
    }

    var electronsCountEdit = document.getElementById('ElectronsCountEditBox');
    electronsCountEdit.value = Options.CountElectrons.toFixed();
    electronsCountEdit.onblur = OnEditElectronsCount;
    electronsCountEdit.setAttribute('min', MinElectronsCount.toFixed());
    electronsCountEdit.setAttribute('max', MaxElectronsCount.toFixed());

    electronsCountEdit.onkeypress = function (evt) {
      if (evt.keyCode === 13) {
        OnEditElectronsCount();
        event.preventDefault();
        return false;
      }

      return true;
    };

    display = new Display(canvas.width, canvas.height, ZoomFactor, ParallaxDistance);
    sim.Rotate(initialTilt);
    AnimationFrame();
  };
})(Electrons || (Electrons = {}));
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "33393" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../dist/electrons.js"], null)
//# sourceMappingURL=/electrons.247099c6.js.map