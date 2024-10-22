"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AABB = void 0;
var _Vector = require("../math/Vector");
class AABB {
  min = (() => _Vector.Vector2.zero)();
  max = (() => _Vector.Vector2.zero)();
  set(minX, minY, maxX, maxY) {
    this.min.set(minX, minY);
    this.max.set(maxX, maxY);
  }
}
exports.AABB = AABB;