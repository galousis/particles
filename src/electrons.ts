module Electrons {
    
    'use strict';

    /**
     * Vector
     */
    class Vector 
    {
        // Properties
        public x: number;
        public y: number;
        public z:number;
        // To reset the force on the electron we need the Zero vector
        public static Zero:Vector = new Vector(0, 0, 0);
    
        /**
         * Creates a new Vector instance using cartesian coordinates
         *
         * @param {number} x The x component of the vector
         * @param {number} y The y component of the vector
         * @param {number} z The y component of the vector
         * @memberof Vector
         */
        constructor(_x:number, _y:number, _z:number) 
        {
            this.x = _x;
            this.y = _y;
            this.z = _z;
        }

        /**
         * Rotate X 
         * @param {number} scalarA
         * @param {number} scalarB
         * @memberof Vector
         */
        public RotateX(scalarA:number, scalarB:number):Vector 
        {
            return new Vector(this.x, scalarA*this.y - scalarB*this.z, scalarB*this.y + scalarA*this.z);
        }

        /**
         * Rotate Y 
         * @param {number} scalarA
         * @param {number} scalarB
         * @memberof Vector
         */
        public RotateY(scalarA:number, scalarB:number):Vector 
        {
            return new Vector(scalarA*this.x + scalarB*this.z, this.y, scalarA*this.z - scalarB*this.x);
        }

        /**
         * Rotate Z 
         * @param {number} scalarA
         * @param {number} scalarB
         * @memberof Vector
         */
        public RotateZ(scalarA:number, scalarB:number):Vector 
        {
            return new Vector(scalarA*this.x - scalarB*this.y, scalarB*this.x - scalarA*this.y, this.z);
        }

        /**
         * Converts the vector into a unit vector in the same direction
         *
         * @memberof Vector
         */
        public Normalize() 
        {
            let magnitude = this.abs();
            this.x /= magnitude;
            this.y /= magnitude;
            this.z /= magnitude;
            return this;
        }

        /**
         * Calc distance between 2 given vectors
         *
         * @param {Vector} a 
         * @param {Vector} b 
         * @returns {number} 
         */
        public static Distance(a:Vector, b:Vector):number 
        {
            var dx:number = b.x - a.x;
            var dy:number = b.y - a.y;
            var dz:number = b.z - a.z;

            return Math.sqrt(dx*dx + dy*dy + dz*dz);
        }

        /**
         * Get the midpoint vector for 2 given vectors
         *
         * @param {Vector} a 
         * @param {Vector} b 
         * @returns {Vector} 
         */
        public static Midpoint(a:Vector, b:Vector):Vector 
        {
            return new Vector((a.x + b.x)/2, (a.y + b.y)/2, (a.z + b.z)/2);
        }

        /**
         * Finds the dot product
         *
         * @param {Vector} a 
         * @param {Vector} b 
         * @returns {number} The dot product of a, b
         * @memberof Vector
         */
        public static Dot(a:Vector, b:Vector):number 
        {
            return a.x*b.x + a.y*b.y + a.z*b.z;
        }

        /**
         * Finds the dot product of this vector and another vector
         *
         * @param {Vector} v2 The vector to find the dot product with
         * @returns {number} The dot product of this and the given vector
         * @memberof Vector
         */
        public dotProduct(v2:Vector):number 
        {
            //return Vector.Dot(this, v2);
            return this.x*v2.x + this.y*v2.y + this.z*v2.z
            
        }
    
        /**
         * Finds the dot product of this vector with its self
         *
         * @returns {nubler} The dot product 
         * @memberof Vector
         */
        public absSquared():number 
        {
            //return Vector.Dot(this, this);
            return this.x*this.x + this.y*this.y + this.z*this.z
        }

        /**
         * Returns the sqrt of dot product of this vector
         *
         * @returns {nubler} The dot product 
         * @memberof Vector
         */
        public abs():number 
        {
            return Math.sqrt(this.absSquared());
        }

        /**
         * Finds the cross product of this vector and another vector
         *
         * While the cross product in 2D is not well-defined, it can be calculated in terms of an imaginary z-axis
         *
         * @param {Vector} v2 The vector to find the cross product with
         * @returns {number} The cross product of the two vectors
         * @memberof Vector
         */
        crossProduct(v2: Vector): number 
        {
            return (this.x * v2.y) - (this.y * v2.x);
        }
    
        /**
         * Gets the direction of the current vector in radians
         *
         * The direction is the angle in polar coordinates
         *
         * @returns {number} The direction (or angle) of the vector
         * @memberof Vector
         */
        getDirection(): number 
        {
            return Math.atan2(this.y, this.x);
        }

        /**
         * Adds a vector to the current vector, returning the sum as a new vector
         *
         * @param {Vector} v2 The vector to add
         * @returns {Vector} The sum of the two vectors
         * @memberof Vector
         */
        public add(v2: Vector): Vector 
        {
            return new Vector(this.x + v2.x, this.y + v2.y, this.z + v2.z);
        }
    
        /**
         * Adds a vector to the current vector, modifying the current vector's components to represent
         * the difference
         *
         * @param {Vector} v2 The vector to add
         * @memberof Vector
         */
        public addTo(v2: Vector) 
        {
            this.x += v2.x;
            this.y += v2.y;
            this.z += v2.z;
        }

        /**
         * Subtracts a vector from the current vector, returning the difference as a new vector
         *
         * @param {Vector} v2 The vector to subtract
         * @returns {Vector} The difference of the two vectors
         * @memberof Vector
         */
        public subtract(v2: Vector): Vector 
        {
            return new Vector(this.x - v2.x, this.y - v2.y, this.z - v2.z);
        }
    
        /**
         * Subtracts a vector from the current vector, modifying the current vector's components to represent
         * the difference
         *
         * @param {Vector} v2 The vector to subtract
         * @memberof Vector
         */
        public subtractFrom(v2: Vector) 
        {
            this.x -= v2.x;
            this.y -= v2.y;
            this.z -= v2.z;
        }

        /**
         * Multiplies the vector by a scalar value, returning the product as a new vector
         *
         * @param {number} scalar The scalar value to multiply the vector by
         * @returns {Vector} The product of the vector and the scalar
         * @memberof Vector
         */
        public multiply(scalar: number): Vector 
        {
            return new Vector(scalar*this.x, scalar*this.y, scalar*this.z);
        }
    
        /**
         * Multiplies the vector by a scalar value, modifying the current vector's components to represent
         * the product
         *
         * @param {number} scalar The scalar value to multiply the vector by
         * @memberof Vector
         */
        public multiplyBy(scalar: number) 
        {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
        }
    }

    function RadiansFromDegrees(d:number):number {
        return d * (Math.PI / 180);
    }

    /**
     * RotationMatrix
     */
    class RotationMatrix 
    {
        // properties
        public static Unrotated:RotationMatrix = new RotationMatrix( new Vector(1, 0, 0), new Vector(0, 1, 0), new Vector(0, 0, 1));

        /**
         * Constructor
         * @param {Vector} r 
         * @param {Vector} s 
         * @param {Vector} t 
         */
        private constructor(private r:Vector, private s:Vector, private t:Vector) {}

        /**
         * @param {number} radians 
         * @returns {RotationMatrix} 
         * @memberof RotationMatrix
         */
        public RotateX(radians:number):RotationMatrix 
        {
            let a:number = Math.cos(radians);
            let b:number = Math.sin(radians);

            return new RotationMatrix( this.r.RotateX(a, b), this.s.RotateX(a, b), this.t.RotateX(a, b));
        }

        /**
         * @param {number} radians 
         * @returns {RotationMatrix} 
         * @memberof RotationMatrix
         */
        public RotateY(radians:number):RotationMatrix 
        {
            let a:number = Math.cos(radians);
            let b:number = Math.sin(radians);

            return new RotationMatrix( this.r.RotateY(a, b), this.s.RotateY(a, b),this.t.RotateY(a, b));
        }

        /**
         * @param {number} radians 
         * @returns {RotationMatrix} 
         * @memberof RotationMatrix
         */
        public RotateZ(radians:number):RotationMatrix 
        {
            let a:number = Math.cos(radians);
            let b:number = Math.sin(radians);
            
            return new RotationMatrix( this.r.RotateZ(a, b), this.s.RotateZ(a, b), this.t.RotateZ(a, b));
        }

        /**
         * @returns {Vector} 
         * @param {Vector} v 
         * @memberof RotationMatrix
         */
        public Rotate(v:Vector):Vector 
        {
            return new Vector(v.dotProduct(this.r), v.dotProduct(this.s), v.dotProduct(this.t));
        }
    }

    /**
     * Electron
     */
    class Electron 
    {
        //properties
        private position:Vector;
        private force:Vector;

        /**
         * Constructor
         * @param {Vector} position 
         */
        public constructor(position:Vector) 
        {
            this.position = position.Normalize();
        }

        /**
         * @param {Electron} v2 
         * @returns {void} 
         * @memberof Electron
         */
        public AddExtForce(v2:Electron):void 
        {
            // Force of electrically charged electrons: F = k*q1*q2/r^2. Set F = 1/r^2.
            let dp:Vector               = this.position.subtract(v2.position);
            let forcemagnitude:number   = 1 / dp.absSquared();
            let force:Vector            = dp.Normalize().multiply(forcemagnitude);
            this.force                  = this.force.add(force);
            v2.force                    = v2.force.subtract(force);
        }

        /**
         * Update electron position. We need to move the electron to the direction of the force while keeping in mind
         * to constrain its move onto the sphere surface.
         * @param {Vector} positionShift 
         * @returns {void}
         * @memberof Electron
         */
        public UpdatePosition(positionShift:Vector):void 
        {
            this.position = this.position.add(positionShift).Normalize();
        }

        /**
         * Calculate tangential force.
         * force = radial force + tangential force
         * @returns {Vector}
         * @memberof Electron
         */
        public TangentialForce():Vector 
        {
            // Calculate radial component using dot product and subtract to get tangential force
            let radialForce:Vector = this.position.multiply(this.force.dotProduct(this.position));
            return this.force.subtract(radialForce);
        }

        /**
         * @param rotmat 
         * @memberof Electron
         */
        public Rotate(rotmat:RotationMatrix):void 
        {
            this.position = rotmat.Rotate(this.position);
        }

        /**
         * Position getter
         */
        public GetPosition():Vector 
        {
            return this.position;
        }

        /**
         * Force setter
         */
        public ResetForce():void 
        {
            this.force = Vector.Zero;
        }
    }

    /**
     * CameraCoords
     */
    class CameraCoords 
    {
        // properties
        readonly horizontal:number;
        readonly vertical:number;

        /**
         * Constructor
         * @param {number} h 
         * @param {number} v 
         */
        constructor (h:number, v:number) 
        {
            this.horizontal = h;
            this.vertical = v;
        }
    }

    /**
     * Display
     */
    class Display 
    {
        /**
         * Constructor
         * 
         * @param {number} pixelsWide       // wide number of pixels
         * @param {number} pixelsHigh       // high number of pixels
         * @param {number} zoomFactor       // the greater the value the more zoom in
         * @param {number} parallaxDistance // for scaling effect of distance on perspective
         * @memberof Display
         */
        public constructor( private pixelsWide:number, private pixelsHigh:number, private zoomFactor:number, private parallaxDistance:number) {}

        /**
         * @param {CanvasRenderingContext2D} context 
         * @return void
         * @memberof Display
         */
        public Erase(context:CanvasRenderingContext2D):void 
        {
            context.clearRect(0, 0, this.pixelsWide, this.pixelsHigh);
            //context.strokeRect(0, 0, this.pixelsWide, this.pixelsHigh);
        }

        /**
         * GetCameraCoords
         * @param point
         * @memberof Display 
         */
        private GetCameraCoords(point:Vector):CameraCoords 
        {
            var scale:number        = this.pixelsWide * this.zoomFactor / (this.parallaxDistance - point.z);
            var horizontal:number   = scale * point.x;
            var vertical:number     = scale * point.y;

            return new CameraCoords(this.pixelsWide/2 + horizontal, this.pixelsHigh/2 - vertical);
        }

        /**
         * Draw the sphere.
         * 
         * @param context 
         * @param center 
         * @param radius 
         * @param color
         * @memberof Display 
         */
        public DrawSphere( context:CanvasRenderingContext2D, center:Vector, radius:number, color:string):number
        {
            // NOTE: This isn't quite right. The actual projection of a sphere
            // onto the pinhole camera screen is an ellipse, not a circle.
            // This will matter only for very low zoom with very close spheres
            // that are far off center.

            let origin:CameraCoords = this.GetCameraCoords(center);
            let rho:number = radius / this.parallaxDistance;
            let xp:number = rho * Math.sqrt(this.parallaxDistance*this.parallaxDistance - radius*radius);
            let zp:number = rho * radius;
            let tangent:Vector = center.add(new Vector(xp, 0, zp));
            let edge:CameraCoords = this.GetCameraCoords(tangent);
            let cradius:number = Math.abs(edge.horizontal - origin.horizontal);

            context.beginPath();
            context.arc(origin.horizontal, origin.vertical, cradius, 0, 2*Math.PI, true);
            context.fillStyle = "white";
            context.strokeStyle = color;
            context.lineWidth = 1;
            context.stroke();

            return tangent.z;   // the z-value beneath which an electron is "around the bend"
        }

        /**
         * Draw line.
         * @param context 
         * @param startpoint 
         * @param endpoint 
         * @param startcolor 
         * @param endcolor 
         * @param linedash 
         * @memberof Display
         */
        public DrawLine( context:CanvasRenderingContext2D, startpoint:Vector, endpoint:Vector, startcolor:string, endcolor:string, linedash:number[]):void
        {
            let startcam:CameraCoords = this.GetCameraCoords(startpoint);
            let endcam:CameraCoords = this.GetCameraCoords(endpoint);

            let gradient:CanvasGradient = context.createLinearGradient(
                startcam.horizontal, startcam.vertical,
                endcam.horizontal, endcam.vertical);

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
        }
    }

    /**
     * Simulation
     */
    class Simulation 
    {
        // properties
        private eList:Electron[];
        private sphereCenter:Vector = new Vector(0, 0, 0);

        /**
         * Constructor
         */
        public constructor() {
            this.eList = [];
        }

        /**
         * 
         * @param {Electron} p
         * @memberof Simulation 
         */
        public AddElectron(p:Electron):void 
        {
            this.eList.push(p);
        }

        /**
         * @returns {void}
         * @memberof Simulation
         */
        public RemoveElectron():void 
        {
            if (this.eList.length > 1) 
            {
                this.eList.pop();
            }
        }

        /**
         * @returns {number}
         * @memberof Simulation
         */
        public CountElectrons():number {
            return this.eList.length;
        }

        /**
         * @returns {void}
         * @memberof Simulation
         */
        public Update():void 
        {
            let n:number = this.eList.length;

            for (let i=0; i < n; ++i)
            {
                this.eList[i].ResetForce();
            }

            for (let i=0; i < n-1; ++i) 
            {
                for (let j=i+1; j < n; ++j) 
                {
                    this.eList[i].AddExtForce(this.eList[j]);
                }
            }

            let tangentialForceList:Vector[] = [];
            let maxForceMag:number = 0;

            for (let i:number=0; i < n; ++i) 
            {
                let tf:Vector       = this.eList[i].TangentialForce();
                let forceMag:number = tf.abs();

                tangentialForceList.push(tf);
                maxForceMag = Math.max(maxForceMag, forceMag);
            }

            if (maxForceMag > 0) 
            {
                // We want to move each electron a small distance compared with
                // the average distance between electrons.
                // As the number of electrons on the sphere increases, the
                // average distance between them goes down as an inverse square root.
                let dt:number = 0.005 / (maxForceMag * Math.sqrt(n));

                for (let i:number=0; i < n; ++i) 
                {
                    this.eList[i].UpdatePosition(tangentialForceList[i].multiply(dt));
                }
            }
        }

        /**
         * @param {number} newCount 
         * @returns {void}
         * @memberof Simulation
         */
        public AdjustCountElectrons(newCount:number):void 
        {
            while (this.CountElectrons() < newCount) 
            {
                this.AddElectron(new Electron(RandomUnitVector()));
            }

            while (this.CountElectrons() > newCount) 
            {
                this.RemoveElectron();
            }

            SaveOptions();
        }

        /**
         * @param {Display} display 
         * @returns {void}
         * @memberof Simulation 
         */
        public Render(display:Display):void 
        {
            // Store the 2D context
            let context:CanvasRenderingContext2D = canvas.getContext('2d');
            display.Erase(context);

            let zbend:number = display.DrawSphere(context, this.sphereCenter, 1.0, '#d9d9d9');

            for (let p of this.eList) 
            {
                display.DrawSphere(context, p.GetPosition(), 0.01, this.PointColor(p.GetPosition(), zbend));
            }

            let isConnectedIndex:{[index:number]:boolean} = {};
            let linedash = [[], [3,6], [], [1,5], [1,10]];

            for (let level=0; level < 5; ++level) 
            {
                // Find the smallest distance between any two (as-yet unconnected) electrons.
                let nextIsConnectedIndex:{[index:number]:boolean} = {};
                let minDistance:number = null;

                for (let i:number = 0; i < this.eList.length - 1; ++i) 
                {
                    if (!isConnectedIndex[i]) 
                    {
                        let ipos:Vector = this.eList[i].GetPosition();

                        for (let j:number = i+1; j < this.eList.length; ++j) 
                        {
                            if (!isConnectedIndex[j]) 
                            {
                                let jpos:Vector = this.eList[j].GetPosition();
                                let distance:number = Vector.Distance(ipos, jpos);

                                if ((minDistance === null) || (distance < minDistance)) 
                                {
                                    minDistance = distance;
                                }
                            }
                        }
                    }
                }

                if (minDistance === null) 
                {
                    break;      // nothing more to connect
                }

                // Connect all pairs of electrons whose distance is not much larger than the minimum.
                let threshold:number = 1.005 * minDistance;

                for (let i:number = 0; i < this.eList.length - 1; ++i) 
                {
                    if (!isConnectedIndex[i]) 
                    {
                        let ipos:Vector = this.eList[i].GetPosition();
                        let icolor:string = this.PointColor(ipos, zbend);

                        for (let j:number = i+1; j < this.eList.length; ++j) 
                        {
                            if (!isConnectedIndex[j]) 
                            {
                                let jpos:Vector = this.eList[j].GetPosition();
                                let distance:number = Vector.Distance(ipos, jpos);

                                if (distance <= threshold) 
                                {
                                    let jcolor:string = this.PointColor(jpos, zbend);
                                    //console.log(linedash[level]);
                                    display.DrawLine(context, ipos, jpos, icolor, jcolor, linedash[level]);
                                    nextIsConnectedIndex[i] = nextIsConnectedIndex[j] = true;
                                }
                            }
                        }
                    }
                }

                for (let i in nextIsConnectedIndex) 
                {
                    isConnectedIndex[i] = true;
                }
            }
        }

        /**
         * @param {number} x 
         * @memberof Simulation
         */
        private ColorRound(x:number):number 
        {
            return Math.round(255 * Math.min(1, Math.max(0, x)));
        }

        /**
         * When electron travels to the hidden sphere surface gradually change its color.
         *  
         * @param {Vector} p 
         * @param {number} zlimit 
         * @returns {string}
         * @memberof Simulation
         */
        private PointColor(p:Vector, zlimit:number):string 
        {
            let frac:number     = (zlimit - p.z) / (zlimit - (-1.1));
            let red:number      = this.ColorRound(0.2 + (0.8*frac));
            let blue:number     = this.ColorRound(1.7*frac);
            let green:number    = this.ColorRound(frac);

            return 'rgb(' + red + ',' + green + ',' + blue + ')';
        }

        /**
         * @param {RotationMatrix} rotmat 
         * @returns {void}
         * @memberof Simulation
         */
        public Rotate(rotmat:RotationMatrix):void 
        {
            for (let p of this.eList) 
            {
                p.Rotate(rotmat);
            }
        }
    }

    // Init params
    var canvas:HTMLCanvasElement;
    var sim:Simulation;
    var display:Display;

    // Conf
    const UpdatesPerFrame:number    = 10;
    const FrameDelayMillis:number   = 30;
    const ZoomFactor:number         = 7;
    const ParallaxDistance:number   = 15.0;
    const MinElectronsCount:number   = 2;
    const MaxElectronsCount:number   = 200;

    var Options;
    var ySpinner:RotationMatrix     = RotationMatrix.Unrotated.RotateY(RadiansFromDegrees(0.15));
    var xSpinner:RotationMatrix     = RotationMatrix.Unrotated.RotateX(RadiansFromDegrees(0.0377));
    var initialTilt:RotationMatrix  = RotationMatrix.Unrotated.RotateX(RadiansFromDegrees(-15.0));

    /**
     * @returns {void}
     */
    function AnimationFrame():void 
    {
        sim.Render(display);
        for (let i=0; i < UpdatesPerFrame; ++i) 
        {
            sim.Update();
        }

        sim.Rotate(ySpinner);
        sim.Rotate(xSpinner);

        window.setTimeout(AnimationFrame, FrameDelayMillis);
    }

    /**
     * Algorithm for picking a random point on a sphere, which avoids clustering of points on the 2 polars region.
     * http://mathworld.wolfram.com/SpherePointPicking.html
     * https://angms.science/doc/RM/randUnitVec.pdf
     * See equations (9), (10), (11) there.
     * @returns {Vector} 
     */
    function RandomUnitVector():Vector 
    {
        while (true) 
        {
            var a = 1 - 2*Math.random();
            var b = 1 - 2*Math.random();
            var mag = (a*a) + (b*b);

            if (mag < 1) 
            {
                var root = 2 * Math.sqrt(1 - mag);
                return new Vector(a*root, b*root, 1 - (2*mag));
            }
        }
    }

    /**
     * OnEditElectronsCount
     */
    function OnEditElectronsCount() 
    {
        var electronsCountEdit  = <HTMLInputElement> document.getElementById('ElectronsCountEditBox');
        var errorMessage     = document.getElementById('ErrorMessage');
        var text                = electronsCountEdit.value;

        if (text.match(/^[0-9]{1,4}$/)) 
        {
            var count = parseInt(text);

            if (count >= MinElectronsCount && count <= MaxElectronsCount) 
            {
                sim.AdjustCountElectrons(count);
                errorMessage.textContent = '';
                electronsCountEdit.blur();
                return;
            }
        }
        errorMessage.textContent = 'Invalid number of electrons. Must be an integer in the range ' +
            MinElectronsCount + ' to ' + MaxElectronsCount;
    }

    /**
     * LoadOptions
     */
    function LoadOptions() 
    {
        try {
            Options = JSON.parse(window.localStorage.getItem('Electrons'));
        } catch(e) {}

        if (!Options || typeof Options.CountElectrons !== 'number') 
        {
            Options = { CountElectrons: 22 };
        }
    }

    /**
     * SaveOptions
     */
    function SaveOptions() 
    {
        try {
            Options.CountElectrons = sim.CountElectrons();
            window.localStorage.setItem('Electrons', JSON.stringify(Options));
        } catch (e) {}
    }

    window.onload = function() 
    {

        LoadOptions();

        // var explanationDiv              = document.getElementById('ExplanationDiv');
        // var hideShowExplanationButton   = document.getElementById('HideShowExplanationButton');

        var hidePrompt = '&laquo;&nbsp;Κλείσιμο';
        var showPrompt = 'Πληροφορίες&nbsp;&raquo;';

        // Get the canvas element from the DOM
        canvas = <HTMLCanvasElement> document.getElementById('SimCanvas');

        //canvas.addEventListener('click', OnCanvasClick, false);
        sim = new Simulation();

        for (let i:number = 0; i < Options.CountElectrons; ++i) 
        {
            sim.AddElectron(new Electron(RandomUnitVector()));
        }

        var electronsCountEdit      = <HTMLInputElement> document.getElementById('ElectronsCountEditBox');
        electronsCountEdit.value    = Options.CountElectrons.toFixed();
        electronsCountEdit.onblur   = OnEditElectronsCount;

        electronsCountEdit.setAttribute('min', MinElectronsCount.toFixed());
        electronsCountEdit.setAttribute('max', MaxElectronsCount.toFixed());

        electronsCountEdit.onkeypress = function(evt) 
        {
            if (evt.keyCode === 13) 
            {
                OnEditElectronsCount();
                event.preventDefault();
                return false;
            }
            return true;
        }

        display = new Display(canvas.width, canvas.height, ZoomFactor, ParallaxDistance);
        sim.Rotate(initialTilt);
        AnimationFrame();
    }
}
