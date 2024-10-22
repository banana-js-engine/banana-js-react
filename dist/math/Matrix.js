"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Matrix4 = void 0;
var _BananaMath = require("./BananaMath");
var _Vector = require("./Vector");
/**
 * 4x4 Matrix row-wise representation 
 * (Internally does column-wise calculations)
 */
class Matrix4 {
  #data;
  constructor() {
    this.#data = new Float32Array(16);
  }
  static get zero() {
    return new Matrix4();
  }
  get flat() {
    return this.#data;
  }
  zero() {
    this.#data.fill(0);
    return this;
  }
  identity() {
    this.zero();
    this.#data[0] = 1;
    this.#data[5] = 1;
    this.#data[10] = 1;
    this.#data[15] = 1;
    return this;
  }
  multiply(other) {
    const nm00 = this.#data[0] * other.#data[0] + this.#data[4] * other.#data[1] + this.#data[8] * other.#data[2] + this.#data[12] * other.#data[3];
    const nm01 = this.#data[1] * other.#data[0] + this.#data[5] * other.#data[1] + this.#data[9] * other.#data[2] + this.#data[13] * other.#data[3];
    const nm02 = this.#data[2] * other.#data[0] + this.#data[6] * other.#data[1] + this.#data[10] * other.#data[2] + this.#data[14] * other.#data[3];
    const nm03 = this.#data[3] * other.#data[0] + this.#data[7] * other.#data[1] + this.#data[11] * other.#data[2] + this.#data[15] * other.#data[3];
    const nm10 = this.#data[0] * other.#data[4] + this.#data[4] * other.#data[5] + this.#data[8] * other.#data[6] + this.#data[12] * other.#data[7];
    const nm11 = this.#data[1] * other.#data[4] + this.#data[5] * other.#data[5] + this.#data[9] * other.#data[6] + this.#data[13] * other.#data[7];
    const nm12 = this.#data[2] * other.#data[4] + this.#data[6] * other.#data[5] + this.#data[10] * other.#data[6] + this.#data[14] * other.#data[7];
    const nm13 = this.#data[3] * other.#data[4] + this.#data[7] * other.#data[5] + this.#data[11] * other.#data[6] + this.#data[15] * other.#data[7];
    const nm20 = this.#data[0] * other.#data[8] + this.#data[4] * other.#data[9] + this.#data[8] * other.#data[10] + this.#data[12] * other.#data[11];
    const nm21 = this.#data[1] * other.#data[8] + this.#data[5] * other.#data[9] + this.#data[9] * other.#data[10] + this.#data[13] * other.#data[11];
    const nm22 = this.#data[2] * other.#data[8] + this.#data[6] * other.#data[9] + this.#data[10] * other.#data[10] + this.#data[14] * other.#data[11];
    const nm23 = this.#data[3] * other.#data[8] + this.#data[7] * other.#data[9] + this.#data[11] * other.#data[10] + this.#data[15] * other.#data[11];
    const nm30 = this.#data[0] * other.#data[12] + this.#data[4] * other.#data[13] + this.#data[8] * other.#data[14] + this.#data[12] * other.#data[15];
    const nm31 = this.#data[1] * other.#data[12] + this.#data[5] * other.#data[13] + this.#data[9] * other.#data[14] + this.#data[13] * other.#data[15];
    const nm32 = this.#data[2] * other.#data[12] + this.#data[6] * other.#data[13] + this.#data[10] * other.#data[14] + this.#data[14] * other.#data[15];
    const nm33 = this.#data[3] * other.#data[12] + this.#data[7] * other.#data[13] + this.#data[11] * other.#data[14] + this.#data[15] * other.#data[15];
    this.#data[0] = nm00;
    this.#data[1] = nm01;
    this.#data[2] = nm02;
    this.#data[3] = nm03;
    this.#data[4] = nm10;
    this.#data[5] = nm11;
    this.#data[6] = nm12;
    this.#data[7] = nm13;
    this.#data[8] = nm20;
    this.#data[9] = nm21;
    this.#data[10] = nm22;
    this.#data[11] = nm23;
    this.#data[12] = nm30;
    this.#data[13] = nm31;
    this.#data[14] = nm32;
    this.#data[15] = nm33;
    return this;
  }

  /**
   * 
   * @param {Vector3} vec3
   * @returns 
   */
  multiplyVector3(vec3) {
    const result = _Vector.Vector3.zero;
    result.x = this.#data[0] * vec3.x + this.#data[1] * vec3.y + this.#data[2] * vec3.z + this.#data[3];
    result.y = this.#data[4] * vec3.x + this.#data[5] * vec3.y + this.#data[6] * vec3.z + this.#data[7];
    result.z = this.#data[8] * vec3.x + this.#data[9] * vec3.y + this.#data[10] * vec3.z + this.#data[11];
    return result;
  }

  /**
   * 
   * @param {Vector4} vec4 
   * @returns 
   */
  multiplyVector4(vec4) {
    const result = _Vector.Vector4.zero;
    result.x = this.#data[0] * vec4.x + this.#data[1] * vec4.y + this.#data[2] * vec4.z + this.#data[3] * vec4.w;
    result.y = this.#data[4] * vec4.x + this.#data[5] * vec4.y + this.#data[6] * vec4.z + this.#data[7] * vec4.w;
    result.z = this.#data[8] * vec4.x + this.#data[9] * vec4.y + this.#data[10] * vec4.z + this.#data[11] * vec4.w;
    result.w = 1.0;
    return result;
  }
  transpose() {
    const nm00 = this.#data[0];
    const nm01 = this.#data[4];
    const nm02 = this.#data[8];
    const nm03 = this.#data[12];
    const nm10 = this.#data[1];
    const nm11 = this.#data[5];
    const nm12 = this.#data[9];
    const nm13 = this.#data[13];
    const nm20 = this.#data[2];
    const nm21 = this.#data[6];
    const nm22 = this.#data[10];
    const nm23 = this.#data[14];
    const nm30 = this.#data[3];
    const nm31 = this.#data[7];
    const nm32 = this.#data[11];
    const nm33 = this.#data[15];
    this.#data[0] = nm00;
    this.#data[1] = nm01;
    this.#data[2] = nm02;
    this.#data[3] = nm03;
    this.#data[4] = nm10;
    this.#data[5] = nm11;
    this.#data[6] = nm12;
    this.#data[7] = nm13;
    this.#data[8] = nm20;
    this.#data[9] = nm21;
    this.#data[10] = nm22;
    this.#data[11] = nm23;
    this.#data[12] = nm30;
    this.#data[13] = nm31;
    this.#data[14] = nm32;
    this.#data[15] = nm33;
    return this;
  }
  invert() {
    const a = this.#data[0] * this.#data[5] - this.#data[1] * this.#data[4];
    const b = this.#data[0] * this.#data[6] - this.#data[2] * this.#data[4];
    const c = this.#data[0] * this.#data[7] - this.#data[3] * this.#data[4];
    const d = this.#data[1] * this.#data[6] - this.#data[2] * this.#data[5];
    const e = this.#data[1] * this.#data[7] - this.#data[3] * this.#data[5];
    const f = this.#data[2] * this.#data[7] - this.#data[3] * this.#data[6];
    const g = this.#data[8] * this.#data[13] - this.#data[9] * this.#data[12];
    const h = this.#data[8] * this.#data[14] - this.#data[10] * this.#data[12];
    const i = this.#data[8] * this.#data[15] - this.#data[11] * this.#data[12];
    const j = this.#data[9] * this.#data[14] - this.#data[10] * this.#data[13];
    const k = this.#data[9] * this.#data[15] - this.#data[11] * this.#data[13];
    const l = this.#data[10] * this.#data[15] - this.#data[11] * this.#data[14];
    let det = a * l - b * k + c * j + d * i - e * h + f * g;
    det = 1.0 / det;
    const nm00 = (this.#data[5] * l - this.#data[6] * k + this.#data[7] * j) * det;
    const nm01 = (-this.#data[1] * l + this.#data[2] * k - this.#data[3] * j) * det;
    const nm02 = (this.#data[13] * f - this.#data[14] * e + this.#data[15] * d) * det;
    const nm03 = (-this.#data[9] * f + this.#data[10] * e - this.#data[11] * d) * det;
    const nm10 = (-this.#data[4] * l + this.#data[6] * i - this.#data[7] * h) * det;
    const nm11 = (this.#data[0] * l - this.#data[2] * i + this.#data[3] * h) * det;
    const nm12 = (-this.#data[12] * f + this.#data[14] * c - this.#data[15] * b) * det;
    const nm13 = (this.#data[8] * f - this.#data[10] * c + this.#data[11] * b) * det;
    const nm20 = (this.#data[4] * k - this.#data[5] * i + this.#data[7] * g) * det;
    const nm21 = (-this.#data[0] * k + this.#data[1] * i - this.#data[3] * g) * det;
    const nm22 = (this.#data[12] * e - this.#data[13] * c + this.#data[15] * a) * det;
    const nm23 = (-this.#data[8] * e + this.#data[9] * c - this.#data[11] * a) * det;
    const nm30 = (-this.#data[4] * j + this.#data[5] * h - this.#data[6] * g) * det;
    const nm31 = (this.#data[0] * j - this.#data[1] * h + this.#data[2] * g) * det;
    const nm32 = (-this.#data[12] * d + this.#data[13] * b - this.#data[14] * a) * det;
    const nm33 = (this.#data[8] * d - this.#data[9] * b + this.#data[10] * a) * det;
    this.#data[0] = nm00;
    this.#data[1] = nm01;
    this.#data[2] = nm02;
    this.#data[3] = nm03;
    this.#data[4] = nm10;
    this.#data[5] = nm11;
    this.#data[6] = nm12;
    this.#data[7] = nm13;
    this.#data[8] = nm20;
    this.#data[9] = nm21;
    this.#data[10] = nm22;
    this.#data[11] = nm23;
    this.#data[12] = nm30;
    this.#data[13] = nm31;
    this.#data[14] = nm32;
    this.#data[15] = nm33;
    return this;
  }
  setTranslation(vec3) {
    this.identity();
    this.#data[3] = vec3.x;
    this.#data[7] = vec3.y;
    this.#data[11] = vec3.z;
    return this;
  }
  setRotationX(ang) {
    this.identity();
    ang = _BananaMath.BananaMath.toRadians(ang);
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);
    this.#data[5] = cos;
    this.#data[6] = -sin;
    this.#data[9] = sin;
    this.#data[10] = cos;
    return this;
  }
  setRotationY(ang) {
    this.identity();
    ang = _BananaMath.BananaMath.toRadians(ang);
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);
    this.#data[0] = cos;
    this.#data[2] = sin;
    this.#data[8] = -sin;
    this.#data[10] = cos;
    return this;
  }
  setRotationZ(ang) {
    this.identity();
    ang = _BananaMath.BananaMath.toRadians(ang);
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);
    this.#data[0] = cos;
    this.#data[1] = -sin;
    this.#data[4] = sin;
    this.#data[5] = cos;
    return this;
  }
  setScale(vec3) {
    this.identity();
    this.#data[0] = vec3.x;
    this.#data[5] = vec3.y;
    this.#data[10] = vec3.z;
    return this;
  }
  applyPerspective(fovy, aspect, near, far) {
    const h = Math.tan(fovy * 0.5);

    // calculate right matrix elements
    const rm00 = 1.0 / (h * aspect);
    const rm11 = 1.0 / h;
    let rm22;
    let rm32;
    const zZeroToOne = false;
    rm22 = (zZeroToOne ? far : far + near) / (near - far);
    rm32 = (zZeroToOne ? far : far + far) * near / (near - far);

    // perform optimized matrix multiplication
    const nm20 = this.#data[8] * rm22 - this.#data[12];
    const nm21 = this.#data[9] * rm22 - this.#data[13];
    const nm22 = this.#data[10] * rm22 - this.#data[14];
    const nm23 = this.#data[11] * rm22 - this.#data[15];
    this.#data[0] = this.#data[0] * rm00;
    this.#data[1] = this.#data[1] * rm00;
    this.#data[2] = this.#data[2] * rm00;
    this.#data[3] = this.#data[3] * rm00;
    this.#data[4] = this.#data[4] * rm11;
    this.#data[5] = this.#data[5] * rm11;
    this.#data[6] = this.#data[6] * rm11;
    this.#data[7] = this.#data[7] * rm11;
    this.#data[12] = this.#data[8] * rm32;
    this.#data[13] = this.#data[9] * rm32;
    this.#data[14] = this.#data[10] * rm32;
    this.#data[15] = this.#data[11] * rm32;
    this.#data[8] = nm20;
    this.#data[9] = nm21;
    this.#data[10] = nm22;
    this.#data[11] = nm23;
    return this;
  }
  setPerspective(fovy, aspect, near, far) {
    this.identity();
    this.applyPerspective(fovy, aspect, near, far);
    return this;
  }
  applyOrtho(left, right, bottom, top, near, far) {
    // calculate right matrix elements
    const rm00 = 2.0 / (right - left);
    const rm11 = 2.0 / (top - bottom);
    const rm22 = 2.0 / (near - far);
    const rm30 = (left + right) / (left - right);
    const rm31 = (top + bottom) / (bottom - top);
    const rm32 = (far + near) / (near - far);

    // perform optimized multiplication
    // compute the last column first, because other columns do not depend on it
    this.#data[12] = this.#data[0] * rm30 + this.#data[4] * rm31 + this.#data[8] * rm32 + this.#data[12];
    this.#data[13] = this.#data[1] * rm30 + this.#data[5] * rm31 + this.#data[9] * rm32 + this.#data[13];
    this.#data[14] = this.#data[2] * rm30 + this.#data[6] * rm31 + this.#data[10] * rm32 + this.#data[14];
    this.#data[15] = this.#data[3] * rm30 + this.#data[7] * rm31 + this.#data[11] * rm32 + this.#data[15];
    this.#data[0] = this.#data[0] * rm00;
    this.#data[1] = this.#data[1] * rm00;
    this.#data[2] = this.#data[2] * rm00;
    this.#data[3] = this.#data[3] * rm00;
    this.#data[4] = this.#data[4] * rm11;
    this.#data[5] = this.#data[5] * rm11;
    this.#data[6] = this.#data[6] * rm11;
    this.#data[7] = this.#data[7] * rm11;
    this.#data[8] = this.#data[8] * rm22;
    this.#data[9] = this.#data[9] * rm22;
    this.#data[10] = this.#data[10] * rm22;
    this.#data[11] = this.#data[11] * rm22;
    return this;
  }
  setOrtho(left, right, bottom, top, near, far) {
    this.identity();
    this.applyOrtho(left, right, bottom, top, near, far);
    return this;
  }
  toString() {
    let result = '';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result += `${this.#data[i * 4 + j].toFixed(2).padStart(8)}`;
      }
      result += '\n';
    }
    return result;
  }
}
exports.Matrix4 = Matrix4;