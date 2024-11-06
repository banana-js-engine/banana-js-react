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
    this.transform = this.getComponent(_Types.ComponentType.Transform);
    this.body = this.getComponent(_Types.ComponentType.Body2D);
    this.text = this.getComponent(_Types.ComponentType.Text);
  }
  step(dt) {
    if (_Input.Input.getKey('w')) {
      this.body.addForce(_Vector.Vector2.down.mul(this.speed));
    }
    if (_Input.Input.getKey('a')) {
      this.body.addForce(_Vector.Vector2.left.mul(this.speed));
    }
    if (_Input.Input.getKey('s')) {
      this.body.addForce(_Vector.Vector2.up.mul(this.speed));
    }
    if (_Input.Input.getKey('d')) {
      this.body.addForce(_Vector.Vector2.right.mul(this.speed));
    }
    if (_Input.Input.getKeyDown('c')) {
      const transform = this.create('TEST');
      transform.addComponent(_Types.ComponentType.Sprite);
      transform.addComponent(_Types.ComponentType.Body2D);
    }
  }
  onExitViewport() {
    console.log('exit');
    this.test();
  }
  onEnterViewport() {
    console.log('enter');
  }
}
exports.MovementScript = MovementScript;