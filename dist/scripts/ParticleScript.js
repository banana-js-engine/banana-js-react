"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParticleScript = void 0;
var _Input = require("../core/Input");
var _Types = require("../core/Types");
var _Component = require("../ecs/Component");
class ParticleScript extends _Component.ScriptComponent {
  #particle;
  ready() {
    this.#particle = this.getComponent(_Types.ComponentType.Particle);
  }
  step(dt) {
    if (_Input.Input.getKeyDown(_Types.KeyCode.Space)) {
      if (this.#particle.playing) {
        this.#particle.stop();
      } else {
        this.#particle.play();
      }
    }
  }
}
exports.ParticleScript = ParticleScript;