"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transform = Transform;
var _react = require("react");
var _ECS = require("../ecs/ECS");
var _Scene = require("./Scene");
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
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
  const gameObjectId = (0, _GameObject.useGameObject)();
  (0, _react.useEffect)(() => {
    ecs.emplace(gameObjectId, new _Component.TransformComponent(gameObjectId, ecs, props.position, props.rotation, props.scale));
  }, []);
}