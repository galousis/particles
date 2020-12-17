"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var vectors_1 = require("./vectors");

var rotationmatrix_1 = require("./rotationmatrix");

var Electrons;

(function (Electrons) {
  'use strict';

  function RadiansFromDegrees(d) {
    return d * (Math.PI / 180);
  }

  var CameraCoords = function () {
    function CameraCoords(h, v) {
      this.hor = h;
      this.ver = v;
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
      var h = scale * point.x;
      var v = scale * point.y;
      return new CameraCoords(this.pixelsWide / 2 + h, this.pixelsHigh / 2 - v);
    };

    Display.prototype.DrawSphere = function (context, center, radius, color) {
      var origin = this.GetCameraCoords(center);
      var rho = radius / this.parallaxDistance;
      var xp = rho * Math.sqrt(this.parallaxDistance * this.parallaxDistance - radius * radius);
      var zp = rho * radius;
      var tangent = center.add(new vectors_1.VectorAnalysis.Vector(xp, 0, zp));
      var edge = this.GetCameraCoords(tangent);
      var cradius = Math.abs(edge.hor - origin.hor);
      context.beginPath();
      context.arc(origin.hor, origin.ver, cradius, 0, 2 * Math.PI, true);
      context.fillStyle = "white";
      context.strokeStyle = color;
      context.lineWidth = 1;
      context.stroke();
      return tangent.z;
    };

    Display.prototype.DrawLine = function (context, startpoint, endpoint, startcolor, endcolor, linedash) {
      var startcam = this.GetCameraCoords(startpoint);
      var endcam = this.GetCameraCoords(endpoint);
      var gradient = context.createLinearGradient(startcam.hor, startcam.ver, endcam.hor, endcam.ver);
      gradient.addColorStop(0, startcolor);
      gradient.addColorStop(1, endcolor);
      context.setLineDash(linedash);
      context.beginPath();
      context.moveTo(startcam.hor, startcam.ver);
      context.lineTo(endcam.hor, endcam.ver);
      context.strokeStyle = gradient;
      context.lineWidth = 1;
      context.stroke();
      context.setLineDash([]);
    };

    return Display;
  }();

  var Particle = function () {
    function Particle(position) {
      this.position = position.UnitVector();
    }

    Particle.prototype.GetPosition = function () {
      return this.position;
    };

    Particle.prototype.ResetForce = function () {
      this.force = vectors_1.VectorAnalysis.Vector.Zero;
    };

    Particle.prototype.AddForce = function (other) {
      var dp = this.position.sub(other.position);
      var forcemag = 1.0 / dp.absSquared();
      var force = dp.UnitVector().mul(forcemag);
      this.force = this.force.add(force);
      other.force = other.force.sub(force);
    };

    Particle.prototype.Migrate = function (positionShift) {
      this.position = this.position.add(positionShift).UnitVector();
    };

    Particle.prototype.TangentialForce = function () {
      var radialForce = this.position.mul(this.force.dot(this.position));
      return this.force.sub(radialForce);
    };

    Particle.prototype.Rotate = function (rotmat) {
      this.position = rotmat.Rotate(this.position);
    };

    return Particle;
  }();

  var Simulation = function () {
    function Simulation() {
      this.sphereCenter = new vectors_1.VectorAnalysis.Vector(0, 0, 0);
      this.particleList = [];
    }

    Simulation.prototype.InsertParticle = function (p) {
      this.particleList.push(p);
    };

    Simulation.prototype.RemoveParticle = function () {
      if (this.particleList.length > 1) {
        this.particleList.pop();
      }
    };

    Simulation.prototype.ParticleCount = function () {
      return this.particleList.length;
    };

    Simulation.prototype.Update = function () {
      var n = this.particleList.length;

      for (var i = 0; i < n; ++i) {
        this.particleList[i].ResetForce();
      }

      for (var i = 0; i < n - 1; ++i) {
        for (var j = i + 1; j < n; ++j) {
          this.particleList[i].AddForce(this.particleList[j]);
        }
      }

      var tangentialForceList = [];
      var maxForceMag = 0;

      for (var i = 0; i < n; ++i) {
        var tf = this.particleList[i].TangentialForce();
        var forceMag = tf.abs();
        tangentialForceList.push(tf);
        maxForceMag = Math.max(maxForceMag, forceMag);
      }

      if (maxForceMag > 0) {
        var dt = 0.005 / (maxForceMag * Math.sqrt(n));

        for (var i = 0; i < n; ++i) {
          this.particleList[i].Migrate(tangentialForceList[i].mul(dt));
        }
      }
    };

    Simulation.prototype.AdjustParticleCount = function (newCount) {
      while (this.ParticleCount() < newCount) {
        this.InsertParticle(new Particle(RandomUnitVector()));
      }

      while (this.ParticleCount() > newCount) {
        this.RemoveParticle();
      }

      SaveOptions();
    };

    Simulation.prototype.Render = function (display) {
      var context = canvas.getContext('2d');
      display.Erase(context);
      var zbend = display.DrawSphere(context, this.sphereCenter, 1.0, '#d9d9d9');

      for (var _i = 0, _a = this.particleList; _i < _a.length; _i++) {
        var p = _a[_i];
        display.DrawSphere(context, p.GetPosition(), 0.01, this.PointColor(p.GetPosition(), zbend));
      }

      var isConnectedIndex = {};
      var linedash = [[], [1, 3], [1, 6], [1, 9], [1, 13]];

      for (var level = 0; level < 5; ++level) {
        var nextIsConnectedIndex = {};
        var minDistance = null;

        for (var i = 0; i < this.particleList.length - 1; ++i) {
          if (!isConnectedIndex[i]) {
            var ipos = this.particleList[i].GetPosition();

            for (var j = i + 1; j < this.particleList.length; ++j) {
              if (!isConnectedIndex[j]) {
                var jpos = this.particleList[j].GetPosition();
                var distance = vectors_1.VectorAnalysis.Vector.Distance(ipos, jpos);

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

        for (var i = 0; i < this.particleList.length - 1; ++i) {
          if (!isConnectedIndex[i]) {
            var ipos = this.particleList[i].GetPosition();
            var icolor = this.PointColor(ipos, zbend);

            for (var j = i + 1; j < this.particleList.length; ++j) {
              if (!isConnectedIndex[j]) {
                var jpos = this.particleList[j].GetPosition();
                var distance = vectors_1.VectorAnalysis.Vector.Distance(ipos, jpos);

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
      var blue = this.ColorRound(1.2 * frac);
      var green = this.ColorRound(frac);
      return 'rgb(' + red + ',' + green + ',' + blue + ')';
    };

    Simulation.prototype.Rotate = function (rotmat) {
      for (var _i = 0, _a = this.particleList; _i < _a.length; _i++) {
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
  var MinParticleCount = 2;
  var MaxParticleCount = 200;
  var Options;
  var ySpinner = rotationmatrix_1.Rotation.Matrix.Unrotated.RotateY(RadiansFromDegrees(0.15));
  var xSpinner = rotationmatrix_1.Rotation.Matrix.Unrotated.RotateX(RadiansFromDegrees(0.0377));
  var initialTilt = rotationmatrix_1.Rotation.Matrix.Unrotated.RotateX(RadiansFromDegrees(-15.0));

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
        return new vectors_1.VectorAnalysis.Vector(a * root, b * root, 1 - 2 * mag);
      }
    }
  }

  function OnEditParticleCount() {
    var particleCountEdit = document.getElementById('ParticleCountEditBox');
    var errorMessageDiv = document.getElementById('ErrorMessageDiv');
    var text = particleCountEdit.value;

    if (text.match(/^[0-9]{1,4}$/)) {
      var count = parseInt(text);

      if (count >= MinParticleCount && count <= MaxParticleCount) {
        sim.AdjustParticleCount(count);
        errorMessageDiv.textContent = '';
        particleCountEdit.blur();
        return;
      }
    }

    errorMessageDiv.textContent = 'Invalid number of particles. Must be an integer in the range ' + MinParticleCount + ' to ' + MaxParticleCount;
  }

  function LoadOptions() {
    try {
      Options = JSON.parse(window.localStorage.getItem('Electrons'));
    } catch (e) {}

    if (!Options || typeof Options.ParticleCount !== 'number') {
      Options = {
        ParticleCount: 22
      };
    }
  }

  function SaveOptions() {
    try {
      Options.ParticleCount = sim.ParticleCount();
      window.localStorage.setItem('Electrons', JSON.stringify(Options));
    } catch (e) {}
  }

  window.onload = function () {
    LoadOptions();
    var explanationDiv = document.getElementById('ExplanationDiv');
    var hideShowExplanationButton = document.getElementById('HideShowExplanationButton');
    var hidePrompt = '&laquo;&nbsp;Κλείσιμο';
    var showPrompt = 'Πληροφορίες&nbsp;&raquo;';
    explanationDiv.style.display = 'none';
    hideShowExplanationButton.innerHTML = showPrompt;

    hideShowExplanationButton.onclick = function () {
      if (explanationDiv.style.display === 'none') {
        explanationDiv.style.display = '';
        hideShowExplanationButton.innerHTML = hidePrompt;
      } else {
        explanationDiv.style.display = 'none';
        hideShowExplanationButton.innerHTML = showPrompt;
      }
    };

    canvas = document.getElementById('SimCanvas');
    sim = new Simulation();

    for (var i = 0; i < Options.ParticleCount; ++i) {
      sim.InsertParticle(new Particle(RandomUnitVector()));
    }

    var particleCountEdit = document.getElementById('ParticleCountEditBox');
    particleCountEdit.value = Options.ParticleCount.toFixed();
    particleCountEdit.onblur = OnEditParticleCount;
    particleCountEdit.setAttribute('min', MinParticleCount.toFixed());
    particleCountEdit.setAttribute('max', MaxParticleCount.toFixed());
    document.getElementById('MinParticleCountSpan').textContent = MinParticleCount.toFixed();
    document.getElementById('MaxParticleCountSpan').textContent = MaxParticleCount.toFixed();

    particleCountEdit.onkeypress = function (evt) {
      if (evt.keyCode === 13) {
        OnEditParticleCount();
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