"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MovementScript = void 0;
var _Input = require("../core/Input");
var _Types = require("../core/Types");
var _Component = require("../ecs/Component");
var _Vector = require("../math/Vector");
class MovementScript extends _Component.ScriptComponent {
  ready() {
    this.speed = 0.1;
    this.transform = this.getComponent(_Types.ComponentType.Transform);
    this.body = this.getComponent(_Types.ComponentType.Body2D);
  }
  step(dt) {
    const s = this.speed * dt;
    if (_Input.Input.getKey('w')) {
      this.body.addForce(_Vector.Vector2.down.mul(this.speed));
      // this.transform.moveBy(0, -s, 0);
    }
    if (_Input.Input.getKey('a')) {
      this.body.addForce(_Vector.Vector2.left.mul(this.speed));
      // this.transform.moveBy(-s, 0, 0);
    }
    if (_Input.Input.getKey('s')) {
      this.body.addForce(_Vector.Vector2.up.mul(this.speed));
      // this.transform.moveBy(0, s, 0);
    }
    if (_Input.Input.getKey('d')) {
      this.body.addForce(_Vector.Vector2.right.mul(this.speed));
      // this.transform.moveBy(s, 0, 0);
    }
  }
}
exports.MovementScript = MovementScript;