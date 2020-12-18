import { Vector, RotationMatrix, Electron, Display } from "./classes";

module Electrons {
    
    'use strict';

    /**
     * @param {number} d 
     * @returns {number}
     */
    function RadiansFromDegrees(d:number):number 
    {
        return d * (Math.PI / 180);
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
    function Frame():void 
    {
        sim.Render(display);
        for (let i=0; i < UpdatesPerFrame; ++i) 
        {
            sim.Update();
        }

        sim.Rotate(ySpinner);
        sim.Rotate(xSpinner);

        window.setTimeout(Frame, FrameDelayMillis);
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
        Frame();
    }
}
