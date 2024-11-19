"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MovementScript = void 0;
var _Input = require("../core/Input");
var _Types = require("../core/Types");
var _Component = require("../ecs/Component");
var _Vector = require("../math/Vector");
var _Test = require("../prefabs/Test");
var _jsxRuntime = require("react/jsx-runtime");
class MovementScript extends _Component.ScriptComponent {
  ready() {
    this.body = this.getComponent(_Types.ComponentType.Body2D);
    this.text = this.getComponent(_Types.ComponentType.Text);
    this.audio = this.getComponent(_Types.ComponentType.Audio);
  }
  step(dt) {
    if (_Input.Input.getKeyDown(_Types.KeyCode.W)) {
      //this.body.addForce(Vector2.down.mul(this.speed));
      this.transform.moveBy(0, -1, 0);
    }
    if (_Input.Input.getKeyDown(_Types.KeyCode.A)) {
      //this.body.addForce(Vector2.left.mul(this.speed));
      this.transform.moveBy(-1, 0, 0);
    }
    if (_Input.Input.getKeyDown(_Types.KeyCode.S)) {
      //this.body.addForce(Vector2.up.mul(this.speed));
      this.transform.moveBy(0, 1, 0);
    }
    if (_Input.Input.getKeyDown(_Types.KeyCode.D)) {
      //this.body.addForce(Vector2.right.mul(this.speed));
      this.transform.moveBy(1, 0, 0);
    }
    if (_Input.Input.getKeyDown(_Types.KeyCode.C)) {
      // const gameObject = this.createGameObject('TEST');
      // gameObject.addEmptyComponent(ComponentType.Sprite);
      // gameObject.addEmptyComponent(ComponentType.Body2D);

      this.createPrefab(/*#__PURE__*/(0, _jsxRuntime.jsx)(_Test.Test, {}));
    }
    if (_Input.Input.getKeyDown(_Types.KeyCode.P)) {
      this.audio.pause();
    }
    if (_Input.Input.getKeyDown(_Types.KeyCode.O)) {
      this.audio.resume();
    }
  }
  onExitViewport() {
    console.log('viewport exit');
    this.test();
  }
  onEnterViewport() {
    console.log('viewport enter');
  }
  onCollisionEnter2D(other) {
    console.log('collision enter');
  }
  onCollisionExit2D(other) {
    console.log('collision exit');
  }
}
exports.MovementScript = MovementScript;