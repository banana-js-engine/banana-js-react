"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vector4 = exports.Vector3 = exports.Vector2 = void 0;
// VECTORS //
/* Vectors are inheritance based, meaning that we can pass a Vector3 instance
 * to a function that expects a Vector2
 */

/**
 * 2D vector representation (x, y)
 */
class Vector2 {
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
  set(x, y) {
    if (x instanceof Vector2) {
      this.x = x.x;
      this.y = x.y;
      return;
    }
    this.x = x;
    this.y = y;
  }

  // useful vector properties
  get length() {
    return Math.sqrt(this.lengthSquared);
  }
  get lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }
  get normalized() {
    const len = this.length;
    return new Vector2(this.x / len, this.y / len);
  }
  normalize() {
    const len = this.length;
    this.x /= len;
    this.y /= len;
    return this;
  }

  /**
   * 
   * @param {Vector2} to 
   */
  distance(to) {
    return Math.sqrt((this.x - to.x) ** 2 + (this.y - to.y) ** 2);
  }

  /**
   * 
   * @param {Vector2} to 
   */
  distanceSquared(to) {
    return (this.x - to.x) ** 2 + (this.y - to.y) ** 2;
  }

  // vector operations
  /**
   * 
   * @param {Vector2} other
   * @returns {Vector2} 
   */
  add(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * 
   * @param {Vector2} other
   * @returns {Vector2} 
   */
  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  /**
   * 
   * @param {number} scalar
   * @returns {Vector2} 
   */
  mul(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * 
   * @param {number} scalar
   * @returns {Vector2} 
   */
  div(scalar) {
    if (scalar == 0) {
      console.error('division by 0!');
      return Vector2.zero;
    }
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  /**
   * 
   * @param {Vector2} other
   * @returns {number} 
   */
  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * 
   * @param {Vector2} other 
   */
  equals(other) {
    return this.x == other.x && this.y == other.y;
  }

  // ready Vector2s
  static get zero() {
    return new Vector2(0, 0);
  }
  static get one() {
    return new Vector2(1, 1);
  }

  // basic directions
  static get right() {
    return new Vector2(1, 0);
  }
  static get left() {
    return new Vector2(-1, 0);
  }
  static get up() {
    return new Vector2(0, 1);
  }
  static get down() {
    return new Vector2(0, -1);
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
exports.Vector2 = Vector2;
class Vector3 extends Vector2 {
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
  set(x, y, z) {
    if (x instanceof Vector3) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
      return;
    }
    if (x instanceof Vector2) {
      this.x = x.x;
      this.y = x.y;
      return;
    }
    this.x = x;
    this.y = y;
    this.z = z;
  }
  get lengthSquared() {
    return super.lengthSquared + this.z * this.z;
  }

  // vector operations
  /**
   * 
   * @param {Vector3} other
   * @returns {Vector3} 
   */
  add(other) {
    super.add(other);
    this.z += other.z;
    return this;
  }

  /**
   * 
   * @param {Vector3} other
   * @returns {Vector3} 
   */
  sub(other) {
    super.sub(other);
    this.z -= other.z;
    return this;
  }

  /**
   * 
   * @param {number} scalar
   * @returns {Vector3} 
   */
  mul(scalar) {
    super.mul(scalar);
    this.z *= scalar;
    return this;
  }

  /**
   * 
   * @param {number} scalar
   * @returns {Vector3} 
   */
  div(scalar) {
    if (scalar == 0) {
      console.error('division by 0!');
      return Vector3.zero;
    }
    super.div(scalar);
    this.z /= scalar;
    return this;
  }

  // ready Vector3s
  static get zero() {
    return new Vector3(0, 0, 0);
  }
  static get one() {
    return new Vector3(1, 1, 1);
  }

  // basic directions
  static get right() {
    return new Vector3(1, 0, 0);
  }
  static get left() {
    return new Vector3(-1, 0, 0);
  }
  static get up() {
    return new Vector3(0, 1, 0);
  }
  static get down() {
    return new Vector3(0, -1, 0);
  }
  static get forward() {
    return new Vector3(0, 0, 1);
  }
  static get back() {
    return new Vector3(0, 0, -1);
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
exports.Vector3 = Vector3;
class Vector4 extends Vector3 {
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
  set(x, y, z, w) {
    if (x instanceof Vector4) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
      this.w = x.w;
      return;
    }
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  get lengthSquared() {
    return super.lengthSquared + this.w * this.w;
  }
  get hex() {
    let hexRepresentation = '#';
    for (let i = 0; i < 3; i++) {
      const digit = Math.round(this.data[i] * 255).toString(16);
      if (digit.length == 1) {
        hexRepresentation += `0${digit}`;
      } else {
        hexRepresentation += digit;
      }
    }
    return hexRepresentation;
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
exports.Vector4 = Vector4;