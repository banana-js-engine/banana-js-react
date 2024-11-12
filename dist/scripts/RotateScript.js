"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RotateScript = void 0;
var _Component = require("../ecs/Component");
class RotateScript extends _Component.ScriptComponent {
  step(dt) {
    this.transform.rotateBy(0, this.speed * dt, 0);
  }
}
exports.RotateScript = RotateScript;