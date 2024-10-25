"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PerspectiveCameraController = void 0;
var _Input = require("../core/Input");
var _Types = require("../core/Types");
var _Component = require("../ecs/Component");
var _Vector = require("../math/Vector");
class PerspectiveCameraController extends _Component.ScriptComponent {
  #direction;
  #previousMousePosition;
  #movementSpeed;
  #rotationSpeed;
  ready() {
    this.transform = this.getComponent(_Types.ComponentType.Transform);
    this.camera = this.getComponent(_Types.ComponentType.Camera);
    this.#direction = _Vector.Vector3.zero;
    this.#previousMousePosition = _Vector.Vector3.zero;
    this.#movementSpeed = 10;
    this.#rotationSpeed = 5;
  }
  step(dt) {
    const currentMousePosition = this.camera.screenToWorldSpace(_Input.Input.mousePosition);
    if (_Input.Input.getButton(2)) {
      // movement
      if (_Input.Input.getKey('a')) {
        this.transform.moveBy(-this.#movementSpeed * dt, 0, 0);
      }
      if (_Input.Input.getKey('w')) {
        this.transform.moveBy(0, 0, -this.#movementSpeed * dt);
      }
      if (_Input.Input.getKey('d')) {
        this.transform.moveBy(this.#movementSpeed * dt, 0, 0);
      }
      if (_Input.Input.getKey('s')) {
        this.transform.moveBy(0, 0, this.#movementSpeed * dt);
      }
      if (_Input.Input.getKey('q')) {
        this.transform.moveBy(0, this.#movementSpeed * dt, 0);
      }
      if (_Input.Input.getKey('e')) {
        this.transform.moveBy(0, -this.#movementSpeed * dt, 0);
      }

      // rotation
      this.#direction.set(0, 0, 0);
      this.#direction.x = this.#previousMousePosition.x - currentMousePosition.x;
      this.#direction.y = this.#previousMousePosition.y - currentMousePosition.y;
      this.transform.rotateBy(-this.#direction.y * this.#rotationSpeed, this.#direction.x * this.#rotationSpeed, 0);
    }
    this.#previousMousePosition.set(currentMousePosition);
  }
}
exports.PerspectiveCameraController = PerspectiveCameraController;