"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RotateScript = void 0;
var _Component = require("../ecs/Component");
class RotateScript extends _Component.ScriptComponent {
  step(dt) {
    this.transform.rotateBy(1, 2, 3);
  }
}
exports.RotateScript = RotateScript;