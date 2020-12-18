export class Vector 
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


export class RotationMatrix 
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
