"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MovementScript = void 0;
var _Input = require("../core/Input");
var _Types = require("../core/Types");
var _Component = require("../ecs/Component");
class MovementScript extends _Component.ScriptComponent {
  ready() {
    this.speed = 5;
    this.transform = this.getComponent(_Types.ComponentType.Transform);
  }
  step(dt) {
    const s = this.speed * dt;
    if (_Input.Input.getKey('w')) {
      this.transform.moveBy(0, -s, 0);
    }
    if (_Input.Input.getKey('a')) {
      this.transform.moveBy(-s, 0, 0);
    }
    if (_Input.Input.getKey('s')) {
      this.transform.moveBy(0, s, 0);
    }
    if (_Input.Input.getKey('d')) {
      this.transform.moveBy(s, 0, 0);
    }
  }
}
exports.MovementScript = MovementScript;