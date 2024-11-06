"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PerspectiveCamera = PerspectiveCamera;
var _react = require("react");
var _Scene = require("./Scene");
var _GameObject = require("./GameObject");
var _ECS = require("../ecs/ECS");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
var _Game = require("./Game");
/**
 * React component camera (perspective):
 * Every scene has to have a camera in order for the player to see 
 * the rendered objects.
 * @param {{ bgColor: [number, number, number, number] 
 *           fovy: number
 *           near: number 
 *           far: number }} props 
 * @returns 
 */
function PerspectiveCamera(props) {
  /**
   * @type {ECS} entity-component system
   */
  const ecs = (0, _Scene.useScene)();
  const id = (0, _GameObject.useGameObject)();
  const gl = (0, _Game.useGL)();
  if (ecs.has(id, _Types.ComponentType.Camera)) {
    ecs.emplace(id, new _Component.CameraComponent(id, ecs, gl, false, props.bgColor, props.size, props.near, props.far));
  }
}