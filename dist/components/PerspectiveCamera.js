"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PerspectiveCamera = PerspectiveCamera;
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
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
  const gameObject = (0, _GameObject.useGameObject)();
  if (!gameObject.hasComponent(_Types.ComponentType.Camera)) {
    gameObject.addComponent(new _Component.CameraComponent(gameObject, false, props.bgColor, props.size, props.near, props.far));
  }
}