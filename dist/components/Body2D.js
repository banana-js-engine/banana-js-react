"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Body2D;
var _react = require("react");
var _GameObject = require("./GameObject");
var _Scene = require("./Scene");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
/**
 * 
 * @param {{ shape: number, isStatic: boolean, gravityScale: number }} props 
 */
function Body2D(props) {
  const ecs = (0, _Scene.useScene)();
  const gameObjectId = (0, _GameObject.useGameObject)();
  (0, _react.useEffect)(() => {
    if (props.shape == _Types.ShapeType.Circle) {
      ecs.emplace(gameObjectId, _Component.Body2DComponent.createCircleBody2D(gameObjectId, ecs, 0.5, 0.2, props.isStatic, 0.6, props.gravityScale));
    } else if (props.shape == _Types.ShapeType.Box) {
      ecs.emplace(gameObjectId, _Component.Body2DComponent.createBoxBody2D(gameObjectId, ecs, 1, 1, 0.2, props.isStatic, 0.6, props.gravityScale));
    }
  }, []);
}