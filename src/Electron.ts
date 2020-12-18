import { Vector, RotationMatrix } from "./classes";

export class Electron 
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