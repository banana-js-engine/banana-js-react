"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoxBody2D = BoxBody2D;
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
/**
 * 
 * @param {{ isStatic: boolean, gravityScale: number, width: number, height: number
 *          density: number, restitution }} props 
 */
function BoxBody2D(props) {
  const gameObject = (0, _GameObject.useGameObject)();
  if (!gameObject.hasComponent(_Types.ComponentType.Body2D)) {
    gameObject.addComponent(_Component.Body2DComponent.createBoxBody2D(gameObject, props.width, props.height, props.density, props.isStatic, props.restitution, props.gravityScale));
  }
}