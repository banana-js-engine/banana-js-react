"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Particle = Particle;
var _Types = require("../core/Types");
var _Component = require("../ecs/Component");
var _GameObject = require("./GameObject");
/**
 * 
 * @param {{ count, minAge, maxAge, minTheta, maxTheta, minSpeed, maxSpeed, gravity, color }} props 
 */
function Particle(props) {
  const gameObject = (0, _GameObject.useGameObject)();
  if (!gameObject.hasComponent(_Types.ComponentType.Particle)) {
    gameObject.addComponent(new _Component.ParticleComponent(gameObject, props.count, props.minAge, props.maxAge, props.minTheta, props.maxTheta, props.minSpeed, props.maxSpeed, props.gravity, props.color));
  }
}