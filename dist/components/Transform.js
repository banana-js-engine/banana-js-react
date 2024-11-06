"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transform = Transform;
var _ECS = require("../ecs/ECS");
var _Scene = require("./Scene");
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
var _Game = require("./Game");
/**
 * 
 * @param {{ position: [number, number, number], 
 *           rotation: [number, number, number], 
 *           scale: [number, number, number] }} props 
 * @returns 
 */
function Transform(props) {
  /**
   * @type {ECS} entity-component system
   */
  const ecs = (0, _Scene.useScene)();
  const id = (0, _GameObject.useGameObject)();
  const gl = (0, _Game.useGL)();
  if (!ecs.has(id, _Types.ComponentType.Transform)) {
    ecs.emplace(id, new _Component.TransformComponent(id, ecs, gl, props.position, props.rotation, props.scale));
  }
}