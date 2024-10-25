"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrthographicCameraController = void 0;
var _Input = require("../core/Input");
var _Types = require("../core/Types");
var _Component = require("../ecs/Component");
var _Vector = require("../math/Vector");
class OrthographicCameraController extends _Component.ScriptComponent {
  #direction;
  #previousMousePosition;
  #rotationSpeed;
  ready() {
    this.transform = this.getComponent(_Types.ComponentType.Transform);
    this.camera = this.getComponent(_Types.ComponentType.Camera);
    this.#direction = _Vector.Vector3.zero;
    this.#previousMousePosition = _Vector.Vector3.zero;
    this.#rotationSpeed = 20;
  }
  step(dt) {
    const currentMousePosition = this.camera.screenToWorldSpace(_Input.Input.mousePosition);
    if (_Input.Input.getButton(1)) {
      // rotation
      this.#direction.set(0, 0, 0);
      this.#direction.x = this.#previousMousePosition.x - currentMousePosition.x;
      this.#direction.y = this.#previousMousePosition.y - currentMousePosition.y;
      this.transform.rotateBy(-this.#direction.y * this.#rotationSpeed, this.#direction.x * this.#rotationSpeed, 0);
    }
    this.#previousMousePosition.set(currentMousePosition);
    if (_Input.Input.mouseDelta.y > 0) {
      this.camera.size++;
      this.camera.setOrthographic();
    } else if (_Input.Input.mouseDelta.y < 0) {
      this.camera.size--;
      this.camera.setOrthographic();
    }
  }
}
exports.OrthographicCameraController = OrthographicCameraController;