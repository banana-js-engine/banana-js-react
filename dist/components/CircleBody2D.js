"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CircleBody2D = CircleBody2D;
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
/**
 * 
 * @param {{ isStatic: boolean, gravityScale: number, radius: number, density: number, restitution: number }} props 
 */
function CircleBody2D(props) {
  const gameObject = (0, _GameObject.useGameObject)();
  if (!gameObject.hasComponent(_Types.ComponentType.Body2D)) {
    gameObject.addComponent(_Component.Body2DComponent.createCircleBody2D(gameObject, props.radius, props.density, props.isStatic, props.restitution, props.gravityScale));
  }
}