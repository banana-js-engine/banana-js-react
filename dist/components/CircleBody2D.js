"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CircleBody2D = CircleBody2D;
var _react = require("react");
var _GameObject = require("./GameObject");
var _Scene = require("./Scene");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
var _Game = require("./Game");
/**
 * 
 * @param {{ isStatic: boolean, gravityScale: number, radius: number, density: number, restitution: number }} props 
 */
function CircleBody2D(props) {
  const ecs = (0, _Scene.useScene)();
  const id = (0, _GameObject.useGameObject)();
  const gl = (0, _Game.useGL)();
  if (!ecs.has(id, _Types.ComponentType.Body2D)) {
    ecs.emplace(id, _Component.Body2DComponent.createCircleBody2D(id, ecs, gl, props.radius, props.density, props.isStatic, props.restitution, props.gravityScale));
  }
}