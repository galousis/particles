import { Vector } from "./classes";

export class CameraCoords 
{
    // properties
    public horizontal:number;
    public vertical:number;

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

export class Display 
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
        let rho:number          = radius / this.parallaxDistance;
        let xp:number           = rho * Math.sqrt(this.parallaxDistance*this.parallaxDistance - radius*radius);
        let zp:number           = rho * radius;
        let tangent:Vector      = center.add(new Vector(xp, 0, zp));
        let edge:CameraCoords   = this.GetCameraCoords(tangent);
        let cradius:number      = Math.abs(edge.horizontal - origin.horizontal);

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
        let startcam:CameraCoords   = this.GetCameraCoords(startpoint);
        let endcam:CameraCoords     = this.GetCameraCoords(endpoint);
        let gradient:CanvasGradient = context.createLinearGradient(startcam.horizontal, startcam.vertical, endcam.horizontal, endcam.vertical);

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