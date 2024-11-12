"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FPSScript = void 0;
var _Types = require("../core/Types");
var _Component = require("../ecs/Component");
class FPSScript extends _Component.ScriptComponent {
  #text;
  ready() {
    this.#text = this.getComponent(_Types.ComponentType.UIText);
  }
  step(dt) {
    const fps = 1 / dt;
    this.#text.text = `FPS: ${fps.toFixed(2)}`;
  }
}
exports.FPSScript = FPSScript;