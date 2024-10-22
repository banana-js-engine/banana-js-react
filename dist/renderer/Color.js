"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Color = void 0;
var _Vector = require("../math/Vector");
class Color {
  static get black() {
    return new _Vector.Vector4(0.0, 0.0, 0.0, 1.0);
  }
  static get red() {
    return new _Vector.Vector4(1.0, 0.0, 0.0, 1.0);
  }
  static get green() {
    return new _Vector.Vector4(0.0, 1.0, 0.0, 1.0);
  }
  static get blue() {
    return new _Vector.Vector4(0.0, 0.0, 1.0, 1.0);
  }
  static get purple() {
    return new _Vector.Vector4(0.5, 0.0, 0.5, 1.0);
  }
  static get yellow() {
    return new _Vector.Vector4(1.0, 1.0, 0.0, 1.0);
  }
  static get orange() {
    return new _Vector.Vector4(1.0, 0.47, 0.0, 1.0);
  }
  static get cyan() {
    return new _Vector.Vector4(0.0, 1.0, 1.0, 1.0);
  }
  static get white() {
    return new _Vector.Vector4(1.0, 1.0, 1.0, 1.0);
  }
  static get transparent() {
    return new _Vector.Vector4(0.0, 0.0, 0.0, 0.0);
  }
}
exports.Color = Color;