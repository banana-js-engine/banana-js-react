// VECTORS //
/* Vectors are inheritance based, meaning that we can pass a Vector3 instance
 * to a function that expects a Vector2
 */

/**
 * 2D vector representation (x, y)
 */
export class Vector2 {
    data;

    constructor(x, y) {
        this.data = [];
        this.data.push(x);
        this.data.push(y);
    }

    // getters
    get x() {
        return this.data[0];
    }

    get y() {
        return this.data[1];
    }

    // setters
    set x(newX) {
        this.data[0] = newX;
    }

    set y(newY) {
        this.data[1] = newY;
    }

    // useful vector properties
    get length() {
        return Math.sqrt(this.lengthSquared);
    }

    get lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    // ready Vector2s
    static get zero() {
        return new Vector2(0, 0);
    }

    static get one() {
        return new Vector2(1, 1);
    }

    /*
     * new Vector2(2, 3) (toString) -> [2, 3]
     */
    toString() {
        return `[${this.x}, ${this.y}]`;
    }
}

/**
 * 3D vector representation (x, y, z)
 */
export class Vector3 extends Vector2 {
    constructor(x, y, z) {
        super(x, y);
        this.data.push(z);
    }

    // getters
    get z() {
        return this.data[2];
    }

    // setters
    set z(newZ) {
        this.data[2] = newZ;
    }

    get lengthSquared() {
        return super.lengthSquared + this.z * this.z;
    }

    // ready Vector3s
    static get zero() {
        return new Vector3(0, 0, 0);
    }

    static get one() {
        return new Vector3(1, 1, 1);
    }

    /*
     * new Vector3(2, 3, 1) (toString) -> [2, 3, 1]
     */
    toString() {
        return `[${this.x}, ${this.y}, ${this.z}]`;
    }
}

/**
 * 4D vector representation (x, y, z, w)
 */
export class Vector4 extends Vector3 {
    constructor(x, y, z, w) {
        super(x, y, z);
        this.data.push(w);
    }

    // getters
    get w() {
        return this.data[3];
    }

    // setters
    set w(newW) {
        this.data[3] = newW;
    }

    get lengthSquared() {
        return super.lengthSquared + this.w * this.w;
    }

    // ready Vector4s
    static get zero() {
        return new Vector4(0, 0, 0, 0);
    }

    static get one() {
        return new Vector4(1, 1, 1, 1);
    }

    /*
     * new Vector4(2, 3, 1, 4) (toString) -> [2, 3, 1, 4]
     */
    toString() {
        return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
    }
}