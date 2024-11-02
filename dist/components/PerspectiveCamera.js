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
  const gameObjectId = (0, _GameObject.useGameObject)();
  (0, _react.useEffect)(() => {
    ecs.emplace(gameObjectId, new _Component.CameraComponent(gameObjectId, ecs, false, props.bgColor, props.size, props.near, props.far));
  }, []);
}